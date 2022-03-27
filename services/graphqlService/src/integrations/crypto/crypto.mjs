import { randomBytes, scryptSync } from 'crypto';

// https://stackoverflow.com/a/70631147

// Pass the password string and get hashed password back
// ( and store only the hashed string in your database)
const encryptPassword = (password, salt) => {
    return scryptSync(password, salt, 32).toString('hex');
};

/**
 * Hash password with random salt
 * @return {string} password hash followed by salt
 *  XXXX till 64 XXXX till 32
 *
 */
export const hashPassword = (password) => {
    // Any random string here (ideally should be atleast 16 bytes)
    const salt = randomBytes(16).toString('hex');
    return encryptPassword(password, salt + process.env.APP_KEY) + salt;
};

/**
 * Match password against the stored hash
 */
export const matchPassword = (password, hash) => {
    // extract salt from the hashed string
    // our hex password length is 32*2 = 64
    const salt = hash.slice(64) + process.env.APP_KEY;
    const originalPassHash = hash.slice(0, 64);
    const currentPassHash = encryptPassword(password, salt);
    return originalPassHash === currentPassHash;
};
