import { hasRole } from "../utils/authentication.mjs";
import { NotFoundError } from "../utils/errors.mjs";
import BaseLogic from "./baseLogic.mjs";

export default class Server extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    getServers() {
        return this.db.getServers();
    }

    getServersByGameID({ gameId }) {
        return this.db.getServersByGameID(gameId);
    }

    async serverBroadcast({ game_ip_and_port, connection_endpoint }) {
        const server = await this.db.getServeryByIP(game_ip_and_port);
        if (!server) throw new Error(`Couldn't find server with ${game_ip_and_port}`);

        return await this.db.updateServer(server.ServerID, {
            battlemanager_endpoint: connection_endpoint,
            battlemanager_lastconnection: new Date().toISOString(),
        });
    }

    async getServerInfo(user, { serverId }) {
        const server = await this.db.getServeryByID(serverId);

        if (!server) throw new NotFoundError(`Couldn't find server with ${serverId}`);

        return this.rcon.getServerInfo(server.battlemanager_endpoint)
            .then(serverInfo => {
                // if (!hasRole(user, ['super', 'admin'])) {
                //     delete serverInfo.game_ip_and_port
                // }

                return serverInfo;
            });
    }
    async getServerPlayers(user, { serverId }) {
        const server = await this.db.getServeryByID(serverId);

        if (!server) throw new NotFoundError(`Couldn't find server with ${serverId}`);

        return this.rcon.getServerPlayers(server.battlemanager_endpoint)
            .then(players => {
                if (!players.length) return [];

                if (!hasRole(user, ['super', 'admin'])) {
                    return players.map(({ eaid, ...rest }) => rest);
                }

                return players;
            });
    }
}