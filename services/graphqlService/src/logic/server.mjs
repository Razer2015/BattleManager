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
}