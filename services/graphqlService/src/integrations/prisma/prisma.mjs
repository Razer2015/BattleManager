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

    async getAllUsers({ skip, limit, search }) {
        if (!skip) skip = 0
        if (!limit) limit = 20

        const args = {}
        if (search) {
            args.where = {
                OR: [
                    {
                        email: {
                            contains: search,
                        }
                    },
                    {
                        name: {
                            contains: search,
                        }
                    }
                ]
            }
        }
        const searchArgs = JSON.parse(JSON.stringify(args));

        args.orderBy = [
            {
                name: 'asc',
            }
        ]
        // args.include = {
        //     battlemanager_userroles: {
        //         include: {
        //             battlemanager_roles: true
        //         }
        //     },
        // }
        args.skip = skip
        args.take = limit

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

    async getAllVips() {
        const allVips = await prisma.vsm_vips.findMany()
        return allVips
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

    async getAllPlayers({ skip, limit, search }) {
        if (!skip) skip = 0
        if (!limit) limit = 20

        const args = {}
        if (search) {
            args.where = {
                SoldierName: {
                    contains: search,
                },
            }
        }
        args.orderBy = [
            {
                SoldierName: 'asc',
            }
        ]
        args.skip = skip
        args.take = limit
        const allPlayers = await prisma.tbl_playerdata.findMany(args)
        return allPlayers
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

    async getServersByGameID(gameId) {
        return await prisma.tbl_server.findMany({
            where: {
                GameID: gameId,
            }
        })
    }
}
