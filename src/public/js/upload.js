// upload.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('image');
  const dropZone = document.getElementById('dropZone');
  const selectedFileName = document.getElementById('selectedFileName');
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  dropZone.appendChild(errorContainer);

  // Create size warning element
  const sizeWarning = document.createElement('div');
  sizeWarning.className = 'size-warning hidden';
  dropZone.appendChild(sizeWarning);

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

  function formatFileSize(bytes) {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2);
  }

  function showError(message, isWarning = false) {
    if (isWarning) {
      sizeWarning.innerHTML = `
                <div class="warning-icon">⚠️</div>
                <div class="warning-content">
                    <strong>Warning: Large File Detected</strong><br>
                    ${message}
                </div>
            `;
      sizeWarning.classList.remove('hidden');
      errorContainer.style.display = 'none';
    } else {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      sizeWarning.classList.add('hidden');
    }
    selectedFileName.style.display = 'none';
  }

  function clearError() {
    errorContainer.style.display = 'none';
    sizeWarning.classList.add('hidden');
    selectedFileName.style.display = 'block';
  }

  function validateFile(file) {
    if (!file) {
      showError('Please select a file');
      return false;
    }

    const fileSize = formatFileSize(file.size);

    if (file.size > MAX_FILE_SIZE) {
      showError(
        `
                Current file size: ${fileSize}MB<br>
                Maximum allowed: 4MB<br>
                Please choose a smaller file or compress this one.
            `,
        true
      );
      return false;
    }

    if (!file.type.match(/^image\/(jpeg|png|gif|webp|avif)$/)) {
      showError('Invalid file type. Please use JPG, PNG, GIF, WebP, or AVIF');
      return false;
    }

    // Show file size even for valid files
    selectedFileName.innerHTML = `
            Selected: ${file.name}<br>
            <span class="file-size">Size: ${fileSize}MB</span>
        `;

    return true;
  }

  // File input change handler
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      if (validateFile(file)) {
        clearError();
      } else {
        // Don't clear the input to allow checking the file info
        // this.value = '';
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
    }
  });
});
