import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient()

export default class Prisma {
    async createUser(user) {
        return await prisma.battlemanager_users.create({ data: user })
    }

    async updateUser(userId, user) {
        return await prisma.battlemanager_users.update({
            where: {
                id: userId,
            },
            data: user
        })
    }

    async deleteUser(userId) {
        return await prisma.battlemanager_users.delete({
            where: {
                id: userId,
            }
        })
    }

    async getUserById(userId) {
        return await prisma.battlemanager_users.findUnique({
            where: {
                id: userId,
            },
        })
    }

    async getUserByEmail(email) {
        return await prisma.battlemanager_users.findFirst({
            where: {
                email: email,
            },
        })
    }

    async getAllUsers(queryParams) {
        const { args, searchArgs } = this.getQueryParameters(queryParams);
        return await prisma.$transaction([
            prisma.battlemanager_users.findMany(args),
            prisma.battlemanager_users.count(searchArgs),
        ])
    }

    async changeUserLoggedInById(userId, signedIn) {
        return await prisma.battlemanager_users.update({
            where: {
                id: userId,
            },
            data: {
                is_logged_in: signedIn,
            }
        })
    }


    async changeUserLoggedInByEmail(email, signedIn) {
        return await prisma.battlemanager_users.update({
            where: {
                email_normalized: email.toUpperCase(),
            },
            data: {
                is_logged_in: signedIn,
            }
        })
    }

    async getUserRoles(userId) {
        if (!userId) return [];
        return await prisma.battlemanager_userroles.findMany({
            where: {
                userId: userId,
            },
            include: {
                battlemanager_roles: true,
            }
        })
    }

    async upsertUserRoles(userId, roles) {
        return await prisma.$transaction([
            prisma.battlemanager_userroles.deleteMany({ where: { userId: userId } }),
            prisma.battlemanager_userroles.createMany({
                data: roles
            }),
        ]);
    }

    async createVip(vip) {
        return await prisma.vsm_vips.create({ data: vip })
    }

    async updateVip(vipId, vip) {
        return await prisma.vsm_vips.update({
            where: {
                ID: vipId,
            },
            data: vip
        })
    }

    async deleteVip(vipId) {
        return await prisma.vsm_vips.delete({
            where: {
                ID: vipId,
            }
        })
    }

    async getAllVips(queryParams) {
        const { args, searchArgs } = this.getQueryParameters(queryParams);
        return await prisma.$transaction([
            prisma.vsm_vips.findMany(args),
            prisma.vsm_vips.count(searchArgs),
        ])
    }

    async getVipById(vipId) {
        return await prisma.vsm_vips.findUnique({
            where: {
                ID: vipId,
            },
        })
    }

    async getAllPlayersCount({ search }) {
        if (!search) return await prisma.tbl_playerdata.count()

        return await prisma.tbl_playerdata.count({
            where: {
                SoldierName: {
                    contains: search,
                },
            }
        })
    }

    async getAllPlayers(queryParams) {
        const { args, searchArgs } = this.getQueryParameters(queryParams);
        return await prisma.$transaction([
            prisma.tbl_playerdata.findMany(args),
            prisma.tbl_playerdata.count(searchArgs),
        ])
    }

    async getGames() {
        return await prisma.tbl_games.findMany()
    }

    async getGameById(gameId) {
        return await prisma.tbl_games.findFirst({
            where: {
                GameID: gameId,
            },
        })
    }

    async getServers() {
        return await prisma.tbl_server.findMany()
    }

    async getServeryByID(serverId) {
        return await prisma.tbl_server.findFirst({
            where: {
                ServerID: serverId,
            }
        })
    }

    async getServersByGameID(gameId) {
        return await prisma.tbl_server.findMany({
            where: {
                GameID: gameId,
            }
        })
    }

    async getServeryByIP(ipAddress) {
        return await prisma.tbl_server.findFirst({
            where: {
                IP_Address: ipAddress,
            }
        })
    }

    async updateServer(serverId, server) {
        return await prisma.tbl_server.update({
            where: {
                ServerID: serverId,
            },
            data: server
        })
    }

    getQueryParameters({ limit, skip, filters, sorter }) {
        const args = {}
        if (filters) {
            const orArray = [];

            for (const [key, value] of Object.entries(filters)) {
                if (key && value && value.length) {
                    orArray.push({
                        [key]: {
                            contains: value[0],
                        }
                    });
                }
            }

            if (orArray.length) {
                args.where = {
                    OR: orArray
                }
            }
        }

        const searchArgs = { ...args };

        if (sorter && sorter.field && sorter.order) {
            const order = sorter?.order === "ascend" ? 'asc' : 'desc'
            args.orderBy = [
                {
                    [sorter.field]: order,
                }
            ]
        }

        if (skip) args.skip = skip
        if (limit) args.take = limit

        return {
            args,
            searchArgs,
        };
    }
}
