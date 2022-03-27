import BaseLogic from "./baseLogic.mjs";

export default class Player extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    async getPlayers(args) {
        return {
            count: this.db.getAllPlayersCount(args),
            data: this.db.getAllPlayers(args)
        };
    }
}