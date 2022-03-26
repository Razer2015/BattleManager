import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient()

export default class Prisma {
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
