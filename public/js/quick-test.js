// Quick functional test for the demo
setTimeout(() => {
  console.log("=== Quick Demo Test ===");

  // Find the demo section
  const demoContainer = document.getElementById("agent-demo-container");
  const codeSection = document.getElementById("demo-code-section");
  const toggleBtn = document.getElementById("toggle-code");

  if (demoContainer && codeSection && toggleBtn) {
    console.log("✓ All elements found");

    // Check initial layout
    const containerRect = demoContainer.getBoundingClientRect();
    const codeRect = codeSection.getBoundingClientRect();

    console.log("Container height:", containerRect.height);
    console.log("Code section display:", getComputedStyle(codeSection).display);
    console.log("Code section height:", codeRect.height);

    // Test toggle
    console.log("Testing toggle...");
    toggleBtn.click();

    setTimeout(() => {
      const newCodeRect = codeSection.getBoundingClientRect();
      const isVisible = codeSection.classList.contains("active");
      console.log("After toggle - visible:", isVisible);
      console.log("After toggle - height:", newCodeRect.height);

      if (isVisible && newCodeRect.height > 0) {
        console.log("✓ Toggle working correctly!");
      } else {
        console.log("✗ Toggle might not be working");
      }
    }, 500);
  } else {
    console.log("✗ Missing elements:", {
      container: !!demoContainer,
      codeSection: !!codeSection,
      toggleBtn: !!toggleBtn,
    });
  }
}, 2000);
