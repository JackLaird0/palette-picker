const express = require('express'); //import express module that was installed via npm
const router = express(); // sets up express application
const bodyParser = require('body-parser'); //import body parser that was installed via npm
const environment = process.env.NODE_ENV || 'development'; //set the environment to development
const configuration = require('./knexfile')[environment]; //import the development environment from knexfile
const database = require('knex')(configuration);  // sets knex up with the proper environment

router.use(bodyParser.json()); // uses body parser to process info from request.body
router.use(express.static('public')); // sets the static site to use the public folder


router.set('port', process.env.PORT || 5280); // sets the port to 5280

router.get('/api/v1/projects/', (request, response) => { // makes get request from projects specific endpoint
  database('projects').select() //uses the projects database from knex and returns a promise
    .then( projects => {
      response.status(200).json(projects) // returns an array of project objects and a 200 status
    })
    .catch(error => {
      response.status(500).json({ error }) // returns an error and a 500 status code
    })
});

router.get('/api/v1/palettes/', (request, response) => { // makes get request from palettes specific endpoint
  database('palettes').select() // uses the palettes database from knex and returns a promise
  .then( palettes => {
    response.status(200).json(palettes) // returns an array of palette objects and a 200 status
  })
  .catch(error => {
    response.status(500).json({ error }) // returns an error and a 500 status code
  })
});


router.post('/api/v1/palettes/', (request, response) => { // makes a post request from a palettes specific endpoint
  const { palette } = request.body; // destructures the palette from request.body.palette

  for(let requiredParameter of ['name', 'color-one', 'color-two', 'color-three', 'color-four', 'color-five', 'project_id' ]) { 
    if (!palette[requiredParameter]) { // checks for required parameter
      return response
        .status(422) // returns a 422 stauts code if a required parameter is missing
        .send({ error: `Expected format: { name: <String>, color-one: <String>, color-two <String>, color-three: <String>, color-four: <String>, color-five: <String>, project_id: <Number> }. You're missing a "${requiredParameter}" property.`}); // provides an error with correct format and which param is missing
    }
  }
  
  database('palettes').insert(palette, 'id') // uses the palettes database from knex and returns a promise
    .then(palette => {
      response.status(201).json({ id: palette[0] }) // returns a 201 status code and the id of the palette that was just created
    })
    .catch(error => {
      response.status(500).json({ error }) // returns an error and a 500 status code
    });
});

router.post('/api/v1/projects/', (request, response) => { // makes a post request from a projects specific endpoint
  const { project } = request.body; // destructures the project from request.body.project

  for(let requiredParameter of ['name']) {
    if (!project[requiredParameter]) { // checks for required parameter
      return response
        .status(422) // returns a 422 stauts code if a required parameter is missing
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`}); // provides an error with correct format and which param is missing
    }
  }

  database('projects').insert(project, 'id') // uses the projects database from knex and returns a promise
    .then(project => {
      response.status(201).json({ id: project[0]}) // returns a 201 status code and the id of the project that was just created
    })
    .catch(error => {
      response.status(500).json({ error }) // returns an error and a 500 status code
    });
});

router.delete('/api/v1/palettes/:id', (request, response) => { // makes a delete request from a palettes endpoint with a specific id
  const { id } = request.params; // destructures id from request.params.id which you get from your endpoint

  database('palettes').where('id', id).del() //uses the palettes database from knex and returns a promise
    .then(() => {
      response.status(202).json({
        id //returns the id of the palette that was deleted and a 202 status code
      });
    });
});

router.listen(router.get('port'), () => { // listening for information on open port 
  console.log(`Palette Picker is running on ${router.get('port')}.`) // logs which port palette picker is running on
});

module.exports = router; // exports the server for access in test file