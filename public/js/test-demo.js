// Test the demo functionality step by step
document.addEventListener("DOMContentLoaded", function () {
  console.log("Testing demo functionality...");

  setTimeout(() => {
    // Step 1: Check if AgentDemo exists and has been initialized
    if (typeof window.AgentDemo !== "undefined") {
      console.log("✓ AgentDemo object exists");

      // Step 2: Check if it has demoData
      if (window.AgentDemo.demoData) {
        console.log(
          "✓ Demo data loaded:",
          window.AgentDemo.demoData.demos.length,
          "scenarios"
        );
      } else {
        console.log("✗ No demo data loaded");
      }

      // Step 3: Check if network is initialized
      if (window.AgentDemo.network) {
        console.log("✓ Network initialized");
      } else {
        console.log("✗ Network not initialized");
      }

      // Step 4: Test button functionality
      const startBtn = document.getElementById("start-demo");
      if (startBtn) {
        console.log("✓ Start button found");
        startBtn.addEventListener("click", () => {
          console.log("Start button clicked - testing demo start");
        });
      } else {
        console.log("✗ Start button not found");
      }

      // Step 5: Test scenario selector
      const scenarioSelect = document.getElementById("demo-scenario");
      if (scenarioSelect && scenarioSelect.options.length > 0) {
        console.log(
          "✓ Scenario selector populated with",
          scenarioSelect.options.length,
          "options"
        );
      } else {
        console.log("✗ Scenario selector empty or not found");
      }

      // Step 6: Test code toggle
      const toggleBtn = document.getElementById("toggle-code");
      if (toggleBtn) {
        console.log("✓ Toggle code button found");
        toggleBtn.addEventListener("click", () => {
          console.log("Toggle code button clicked");
        });
      } else {
        console.log("✗ Toggle code button not found");
      }
    } else {
      console.log("✗ AgentDemo object not found");
    }
  }, 1000); // Wait for initialization
});
