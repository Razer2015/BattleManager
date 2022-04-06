import BaseLogic from "./baseLogic.mjs";

export default class Game extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    getGames() {
        return this.db.getGames();
    }
}