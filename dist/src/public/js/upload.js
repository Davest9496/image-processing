"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('image');
    const dropZone = document.getElementById('dropZone');
    const selectedFileName = document.getElementById('selectedFileName');
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    dropZone.appendChild(errorContainer);
    // Create size warning element with more prominent styling
    const sizeWarning = document.createElement('div');
    sizeWarning.className = 'size-warning hidden';
    dropZone.appendChild(sizeWarning);
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
    function formatFileSize(bytes) {
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2);
    }
    function showError(message, isWarning = false) {
        // Force immediate DOM update
        requestAnimationFrame(() => {
            if (isWarning) {
                sizeWarning.innerHTML = `
          <div class="warning-icon">⚠️</div>
          <div class="warning-content">
            <strong>Warning: Large File Detected</strong><br>
            ${message}
          </div>
        `;
                sizeWarning.classList.remove('hidden');
                sizeWarning.style.display = 'flex'; // Force display
                errorContainer.style.display = 'none';
            }
            else {
                errorContainer.textContent = message;
                errorContainer.style.display = 'block';
                sizeWarning.classList.add('hidden');
                sizeWarning.style.display = 'none';
            }
            selectedFileName.style.display = 'none';
        });
    }
    function clearError() {
        errorContainer.style.display = 'none';
        sizeWarning.classList.add('hidden');
        sizeWarning.style.display = 'none';
        selectedFileName.style.display = 'block';
    }
    function validateFile(file) {
        if (!file) {
            showError('Please select a file');
            return false;
        }
        // Immediate size check
        const fileSize = formatFileSize(file.size);
        console.log('File size check:', fileSize, 'MB'); // Debug log
        if (file.size > MAX_FILE_SIZE) {
            const message = `
        Current file size: ${fileSize}MB<br>
        Maximum allowed: 4MB<br>
        Please choose a smaller file or compress this one.
      `;
            showError(message, true);
            // Force UI update
            requestAnimationFrame(() => {
                sizeWarning.style.display = 'flex';
            });
            return false;
        }
        if (!file.type.match(/^image\/(jpeg|png|gif|webp|avif)$/)) {
            showError('Invalid file type. Please use JPG, PNG, GIF, WebP, or AVIF');
            return false;
        }
        selectedFileName.innerHTML = `
      Selected: ${file.name}<br>
      <span class="file-size">Size: ${fileSize}MB</span>
    `;
        return true;
    }
    // File input change handler with immediate check
    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            // Immediate size check before validation
            const fileSize = file.size / (1024 * 1024);
            console.log('Initial size check:', fileSize, 'MB'); // Debug log
            if (fileSize > 4) {
                const message = `
          Current file size: ${fileSize.toFixed(2)}MB<br>
          Maximum allowed: 4MB<br>
          Please choose a smaller file or compress this one.
        `;
                showError(message, true);
                return;
            }
            if (validateFile(file)) {
                clearError();
            }
        }
    });
    // Form submit handler with double-check
    form.addEventListener('submit', function (e) {
        const file = fileInput.files[0];
        if (file && file.size > MAX_FILE_SIZE) {
            e.preventDefault();
            const fileSize = formatFileSize(file.size);
            showError(`
        Current file size: ${fileSize}MB<br>
        Maximum allowed: 4MB<br>
        Please choose a smaller file or compress this one.
      `, true);
            return false;
        }
        if (!validateFile(file)) {
            e.preventDefault();
            return false;
        }
    });
    // Enhanced drop handler
    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            // Immediate size check for dropped files
            const fileSize = file.size / (1024 * 1024);
            if (fileSize > 4) {
                const message = `
          Current file size: ${fileSize.toFixed(2)}MB<br>
          Maximum allowed: 4MB<br>
          Please choose a smaller file or compress this one.
        `;
                showError(message, true);
                return;
            }
            if (validateFile(file)) {
                fileInput.files = e.dataTransfer.files;
                clearError();
            }
        }
    });
    // Rest of your event handlers remain the same
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    dropZone.addEventListener('dragenter', () => dropZone.classList.add('dragover'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
});
//# sourceMappingURL=upload.js.map