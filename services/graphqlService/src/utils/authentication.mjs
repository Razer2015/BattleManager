import { AuthenticationError, ForbiddenError } from 'apollo-server-core';
import jwt from 'jsonwebtoken'
const { TokenExpiredError } = jwt;
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../constants.mjs';
import { matchPassword } from '../integrations/crypto/crypto.mjs';
import Prisma from '../integrations/prisma/prisma.mjs';
import { InvalidCredentialsError } from './errors.mjs';

const dbClient = new Prisma()

export const getUser = (token) => {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;

    try {
        const verified = jwt.verify(token, tokenSecret);
        if (verified) {
            return verified;
        } else {
            return null;
        }
    } catch (error) {
        // console.error(error);
        return null;
    }
}

export async function generateTokenFromRefreshToken(refreshToken) {
    try {
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET_KEY;
        const verified = jwt.verify(refreshToken, refreshSecret);
        if (verified) {
            const user = await dbClient.getUserById(verified.userId)
            if (!user || !user.is_logged_in) throw new ForbiddenError('Invalid or Expired refresh token.');

            return generateTokenFromUserId(verified.userId);
        }

        throw new ForbiddenError('Invalid or Expired refresh token.');
    } catch (error) {
        // console.error(error);
        throw new ForbiddenError('Invalid or Expired refresh token.');
    }
}

export async function generateTokenFromUserId(userId) {
    const user = await dbClient.getUserById(userId)

    if (!user) throw new InvalidCredentialsError('Invalid credentials');

    return generateToken(user);
}

export async function generateTokenFromEmail(email, password) {
    const user = await dbClient.getUserByEmail(email)

    if (!user) throw new InvalidCredentialsError('Invalid credentials');

    return generateTokenFromUser(user, password);
}

export async function generateTokenFromUser(user, password) {
    if (matchPassword(password, user.password)) {
        return generateToken(user);
    }

    throw new InvalidCredentialsError('Invalid credentials');
}

export function addTokenCookies(reply, accessToken, refreshToken) {
    reply
        .cookie(ACCESS_TOKEN_NAME, accessToken, {
            httpOnly: true,
            signed: !!process.env.COOKIE_SECRET,
        })
        .cookie(REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            signed: !!process.env.COOKIE_SECRET,
        })
}

export function clearTokenCookies(reply) {
    reply
        .clearCookie(ACCESS_TOKEN_NAME)
        .clearCookie(REFRESH_TOKEN_NAME)
}

export async function refreshIfNeeded(reply, token, refreshToken) {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;

    try {
        const verified = jwt.verify(token, tokenSecret);
        if (verified && (verified.exp > Math.floor(new Date().getTime() / 1000))) {
            return { token, refreshToken }
        }
    } catch (error) {
        if (!error instanceof TokenExpiredError) {
            console.error(error);
        }
    }

    // Refresh
    const result = await generateTokenFromRefreshToken(refreshToken);
    if (result) {
        addTokenCookies(reply, result?.accessToken, result?.refreshToken);
        return { token: result.accessToken, refreshToken: result.refreshToken }
    }

    return { token, refreshToken }
}

async function generateToken(user) {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
    const accessTokenLife = parseInt(process.env.ACCESS_TOKEN_LIFE)
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET_KEY;
    const refreshTokenLife = parseInt(process.env.REFRESH_TOKEN_LIFE)

    const roles = await dbClient.getUserRoles(user.id);

    const profileData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        roles: roles.map(role => role?.battlemanager_roles?.name)
    };
    const accessToken = jwt.sign(profileData, tokenSecret, { expiresIn: accessTokenLife });

    const refreshToken = jwt.sign({
        userId: user.id
    }, refreshSecret, { expiresIn: refreshTokenLife });

    return {
        ...profileData,
        accessToken,
        accessTokenLife,
        refreshToken,
        refreshTokenLife,
    }
}

export const checkAuthentication = (token, user, roles) => {
    if (!token || !token.length) throw new AuthenticationError();
    if (!user) throw new ForbiddenError('Invalid or Expired JWT token.');

    if (!roles) return;

    if (Array.isArray(roles)) {
        if (!user?.roles?.some(r => roles.includes(r))) throw new ForbiddenError('Your user doesn\'t have access to this resource.');
    }
    else if (typeof roles === 'string' || roles instanceof String) {
        if (!user?.roles?.includes(roles)) throw new ForbiddenError('Your user doesn\'t have access to this resource.');
    }
}
