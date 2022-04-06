import Prisma from "./integrations/prisma/prisma.mjs";
import Game from "./logic/game.mjs";
import Player from "./logic/player.mjs";
import Role from "./logic/role.mjs";
import Server from "./logic/server.mjs";
import User from "./logic/user.mjs";
import Vip from "./logic/vip.mjs";
import { Timestamp, BigIntScalar } from "./scalarTypes.mjs";
import { checkAuthentication } from "./utils/authentication.mjs";

const dbClient = new Prisma()

export const resolvers = {
    Timestamp: Timestamp,
    BigInt: BigIntScalar,
    User: {
        async userRoles(root, args, { token, user }, info) {
            return new Role(dbClient).getUserRoles(root);
        },
    },
    Query: {
        async me(root, args, { token, user }, info) {
            return {
                ...user,
                signedIn: !!user
            };
        },
        async getUser(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super']);

            return new User(dbClient).getUser(args);
        },
        async allVips(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Vip(dbClient).getVips();
        },
        async getVip(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Vip(dbClient).getVip(args);
        },
        async allPlayers(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Player(dbClient).getPlayers(args);
        },
        async allUsers(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super']);

            return new User(dbClient).getUsers(args);
        },
        async getGames(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Game(dbClient).getGames();
        },
        async getServers(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Server(dbClient).getServers();
        },
        async getServersByGameID(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Server(dbClient).getServersByGameID(args);
        },
    },
    Mutation: {
        async createUser(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super']);

            return new User(dbClient).createUser(args?.user);
        },
        async updateUser(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super']);

            return new User(dbClient).updateUser(args?.userId, args?.user);
        },
        async deleteUser(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super']);

            return new User(dbClient).deleteUser(args);
        },
        async createVip(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Vip(dbClient).createVip(user, args?.vip);
        },
        async updateVip(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Vip(dbClient).updateVip(user, args?.vipId, args?.vip);
        },
        async deleteVip(root, args, { token, user }, info) {
            checkAuthentication(token, user, ['super', 'admin']);

            return new Vip(dbClient).deleteVip(args);
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