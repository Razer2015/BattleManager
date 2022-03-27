import Prisma from "../integrations/prisma/prisma.mjs";

export default class BaseLogic {
    constructor(dbservice) {
        this.db = dbservice ? dbservice : new Prisma()
    }
}
