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
 
});

router.post('/api/v1/projects/', (request, reponse) => {
 
});

router.listen(router.get('port'), () => {
  console.log(`Palette Picker is running on ${router.get('port')}.`)
});