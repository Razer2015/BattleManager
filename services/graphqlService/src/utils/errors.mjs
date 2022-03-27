import { ApolloError } from 'apollo-server-errors';

export class InvalidCredentialsError extends ApolloError {
    constructor(message) {
        super(message, '400');

        Object.defineProperty(this, 'name', { value: 'InvalidCredentialsError' });
    }
}

export class UserConflictError extends ApolloError {
    constructor(message) {
        super(message, '409');

        Object.defineProperty(this, 'name', { value: 'UserConflictError' });
    }
}
