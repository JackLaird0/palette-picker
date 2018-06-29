const $newPaletteButton = $('.new-palette');
const $colorCard1 = $('.color-card1');
const $colorCard2 = $('.color-card2');
const $colorCard3 = $('.color-card3');
const $colorCard4 = $('.color-card4');
const $colorCard5 = $('.color-card5');
const $projectInput = $('.project-input');
const $saveProjectButton = $('.save-project');

const colorValues = ['a', 'b', 'c', 'd', 'e', 'f', 
                      0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const randomColorGenerator = () => {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += colorValues[Math.floor(Math.random() * 16)];
  }
   return color
} 

const submitProjectName = (projectName) => {
  console.log('success')
  fetch('http://localhost:5280/projects/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({project: {name: projectName}})
  });
}

$saveProjectButton.on('click', event => {
  event.preventDefault
  submitProjectName($projectInput.val())
  }
);

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