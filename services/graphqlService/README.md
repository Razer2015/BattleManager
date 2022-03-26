# GraphQL Service

## Preparations

1. Create `.env` file at the root and add the following environment variables

| Name            | Example value                                             |
|-----------------|-----------------------------------------------------------|
| DATABASE_URL    | mysql://username:password@127.0.0.1:3306/battlemanager_db |

<hr>

## Prisma

### Introspection
https://www.prisma.io/docs/concepts/components/introspection

#### Introspection workflow

The typical workflow for projects that are not using Prisma Migrate, but instead use plain SQL or another migration tool looks as follows:

Change the database schema (e.g. using plain SQL)
1. Run `npx prisma db pull` to update the Prisma schema
2. Run `npm prisma generate` to update Prisma Client
3. Use the updated Prisma Client in your application

### Querying

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgres

<hr>

