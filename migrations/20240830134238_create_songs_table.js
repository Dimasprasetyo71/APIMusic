exports.up = function (knex) {
    return knex.schema.createTable('songs', (table) => {
        table.string('id').primary();
        table.string('title').notNullable();
        table.integer('year').notNullable();
        table.string('performer').notNullable();
        table.string('genre').notNullable();
        table.integer('duration');
        table.string('albumId').references('id').inTable('albums').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('songs');
};
