use actix_web::{get, post, web, HttpResponse, Responder};
use std::{sync::Arc};
use battlefield_rcon::{bf4::{Bf4Client, Visibility, ServerInfoError, ListPlayersError }};

#[get("/")]
pub async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
pub async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

#[get("/serverInfo")]
pub async fn server_info(bf4: web::Data<Arc<Bf4Client>>) -> impl Responder {
    match bf4.get_ref().server_info().await {
        Ok(server_info) => {
            return HttpResponse::Ok()
                .content_type(mime::APPLICATION_JSON)
                .json(server_info)
        },
        Err(ServerInfoError::Rcon(rconerr)) => {
            return HttpResponse::InternalServerError().body(format!("Error {:?}", rconerr))
        },
    };
}

#[get("/listPlayers")]
pub async fn list_players(bf4: web::Data<Arc<Bf4Client>>) -> impl Responder {
    match bf4.get_ref().list_players(Visibility::All).await {
        Ok(players) => {
            return HttpResponse::Ok()
                .content_type(mime::APPLICATION_JSON)
                .json(players)
        },
        Err(ListPlayersError::Rcon(rconerr)) => {
            return HttpResponse::InternalServerError().body(format!("Error {:?}", rconerr))
        },
    };
}
