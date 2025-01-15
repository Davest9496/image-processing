document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('image');
  const dropZone = document.getElementById('dropZone');
  const selectedFileName = document.getElementById('selectedFileName');
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  dropZone.appendChild(errorContainer);

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

  function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    selectedFileName.style.display = 'none';
  }

  function clearError() {
    errorContainer.style.display = 'none';
    selectedFileName.style.display = 'block';
  }

  function validateFile(file) {
    if (!file) {
      showError('Please select a file');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      showError(
        `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 4MB limit`
      );
      return false;
    }

    if (!file.type.match(/^image\/(jpeg|png|gif|webp|avif)$/)) {
      showError('Invalid file type. Please use JPG, PNG, GIF, WebP, or AVIF');
      return false;
    }

    return true;
  }

  // File input change handler
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      if (validateFile(file)) {
        clearError();
        selectedFileName.textContent = `Selected: ${file.name}`;
      } else {
        this.value = ''; // Clear the file input
      }
    }
  });

  // Form submit handler
  form.addEventListener('submit', function (e) {
    const file = fileInput.files[0];
    if (!validateFile(file)) {
      e.preventDefault();
      return false;
    }
  });

  // Drag and drop handlers
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  dropZone.addEventListener('dragenter', () =>
    dropZone.classList.add('dragover')
  );
  dropZone.addEventListener('dragleave', () =>
    dropZone.classList.remove('dragover')
  );
  dropZone.addEventListener('drop', (e) => {
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      fileInput.files = e.dataTransfer.files;
      clearError();
      selectedFileName.textContent = `Selected: ${file.name}`;
    }
  });
});
