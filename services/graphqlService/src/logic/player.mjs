import BaseLogic from "./baseLogic.mjs";

export default class Player extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    async getPlayers(queryParams) {
        const [data, count] = await this.db.getAllPlayers(queryParams);
        return {
            count: count,
            data: data
        };
    }
}