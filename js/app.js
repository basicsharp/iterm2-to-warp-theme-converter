/**
 * iTerm2 to Warp Theme Converter - UI Logic
 * Handles DOM manipulation, event handlers, and user interactions
 */

// DOM element references
const itermInput = document.getElementById('iterm-input');
const warpOutput = document.getElementById('warp-output');
const convertBtn = document.getElementById('convert-btn');
const copyBtn = document.getElementById('copy-btn');
const fileUpload = document.getElementById('file-upload');
const statusMessage = document.getElementById('status-message');

/**
 * Displays a status message to the user.
 * @param {string} message - The message to display.
 * @param {'success' | 'error'} type - The type of message.
 */
const showStatus = (message, type) => {
    statusMessage.textContent = message;
    if (type === 'success') {
        statusMessage.className = 'mt-6 text-center text-sm text-green-400';
    } else {
        statusMessage.className = 'mt-6 text-center text-sm text-red-400';
    }
};

/**
 * Main function to handle the conversion process.
 */
const handleConvert = () => {
    const itermXml = itermInput.value;
    
    try {
        const yamlOutput = convertITermToWarp(itermXml);
        warpOutput.value = yamlOutput;
        copyBtn.disabled = false;
        showStatus("Conversion successful!", "success");
    } catch (error) {
        showStatus(`Conversion failed: ${error.message}`, "error");
        warpOutput.value = '';
        copyBtn.disabled = true;
    }
};

/**
 * Handles the file upload event.
 * @param {Event} event - The file input change event.
 */
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            itermInput.value = e.target.result;
            handleConvert();
        };
        reader.onerror = () => {
            showStatus("Failed to read the file.", "error");
        };
        reader.readAsText(file);
    }
};

/**
 * Copies the generated YAML to the clipboard.
 */
const handleCopy = () => {
    if (!warpOutput.value) return;

    // The navigator.clipboard API might not be available in all contexts,
    // so we use the older execCommand as a reliable fallback.
    const textarea = document.createElement('textarea');
    textarea.value = warpOutput.value;
    textarea.style.position = 'fixed'; // Avoid scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy to Clipboard`;
        }, 2000);
    } catch (err) {
        showStatus('Failed to copy text.', 'error');
    }
    document.body.removeChild(textarea);
};

/**
 * Initialize the application when the DOM is loaded.
 */
const initializeApp = () => {
    // Event listeners
    convertBtn.addEventListener('click', handleConvert);
    fileUpload.addEventListener('change', handleFileUpload);
    copyBtn.addEventListener('click', handleCopy);
    
    // Clear any initial status messages
    showStatus('', 'success');
};

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
} 