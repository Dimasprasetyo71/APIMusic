require('dotenv').config();

module.exports = {
    client: 'pg',
    connection: {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT,
    },
    migrations: {
        tableName: 'knex_migrations',
    },
};