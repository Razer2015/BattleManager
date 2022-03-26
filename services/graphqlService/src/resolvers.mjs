import Prisma from "./integrations/prisma/prisma.mjs";
import { Timestamp, BigInt } from "./scalarTypes.mjs";

const dbClient = new Prisma()

export const resolvers = {
    Timestamp: Timestamp,
    BigInt: BigInt,
    Query: {
        async allVips(root, args, { models }) {
            return dbClient.getAllVips();
        },
        async allPlayers(root, args, { models }) {
            return {
                count: dbClient.getAllPlayersCount(args),
                data: dbClient.getAllPlayers(args)
            };
        },
    },
};