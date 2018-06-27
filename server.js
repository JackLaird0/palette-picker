const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

router.use(bodyParser.json());
router.use(express.static('public'));

router.set('port', process.env.PORT || 5280);

router.get('/api/v1/projects/', (request, response) => {
  database('projects').select()
    .then( projects => {
      response.status(200).json(projects)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

router.get('/api/v1/palettes/', (request, response) => {
  database('palettes').select()
  .then( palettes => {
    response.status(200).json(palettes)
  })
  .catch(error => {
    response.status(500).json({ error })
  })
});


router.post('/api/v1/palettes/', (request, response) => {
  const { palette } = request.body;

  for(let requiredParameter of ['name', 'color-one', 'color-two', 'color-three', 'color-four', 'color-five', 'project_id' ]) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color-one: <String>, color-two <String>, color-three: <String>, color-four: <String>, color-five: <String> }. You're missing a "${requiredParameter}" property.`});
    }
  }
  
  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

router.post('/api/v1/projects/', (request, response) => {
  const { project } = request.body;

  for(let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`});
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0]})
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

router.listen(router.get('port'), () => {
  console.log(`Palette Picker is running on ${router.get('port')}.`)
});