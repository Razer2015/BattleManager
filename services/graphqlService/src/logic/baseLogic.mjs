import Prisma from "../integrations/prisma/prisma.mjs";
import RCON from "../integrations/rcon/rcon.mjs";

export default class BaseLogic {
    constructor(dbservice, rconService) {
        this.db = dbservice ? dbservice : new Prisma()
        this.rcon = rconService ? rconService : new RCON()
    }
}
