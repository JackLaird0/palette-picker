exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del()) 
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'sample'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { name: 'sample palette',
              'color-one': '#FFFFFF',
              'color-two': '#000000',
              'color-three': '#000FFF',
              'color-four': '#FFF000',
              'color-five': '#AB750C',
              project_id: project[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) 
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

