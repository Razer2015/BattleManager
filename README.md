# BattleManager

TODO: Well, this...

## Requirements

1. [Docker](https://www.docker.com/products/docker-desktop/)

### Procon plugins
1. [Chat, GUID, Stats and Mapstats Logger](https://myrcon.net/topic/162-chat-guid-stats-and-mapstats-logger-1003/)
2. [VIP Slot Manager](https://github.com/procon-plugin/vip-slot-manager)

## How to run (Docker)

1. Make sure you've ran the migration scripts to the database from the `scripts` -folder.
2. Rename the `docker-compose.example.yml` to `docker-compose.yml`.
3. Change the proper environment variables.
4. Change the BACKEND_ENDPOINT from `config.js` to point to the correct public graphlService endpoint.
5. Run with `docker-compose up` or the stack with `docker stack deploy -c docker-compose.yml`

**Note**
- **INTERNAL_TOKEN** between services must match
- **APP_KEY** changing app key after adding users will make the passwords invalid

## Development

### Windows

If you have `Windows Terminal` installed
- Run the `run-localhost.bat` script

Otherwise

- Start GraphQL backend
```
cd services\graphqlService && npm i && npm start
```

- Start Management Frontend
```
cd services\managementfrontend && npm i && npm start
```

### Linux

- Start GraphQL backend
```
cd services\graphqlService && npm i && npm start
```

- Start Management Frontend
```
cd services\managementfrontend && npm i && npm start
```