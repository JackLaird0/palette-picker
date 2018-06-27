
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('color-one');
      table.string('color-two');
      table.string('color-three');
      table.string('color-four');
      table.string('color-five');
      table.integer('project_id').unsigned()
      table.foreign('project_id')
        .references('projects.id')


      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('palettes')
  ]);
};
