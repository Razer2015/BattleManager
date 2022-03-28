import Prisma from "./integrations/prisma/prisma.mjs";
import Player from "./logic/player.mjs";
import Role from "./logic/role.mjs";
import User from "./logic/user.mjs";
import Vip from "./logic/vip.mjs";
import { Timestamp, BigInt } from "./scalarTypes.mjs";
import { checkAuthentication } from "./utils/authentication.mjs";

const dbClient = new Prisma()

export const resolvers = {
    Timestamp: Timestamp,
    BigInt: BigInt,
    User: {
        async userRoles(root, args, { token, user }, info) {
            return new Role(dbClient).getUserRoles(args);
        },
    },
    Query: {
        async me(root, args, { token, user }, info) {
            return {
                ...user,
                signedIn: !!user
            };
        },
        async allVips(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);
            
            return new Vip(dbClient).getVips();
        },
        async allPlayers(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Player(dbClient).getPlayers(args);
        },
        async allUsers(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super']);

            return new User(dbClient).getUsers(args);
        },
    },
    Mutation: {
        async createUser(root, args, { token, user }, info) {
            return new User(dbClient).createUser(args);
        },
        async login(root, args, { token, user }, info) {
            return new User(dbClient).login(args);
        },
        async loginSafe(root, args, { reply, token, user }, info) {
            return new User(dbClient).loginSafe(reply, args);
        },
        async logout(root, args, { reply, refreshToken, user }, info) {
            if (!user) return 'Already logged out';
            return new User(dbClient).logout(reply, user);
        },
        async token(root, args, { token, user }, info) {
            return new User(dbClient).token(args);
        },
        async tokenSafe(root, args, { reply, refreshToken, user }, info) {
            return new User(dbClient).tokenSafe(reply, refreshToken);
        },
    }
};