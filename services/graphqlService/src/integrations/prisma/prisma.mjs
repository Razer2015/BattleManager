import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient()

export default class Prisma {
    async createUser(user) {
        return await prisma.battlemanager_users.create({ data: user })
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
        return await prisma.battlemanager_userroles.findMany({
            where: {
                userId: userId,
            },
            include: {
                battlemanager_roles: true,
            }
        })
    }

    async getAllVips() {
        const allVips = await prisma.vsm_vips.findMany()
        return allVips
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
}
