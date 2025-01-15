// Get DOM elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('image');
const selectedFileName = document.getElementById('selectedFileName');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

/**
 * Prevents default drag and drop behaviors
 * @param {Event} e - The drag event
 */
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Adds highlight class to drop zone
 */
function highlight() {
  dropZone.classList.add('dragover');
}

/**
 * Removes highlight class from drop zone
 */
function unhighlight() {
  dropZone.classList.remove('dragover');
}

/**
 * Handles file drop event
 * @param {DragEvent} e - The drop event
 */
function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  fileInput.files = files;
  updateFileName();
}

// Update filename when file is selected
fileInput.addEventListener('change', updateFileName);

/**
 * Updates the displayed filename when a file is selected
 */
function updateFileName() {
  if (fileInput.files.length > 0) {
    selectedFileName.textContent = `Selected: ${fileInput.files[0].name}`;
  } else {
    selectedFileName.textContent = '';
  }
}
