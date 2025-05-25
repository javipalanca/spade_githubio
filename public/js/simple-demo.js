// Simplified demo script to test basic functionality
console.log("Loading simplified demo script...");

// Simple object to test basic demo functionality
const SimpleDemo = {
  init() {
    console.log("SimpleDemo: Starting initialization...");

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.doInit());
    } else {
      this.doInit();
    }
  },

  doInit() {
    console.log("SimpleDemo: DOM ready, initializing...");

    // Check for required elements
    const container = document.getElementById("agent-demo-container");
    const startBtn = document.getElementById("start-demo");
    const scenarioSelect = document.getElementById("demo-scenario");

    console.log("Container found:", !!container);
    console.log("Start button found:", !!startBtn);
    console.log("Scenario select found:", !!scenarioSelect);

    if (!container) {
      console.error("SimpleDemo: No container found!");
      return;
    }

    // Test vis.js
    if (typeof window.vis !== "undefined") {
      console.log("SimpleDemo: vis.js is available");
      this.createSimpleNetwork(container);
    } else {
      console.error("SimpleDemo: vis.js not available");
    }

    // Test scenario loading
    this.loadScenarios();

    // Test controls
    this.setupSimpleControls();

    console.log("SimpleDemo: Initialization complete");
  },

  createSimpleNetwork(container) {
    console.log("SimpleDemo: Creating simple network...");

    // Create or find network container
    let networkDiv = document.getElementById("agent-network");
    if (!networkDiv) {
      networkDiv = document.createElement("div");
      networkDiv.id = "agent-network";
      networkDiv.style.width = "100%";
      networkDiv.style.height = "400px";
      container.appendChild(networkDiv);
    }

    // Simple test data
    const nodes = new vis.DataSet([
      { id: 1, label: "Agent 1", x: 100, y: 100 },
      { id: 2, label: "Agent 2", x: 300, y: 100 },
    ]);

    const edges = new vis.DataSet([{ from: 1, to: 2, arrows: "to" }]);

    const data = { nodes: nodes, edges: edges };
    const options = {
      layout: { randomSeed: 1 },
      physics: { enabled: false },
    };

    try {
      this.network = new vis.Network(networkDiv, data, options);
      console.log("SimpleDemo: Network created successfully");
    } catch (error) {
      console.error("SimpleDemo: Error creating network:", error);
    }
  },

  loadScenarios() {
    console.log("SimpleDemo: Loading scenarios...");

    fetch("/json/demos.json")
      .then((response) => {
        console.log("SimpleDemo: Demos JSON response:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("SimpleDemo: Demos loaded:", data);
        this.populateScenarioSelect(data);
      })
      .catch((error) => {
        console.error("SimpleDemo: Error loading demos:", error);
      });
  },

  populateScenarioSelect(data) {
    const select = document.getElementById("demo-scenario");
    if (!select) {
      console.warn("SimpleDemo: No scenario select found");
      return;
    }

    // Clear existing options
    select.innerHTML = "";

    // Add scenarios
    data.demos.forEach((demo) => {
      const option = document.createElement("option");
      option.value = demo.id;
      option.textContent = demo.name;
      select.appendChild(option);
    });

    console.log("SimpleDemo: Populated", data.demos.length, "scenarios");
  },

  setupSimpleControls() {
    console.log("SimpleDemo: Setting up controls...");

    const startBtn = document.getElementById("start-demo");
    const toggleBtn = document.getElementById("toggle-code");

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        console.log("SimpleDemo: Start button clicked");
        this.startSimpleAnimation();
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        console.log("SimpleDemo: Toggle code button clicked");
        this.toggleCodeSection();
      });
    }
  },

  startSimpleAnimation() {
    console.log("SimpleDemo: Starting simple animation...");

    const statusText = document.getElementById("demo-status-text");
    if (statusText) {
      statusText.textContent = "Running";
      statusText.className = "text-success";
    }

    // Simple animation: just change node colors
    if (this.network) {
      const nodes = new vis.DataSet([
        { id: 1, label: "Agent 1", color: "red" },
        { id: 2, label: "Agent 2", color: "blue" },
      ]);
      this.network.setData({
        nodes: nodes,
        edges: this.network.body.data.edges,
      });
    }
  },

  toggleCodeSection() {
    console.log("SimpleDemo: Toggling code section...");

    const codeSection = document.getElementById("demo-code-section");
    if (codeSection) {
      if (codeSection.style.display === "none") {
        codeSection.style.display = "block";
        console.log("SimpleDemo: Code section shown");
      } else {
        codeSection.style.display = "none";
        console.log("SimpleDemo: Code section hidden");
      }
    }
  },
};

// Initialize when script loads
SimpleDemo.init();

// Make it globally available
window.SimpleDemo = SimpleDemo;
