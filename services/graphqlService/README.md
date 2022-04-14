# GraphQL Service

## Preparations

1. Create `.env` file at the root and add the following environment variables

| Name                      | Example value                                             |
|---------------------------|-----------------------------------------------------------|
| DATABASE_URL              | mysql://username:password@127.0.0.1:3306/battlemanager_db |
| ALLOWED_ORIGINS           | http://localhost:3000                                     |
| APP_KEY                   | battlemanager-development                                 |
| COOKIE_SECRET             | battlemanager-development                                 |
| ACCESS_TOKEN_SECRET_KEY   | battlemanager-development                                 |
| ACCESS_TOKEN_LIFE         | 900                                                       |
| REFRESH_TOKEN_SECRET_KEY  | battlemanager-development                                 |
| REFRESH_TOKEN_LIFE        | 86400                                                     |
| INTERNAL_TOKEN            | 50655368566D597133743677397A2443                          |
| ADMIN_USERNAME            | admin                                                     |
| ADMIN_EMAIL               | admin@battlemanager.com                                   |
| ADMIN_PASSWORD            | password                                                  |
|---------------------------|-----------------------------------------------------------|

<hr>

## Prisma

### Introspection
https://www.prisma.io/docs/concepts/components/introspection

#### Introspection workflow

The typical workflow for projects that are not using Prisma Migrate, but instead use plain SQL or another migration tool looks as follows:

Change the database schema (e.g. using plain SQL)
1. Run `npx prisma db pull` to update the Prisma schema
2. Run `npx prisma generate` to update Prisma Client
3. Use the updated Prisma Client in your application

### Querying

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgres

<hr>

## Database schema


### BattleManager
```
battlemanager_*
```

prefixed tables

### Vip Slot Manager

```
vsm_vips
```
- Added `discord_id` column with type `BIGINT` and `allow nulls`

_Also make sure all tables are lowecase only_
### Chat, Stats, GUID logger

```
tbl_server
```

- Added `battlemanager_endpoint` column with type `VARCHAR(200)` and `allow nulls`
- Added `battlemanager_lastconnection` column with type `TIMESTAMP` and `allow nulls`
