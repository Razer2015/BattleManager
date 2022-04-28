#[macro_use]
extern crate log;

use actix_web::{middleware, web, App, HttpServer};
use ascii::IntoAsciiString;
use battlefield_rcon::bf4::Event::Chat;
use battlefield_rcon::bf4::{Bf4Client, ServerInfoError};
use dotenv::dotenv;
use futures::join;
use futures::StreamExt;

use async_std::task;
use std::{thread, time::Duration};

use serde::{Deserialize, Serialize};

mod endpoints;
mod logging;

#[derive(Serialize, Deserialize, Debug)]
struct BroadcastInfo {
    game_ip_and_port: String,
    connection_endpoint: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    logging::init_logging();

    let rcon_ipport = match dotenv::var("RCON_IPPORT") {
        Ok(val) => val,
        Err(e) => panic!(
            "Could not find environment variable {}: {}",
            "RCON_IPPORT", e
        ),
    };
    let rcon_password = match dotenv::var("RCON_PASSWORD") {
        Ok(val) => val.into_ascii_string().unwrap(),
        Err(e) => panic!(
            "Could not find environment variable {}: {}",
            "RCON_PASSWORD", e
        ),
    };
    let backend_api = match dotenv::var("BACKEND_ENDPOINT") {
        Ok(val) => val,
        Err(e) => panic!(
            "Could not find environment variable {}: {}",
            "BACKEND_ENDPOINT", e
        ),
    };
    let internal_token = match dotenv::var("INTERNAL_TOKEN") {
        Ok(val) => val,
        Err(e) => panic!(
            "Could not find environment variable {}: {}",
            "INTERNAL_TOKEN", e
        ),
    };
    let host_hostname = match dotenv::var("HOST_HOSTNAME") {
        Ok(val) => val,
        Err(e) => panic!(
            "Could not find environment variable {}: {}",
            "HOST_HOSTNAME", e
        ),
    };
    let rest_api_address = dotenv::var("RESTAPI_ADDRESS").unwrap_or("0.0.0.0".to_string());
    let rest_api_port: u16 = dotenv::var("RESTAPI_PORT")
        .map(|var| var.parse::<u16>())
        .unwrap_or(Ok(8080))
        .unwrap();

    info!("Starting up rcon-connector");

    info!("Connecting to {:?}", rcon_ipport);
    let bf4 = Bf4Client::connect(&rcon_ipport, rcon_password)
        .await
        .unwrap();

    let events_bf4 = bf4.clone();
    let events_backend = backend_api.clone();
    let events_internal_token = internal_token.clone();
    let events_task = task::spawn(async move {
        let chat_client = reqwest::blocking::Client::new();
        let mut event_stream = events_bf4.event_stream().await.unwrap();
        while let Some(event) = event_stream.next().await {
            match event {
                Ok(Chat { vis, player, msg }) => {
                    match serde_json::to_string(&Chat { vis, player, msg }) {
                        Ok(serialized_chat) => match chat_client
                            .post(format!("{}/internal/server/chat", events_backend))
                            .header("Authorization", events_internal_token.to_string())
                            .header("User-Agent", "battlemanager/rcon-connector")
                            .header("Content-Type", "application/json")
                            .body(serialized_chat)
                            .send()
                        {
                            Ok(_) => (),
                            Err(error) => error!("Couldn't serialize chat message. {:?}", error),
                        },
                        Err(error) => error!("Couldn't send chat message to backend. {:?}", error),
                    };
                }
                _ => (),
            }
        }
    });

    let keep_alive_bf4 = bf4.clone();
    let keep_alive = task::spawn(async move {
        let wait_time = Duration::from_secs(1 * 60); // 1 minute
        info!("Keep alive interval: {:?}", wait_time);

        loop {
            match keep_alive_bf4.server_info().await {
                Ok(server_info) => {
                    info!(
                        "Server info fetched. Players: {}",
                        server_info.blaze_player_count
                    );

                    let client = reqwest::blocking::Client::new();
                    let serialized_info = serde_json::to_string(&BroadcastInfo {
                        game_ip_and_port: rcon_ipport.to_string(),
                        connection_endpoint: host_hostname.to_string(),
                    })
                    .unwrap();
                    match client
                        .post(format!("{}/internal/server/broadcast", backend_api))
                        .header("Authorization", internal_token.to_string())
                        .header("User-Agent", "battlemanager/rcon-connector")
                        .header("Content-Type", "application/json")
                        .body(serialized_info)
                        .send()
                    {
                        Ok(_) => (),
                        Err(error) => error!("Couldn't broadcast server to backend. {:?}", error),
                    };

                    thread::sleep(wait_time);
                }
                Err(ServerInfoError::Rcon(rconerr)) => panic!(
                    "Server info failed, crash the whole thing so it restarts. {:?}",
                    rconerr
                ),
            };
        }
    });

    info!(
        "Binding REST API to http://{}:{}",
        &rest_api_address, &rest_api_port
    );

    let rest_api = HttpServer::new(move || {
        App::new()
            .wrap(middleware::Compress::default())
            .app_data(web::Data::new(bf4.clone()))
            .service(endpoints::hello)
            .service(endpoints::echo)
            .service(endpoints::server_info)
            .service(endpoints::list_players)
    })
    .bind((rest_api_address, rest_api_port))
    .unwrap()
    .run();

    _ = join!(events_task, rest_api, keep_alive);

    info!("Shutting down");

    Ok(())
}
