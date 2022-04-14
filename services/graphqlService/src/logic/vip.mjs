import pkg from '@prisma/client';
const { Prisma } = pkg;
import { UserConflictError, NotFoundError } from "../utils/errors.mjs";
import BaseLogic from "./baseLogic.mjs";

export default class Vip extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    async createVip(user, { gametype, servergroup, playername, timestamp, status, comment, discord_id }) {
        const game = await this.db.getGameById(gametype);
        const vip = await this.db.createVip({
            gametype: game.Name,
            servergroup: servergroup.toString(),
            playername,
            timestamp,
            status,
            admin: user?.name,
            comment,
            discord_id,
        })
            .catch(e => {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') {
                        console.log(
                            'There is a unique constraint violation, a player with this name already exists.'
                        )

                        throw new UserConflictError('User with the same playername already exists.');
                    }
                }

                throw e
            });

        if (!vip) throw new Error('Failed to create vip');

        return vip;
    }

    async updateVip(user, vipId, { playername, timestamp, status, comment, discord_id }) {
        const vip = await this.db.updateVip(vipId, {
            playername,
            timestamp,
            status,
            admin: user?.name,
            comment,
            discord_id,
        })
            .catch(e => {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') {
                        console.log(
                            'There is a unique constraint violation, a player with this name already exists.'
                        )

                        throw new UserConflictError('User with the same playername already exists.');
                    }
                }

                throw e
            });

        if (!vip) throw new Error('Failed to update vip');

        return vip;
    }

    async deleteVip({ vipId }) {
        const vip = await this.db.getVipById(vipId);
        if (!vip) throw new NotFoundError('Vip not found');

        await this.db.deleteVip(vipId);

        return vip;
    }

    getVip(args) {
        return this.db.getVipById(args?.vipId);
    }

    async getVips(queryParams) {
        const [data, count] = await this.db.getAllVips(queryParams);
        return {
            count: count,
            data: data
        };
    }
}