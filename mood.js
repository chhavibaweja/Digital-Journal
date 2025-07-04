// Open the dropdown modal when user clicks on a grid cell
const gridCells = document.querySelectorAll('.grid-cell');
const modal = document.getElementById('mood-modal');
const moodSelect = document.getElementById('mood-select');
const closeModal = document.getElementById('close-modal');
let selectedCell = null;

// Load saved moods from localStorage on page load
window.onload = function () {
  const savedMoods = JSON.parse(localStorage.getItem('moodGrid'));
  if (savedMoods) {
    savedMoods.forEach((color, index) => {
      if (color) {
        gridCells[index].style.backgroundColor = color;
      }
    });
  }
};

// Event listener for each grid cell
gridCells.forEach((cell, index) => {
  cell.addEventListener('click', function () {
    selectedCell = this;
    selectedCell.dataset.index = index; // Store index for saving
    modal.style.display = 'flex';
  });
});

// Event listener for closing the modal
closeModal.addEventListener('click', function () {
  modal.style.display = 'none';
});

// Event listener for mood selection
moodSelect.addEventListener('change', function () {
  const mood = moodSelect.value;
  let color = '';

  // Change background color based on mood
  switch (mood) {
    case 'happy':
      color = '#ffd700'; // Yellow
      break;
    case 'sad':
      color = '#6495ed'; // Blue
      break;
    case 'angry':
      color = '#ff6347'; // Red
      break;
    case 'excited':
      color = '#ffa500'; // Orange
      break;
    case 'energetic':
      color = '#32cd32'; // Lime Green
      break;
    case 'lazy':
      color = '#d3d3d3'; // Light Gray
      break;
    case 'calm':
      color = '#add8e6'; // Light Blue
      break;
  }

  // Apply the color
  selectedCell.style.backgroundColor = color;

  // Save mood color in localStorage
  const savedMoods = JSON.parse(localStorage.getItem('moodGrid')) || [];
  const cellIndex = selectedCell.dataset.index;
  savedMoods[cellIndex] = color;
  localStorage.setItem('moodGrid', JSON.stringify(savedMoods));

  // Close the modal after mood is selected
  modal.style.display = 'none';
});
