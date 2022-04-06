import { GraphQLScalarType, Kind } from 'graphql';

// https://gist.github.com/langpavel/b30f3d507a47713b0c6e89016e4e9eb7
export const Timestamp = new GraphQLScalarType({
    name: 'Timestamp',
    description: 'The javascript `Date` as integer. Type represents date and time ' +
        'as number of milliseconds from start of UNIX epoch.',
    serialize(value) {
        if (value instanceof Date) {
            return value.getTime();
        } else if (typeof value === 'number') {
            return Math.trunc(value);
        } else if (typeof value === 'string') {
            return Date.parse(value);
        }
        return null;
    },
    parseValue(value) {
        if (value === null) {
            return null;
        }

        try {
            return new Date(value);
        } catch (err) {
            return null;
        }
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            const num = parseInt(ast.value, 10);
            return new Date(num);
        } else if (ast.kind === Kind.STRING) {
            return parseDate(ast.value);
        }
        return null;
    },
});

// https://github.com/Nberezhnoy/apollo-type-bigint
const MAX_INT = Number.MAX_SAFE_INTEGER;
const MIN_INT = Number.MIN_SAFE_INTEGER;
export const BigIntScalar = new GraphQLScalarType({
    name: 'BigInt',
    description: "The `BigInt` scalar type represents non-fractional signed whole numeric values." +
        "BigInt can represent values between -(2^53) + 1 and 2^53 - 1.",
    serialize(value) {
        if (value === "") {
            throw new TypeError("The value cannot be converted from BigInt because it is empty string");
        }
        try {
            return global.BigInt(value.toString()).toString();
        } catch {
            throw new TypeError(
                `The value ${value} cannot be converted to a BigInt because it is not an integer`
            );
        }
    },
    parseValue(value) {
        return BigInt(value);
        if (typeof value !== "number") {
            throw new TypeError(`BigInt cannot represent non-integer value: ${value}`);
        }
        const number = Number(value);
        if (number > MAX_INT || number < MIN_INT) {
            throw new TypeError("BigInt number should be in the range from -(2^53) + 1 to 2^53 - 1");
        }
        const int = Math.floor(number);
        if (int !== number) {
            throw new TypeError(`BigInt cannot represent non-integer value: ${value}`);
        }
        return number;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            const number = Number(ast.value);
            if (number <= MAX_INT && number >= MIN_INT) {
                return number;
            } else {
                throw new TypeError("BigInt number should be in the range from -(2^53) + 1 to 2^53 - 1");
            }
        } else {
            throw new TypeError(`BigInt cannot represent non-integer value: ${ast.value}`);
        }
    },
});