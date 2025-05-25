// Test script for the new layout
document.addEventListener("DOMContentLoaded", function () {
  console.log("=== Testing New Layout ===");

  // Test 1: Check if elements exist
  const elements = {
    "Demo Container": document.getElementById("agent-demo-container"),
    "Network Canvas": document.getElementById("agent-network"),
    Controls: document.querySelector(".demo-controls"),
    "Code Section": document.getElementById("demo-code-section"),
    "Toggle Button": document.getElementById("toggle-code"),
    "Start Button": document.getElementById("start-demo"),
  };

  console.log("Element Check:");
  Object.entries(elements).forEach(([name, element]) => {
    console.log(`${element ? "✓" : "✗"} ${name}:`, element);
  });

  // Test 2: Check CSS classes and styles
  const codeSection = document.getElementById("demo-code-section");
  if (codeSection) {
    console.log("Code section classes:", codeSection.className);
    console.log("Code section display:", getComputedStyle(codeSection).display);
  }

  // Test 3: Check if AgentDemo exists
  setTimeout(() => {
    if (typeof window.AgentDemo !== "undefined") {
      console.log("✓ AgentDemo object exists");
      console.log("  - Container:", !!window.AgentDemo.container);
      console.log("  - Demo data:", !!window.AgentDemo.demoData);

      // Test toggle functionality
      const toggleBtn = document.getElementById("toggle-code");
      if (toggleBtn) {
        console.log("Testing toggle button...");
        toggleBtn.click();

        setTimeout(() => {
          const isActive = codeSection.classList.contains("active");
          console.log("Code section active after toggle:", isActive);
        }, 500);
      }
    } else {
      console.log("✗ AgentDemo not found");
    }
  }, 1500);
});
