const $newPaletteButton = $('.new-palette');
const $projectInput = $('.project-input');
const $saveProjectButton = $('.save-project');

$(document).ready(function() {
  $(document).ready(fetchProjects);
  $newPaletteButton.on('click', generateNewPalette);
  generateNewPalette();
  $saveProjectButton.on('click', event => {
    event.preventDefault();
    submitProjectName($projectInput.val());
    $projectInput.val('');
    }
  );
  $('.save-palette').on('click', savePalette);
  $('.projects-container').on('click', '.trash-can', deletePalette);
})

const colorValues = ['a', 'b', 'c', 'd', 'e', 'f', 
                      0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


const fetchProjects = async () => {
  const response = await fetch('/api/v1/projects');
  const projects = await response.json();
  prependProjects(projects)
  fetchPalettes();
}

const prependProjects = (projects) => {
  projects.forEach(project => {
    $('.projects-container').prepend(`
      <h3> ${project.name} </h3>
      <div class="palette palette-${project.id}">
      </div>
    `)
    $('.drop-down').prepend(`
      <option value="${project.id}">${project.name}</option>
    `)
  })
}

const fetchPalettes = async () => {
  const response = await fetch('/api/v1/palettes');
  const palettes = await response.json();
  await palettes.forEach(palette => {
    prependPalettes(palette)
  })
}

const prependPalettes = (palette) => {
    $(`.palette-${palette.project_id}`).prepend(`
        <div class='palette'>
          <p class="palette-name">${palette.name}</p>
          <div class="color-sample sample1" style="background-color: ${palette['color-one']};"></div>
          <div class="color-sample sample2" style="background-color: ${palette['color-two']};"></div>
          <div class="color-sample sample3" style="background-color: ${palette['color-three']};"></div>
          <div class="color-sample sample4" style="background-color: ${palette['color-four']};"></div>
          <div class="color-sample sample5" style="background-color: ${palette['color-five']};"></div>
          <button class='trash-can trash-${palette.id}'>Trash</button>
        </div>
    `)
}

const randomColorGenerator = () => {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += colorValues[Math.floor(Math.random() * 16)];
  }
   return color
} 

const submitProjectName = async (projectName) => {
  const response = await fetch('/api/v1/projects/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({project: {name: projectName}})
  });
  
  const newProjectId = await response.json();
  $('.drop-down').prepend(`
      <option value="${newProjectId.id}">${projectName}</option>
    `)
}

const generateNewPalette = () => {
  $('.color-card').each(function() {
    if (!$(this).children()[0].classList[1]) {
      const cardColor = randomColorGenerator();
      $(this).attr('style', `background-color: ${cardColor};`);
      $(this).children()[1].innerText = cardColor.toUpperCase()
    }
  })
}


const savePalette = (e) => {
  e.preventDefault();
  const colorOne = $('.hex-value1')[0].innerText
  const colorTwo = $('.hex-value2')[0].innerText
  const colorThree =  $('.hex-value3')[0].innerText
  const colorFour = $('.hex-value4')[0].innerText
  const colorFive = $('.hex-value5')[0].innerText
  const paletteName = $('.palette-name-input').val();
  const projectId = $( "select option:selected" ).val()
  const paletteBody = {
    palette: {
      name: paletteName,
      "color-one": colorOne,
      "color-two": colorTwo,
      "color-three": colorThree,
      "color-four": colorFour,
      "color-five": colorFive,
      "project_id": projectId
    }
  }
  fetch('/api/v1/palettes/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(paletteBody)
  })
  $('.palette-name-input').val('')
  prependPalettes(paletteBody.palette)
} 

const deletePalette = function () {
  const paletteId = $(this)[0].classList[1].split('-')[1];
  fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    }
  })
  $(this).parent().remove();
}

const handleLock = function () {
  if ($(this)[0].classList[1] !== 'locked' ) {
    this.classList.add('locked')
    this.innerText = 'Unlock'
  } else {
    this.classList.remove('locked')
    this.innerText = 'Lock'
  }
}

$('.color-card').on('click', '.lock', handleLock)