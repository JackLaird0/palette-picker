const $newPaletteButton = $('.new-palette');
const $colorCard1 = $('.color-card1');
const $colorCard2 = $('.color-card2');
const $colorCard3 = $('.color-card3');
const $colorCard4 = $('.color-card4');
const $colorCard5 = $('.color-card5');

const colorValues = ['a', 'b', 'c', 'd', 'e', 'f', 
                      0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const randomColorGenerator = () => {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += colorValues[Math.floor(Math.random() * 16)];
  }
   return color
} 

const generateNewPalette = (e) => {
  e.preventDefault();
  console.log('ya did it')
  $colorCard1.attr('style', `background-color: ${randomColorGenerator()};`);
  $colorCard2.attr('style', `background-color: ${randomColorGenerator()};`);
  $colorCard3.attr('style', `background-color: ${randomColorGenerator()};`);
  $colorCard4.attr('style', `background-color: ${randomColorGenerator()};`);
  $colorCard5.attr('style', `background-color: ${randomColorGenerator()};`);
}

$newPaletteButton.on('click', generateNewPalette);