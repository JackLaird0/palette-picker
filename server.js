const express = require('express');
const router = express();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(express.static('public'));

router.set('port', process.env.PORT || 5280);

router.listen(router.get('port'), () => {
  console.log(`Palette Picker is running on ${router.get('port')}.`)
});