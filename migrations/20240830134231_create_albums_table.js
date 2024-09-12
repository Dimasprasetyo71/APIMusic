exports.up = function (knex) {
    return knex.schema.createTable('albums', (table) => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.integer('year').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('albums');
};
