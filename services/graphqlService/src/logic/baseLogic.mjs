import Discord from "../integrations/discord/discord.mjs";
import Prisma from "../integrations/prisma/prisma.mjs";
import RCON from "../integrations/rcon/rcon.mjs";

export default class BaseLogic {
    constructor(dbservice, rconService, discordService) {
        this.db = dbservice ? dbservice : new Prisma()
        this.rcon = rconService ? rconService : new RCON()
        this.discord = discordService ? discordService : new Discord()
    }
}
