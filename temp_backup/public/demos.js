// SPADE Interactive Demo
// This script manages the interactive agent demonstrations
// It's been separated from the main scripts.js for better maintainability
// Last updated: May 25, 2025 - Refactored from scripts.js to improve code organization

const AgentDemo = {
  canvas: null,
  ctx: null,
  agents: [],
  messages: [],
  particles: [],
  animationId: null,
  running: false,
  scenario: 'simple',
  scenarioStartTime: 0,

  // Agent types and their properties
  agentTypes: {
    sender: {
      color: '#3498db', // Blue
      radius: 25,
      label: 'Sender Agent',
    },
    receiver: {
      color: '#2ecc71', // Green
      radius: 25,
      label: 'Receiver Agent',
    },
    coordinator: {
      color: '#e74c3c', // Red
      radius: 25,
      label: 'Coordinator',
    },
    worker: {
      color: '#f39c12', // Orange
      radius: 20,
      label: 'Worker Agent',
    },
  },

  // Initialize the demo
  init() {
    console.log('Initializing Agent Demo...');
    this.canvas = document.getElementById('agent-canvas');
    if (!this.canvas) {
      console.warn('Agent canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    // Track mouse position for tooltips
    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      // Force redraw for tooltips
      if (!this.running) {
        this.drawFrame();
      }
    });

    // Remove tooltips when mouse leaves canvas
    this.canvas.addEventListener('mouseleave', () => {
      const tooltip = document.querySelector('.agent-tooltip');
      if (tooltip) tooltip.remove();
    });

    // Set up event listeners
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.resizeCanvas(), 150);
    });

    // Add ResizeObserver for container size changes
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => this.resizeCanvas(), 150);
      });
      this.resizeObserver.observe(this.canvas.parentElement);
    }

    const startButton = document.getElementById('start-demo');
    const resetButton = document.getElementById('reset-demo');
    const scenarioSelect = document.getElementById('demo-scenario');

    if (startButton) {
      startButton.addEventListener('click', () => {
        if (this.running) {
          this.pause();
          startButton.innerHTML = '<i class="bi bi-play-fill"></i> Start Demo';
        } else {
          this.start();
          startButton.innerHTML = '<i class="bi bi-pause-fill"></i> Pause';
        }
      });
    }

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        this.reset();
        if (startButton) {
          startButton.innerHTML = '<i class="bi bi-play-fill"></i> Start Demo';
        }
      });
    }

    if (scenarioSelect) {
      scenarioSelect.addEventListener('change', (e) => {
        this.scenario = e.target.value;
        this.reset();
        this.updateDemoStatus();
      });
    }

    // Load scenarios from JSON file
    this.loadScenariosFromJSON();

    // Initialize with agents in paused state
    this.setupScenario();
    this.updateDemoStatus();
    this.drawFrame();

    // Force resize on initialization and after a short delay
    this.resizeCanvas();
    setTimeout(() => {
      this.resizeCanvas();
    }, 100);

    console.log('Agent Demo initialized successfully');
  },

  // Load scenarios from JSON
  loadScenariosFromJSON() {
    console.log('Loading demo scenarios from JSON...');
    fetch('landing-assets/demos.json')
      .then((response) => {
        console.log('Demos response status:', response.status);
        return response.json();
      })
      .then((data) => {
        console.log('Demo scenarios loaded:', data);
        const scenarioSelect = document.getElementById('demo-scenario');

        if (scenarioSelect) {
          // Clear existing options
          scenarioSelect.innerHTML = '';

          // Add options from JSON
          data.demos.forEach((demo) => {
            const option = document.createElement('option');
            option.value = demo.id;
            option.textContent = demo.name;
            scenarioSelect.appendChild(option);
          });

          // Set current scenario
          this.scenario = scenarioSelect.value;
          this.reset();
          console.log(`Loaded ${data.demos.length} demo scenarios`);
        }
      })
      .catch((error) => {
        console.error('Error loading demo scenarios:', error);
      });
  },

  // Resize canvas to maintain proper dimensions
  resizeCanvas() {
    const container = this.canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Set canvas dimensions to match container
    this.canvas.width = containerWidth;
    this.canvas.height = containerHeight;

    // Ensure minimum dimensions for usability
    if (this.canvas.width < 300) this.canvas.width = 300;
    if (this.canvas.height < 200) this.canvas.height = 200;

    // Update agents positions if they exist
    if (this.agents.length) {
      this.setupScenario(); // Recalculate agent positions for new dimensions
      this.drawFrame();
    }
  },

  // Set up the selected scenario
  setupScenario() {
    this.agents = [];
    this.messages = [];
    this.particles = [];

    switch (this.scenario) {
      case 'simple':
        this.setupSimpleScenario();
        break;
      case 'behaviors':
        this.setupBehaviorScenario();
        break;
      case 'network':
        this.setupNetworkScenario();
        break;
      default:
        this.setupSimpleScenario();
    }
  },

  // Basic sender-receiver scenario
  setupSimpleScenario() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // Create sender agent on the left
    this.agents.push({
      id: 'sender1',
      type: 'sender',
      x: canvasWidth * 0.25,
      y: canvasHeight * 0.5,
      ...this.agentTypes.sender,
    });

    // Create receiver agent on the right
    this.agents.push({
      id: 'receiver1',
      type: 'receiver',
      x: canvasWidth * 0.75,
      y: canvasHeight * 0.5,
      ...this.agentTypes.receiver,
    });
  },

  // Setup behavior demonstration with cyclic and one-shot behaviors
  setupBehaviorScenario() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // Central coordinator agent
    this.agents.push({
      id: 'coordinator',
      type: 'coordinator',
      x: canvasWidth * 0.5,
      y: canvasHeight * 0.5,
      ...this.agentTypes.coordinator,
    });

    // Worker agents arranged in a circle
    const numWorkers = 4;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.3;

    for (let i = 0; i < numWorkers; i++) {
      const angle = (i / numWorkers) * Math.PI * 2;
      this.agents.push({
        id: `worker${i + 1}`,
        type: 'worker',
        x: canvasWidth * 0.5 + Math.cos(angle) * radius,
        y: canvasHeight * 0.5 + Math.sin(angle) * radius,
        ...this.agentTypes.worker,
        behaviorState: 'idle',
        behaviorType: i % 2 === 0 ? 'cyclic' : 'one-shot',
      });
    }
  },

  // Setup network scenario with multiple interconnected agents
  setupNetworkScenario() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // Create a network of 7 agents
    const positions = [
      { x: canvasWidth * 0.5, y: canvasHeight * 0.3 }, // Top center
      { x: canvasWidth * 0.3, y: canvasHeight * 0.4 }, // Top left
      { x: canvasWidth * 0.7, y: canvasHeight * 0.4 }, // Top right
      { x: canvasWidth * 0.5, y: canvasHeight * 0.6 }, // Center
      { x: canvasWidth * 0.3, y: canvasHeight * 0.7 }, // Bottom left
      { x: canvasWidth * 0.7, y: canvasHeight * 0.7 }, // Bottom right
      { x: canvasWidth * 0.5, y: canvasHeight * 0.8 }, // Bottom center
    ];

    const types = [
      'coordinator',
      'sender',
      'receiver',
      'sender',
      'worker',
      'worker',
      'receiver',
    ];

    for (let i = 0; i < positions.length; i++) {
      this.agents.push({
        id: `agent${i + 1}`,
        type: types[i],
        x: positions[i].x,
        y: positions[i].y,
        ...this.agentTypes[types[i]],
      });
    }
  },

  // Start animation
  start() {
    if (this.running) return;

    this.running = true;
    this.scenarioStartTime = Date.now();
    this.updateDemoStatus();
    this.animate();
  },

  // Pause animation
  pause() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  // Reset demo to initial state
  reset() {
    this.pause();
    this.setupScenario();
    this.running = false;
    this.updateDemoStatus();
    this.drawFrame();
  },

  // Cleanup method
  cleanup() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.pause();
  },

  // Animation loop
  animate() {
    if (!this.running) return;

    this.update();
    this.drawFrame();
    this.animationId = requestAnimationFrame(() => this.animate());
  },

  // Update agent and message states
  update() {
    const elapsed = Date.now() - this.scenarioStartTime;

    // Update logic based on scenario
    switch (this.scenario) {
      case 'simple':
        this.updateSimpleScenario(elapsed);
        break;
      case 'behaviors':
        this.updateBehaviorScenario(elapsed);
        break;
      case 'network':
        this.updateNetworkScenario(elapsed);
        break;
    }

    // Update message positions
    this.messages.forEach((msg, index) => {
      const progress = (Date.now() - msg.startTime) / msg.duration;

      if (progress >= 1) {
        // Message arrived at destination
        this.messages.splice(index, 1);

        // Generate particles on arrival
        this.createArrivalParticles(msg.toX, msg.toY, msg.color);

        // Handle message arrival based on scenario
        if (this.scenario === 'behaviors' && msg.to === 'coordinator') {
          // Create response message
          this.createMessage(
            'coordinator',
            msg.from,
            'Task assignment',
            1500,
            '#e74c3c'
          );
        }
      } else {
        // Update position
        msg.x = msg.fromX + (msg.toX - msg.fromX) * progress;
        msg.y = msg.fromY + (msg.toY - msg.fromY) * progress;

        // Occasionally create trail particles
        if (Math.random() < 0.1) {
          this.particles.push({
            x: msg.x,
            y: msg.y,
            color: msg.color,
            size: 3 + Math.random() * 3,
            lifetime: 500,
            createdAt: Date.now(),
          });
        }
      }
    });

    // Update particles
    this.particles.forEach((particle, index) => {
      const age = Date.now() - particle.createdAt;
      if (age > particle.lifetime) {
        this.particles.splice(index, 1);
      } else {
        // Fade out and shrink
        particle.opacity = 1 - age / particle.lifetime;
        particle.size -= 0.01;
      }
    });
  },

  // Update simple scenario state
  updateSimpleScenario(elapsed) {
    // Send message every 3 seconds
    if (elapsed % 3000 < 20 && this.messages.length === 0) {
      const sender = this.agents.find((a) => a.type === 'sender');
      const receiver = this.agents.find((a) => a.type === 'receiver');

      if (sender && receiver) {
        const messageTypes = ['Request', 'Data', 'Query', 'Update'];
        const messageType =
          messageTypes[Math.floor(Math.random() * messageTypes.length)];
        this.createMessage(
          'sender1',
          'receiver1',
          messageType,
          1500,
          '#3498db'
        );
      }
    }
  },

  // Update behavior scenario state
  updateBehaviorScenario(elapsed) {
    const coordinator = this.agents.find((a) => a.type === 'coordinator');
    const workers = this.agents.filter((a) => a.type === 'worker');

    // Initialize worker states if needed
    workers.forEach((worker) => {
      if (!worker.behaviorState) {
        worker.behaviorState = 'idle';
        worker.nextStateChange = elapsed + 1000 + Math.random() * 2000;
        worker.lastUpdate = elapsed;
      }
    });

    // Update worker states
    workers.forEach((worker) => {
      if (elapsed >= worker.nextStateChange) {
        if (worker.behaviorState === 'idle') {
          // Send message to coordinator
          this.createMessage(
            worker.id,
            'coordinator',
            'Task Request',
            1200,
            worker.color
          );
          worker.behaviorState = 'working';
          worker.nextStateChange = elapsed + 2000 + Math.random() * 1500;
        } else if (worker.behaviorState === 'working') {
          // Send completion message
          this.createMessage(
            'coordinator',
            worker.id,
            'Task Complete',
            1000,
            coordinator.color
          );
          worker.behaviorState = 'idle';
          worker.nextStateChange = elapsed + 1500 + Math.random() * 2000;
        }
      }
    });
  },

  // Update network scenario state
  updateNetworkScenario(elapsed) {
    // Create random messages between agents every few seconds
    if (elapsed % 2000 < 20 && this.messages.length < 3) {
      const fromIdx = Math.floor(Math.random() * this.agents.length);
      let toIdx;
      do {
        toIdx = Math.floor(Math.random() * this.agents.length);
      } while (toIdx === fromIdx);

      const from = this.agents[fromIdx];
      const to = this.agents[toIdx];

      const messageTypes = ['Data', 'Request', 'Response', 'Query', 'Update'];
      const messageType =
        messageTypes[Math.floor(Math.random() * messageTypes.length)];

      this.createMessage(from.id, to.id, messageType, 1500, from.color);
    }
  },

  // Create a new message between agents
  createMessage(fromId, toId, text, duration = 1500, color = '#3498db') {
    const fromAgent = this.agents.find((a) => a.id === fromId);
    const toAgent = this.agents.find((a) => a.id === toId);

    if (!fromAgent || !toAgent) return;

    this.messages.push({
      from: fromId,
      to: toId,
      text: text,
      fromX: fromAgent.x,
      fromY: fromAgent.y,
      toX: toAgent.x,
      toY: toAgent.y,
      x: fromAgent.x,
      y: fromAgent.y,
      startTime: Date.now(),
      duration: duration,
      color: color,
    });
  },

  // Create arrival effect particles
  createArrivalParticles(x, y, color) {
    const numParticles = 8 + Math.floor(Math.random() * 5);

    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const velocity = 0.5 + Math.random() * 1;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: color,
        size: 4 + Math.random() * 3,
        lifetime: 800 + Math.random() * 500,
        createdAt: Date.now(),
      });
    }
  },

  // Render a frame
  drawFrame() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections between agents based on scenario
    this.drawConnections();

    // Draw messages
    this.messages.forEach((msg) => {
      this.drawMessage(msg);
    });

    // Draw agents
    this.agents.forEach((agent) => {
      this.drawAgent(agent);
    });

    // Draw particles
    this.particles.forEach((particle) => {
      this.drawParticle(particle);
    });
  },

  // Draw connections between agents
  drawConnections() {
    this.ctx.save();

    switch (this.scenario) {
      case 'simple':
        // Simple line between sender and receiver
        const sender = this.agents.find((a) => a.type === 'sender');
        const receiver = this.agents.find((a) => a.type === 'receiver');

        if (sender && receiver) {
          this.ctx.beginPath();
          this.ctx.moveTo(sender.x, sender.y);
          this.ctx.lineTo(receiver.x, receiver.y);
          this.ctx.strokeStyle = document.body.classList.contains('dark-mode')
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.1)';
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
        }
        break;

      case 'behaviors':
        // Lines from workers to coordinator
        const coordinator = this.agents.find((a) => a.type === 'coordinator');
        const workers = this.agents.filter((a) => a.type === 'worker');

        if (coordinator) {
          workers.forEach((worker) => {
            this.ctx.beginPath();
            this.ctx.moveTo(coordinator.x, coordinator.y);
            this.ctx.lineTo(worker.x, worker.y);

            // Different style based on worker state
            if (worker.behaviorState === 'working') {
              this.ctx.strokeStyle = document.body.classList.contains(
                'dark-mode'
              )
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(0,0,0,0.2)';
              this.ctx.lineWidth = 2;
            } else {
              this.ctx.strokeStyle = document.body.classList.contains(
                'dark-mode'
              )
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)';
              this.ctx.lineWidth = 1;
            }

            this.ctx.stroke();
          });
        }
        break;

      case 'network':
        // Draw network connections
        const lineColor = document.body.classList.contains('dark-mode')
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(0,0,0,0.1)';

        // Create a web of connections between agents
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = 1;

        // Connect each agent to 2-3 others
        this.agents.forEach((agent, i) => {
          // Connect to neighboring agents
          for (let j = 1; j <= 2; j++) {
            const targetIdx = (i + j) % this.agents.length;
            const target = this.agents[targetIdx];

            this.ctx.beginPath();
            this.ctx.moveTo(agent.x, agent.y);
            this.ctx.lineTo(target.x, target.y);
            this.ctx.stroke();
          }
        });
        break;
    }

    this.ctx.restore();
  },

  // Draw a single agent
  drawAgent(agent) {
    this.ctx.save();

    // Main circle
    this.ctx.beginPath();
    this.ctx.arc(agent.x, agent.y, agent.radius, 0, Math.PI * 2);

    // Fill with gradient
    const gradient = this.ctx.createRadialGradient(
      agent.x,
      agent.y,
      0,
      agent.x,
      agent.y,
      agent.radius
    );

    gradient.addColorStop(0, this.lightenColor(agent.color, 20));
    gradient.addColorStop(1, agent.color);

    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Add a subtle border
    this.ctx.strokeStyle = document.body.classList.contains('dark-mode')
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(0,0,0,0.1)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Add label
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(agent.type.charAt(0).toUpperCase(), agent.x, agent.y);

    // Add behavior indicator for worker agents
    if (agent.type === 'worker' && agent.behaviorState) {
      // Small indicator dot
      this.ctx.beginPath();
      this.ctx.arc(
        agent.x + agent.radius * 0.7,
        agent.y - agent.radius * 0.7,
        agent.radius * 0.25,
        0,
        Math.PI * 2
      );

      // Color based on state
      if (agent.behaviorState === 'idle') {
        this.ctx.fillStyle = '#3498db'; // Blue for idle
      } else if (agent.behaviorState === 'working') {
        this.ctx.fillStyle = '#e74c3c'; // Red for working
      }

      this.ctx.fill();
    }

    // Check for hover and show tooltip
    const mouseDistSq =
      Math.pow(agent.x - this.mouseX, 2) + Math.pow(agent.y - this.mouseY, 2);

    if (mouseDistSq < Math.pow(agent.radius + 5, 2)) {
      this.showAgentTooltip(agent);
    }

    this.ctx.restore();
  },

  // Draw a message particle
  drawMessage(msg) {
    this.ctx.save();

    // Draw message circle
    this.ctx.beginPath();
    this.ctx.arc(msg.x, msg.y, 6, 0, Math.PI * 2);
    this.ctx.fillStyle = msg.color;
    this.ctx.fill();

    // Check for hover to show tooltip
    const mouseDistSq =
      Math.pow(msg.x - this.mouseX, 2) + Math.pow(msg.y - this.mouseY, 2);

    if (mouseDistSq < 100) {
      // 10px radius for hover
      // Show tooltip with message text
      let tooltip = document.querySelector('.message-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'message-tooltip';
        document.body.appendChild(tooltip);
      }

      const rect = this.canvas.getBoundingClientRect();
      tooltip.style.left = rect.left + msg.x + 10 + 'px';
      tooltip.style.top = rect.top + msg.y - 10 + 'px';
      tooltip.innerHTML = `<div class="arrow"></div><div class="content">${msg.text}</div>`;
    }

    this.ctx.restore();
  },

  // Draw a particle effect
  drawParticle(particle) {
    this.ctx.save();

    // Update position if it has velocity
    if (particle.vx !== undefined && particle.vy !== undefined) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Slow down
      particle.vx *= 0.95;
      particle.vy *= 0.95;
    }

    // Draw particle
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

    // Set opacity based on age
    const opacity =
      particle.opacity !== undefined
        ? particle.opacity
        : 1 - (Date.now() - particle.createdAt) / particle.lifetime;

    this.ctx.fillStyle = this.hexToRgba(particle.color, opacity);
    this.ctx.fill();

    this.ctx.restore();
  },

  // Show tooltip with agent information
  showAgentTooltip(agent) {
    let tooltip = document.querySelector('.agent-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'agent-tooltip';
      document.body.appendChild(tooltip);
    }

    const rect = this.canvas.getBoundingClientRect();
    tooltip.style.left = rect.left + agent.x + 15 + 'px';
    tooltip.style.top = rect.top + agent.y - 15 + 'px';

    let content = `<div class="arrow"></div><div class="content">
      <h5>${agent.label}</h5>
      <p>ID: ${agent.id}</p>`;

    // Add behavior info for workers
    if (agent.type === 'worker' && agent.behaviorState) {
      content += `<p>State: ${agent.behaviorState}</p>
        <p>Type: ${agent.behaviorType}</p>`;
    }

    content += '</div>';
    tooltip.innerHTML = content;
  },

  // Update status display
  updateDemoStatus() {
    const statusEl = document.getElementById('demo-status');
    if (statusEl) {
      statusEl.textContent = this.running ? 'Running' : 'Paused';
      statusEl.className = this.running ? 'text-success' : 'text-warning';
    }
  },

  // Utility: Lighten a color
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      '#' +
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

  // Utility: Convert hex color to rgba
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};

// Add CSS for tooltips
document.addEventListener('DOMContentLoaded', function () {
  // Add tooltip styles if not already present
  if (!document.getElementById('agent-demo-styles')) {
    const style = document.createElement('style');
    style.id = 'agent-demo-styles';
    style.textContent = `
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
    `;
    document.head.appendChild(style);
  }
});
