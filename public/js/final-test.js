console.log("=== DEMO FINAL TEST ===");

// Wait for everything to load
setTimeout(() => {
  const demo = window.AgentDemo;
  const toggleBtn = document.getElementById("toggle-code");
  const codeSection = document.getElementById("demo-code-section");
  const startBtn = document.getElementById("start-demo");
  const scenarioSelect = document.getElementById("demo-scenario");

  console.log("Components status:");
  console.log("- AgentDemo:", !!demo);
  console.log("- Toggle button:", !!toggleBtn);
  console.log("- Code section:", !!codeSection);
  console.log("- Start button:", !!startBtn);
  console.log("- Scenario select:", !!scenarioSelect);

  if (demo && demo.demoData) {
    console.log("- Demo data loaded:", demo.demoData.demos.length, "scenarios");
  }

  if (scenarioSelect && scenarioSelect.options.length > 0) {
    console.log("- Scenario options:", scenarioSelect.options.length);
  }

  // Test toggle functionality
  if (toggleBtn && codeSection) {
    console.log("\nTesting toggle functionality...");
    toggleBtn.click();

    setTimeout(() => {
      const isActive = codeSection.classList.contains("active");
      console.log("Code section toggled:", isActive);

      if (isActive) {
        console.log("✅ Demo appears to be working!");
      } else {
        console.log("⚠️ Toggle might need adjustment");
      }
    }, 500);
  }
}, 3000);
