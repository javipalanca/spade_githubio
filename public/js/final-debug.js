// Final state debug script - runs after everything should be loaded
setTimeout(() => {
  console.log("=== FINAL STATE DEBUG ===");

  // Check AgentDemo state
  if (typeof window.AgentDemo !== "undefined") {
    const demo = window.AgentDemo;
    console.log("✓ AgentDemo exists");
    console.log("  - Container:", !!demo.container);
    console.log("  - Network:", !!demo.network);
    console.log("  - Demo data:", !!demo.demoData);
    console.log("  - Current scenario:", demo.scenario);

    if (demo.demoData) {
      console.log(
        "  - Available scenarios:",
        demo.demoData.demos.map((d) => d.id).join(", ")
      );
    }
  } else {
    console.log("✗ AgentDemo not found");
  }

  // Check DOM elements
  const elements = {
    Container: document.getElementById("agent-demo-container"),
    "Network div": document.getElementById("agent-network"),
    "Start button": document.getElementById("start-demo"),
    "Reset button": document.getElementById("reset-demo"),
    "Toggle button": document.getElementById("toggle-code"),
    "Scenario select": document.getElementById("demo-scenario"),
    "Code section": document.getElementById("demo-code-section"),
    "Status text": document.getElementById("demo-status-text"),
  };

  Object.entries(elements).forEach(([name, element]) => {
    if (element) {
      console.log(`✓ ${name} found`);
      if (name === "Scenario select" && element.options) {
        console.log(`  - Options: ${element.options.length}`);
      }
    } else {
      console.log(`✗ ${name} NOT found`);
    }
  });

  // Test basic functionality
  const startBtn = document.getElementById("start-demo");
  if (startBtn) {
    console.log("Testing start button...");
    startBtn.click();
  }
}, 3000); // Wait 3 seconds for everything to load
