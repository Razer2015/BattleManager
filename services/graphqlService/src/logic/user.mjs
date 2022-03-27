import pkg from '@prisma/client';
import { ForbiddenError } from 'apollo-server-core';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../constants.mjs';
const { Prisma } = pkg;
import { hashPassword } from "../integrations/crypto/crypto.mjs";
import { addTokenCookies, clearTokenCookies, generateTokenFromEmail, generateTokenFromRefreshToken, generateTokenFromUser } from "../utils/authentication.mjs";
import { UserConflictError } from '../utils/errors.mjs';
import BaseLogic from "./baseLogic.mjs";

export default class User extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    async createUser({ email, password }) {
        const user = await this.db.createUser({
            email: email,
            email_normalized: email.toUpperCase(),
            name: name,
            password: hashPassword(password),
            locked: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .catch(e => {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') {
                        console.log(
                            'There is a unique constraint violation, a new user cannot be created with this email'
                        )

                        throw new UserConflictError('User with the same email already exists.');
                    }
                }

                throw e
            });

        if (!user) throw new Error('Failed to create user');

        return generateTokenFromUser(user, password)
            .then(result => {
                this.db.changeUserLoggedInById(user.id, true);
                return result;
            });
    }

    async login({ email, password }) {
        return generateTokenFromEmail(email, password)
            .then(result => {
                this.db.changeUserLoggedInByEmail(email, true);
                return result;
            });
    }

    async loginSafe(reply, { email, password }) {
        return generateTokenFromEmail(email, password)
            .then(result => {
                this.db.changeUserLoggedInByEmail(email, true);

                addTokenCookies(reply, result?.accessToken, result?.refreshToken);

                return result
            });
    }

    async logout(reply, user) {
        return this.db.changeUserLoggedInById(user?.userId, false)
            .then(result => {
                clearTokenCookies(reply);

                return 'Logged out'
            })
            .catch(e => {
                console.error(e);

                return 'Logout failed'
            });
    }

    async token({ refreshToken }) {
        return generateTokenFromRefreshToken(refreshToken);
    }

    async tokenSafe(reply, refreshToken) {
        return generateTokenFromRefreshToken(refreshToken)
            .then(result => {
                addTokenCookies(reply, result?.accessToken, result?.refreshToken);

                return result
            })
            .catch(ex => {
                if (ex instanceof ForbiddenError) {
                    reply
                        .clearCookie(ACCESS_TOKEN_NAME)
                        .clearCookie(REFRESH_TOKEN_NAME)
                }
                throw ex
            });
    }
}