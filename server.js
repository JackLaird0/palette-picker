const express = require('express');
const router = express();
const bodyParser = require('body-parser');

router.locals.palettes = {
  1: '#123456',
  2: '#142356',
  3: '#435687',
  4: '#1b4hf5',
  5: '#23ff60'
}

router.use(bodyParser.json());
router.use(express.static('public'));

router.set('port', process.env.PORT || 5280);

router.get('/api/v1/palettes/', (request, response) => {
  const { palettes } = router.locals;
  response.status(200).json(palettes);
});

router.post('/api/v1/palettes/', (request, response) => {
  const id = Date.now().toString();
  const { palette } = request.body;

  if (!palette) {
    response.status(422).send({error: 'palette not provided'})
  } else {
    router.locals.palettes[id] = palette;
    response.status(201).json({id, palette});
  }
});

router.listen(router.get('port'), () => {
  console.log(`Palette Picker is running on ${router.get('port')}.`)
});