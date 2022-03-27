import { hashPassword } from "../integrations/crypto/crypto.mjs";
import BaseLogic from "./baseLogic.mjs";

export default class Vip extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    getVips() {
        return this.db.getAllVips();
    }
}