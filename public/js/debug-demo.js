// Debug script for the interactive demo
console.log("Debug script loaded");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, checking demo elements...");

  // Check if key elements exist
  const elements = {
    "agent-demo-container": document.getElementById("agent-demo-container"),
    "agent-network": document.getElementById("agent-network"),
    "agent-canvas": document.getElementById("agent-canvas"),
    "demo-scenario": document.getElementById("demo-scenario"),
    "start-demo": document.getElementById("start-demo"),
    "toggle-code": document.getElementById("toggle-code"),
    "demo-code-section": document.getElementById("demo-code-section"),
    "demo-code-content": document.getElementById("demo-code-content"),
  };

  console.log("Elements found:", elements);

  // Check if vis.js is loaded
  console.log("vis global:", typeof window.vis);

  // Check if Prism is loaded
  console.log("Prism global:", typeof window.Prism);

  // Check if AgentDemo is initialized
  setTimeout(() => {
    console.log("AgentDemo global:", typeof window.AgentDemo);
    if (window.AgentDemo) {
      console.log(
        "AgentDemo initialized:",
        window.AgentDemo.container !== null
      );
      console.log("AgentDemo network:", window.AgentDemo.network !== null);
    }
  }, 2000);
});
