// SPADE Interactive Demo
// This script manages the interactive agent demonstrations
// It's been separated from the main scripts.js for better maintainability
// Last updated: May 25, 2025 - Refactored to use vis.js and dynamic JSON configuration

// We use the vis global variable that's loaded from node_modules or CDN
// If you prefer using import/export, uncomment the following line:
// import { Network } from 'vis-network';

const AgentDemo = {
  network: null,
  container: null,
  demoData: null,
  running: false,
  scenario: "simple",
  activeInterval: null,
  messages: [],
  startTime: 0,
  behaviors: [],
  messageElements: {},

  init() {
    console.log("Initializing Agent Demo with vis.js...");

    // Ensure DOM is ready first
    if (document.readyState === "loading") {
      console.log("DOM still loading, waiting...");
      document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM loaded, proceeding with init...");
        this.doInit();
      });
      return;
    }

    this.doInit();
  },

  doInit() {
    console.log("Starting Agent Demo initialization...");
    this.container = document.getElementById("agent-demo-container");

    if (!this.container) {
      console.warn("Agent demo container not found, will try again...");
      // Try again after a short delay
      setTimeout(() => this.doInit(), 500);
      return;
    }

    console.log("Found agent-demo-container");

    // Use existing vis.js container or create one
    let visContainer = document.getElementById("agent-network");
    if (!visContainer) {
      visContainer = document.createElement("div");
      visContainer.id = "agent-network";
      visContainer.style.width = "100%";
      visContainer.style.height = "400px";
      visContainer.style.position = "relative";
      this.container.appendChild(visContainer);
      console.log("Created vis.js container");
    } else {
      console.log("Using existing vis.js container");
    }

    // Hide the canvas if it exists
    const canvasEl = document.getElementById("agent-canvas");
    if (canvasEl) {
      canvasEl.style.display = "none";
      console.log("Hidden canvas element");
    }

    // Load demos from JSON
    this.loadScenariosFromJSON();

    // Setup controls
    this.setupControls();

    console.log("Agent Demo initialized with vis.js");

    // Make AgentDemo globally accessible for debugging
    window.AgentDemo = this;
  },

  loadScenariosFromJSON() {
    console.log("Loading demo scenarios from JSON...");
    fetch("/json/demos.json")
      .then((response) => {
        console.log("Demos response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Demo scenarios loaded:", data);
        this.demoData = data;

        // Populate scenario selector
        const scenarioSelect = document.getElementById("demo-scenario");
        if (scenarioSelect) {
          // Clear existing options
          scenarioSelect.innerHTML = "";

          // Add options from JSON
          data.demos.forEach((demo) => {
            const option = document.createElement("option");
            option.value = demo.id;
            option.textContent = demo.name;
            scenarioSelect.appendChild(option);
          });

          // Set current scenario
          this.scenario = scenarioSelect.value || "simple";
          this.setupScenario(this.scenario);

          // Update code display
          this.updateCodeTab(this.scenario);
        } else {
          // Initialize with default scenario
          this.setupScenario("simple");
        }
      })
      .catch((error) => {
        console.error("Error loading demo scenarios:", error);
      });
  },

  setupControls() {
    console.log("Setting up controls");
    const startButton = document.getElementById("start-demo");
    const resetButton = document.getElementById("reset-demo");
    const scenarioSelect = document.getElementById("demo-scenario");

    console.log("Controls found:", {
      startButton: !!startButton,
      resetButton: !!resetButton,
      scenarioSelect: !!scenarioSelect,
    });

    if (startButton) {
      startButton.addEventListener("click", () => {
        console.log("Start/Pause button clicked");
        if (this.running) {
          this.pause();
          startButton.innerHTML =
            '<i class="bi bi-play-fill"></i> <span class="d-none d-sm-inline">Start</span>';
        } else {
          this.start();
          startButton.innerHTML =
            '<i class="bi bi-pause-fill"></i> <span class="d-none d-sm-inline">Pause</span>';
        }
      });
    } else {
      console.error("Start button not found!");
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        console.log("Reset button clicked");
        this.reset();
        if (startButton) {
          startButton.innerHTML =
            '<i class="bi bi-play-fill"></i> <span class="d-none d-sm-inline">Start</span>';
        }
      });
    } else {
      console.error("Reset button not found!");
    }
    if (scenarioSelect) {
      scenarioSelect.addEventListener("change", (e) => {
        console.log("Scenario changed to:", e.target.value);
        this.scenario = e.target.value;
        this.reset();
        this.setupScenario(this.scenario);
        this.updateDemoStatus();

        // Update code section
        this.updateCodeTab(this.scenario);
      });
    } else {
      console.error("Scenario select not found!");
    }

    // Handle responsive resizing
    window.addEventListener("resize", () => {
      if (this.network) {
        this.network.redraw();
        this.network.fit();
      }
    });
  },

  setupScenario(scenarioId) {
    if (!this.demoData) return;

    // Clear existing messages
    this.clearMessages();

    // Find the selected scenario
    const scenario = this.demoData.demos.find((demo) => demo.id === scenarioId);
    if (!scenario) {
      console.error(`Scenario ${scenarioId} not found`);
      return;
    }

    // Update description if it exists
    const descEl = document.getElementById("demo-description");
    if (descEl) {
      descEl.textContent = scenario.description;
    }

    // Prepare data for vis.js
    const nodes = scenario.nodes.map((node) => {
      const agentType = this.demoData.agentTypes[node.type];
      return {
        id: node.id,
        label: node.label || agentType.label.charAt(0),
        title: agentType.label,
        x: node.position?.x,
        y: node.position?.y,
        color: {
          background: agentType.color,
          border: this.lightenColor(agentType.color, -20),
        },
        size: agentType.size,
        font: { color: "#ffffff" },
        metadata: {
          type: node.type,
          state: "idle",
          behaviorType: node.behaviorType || "default",
          ...node,
        },
      };
    });

    const edges = scenario.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      color: {
        color: "rgba(150,150,150,0.2)",
        highlight: "rgba(150,150,150,0.5)",
      },
      width: 1,
      smooth: { type: "continuous" },
    }));

    // Visualization options
    const options = {
      nodes: {
        shape: "circle",
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        width: 1,
        shadow: true,
      },
      physics: {
        enabled: true,
        stabilization: true,
        barnesHut: {
          gravitationalConstant: -2000,
          springLength: 150,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
    };

    // Create the network
    const container = document.getElementById("agent-network");
    if (!container) return;

    // If a network already exists, destroy it first
    if (this.network) {
      this.network.destroy();
    }

    // Create new Network instance
    try {
      this.network = new vis.Network(container, { nodes, edges }, options);

      // If positions are defined, disable physics after stabilization
      if (scenario.nodes.some((node) => node.position)) {
        this.network.once("stabilizationIterationsDone", () => {
          this.network.setOptions({ physics: { enabled: false } });
        });
      }

      // Add enhanced tooltips
      this.network.on("hoverNode", (params) => {
        const nodeId = params.node;
        const node = nodes.find((n) => n.id === nodeId);
        if (node) {
          this.showNodeTooltip(node, params.pointer.DOM);
        }
      });

      this.network.on("blurNode", () => {
        this.hideTooltip();
      });

      console.log(`Scenario "${scenario.name}" loaded successfully`);
    } catch (err) {
      console.error("Error creating network:", err);
    }

    // Save behaviors for use in animation
    this.behaviors = scenario.behaviors || [];
    this.messages = [];
  },

  start() {
    if (this.running) return;

    this.running = true;
    this.updateDemoStatus();

    // Set interval to run behaviors
    this.activeInterval = setInterval(() => this.updateBehaviors(), 100);

    // Initialize start time
    this.startTime = Date.now();
  },

  pause() {
    this.running = false;
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
    this.updateDemoStatus();
  },

  reset() {
    this.pause();
    this.clearMessages();

    // Reset the scenario visualization
    this.setupScenario(this.scenario);
  },

  clearMessages() {
    // Remove all message elements from the DOM
    Object.values(this.messageElements).forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    this.messageElements = {};
    this.messages = [];
  },

  updateBehaviors() {
    if (!this.running || !this.network || !this.behaviors || !this.demoData)
      return;

    const elapsed = Date.now() - this.startTime;

    // Process each behavior defined in the JSON
    this.behaviors.forEach((behavior) => {
      switch (behavior.type) {
        case "messagePassing":
          // Send messages periodically
          if (
            elapsed % behavior.interval < 100 &&
            this.countActiveMessages() < 3
          ) {
            // Select a random message type
            const messageType =
              behavior.messageTypes[
                Math.floor(Math.random() * behavior.messageTypes.length)
              ];

            this.sendMessage(behavior.source, behavior.target, messageType);
          }
          break;

        case "workCycle":
          // Update node states periodically
          const nodeId = behavior.nodeId;
          const nodesDataset = this.network.body.data.nodes;
          const node = nodesDataset.get(nodeId);

          if (node) {
            const currentTime =
              elapsed % (behavior.idleDuration + behavior.workDuration);
            const newState =
              currentTime < behavior.idleDuration ? "idle" : "working";

            if (node.metadata.state !== newState) {
              node.metadata.state = newState;

              // Update node visualization
              nodesDataset.update({
                id: nodeId,
                color: {
                  background:
                    newState === "working"
                      ? "#e74c3c"
                      : this.demoData.agentTypes[node.metadata.type].color,
                  border: this.lightenColor(
                    newState === "working"
                      ? "#e74c3c"
                      : this.demoData.agentTypes[node.metadata.type].color,
                    -20
                  ),
                },
              });

              // Send message when state changes
              if (newState === "working" && behavior.reportTo) {
                this.sendMessage(nodeId, behavior.reportTo, "Starting work");
              } else if (newState === "idle" && behavior.reportTo) {
                this.sendMessage(nodeId, behavior.reportTo, "Work complete");
              }
            }
          }
          break;

        case "networkCommunication":
          // Create random messages between nodes
          if (
            elapsed % behavior.interval < 100 &&
            this.countActiveMessages() < behavior.maxMessages
          ) {
            const nodes = this.network.body.data.nodes.get();
            if (nodes.length < 2) return;

            // Select random nodes
            const fromIdx = Math.floor(Math.random() * nodes.length);
            let toIdx;
            do {
              toIdx = Math.floor(Math.random() * nodes.length);
            } while (toIdx === fromIdx);

            const fromNode = nodes[fromIdx];
            const toNode = nodes[toIdx];

            const messageTypes = [
              "Data",
              "Request",
              "Response",
              "Query",
              "Update",
            ];
            const messageType =
              messageTypes[Math.floor(Math.random() * messageTypes.length)];

            this.sendMessage(fromNode.id, toNode.id, messageType);
          }
          break;

        case "presenceNotification":
          // Update buddy presence status periodically
          if (elapsed % behavior.interval < 100) {
            const buddyNodes = this.network.body.data.nodes
              .get()
              .filter((node) => node.metadata.type === "buddy");

            if (buddyNodes.length > 0) {
              // Pick a random buddy to change status
              const buddy =
                buddyNodes[Math.floor(Math.random() * buddyNodes.length)];
              const newStatus =
                behavior.statusTypes[
                  Math.floor(Math.random() * behavior.statusTypes.length)
                ];

              // Update node color based on status
              const statusColors = {
                available: "#2ecc71",
                away: "#f39c12",
                dnd: "#e74c3c",
                offline: "#95a5a6",
              };

              const nodesDataset = this.network.body.data.nodes;
              nodesDataset.update({
                id: buddy.id,
                color: {
                  background: statusColors[newStatus] || "#9b59b6",
                  border: this.lightenColor(
                    statusColors[newStatus] || "#9b59b6",
                    -20
                  ),
                },
                title: `${buddy.label} - Status: ${newStatus}`,
              });

              // Broadcast presence notification to all other buddies AND server
              const allConnectedNodes = this.getConnectedNodes(
                buddy.id,
                "both"
              );

              if (allConnectedNodes.length > 0) {
                // Send simultaneous presence notifications to all connected nodes
                this.sendMessage(
                  buddy.id,
                  allConnectedNodes,
                  `presence: ${newStatus}`,
                  {
                    staggerDelay: 25, // Small stagger for visual effect
                    color: this.getPresenceColor(newStatus),
                    messageType: "presence",
                  }
                );

                console.log(
                  `${buddy.label} broadcasting presence '${newStatus}' to ${allConnectedNodes.length} contacts`
                );
              }
            }
          }
          break;

        case "serverRelay":
          // Server relays messages between buddies
          if (
            elapsed % behavior.interval < 100 &&
            this.countActiveMessages() < 4 // Increased limit for broadcast messages
          ) {
            const messageType =
              behavior.messageTypes[
                Math.floor(Math.random() * behavior.messageTypes.length)
              ];

            // Send message from source to server
            this.sendMessage(behavior.source, behavior.target, messageType);

            // After a short delay, server broadcasts to all other buddies simultaneously
            setTimeout(() => {
              const buddyNodes = this.network.body.data.nodes
                .get()
                .filter(
                  (node) =>
                    node.metadata.type === "buddy" &&
                    node.id !== behavior.source
                );

              if (buddyNodes.length > 0) {
                // Server broadcasts to all buddies at once
                const targetIds = buddyNodes.map((node) => node.id);
                this.sendMessage(
                  behavior.target,
                  targetIds,
                  `relay: ${messageType}`,
                  {
                    staggerDelay: 40, // Small delay for visual effect
                    color: "#34495e", // Server color
                    messageType: "relay",
                  }
                );

                console.log(
                  `Server relaying '${messageType}' to ${targetIds.length} buddies`
                );
              }
            }, 800);
          }
          break;

        case "publication":
          // Publishers send messages to broker
          if (
            elapsed % behavior.interval < 100 &&
            this.countActiveMessages() < 6
          ) {
            const topic =
              behavior.topics[
                Math.floor(Math.random() * behavior.topics.length)
              ];

            this.sendMessage(
              behavior.publisherId,
              behavior.brokerId,
              `topic: ${topic}`,
              {
                color: this.getTopicColor(topic),
                messageType: "publication",
              }
            );

            console.log(
              `Publisher ${behavior.publisherId} publishing to topic '${topic}'`
            );
          }
          break;

        case "subscription":
          // Broker distributes to subscribers based on topic
          if (
            elapsed % behavior.interval < 100 &&
            this.countActiveMessages() < 8
          ) {
            // Randomly select a topic that has subscribers
            const topics = Object.keys(behavior.subscriberGroups);
            if (topics.length > 0) {
              const topic = topics[Math.floor(Math.random() * topics.length)];
              const subscribers = behavior.subscriberGroups[topic];

              if (subscribers.length > 0) {
                // Broker broadcasts to all subscribers of this topic
                this.sendMessage(
                  behavior.brokerId,
                  subscribers,
                  `broadcast: ${topic}`,
                  {
                    staggerDelay: 50,
                    color: this.getTopicColor(topic),
                    messageType: "subscription",
                  }
                );

                console.log(
                  `Broker broadcasting '${topic}' to ${subscribers.length} subscribers`
                );
              }
            }
          }
          break;
      }
    });

    // Update messages in transit
    this.updateMessages();
  },

  countActiveMessages() {
    return this.messages.length;
  },

  // Enhanced message sending - supports single or multiple recipients
  sendMessage(fromId, toId, text, options = {}) {
    // Support for multiple recipients (for broadcasting)
    if (Array.isArray(toId)) {
      return this.sendBroadcastMessage(fromId, toId, text, options);
    }

    return this.sendSingleMessage(fromId, toId, text, options);
  },

  // Send message to multiple recipients simultaneously
  sendBroadcastMessage(fromId, toIds, text, options = {}) {
    const {
      staggerDelay = 0, // Delay between messages (0 = simultaneous)
      color = null,
      duration = 1500,
      messageType = "broadcast",
    } = options;

    const messages = [];
    const baseTime = Date.now();

    // Send to each recipient
    toIds.forEach((toId, index) => {
      const delay = staggerDelay * index;

      setTimeout(() => {
        const message = this.sendSingleMessage(fromId, toId, text, {
          color,
          duration,
          messageType,
          broadcastId: `broadcast-${baseTime}`,
          broadcastIndex: index,
          broadcastTotal: toIds.length,
        });

        if (message) {
          messages.push(message);
        }
      }, delay);
    });

    console.log(
      `Broadcasting from ${fromId} to ${toIds.length} recipients: ${text}`
    );
    return messages;
  },

  // Send message to a single recipient
  sendSingleMessage(fromId, toId, text, options = {}) {
    // Get nodes from the network
    const fromNode = this.network.body.nodes[fromId];
    const toNode = this.network.body.nodes[toId];

    if (!fromNode || !toNode) {
      console.warn(`Nodes not found for message: ${fromId} -> ${toId}`);
      return null;
    }

    // Get the network positions of the nodes
    const networkPosition = this.network.getPositions([fromId, toId]);

    // Get the DOM coordinates of a canvas point
    const fromCanvas = this.network.canvasToDOM({
      x: networkPosition[fromId].x,
      y: networkPosition[fromId].y,
    });

    const toCanvas = this.network.canvasToDOM({
      x: networkPosition[toId].x,
      y: networkPosition[toId].y,
    });

    // If network.canvasToDOM doesn't exist, we need to calculate it ourselves
    let fromPos, toPos;

    if (typeof this.network.canvasToDOM !== "function") {
      // Calculate the offset and scale manually
      const canvas = this.network.canvas.frame;
      const canvasRect = canvas.getBoundingClientRect();

      // Get network scale and viewport transform
      const scale = this.network.getScale();
      const viewPosition = this.network.getViewPosition();

      // Convert network coordinates to DOM coordinates
      fromPos = {
        x:
          canvasRect.left +
          (networkPosition[fromId].x - viewPosition.x) * scale +
          canvas.clientWidth / 2,
        y:
          canvasRect.top +
          (networkPosition[fromId].y - viewPosition.y) * scale +
          canvas.clientHeight / 2,
      };

      toPos = {
        x:
          canvasRect.left +
          (networkPosition[toId].x - viewPosition.x) * scale +
          canvas.clientWidth / 2,
        y:
          canvasRect.top +
          (networkPosition[toId].y - viewPosition.y) * scale +
          canvas.clientHeight / 2,
      };
    } else {
      fromPos = fromCanvas;
      toPos = toCanvas;
    }

    // Extract options
    const {
      color = fromNode.options.color.background || "#3498db",
      duration = 1500,
      messageType = "single",
      broadcastId = null,
      broadcastIndex = null,
      broadcastTotal = null,
    } = options;

    console.log(
      `Sending ${messageType} message from (${fromPos.x}, ${fromPos.y}) to (${toPos.x}, ${toPos.y})`
    );

    // Create unique ID for the message
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create visual element for the message
    const msgElement = this.createMessageElement(msgId, color, options);

    // Create message object with enhanced metadata
    const message = {
      id: msgId,
      from: fromId,
      to: toId,
      text: text,
      color: color,
      startTime: Date.now(),
      duration: duration,
      progress: 0,
      fromPos,
      toPos,
      messageType,
      broadcastId,
      broadcastIndex,
      broadcastTotal,
    };

    this.messages.push(message);
    return message;
  },

  // Helper method to get all nodes connected to a source node
  getConnectedNodes(sourceId, direction = "to") {
    const edges = this.network.body.data.edges.get();
    const connectedIds = [];

    edges.forEach((edge) => {
      if (direction === "to" && edge.from === sourceId) {
        connectedIds.push(edge.to);
      } else if (direction === "from" && edge.to === sourceId) {
        connectedIds.push(edge.from);
      } else if (direction === "both") {
        if (edge.from === sourceId) {
          connectedIds.push(edge.to);
        } else if (edge.to === sourceId) {
          connectedIds.push(edge.from);
        }
      }
    });

    return [...new Set(connectedIds)]; // Remove duplicates
  },

  // Helper method for presence broadcasting
  broadcastPresence(sourceId, presenceStatus, excludeNodes = []) {
    const connectedNodes = this.getConnectedNodes(sourceId, "both").filter(
      (nodeId) => !excludeNodes.includes(nodeId)
    );

    return this.sendMessage(
      sourceId,
      connectedNodes,
      `presence: ${presenceStatus}`,
      {
        staggerDelay: 50, // Small delay for visual effect
        color: this.getPresenceColor(presenceStatus),
        messageType: "presence",
      }
    );
  },

  // Helper method for pub-sub broadcasting
  publishToSubscribers(publisherId, topic, data, subscriberIds) {
    return this.sendMessage(publisherId, subscriberIds, `${topic}: ${data}`, {
      staggerDelay: 30,
      color: this.getTopicColor(topic),
      messageType: "publication",
    });
  },

  // Get color based on presence status
  getPresenceColor(status) {
    const presenceColors = {
      available: "#2ecc71",
      away: "#f39c12",
      busy: "#e74c3c",
      dnd: "#e74c3c",
      offline: "#95a5a6",
      xa: "#9b59b6",
    };
    return presenceColors[status] || "#3498db";
  },

  // Get color based on topic
  getTopicColor(topic) {
    const topicColors = {
      news: "#3498db",
      status: "#2ecc71",
      alert: "#e74c3c",
      data: "#f39c12",
      event: "#9b59b6",
    };
    return topicColors[topic] || "#34495e";
  },

  createMessageElement(id, color, options = {}) {
    const msgElement = document.createElement("div");
    msgElement.className = "message-particle";

    // Enhanced styling based on message type
    const {
      messageType = "single",
      broadcastIndex = null,
      broadcastTotal = null,
    } = options;

    // Base styling
    msgElement.style.backgroundColor = color;
    msgElement.style.width = "8px";
    msgElement.style.height = "8px";
    msgElement.style.borderRadius = "50%";
    msgElement.style.position = "absolute";
    msgElement.style.zIndex = "5";
    msgElement.style.transform = "translate(-50%, -50%)";
    msgElement.style.boxShadow = `0 0 10px ${color}`;

    // Special styling for broadcast messages
    if (
      messageType === "broadcast" ||
      messageType === "presence" ||
      messageType === "publication"
    ) {
      msgElement.style.border = `2px solid ${color}`;
      msgElement.style.backgroundColor = "rgba(255, 255, 255, 0.8)";

      // Slightly larger for broadcast messages
      msgElement.style.width = "10px";
      msgElement.style.height = "10px";

      // Add pulsing animation for presence messages
      if (messageType === "presence") {
        msgElement.style.animation = "pulse 1s ease-in-out infinite alternate";
      }
    }

    // Add CSS animation for pulsing effect if not already defined
    if (!document.getElementById("message-animations")) {
      const style = document.createElement("style");
      style.id = "message-animations";
      style.textContent = `
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1.2); }
        }
        
        .message-particle {
          transition: all 0.1s ease;
        }
        
        .message-particle:hover {
          transform: translate(-50%, -50%) scale(1.5) !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Add to network container but don't set position yet
    // It will be set in updateMessages
    const container = document.getElementById("agent-network");
    if (container) {
      container.appendChild(msgElement);
    } else {
      console.error("Agent network container not found");
    }

    // Store reference
    this.messageElements[id] = msgElement;

    return msgElement;
  },

  updateMessages() {
    this.messages = this.messages.filter((msg, index) => {
      const elapsed = Date.now() - msg.startTime;
      msg.progress = Math.min(elapsed / msg.duration, 1);

      if (msg.progress >= 1) {
        // Message reached destination
        const msgElement = this.messageElements[msg.id];
        if (msgElement) {
          // Arrival effect
          this.createArrivalEffect(msg.toPos.x, msg.toPos.y, msg.color);

          // Remove element
          msgElement.remove();
          delete this.messageElements[msg.id];
        }

        // Handle message arrival events
        this.handleMessageArrival(msg);

        return false; // Remove message
      } else {
        // Update message position
        const x = msg.fromPos.x + (msg.toPos.x - msg.fromPos.x) * msg.progress;
        const y = msg.fromPos.y + (msg.toPos.y - msg.fromPos.y) * msg.progress;

        const msgElement = this.messageElements[msg.id];
        if (msgElement) {
          msgElement.style.left = `${x}px`;
          msgElement.style.top = `${y}px`;

          // Detect hover to show tooltip
          if (this.isMouseNear(x, y, 10)) {
            this.showMessageTooltip(msg, x, y);
          }
        }
        return true; // Keep message
      }
    });
  },

  // Handle message arrival events to trigger behaviors
  handleMessageArrival(message) {
    const { from, to, text, messageType } = message;

    console.log(
      `Message arrived: ${from} -> ${to}: ${text} (type: ${messageType})`
    );

    // Find any behaviors that should trigger on message arrival
    if (this.behaviors) {
      this.behaviors.forEach((behavior) => {
        this.processBehaviorOnMessageArrival(behavior, message);
      });
    }

    // Handle scenario-specific message arrivals
    this.handleScenarioSpecificArrival(message);
  },

  // Process behavior-specific reactions to message arrivals
  processBehaviorOnMessageArrival(behavior, message) {
    const { from, to, text, messageType } = message;

    switch (behavior.type) {
      case "messageForwarding":
        // Forward messages to other nodes based on routing rules
        if (behavior.forwardingRules) {
          const rule = behavior.forwardingRules.find(
            (r) =>
              (r.messageType === messageType || r.messageType === "any") &&
              (r.recipient === to || r.recipient === "any")
          );

          if (rule && rule.forwardTo) {
            setTimeout(() => {
              this.sendMessage(to, rule.forwardTo, `fwd: ${text}`, {
                color: "#9b59b6",
                messageType: "forwarded",
                originalFrom: from,
              });
              console.log(`${to} forwarding message to ${rule.forwardTo}`);
            }, rule.delay || 200);
          }
        }
        break;

      case "autoResponse":
        // Auto-respond to specific message types
        if (behavior.responseRules) {
          const rule = behavior.responseRules.find(
            (r) =>
              (r.trigger === messageType || r.trigger === "any") &&
              (r.recipient === to || r.recipient === "any")
          );

          if (rule) {
            setTimeout(() => {
              this.sendMessage(to, from, rule.response, {
                color: "#e67e22",
                messageType: "response",
              });
              console.log(
                `${to} auto-responding to ${from} with: ${rule.response}`
              );
            }, rule.delay || 300);
          }
        }
        break;

      case "messageAggregation":
        // Collect messages and broadcast summaries
        if (behavior.aggregator === to) {
          if (!behavior.messageBuffer) {
            behavior.messageBuffer = [];
          }

          behavior.messageBuffer.push({ from, text, timestamp: Date.now() });

          // If buffer is full or time threshold met, broadcast summary
          if (behavior.messageBuffer.length >= (behavior.bufferSize || 3)) {
            const summary = `summary: ${behavior.messageBuffer.length} messages received`;
            const targetNodes = this.getConnectedNodes(to, "from");

            if (targetNodes.length > 0) {
              this.sendMessage(to, targetNodes, summary, {
                staggerDelay: 100,
                color: "#3498db",
                messageType: "summary",
              });

              console.log(
                `${to} broadcasting message summary to ${targetNodes.length} nodes`
              );
              behavior.messageBuffer = []; // Clear buffer
            }
          }
        }
        break;

      case "presenceNotification":
        // React to presence changes
        if (messageType === "presence" && behavior.reactiveBuddies) {
          const buddyIds = behavior.reactiveBuddies.filter((id) => id !== from);
          if (buddyIds.length > 0) {
            setTimeout(() => {
              this.sendMessage(to, buddyIds, `ack: ${text}`, {
                staggerDelay: 50,
                color: "#2ecc71",
                messageType: "acknowledgment",
              });
              console.log(
                `${to} acknowledging presence change to ${buddyIds.length} buddies`
              );
            }, 150);
          }
        }
        break;

      case "loadBalancing":
        // Distribute incoming work requests among workers
        if (behavior.coordinator === to && messageType === "request") {
          const availableWorkers = this.getAvailableWorkers(behavior.workers);
          if (availableWorkers.length > 0) {
            const selectedWorker =
              availableWorkers[
                Math.floor(Math.random() * availableWorkers.length)
              ];

            setTimeout(() => {
              this.sendMessage(to, selectedWorker, `task: ${text}`, {
                color: "#e74c3c",
                messageType: "task_assignment",
              });
              console.log(`${to} assigning task to worker ${selectedWorker}`);

              // Mark worker as busy
              this.setWorkerState(selectedWorker, "busy");
            }, 200);
          }
        }
        break;
    }
  },

  // Handle scenario-specific message arrival behaviors
  handleScenarioSpecificArrival(message) {
    const { from, to, text, messageType } = message;

    switch (this.scenario) {
      case "behaviors":
        // Coordinator responds to worker requests
        if (to === "coordinator" && messageType === "request") {
          setTimeout(() => {
            this.sendMessage("coordinator", from, "task_assigned", {
              color: "#27ae60",
              messageType: "assignment",
            });
          }, 400);
        }
        // Workers report completion
        else if (from === "coordinator" && messageType === "assignment") {
          setTimeout(
            () => {
              this.sendMessage(to, "coordinator", "task_complete", {
                color: "#2980b9",
                messageType: "completion",
              });
            },
            1000 + Math.random() * 500
          );
        }
        break;

      case "presence":
        // Buddies react to server notifications
        if (from === "server" && messageType === "relay") {
          const connectedBuddies = this.getConnectedNodes(to, "both").filter(
            (id) => id !== "server"
          );
          if (connectedBuddies.length > 0 && Math.random() < 0.3) {
            // 30% chance to react
            setTimeout(() => {
              const randomBuddy =
                connectedBuddies[
                  Math.floor(Math.random() * connectedBuddies.length)
                ];
              this.sendMessage(to, randomBuddy, "direct_message", {
                color: "#8e44ad",
                messageType: "chat",
              });
              console.log(
                `${to} sending direct message to ${randomBuddy} after server notification`
              );
            }, 600);
          }
        }
        break;

      case "pubsub":
        // Subscribers react to broker notifications
        if (from.includes("broker") && messageType === "subscription") {
          if (Math.random() < 0.2) {
            // 20% chance to send feedback
            setTimeout(() => {
              this.sendMessage(to, from, "feedback: received", {
                color: "#16a085",
                messageType: "feedback",
              });
              console.log(`${to} sending feedback to broker`);
            }, 500);
          }
        }
        break;
    }
  },

  // Helper method to get available workers for load balancing
  getAvailableWorkers(workerIds) {
    if (!workerIds) return [];

    return workerIds.filter((workerId) => {
      const worker = this.network.body.data.nodes.get(workerId);
      return (
        worker && (!worker.metadata.state || worker.metadata.state === "idle")
      );
    });
  },

  // Helper method to set worker state
  setWorkerState(workerId, state) {
    const nodesDataset = this.network.body.data.nodes;
    const worker = nodesDataset.get(workerId);

    if (worker) {
      worker.metadata.state = state;

      // Update visual representation
      const stateColors = {
        idle:
          this.demoData.agentTypes[worker.metadata.type]?.color || "#3498db",
        busy: "#e74c3c",
        working: "#f39c12",
      };

      nodesDataset.update({
        id: workerId,
        color: {
          background: stateColors[state],
          border: this.lightenColor(stateColors[state], -20),
        },
      });

      // Auto-reset to idle after some time
      if (state === "busy") {
        setTimeout(
          () => {
            this.setWorkerState(workerId, "idle");
          },
          2000 + Math.random() * 1000
        );
      }
    }
  },

  isMouseNear(x, y, radius) {
    const container = document.getElementById("agent-network");
    if (!container || !container.lastMousePos) return false;

    const mouseX = container.lastMousePos.x;
    const mouseY = container.lastMousePos.y;

    const distSq = Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2);
    return distSq <= Math.pow(radius, 2);
  },

  createArrivalEffect(x, y, color) {
    // Create visual effect when a message arrives
    const effect = document.createElement("div");
    effect.className = "message-arrival-effect";
    effect.style.position = "absolute";
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.width = "16px";
    effect.style.height = "16px";
    effect.style.borderRadius = "50%";
    effect.style.backgroundColor = "transparent";
    effect.style.border = `2px solid ${color}`;
    effect.style.transform = "translate(-50%, -50%)";
    effect.style.zIndex = "4";

    // CSS Animation
    effect.animate(
      [
        { opacity: 1, transform: "translate(-50%, -50%) scale(0.5)" },
        { opacity: 0, transform: "translate(-50%, -50%) scale(2)" },
      ],
      {
        duration: 600,
        easing: "ease-out",
      }
    );

    document.getElementById("agent-network").appendChild(effect);

    // Remove after animation
    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 600);
  },

  updateDemoStatus() {
    const statusEl = document.getElementById("demo-status-text");
    if (statusEl) {
      statusEl.textContent = this.running ? "Running" : "Paused";
      statusEl.className = this.running ? "text-success" : "text-warning";
    }
  },

  showNodeTooltip(node, position) {
    let tooltip = document.querySelector(".agent-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "agent-tooltip";
      document.body.appendChild(tooltip);
    }

    tooltip.style.left = `${position.x + 10}px`;
    tooltip.style.top = `${position.y - 10}px`;

    let content = `<div class="arrow"></div><div class="content">
      <h5>${node.title || node.label}</h5>
      <p>ID: ${node.id}</p>`;

    if (node.metadata?.state) {
      content += `<p>State: ${node.metadata.state}</p>`;
    }

    if (node.metadata?.behaviorType) {
      content += `<p>Behavior: ${node.metadata.behaviorType}</p>`;
    }

    content += "</div>";
    tooltip.innerHTML = content;
    tooltip.style.display = "block";
  },

  showMessageTooltip(message, x, y) {
    let tooltip = document.querySelector(".message-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "message-tooltip";
      document.body.appendChild(tooltip);
    }

    const rect = document
      .getElementById("agent-network")
      .getBoundingClientRect();
    tooltip.style.left = `${rect.left + x + 10}px`;
    tooltip.style.top = `${rect.top + y - 10}px`;
    tooltip.innerHTML = `<div class="arrow"></div><div class="content">${message.text}</div>`;
    tooltip.style.display = "block";
  },

  hideTooltip() {
    const agentTooltip = document.querySelector(".agent-tooltip");
    if (agentTooltip) {
      agentTooltip.style.display = "none";
    }

    const messageTooltip = document.querySelector(".message-tooltip");
    if (messageTooltip) {
      messageTooltip.style.display = "none";
    }
  },

  lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  },

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  // Update the code example tab for the current scenario
  updateCodeTab(scenarioId) {
    const codeTab = document.querySelector(`#${scenarioId}-tab`);
    if (codeTab) {
      try {
        if (typeof bootstrap !== "undefined") {
          const tabTrigger = new bootstrap.Tab(codeTab);
          tabTrigger.show();
        } else {
          // Fallback for when bootstrap is not available
          document
            .querySelectorAll("#codeExampleTabs .nav-link")
            .forEach((tab) => {
              tab.classList.remove("active");
              tab.setAttribute("aria-selected", "false");
            });
          document.querySelectorAll(".tab-pane").forEach((pane) => {
            pane.classList.remove("show", "active");
          });

          codeTab.classList.add("active");
          codeTab.setAttribute("aria-selected", "true");

          const targetId = codeTab.getAttribute("data-bs-target");
          if (targetId) {
            const targetPane = document.querySelector(targetId);
            if (targetPane) {
              targetPane.classList.add("show", "active");
            }
          }
        }

        // Load Python code for this scenario if needed and function is available
        if (typeof window.updateTabWithCode === "function" && this.demoData) {
          const demo = this.demoData.demos.find((d) => d.id === scenarioId);
          if (demo && demo.pythonFile) {
            const targetPane = document.querySelector(`#${scenarioId}-code`);
            const hasSpinner =
              targetPane && targetPane.querySelector(".spinner-border");

            // Load code if tab has spinner (not yet loaded)
            if (hasSpinner) {
              window.updateTabWithCode(demo);
            }
          }
        }

        // Re-highlight code if Prism is available
        if (typeof window.Prism !== "undefined") {
          setTimeout(() => {
            window.Prism.highlightAll();
          }, 100);
        }
      } catch (err) {
        console.warn("Could not update code tab:", err);
      }
    }
  },
};

// Track mouse position for tooltips
document.addEventListener("mousemove", function (e) {
  const container = document.getElementById("agent-network");
  if (container) {
    const rect = container.getBoundingClientRect();
    container.lastMousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
});

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");

  // Add styles for tooltips
  if (!document.getElementById("agent-demo-styles")) {
    const style = document.createElement("style");
    style.id = "agent-demo-styles";
    style.textContent = `
      /* Styles for the agent demo */
      #agent-network {
        width: 100%;
        height: 400px;
        position: relative;
        background-color: transparent;
      }
      
      .agent-tooltip, .message-tooltip {
        position: absolute;
        z-index: 1000;
        pointer-events: none;
      }
      
      .agent-tooltip .content, .message-tooltip .content {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        max-width: 200px;
      }
      
      .agent-tooltip h5 {
        margin: 0 0 5px 0;
        font-size: 14px;
      }
      
      .agent-tooltip p {
        margin: 3px 0;
        font-size: 12px;
      }
      
      .agent-tooltip .arrow, .message-tooltip .arrow {
        position: absolute;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid rgba(0, 0, 0, 0.8);
        top: -5px;
        left: 10px;
      }
      
      .message-tooltip .content {
        background: rgba(0, 0, 0, 0.7);
        font-size: 11px;
        padding: 4px 8px;
      }
      
      .message-arrival-effect {
        pointer-events: none;
      }
      
      .message-particle {
        pointer-events: none;
      }
      
      body.dark-mode #agent-network {
        background-color: transparent;
      }
      
      .demo-canvas-container {
        min-height: 400px;
      }
    `;
    document.head.appendChild(style);
    console.log("Added demo styles");
  }

  console.log("Checking for vis library...");

  // Check if vis is already loaded (from BaseLayout)
  console.log("Checking vis availability:", typeof window.vis);

  if (typeof window.vis !== "undefined") {
    console.log("vis.js already available, initializing AgentDemo...");
    setTimeout(() => {
      try {
        AgentDemo.init();
        console.log("AgentDemo initialization completed");
      } catch (error) {
        console.error("Error initializing AgentDemo:", error);
      }
    }, 250);
  } else {
    console.log("Loading vis-network from CDN...");
    const cdnScript = document.createElement("script");
    cdnScript.src =
      "https://unpkg.com/vis-network/standalone/umd/vis-network.min.js";
    cdnScript.onload = function () {
      console.log("vis-network loaded successfully from CDN");
      setTimeout(() => {
        try {
          AgentDemo.init();
          console.log("AgentDemo initialization completed");
        } catch (error) {
          console.error("Error initializing AgentDemo:", error);
        }
      }, 100);
    };
    cdnScript.onerror = function () {
      console.error("Failed to load vis-network from CDN, trying local...");
      // Fallback to local
      const script = document.createElement("script");
      script.src = "/node_modules/vis-network/dist/vis-network.min.js";
      script.onload = function () {
        console.log("vis-network loaded successfully from local");
        setTimeout(() => {
          try {
            AgentDemo.init();
            console.log("AgentDemo initialization completed");
          } catch (error) {
            console.error("Error initializing AgentDemo:", error);
          }
        }, 100);
      };
      script.onerror = function () {
        console.error("Failed to load vis-network from all sources");
      };
      document.head.appendChild(script);
    };
    document.head.appendChild(cdnScript);
  }
});
