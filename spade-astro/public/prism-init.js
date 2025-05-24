// Prism.js initialization script
console.log('Prism init script loaded');

// Initialize immediately
function initPrism() {
  console.log('Attempting to initialize Prism.js...');
  console.log('window.Prism:', typeof window.Prism);

  if (typeof window.Prism !== 'undefined' && window.Prism.highlightAll) {
    console.log('Prism.js found, highlighting all code blocks...');

    // Find all code blocks with language classes
    const codeBlocks = document.querySelectorAll(
      'pre code[class*="language-"]'
    );
    console.log('Found', codeBlocks.length, 'code blocks to highlight');

    // Highlight each code block
    codeBlocks.forEach((block, index) => {
      console.log(`Highlighting block ${index + 1}:`, block.className);
      window.Prism.highlightElement(block);
    });

    // Also run highlightAll for good measure
    window.Prism.highlightAll();
    console.log('Prism.js highlighting completed');

    return true;
  } else {
    console.log(
      'Prism.js not ready yet, available methods:',
      Object.keys(window.Prism || {})
    );
    return false;
  }
}

// Try to initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, initializing Prism.js...');

  // Try multiple times with increasing delays
  let attempts = 0;
  const maxAttempts = 10;

  function tryInit() {
    attempts++;
    console.log(`Initialization attempt ${attempts}/${maxAttempts}`);

    if (initPrism()) {
      console.log('Prism.js successfully initialized!');
      return;
    }

    if (attempts < maxAttempts) {
      setTimeout(tryInit, 100 * attempts); // Increasing delay
    } else {
      console.error(
        'Failed to initialize Prism.js after',
        maxAttempts,
        'attempts'
      );
    }
  }

  tryInit();
});

// Re-initialize when new content is added
function rehighlightCode() {
  console.log('Rehighlighting code...');
  return initPrism();
}

// Make function globally available
window.rehighlightCode = rehighlightCode;
