// Simple debug script to check what's happening with the demo
console.log("=== SPADE Demo Debug ===");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  // Check if container exists
  const container = document.getElementById("agent-demo-container");
  console.log("Container found:", !!container);

  // Check if vis.js is loaded
  console.log("vis available:", typeof window.vis);

  // Check if AgentDemo exists
  console.log("AgentDemo available:", typeof window.AgentDemo);

  // Check if demo controls exist
  const startBtn = document.getElementById("start-demo");
  const resetBtn = document.getElementById("reset-demo");
  const toggleBtn = document.getElementById("toggle-code");
  const scenarioSelect = document.getElementById("demo-scenario");

  console.log("Start button:", !!startBtn);
  console.log("Reset button:", !!resetBtn);
  console.log("Toggle button:", !!toggleBtn);
  console.log("Scenario select:", !!scenarioSelect);

  // Check if demos.json is accessible
  fetch("/json/demos.json")
    .then((response) => {
      console.log("demos.json status:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("demos.json loaded:", data);
    })
    .catch((error) => {
      console.error("Error loading demos.json:", error);
    });

  // Try to initialize AgentDemo if it exists
  if (typeof window.AgentDemo !== "undefined") {
    console.log("Trying to initialize AgentDemo...");
    try {
      window.AgentDemo.init();
    } catch (error) {
      console.error("Error initializing AgentDemo:", error);
    }
  }
});
