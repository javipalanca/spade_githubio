// SPADE Landing Page Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Load news from JSON file
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        fetch('landing-assets/news.json')
            .then(response => response.json())
            .then(data => {
                // Clear loading spinner
                newsContainer.innerHTML = '';
                
                // Populate news items
                data.news.forEach(item => {
                    const newsCard = document.createElement('div');
                    newsCard.className = 'col-md-4';
                    newsCard.innerHTML = `
                        <div class="card h-100 border-0 shadow-sm">
                            <img src="${item.image}" class="card-img-top" alt="${item.title}">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge ${item.categoryClass}">${item.category}</span>
                                    <small class="text-muted">${item.date}</small>
                                </div>
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text">${item.description}</p>
                                <a href="${item.link}" class="btn btn-sm btn-outline-primary">Read More</a>
                            </div>
                        </div>
                    `;
                    newsContainer.appendChild(newsCard);
                });
            })
            .catch(error => {
                console.error('Error loading news:', error);
                newsContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="text-danger">Error loading news. Please try again later.</p>
                    </div>
                `;
            });
    }
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white', 'shadow-sm');
        } else {
            navbar.classList.remove('bg-white', 'shadow-sm');
        }
    });
    
    // Navbar scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Animation for feature cards
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
    
    // Countdown for demo purposes (e.g., next webinar, release date)
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14); // 14 days from now
        
        function updateCountdown() {
            const now = new Date();
            const difference = targetDate - now;
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            
            if (difference <= 0) {
                clearInterval(interval);
                countdownElement.innerHTML = 'Event started!';
            }
        }
        
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
    }
    
    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Apply saved theme or use system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        body.classList.add('dark-mode');
        setTimeout(() => {
            updateDarkModeIcon(true);
            updateLogos(true);
        }, 50); // Slight delay to ensure DOM is ready
    }
    
    // Toggle dark/light mode
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        
        // Save preference to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Update button icon
        updateDarkModeIcon(isDarkMode);
        
        // Update logos for dark mode
        updateLogos(isDarkMode);
    });
    
    // Update dark mode toggle icon
    function updateDarkModeIcon(isDarkMode) {
        const icon = darkModeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        } else {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
        }
    }
    
    // Update logos based on dark/light mode
    function updateLogos(isDarkMode) {
        // Select only logo images in navbar and footer, NOT the hero image
        const logoImages = document.querySelectorAll('.navbar-brand img, .footer img');
        
        logoImages.forEach(img => {
            img.src = isDarkMode ? 
                'landing-assets/spade-darkmode-fixed.svg' : 
                'landing-assets/spade-agent-network-fixed.svg';
        });
    }
});

// Agent Interactive Demo
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
            label: 'Sender Agent'
        },
        receiver: {
            color: '#2ecc71', // Green
            radius: 25,
            label: 'Receiver Agent'
        },
        coordinator: {
            color: '#e74c3c', // Red
            radius: 25,
            label: 'Coordinator'
        },
        worker: {
            color: '#f39c12', // Orange
            radius: 20,
            label: 'Worker Agent'
        }
    },
    
    // Initialize the demo
    init() {
        this.canvas = document.getElementById('agent-canvas');
        if (!this.canvas) return;
        
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
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.getElementById('start-demo').addEventListener('click', () => {
            if (this.running) {
                this.pause();
                document.getElementById('start-demo').innerHTML = '<i class="bi bi-play-fill"></i> Start Demo';
            } else {
                this.start();
                document.getElementById('start-demo').innerHTML = '<i class="bi bi-pause-fill"></i> Pause';
            }
        });
        
        document.getElementById('reset-demo').addEventListener('click', () => {
            this.reset();
            document.getElementById('start-demo').innerHTML = '<i class="bi bi-play-fill"></i> Start Demo';
        });
        
        document.getElementById('demo-scenario').addEventListener('change', (e) => {
            this.scenario = e.target.value;
            this.reset();
            this.updateDemoStatus();
        });
        
        // Load scenarios from JSON file
        this.loadScenariosFromJSON();
        
        // Initialize with agents in paused state
        this.setupScenario();
        this.updateDemoStatus();
        this.drawFrame();
    },
    
    // Load scenarios from JSON
    loadScenariosFromJSON() {
        fetch('landing-assets/demos.json')
            .then(response => response.json())
            .then(data => {
                const scenarioSelect = document.getElementById('demo-scenario');
                
                // Clear existing options
                scenarioSelect.innerHTML = '';
                
                // Add options from JSON
                data.demos.forEach(demo => {
                    const option = document.createElement('option');
                    option.value = demo.id;
                    option.textContent = demo.name;
                    scenarioSelect.appendChild(option);
                });
                
                // Set current scenario
                this.scenario = scenarioSelect.value;
                this.reset();
            })
            .catch(error => {
                console.error('Error loading demo scenarios:', error);
            });
    },
    
    // Resize canvas to maintain proper dimensions
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        if (this.agents.length) {
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
            ...this.agentTypes.sender
        });
        
        // Create receiver agent on the right
        this.agents.push({
            id: 'receiver1',
            type: 'receiver',
            x: canvasWidth * 0.75,
            y: canvasHeight * 0.5,
            ...this.agentTypes.receiver
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
            ...this.agentTypes.coordinator
        });
        
        // Worker agents arranged in a circle
        const numWorkers = 4;
        const radius = Math.min(canvasWidth, canvasHeight) * 0.3;
        
        for (let i = 0; i < numWorkers; i++) {
            const angle = (i / numWorkers) * Math.PI * 2;
            this.agents.push({
                id: `worker${i+1}`,
                type: 'worker',
                x: canvasWidth * 0.5 + Math.cos(angle) * radius,
                y: canvasHeight * 0.5 + Math.sin(angle) * radius,
                ...this.agentTypes.worker,
                behaviorState: 'idle',
                behaviorType: i % 2 === 0 ? 'cyclic' : 'one-shot'
            });
        }
    },
    
    // Setup network scenario with multiple interconnected agents
    setupNetworkScenario() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Create a network of 7 agents
        const positions = [
            { x: canvasWidth * 0.5, y: canvasHeight * 0.3 },   // Top center
            { x: canvasWidth * 0.3, y: canvasHeight * 0.4 },   // Top left
            { x: canvasWidth * 0.7, y: canvasHeight * 0.4 },   // Top right
            { x: canvasWidth * 0.5, y: canvasHeight * 0.6 },   // Center
            { x: canvasWidth * 0.3, y: canvasHeight * 0.7 },   // Bottom left
            { x: canvasWidth * 0.7, y: canvasHeight * 0.7 },   // Bottom right
            { x: canvasWidth * 0.5, y: canvasHeight * 0.8 }    // Bottom center
        ];
        
        const types = ['coordinator', 'sender', 'receiver', 'sender', 'worker', 'worker', 'receiver'];
        
        for (let i = 0; i < positions.length; i++) {
            this.agents.push({
                id: `agent${i+1}`,
                type: types[i],
                x: positions[i].x,
                y: positions[i].y,
                ...this.agentTypes[types[i]]
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
                        createdAt: Date.now()
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
                particle.opacity = 1 - (age / particle.lifetime);
                particle.size -= 0.01;
            }
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
                createdAt: Date.now()
            });
        }
    },
    
    // Update simple scenario state
    updateSimpleScenario(elapsed) {
        // Send message every 3 seconds
        if (elapsed % 3000 < 20 && this.messages.length === 0) {
            const sender = this.agents.find(a => a.type === 'sender');
            const receiver = this.agents.find(a => a.type === 'receiver');
            
            if (sender && receiver) {
                const messageTypes = ['Request', 'Data', 'Query', 'Update'];
                const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
                this.createMessage('sender1', 'receiver1', messageType, 1500, '#3498db');
            }
        }
    },
    
    // Update behavior scenario state
    updateBehaviorScenario(elapsed) {
        const coordinator = this.agents.find(a => a.type === 'coordinator');
        const workers = this.agents.filter(a => a.type === 'worker');
        
        // Initialize worker states if needed
        workers.forEach(worker => {
            if (!worker.behaviorState) {
                worker.behaviorState = 'idle';
                worker.nextStateChange = elapsed + 1000 + Math.random() * 2000;
                worker.lastUpdate = elapsed;
            }
        });
        
        // Update worker states
        workers.forEach(worker => {
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
                    console.log(`${worker.id} started working`);
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
                    console.log(`${worker.id} completed task`);
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
            const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
            
            this.createMessage(from.id, to.id, messageType, 1500, from.color);
        }
    },
    
    // Create a new message between agents
    createMessage(fromId, toId, text, duration = 1500, color = '#3498db') {
        const fromAgent = this.agents.find(a => a.id === fromId);
        const toAgent = this.agents.find(a => a.id === toId);
        
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
            color: color
        });
    },
    
    // Render a frame
    drawFrame() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections between agents based on scenario
        this.drawConnections();
        
        // Draw messages
        this.messages.forEach(msg => {
            this.drawMessage(msg);
        });
        
        // Draw agents
        this.agents.forEach(agent => {
            this.drawAgent(agent);
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
    },
    
    // Draw connections between agents
    drawConnections() {
        this.ctx.save();
        
        switch (this.scenario) {
            case 'simple':
                // Simple line between sender and receiver
                const sender = this.agents.find(a => a.type === 'sender');
                const receiver = this.agents.find(a => a.type === 'receiver');
                
                if (sender && receiver) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(sender.x, sender.y);
                    this.ctx.lineTo(receiver.x, receiver.y);
                    this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
                break;
                
            case 'behaviors':
                // Lines from workers to coordinator
                const coordinator = this.agents.find(a => a.type === 'coordinator');
                const workers = this.agents.filter(a => a.type === 'worker');
                
                if (coordinator) {
                    workers.forEach(worker => {
                        this.ctx.beginPath();
                        this.ctx.moveTo(coordinator.x, coordinator.y);
                        this.ctx.lineTo(worker.x, worker.y);
                        
                        // Style based on worker state
                        if (worker.behaviorState === 'working') {
                            this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
                            this.ctx.lineWidth = 2;
                        } else {
                            this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                            this.ctx.lineWidth = 1;
                        }
                        
                        this.ctx.stroke();
                    });
                }
                break;
                
            case 'network':
                // Draw network connections
                const lineColor = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                
                // Central connections
                const center = this.agents[3]; // Center agent
                
                for (let i = 0; i < this.agents.length; i++) {
                    if (i === 3) continue; // Skip self
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(center.x, center.y);
                    this.ctx.lineTo(this.agents[i].x, this.agents[i].y);
                    this.ctx.strokeStyle = lineColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
                
                // Additional connections
                const connections = [
                    [0, 1], [0, 2], // Top center to left and right
                    [4, 5], [4, 6], [5, 6] // Bottom connections
                ];
                
                connections.forEach(([i, j]) => {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.agents[i].x, this.agents[i].y);
                    this.ctx.lineTo(this.agents[j].x, this.agents[j].y);
                    this.ctx.strokeStyle = lineColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.setLineDash([4, 4]);
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
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
            agent.x, agent.y, 0,
            agent.x, agent.y, agent.radius
        );
        
        gradient.addColorStop(0, this.lightenColor(agent.color, 20));
        gradient.addColorStop(1, agent.color);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Add a subtle border
        this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
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
            const stateColors = {
                idle: '#95a5a6',
                working: '#f39c12'
            };
            
            // Draw a larger, more visible indicator
            this.ctx.beginPath();
            this.ctx.arc(agent.x + agent.radius * 0.8, agent.y - agent.radius * 0.8, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = stateColors[agent.behaviorState];
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Add a pulsing effect for working state
            if (agent.behaviorState === 'working') {
                const pulseRadius = 8 + Math.sin(Date.now() * 0.01) * 2;
                this.ctx.beginPath();
                this.ctx.arc(agent.x + agent.radius * 0.8, agent.y - agent.radius * 0.8, pulseRadius, 0, Math.PI * 2);
                this.ctx.strokeStyle = stateColors[agent.behaviorState];
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = 0.5;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // Add hover tooltip
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        const mouseX = this.mouseX - rect.left;
        const mouseY = this.mouseY - rect.top;
        
        // Check if mouse is over this agent
        const distance = Math.sqrt(Math.pow(mouseX - agent.x, 2) + Math.pow(mouseY - agent.y, 2));
        if (distance <= agent.radius) {
            // Show tooltip with agent info
            this.showAgentTooltip(agent);
        }
        
        this.ctx.restore();
    },
    
    // Show tooltip with agent information
    showAgentTooltip(agent) {
        // First, remove any existing tooltips
        const existingTooltip = document.querySelector('.agent-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'agent-tooltip';
        
        // Get agent description based on type
        const descriptions = {
            sender: 'Sender agents initiate communications and actively send messages to other agents.',
            receiver: 'Receiver agents primarily respond to incoming messages and process requests.',
            coordinator: 'Coordinator agents manage and delegate tasks to other agents in the system.',
            worker: 'Worker agents perform specific tasks assigned by coordinators or triggered by events.'
        };
        
        // Get behavior information if available
        let behaviorInfo = '';
        if (agent.behaviorState) {
            const behaviorDescriptions = {
                idle: 'Currently idle, waiting for tasks',
                working: 'Actively executing a task'
            };
            behaviorInfo = `<br><b>State:</b> ${behaviorDescriptions[agent.behaviorState]}`;
        }
        
        if (agent.behaviorType) {
            const behaviorTypeDesc = {
                'cyclic': 'Runs repeatedly at intervals',
                'one-shot': 'Executes once and completes'
            };
            behaviorInfo += `<br><b>Behavior:</b> ${behaviorTypeDesc[agent.behaviorType]}`;
        }
        
        // Set tooltip content
        tooltip.innerHTML = `
            <b>${agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent</b><br>
            ${descriptions[agent.type]}
            ${behaviorInfo}
        `;
        
        // Position tooltip near the agent
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        
        tooltip.style.left = `${rect.left + agent.x + agent.radius + 10}px`;
        tooltip.style.top = `${rect.top + agent.y - 20}px`;
        
        // Add to document
        document.body.appendChild(tooltip);
    },
    
    // Draw a message between agents
    drawMessage(msg) {
        this.ctx.save();
        
        // Draw circle for message
        this.ctx.beginPath();
        this.ctx.arc(msg.x, msg.y, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = msg.color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw label above message
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#333';
        
        // Create background for better readability
        const textWidth = this.ctx.measureText(msg.text).width;
        this.ctx.fillStyle = document.body.classList.contains('dark-mode') ? 'rgba(33,33,33,0.7)' : 'rgba(255,255,255,0.7)';
        this.ctx.fillRect(msg.x - textWidth/2 - 5, msg.y - 20, textWidth + 10, 16);
        
        // Draw text
        this.ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#333';
        this.ctx.fillText(msg.text, msg.x, msg.y - 12);
        
        this.ctx.restore();
    },
    
    // Draw a particle
    drawParticle(particle) {
        this.ctx.save();
        
        // Update position if particle has velocity
        if (particle.vx !== undefined && particle.vy !== undefined) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Slow down
            particle.vx *= 0.98;
            particle.vy *= 0.98;
        }
        
        const opacity = particle.opacity !== undefined ? particle.opacity : 1;
        this.ctx.globalAlpha = opacity;
        
        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        this.ctx.restore();
    },
    
    // Update demo status display
    updateDemoStatus() {
        const statusElement = document.getElementById('demo-status-text');
        const statusContainer = document.getElementById('demo-status');
        const legendContainer = document.getElementById('demo-legend');
        
        if (!statusElement || !statusContainer) return;
        
        const descriptions = {
            'simple': 'Watch two agents exchange messages in a basic communication pattern.',
            'behaviors': 'Observe agents with different behavior types: cyclic (continuous) and one-shot (single execution).',
            'network': 'See a complex network of interconnected agents communicating and coordinating tasks.'
        };
        
        statusElement.textContent = descriptions[this.scenario] || 'Demo scenario description.';
        statusContainer.style.display = 'block';
        
        // Show legend only for behaviors demo
        if (legendContainer) {
            legendContainer.style.display = this.scenario === 'behaviors' ? 'block' : 'none';
        }
        
        if (this.running) {
            statusElement.textContent += ' Demo is running...';
        }
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
                createdAt: Date.now()
            });
        }
    },
    
    // Update simple scenario state
    updateSimpleScenario(elapsed) {
        // Send message every 3 seconds
        if (elapsed % 3000 < 20 && this.messages.length === 0) {
            const sender = this.agents.find(a => a.type === 'sender');
            const receiver = this.agents.find(a => a.type === 'receiver');
            
            if (sender && receiver) {
                const messageTypes = ['Request', 'Data', 'Query', 'Update'];
                const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
                this.createMessage('sender1', 'receiver1', messageType, 1500, '#3498db');
            }
        }
    },
    
    // Update behavior scenario state
    updateBehaviorScenario(elapsed) {
        const coordinator = this.agents.find(a => a.type === 'coordinator');
        const workers = this.agents.filter(a => a.type === 'worker');
        
        // Initialize worker states if needed
        workers.forEach(worker => {
            if (!worker.behaviorState) {
                worker.behaviorState = 'idle';
                worker.nextStateChange = elapsed + 1000 + Math.random() * 2000;
                worker.lastUpdate = elapsed;
            }
        });
        
        // Update worker states
        workers.forEach(worker => {
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
                    console.log(`${worker.id} started working`);
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
                    console.log(`${worker.id} completed task`);
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
            const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
            
            this.createMessage(from.id, to.id, messageType, 1500, from.color);
        }
    },
    
    // Create a new message between agents
    createMessage(fromId, toId, text, duration = 1500, color = '#3498db') {
        const fromAgent = this.agents.find(a => a.id === fromId);
        const toAgent = this.agents.find(a => a.id === toId);
        
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
            color: color
        });
    },
    
    // Render a frame
    drawFrame() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections between agents based on scenario
        this.drawConnections();
        
        // Draw messages
        this.messages.forEach(msg => {
            this.drawMessage(msg);
        });
        
        // Draw agents
        this.agents.forEach(agent => {
            this.drawAgent(agent);
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
    },
    
    // Draw connections between agents
    drawConnections() {
        this.ctx.save();
        
        switch (this.scenario) {
            case 'simple':
                // Simple line between sender and receiver
                const sender = this.agents.find(a => a.type === 'sender');
                const receiver = this.agents.find(a => a.type === 'receiver');
                
                if (sender && receiver) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(sender.x, sender.y);
                    this.ctx.lineTo(receiver.x, receiver.y);
                    this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
                break;
                
            case 'behaviors':
                // Lines from workers to coordinator
                const coordinator = this.agents.find(a => a.type === 'coordinator');
                const workers = this.agents.filter(a => a.type === 'worker');
                
                if (coordinator) {
                    workers.forEach(worker => {
                        this.ctx.beginPath();
                        this.ctx.moveTo(coordinator.x, coordinator.y);
                        this.ctx.lineTo(worker.x, worker.y);
                        
                        // Style based on worker state
                        if (worker.behaviorState === 'working') {
                            this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
                            this.ctx.lineWidth = 2;
                        } else {
                            this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                            this.ctx.lineWidth = 1;
                        }
                        
                        this.ctx.stroke();
                    });
                }
                break;
                
            case 'network':
                // Draw network connections
                const lineColor = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                
                // Central connections
                const center = this.agents[3]; // Center agent
                
                for (let i = 0; i < this.agents.length; i++) {
                    if (i === 3) continue; // Skip self
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(center.x, center.y);
                    this.ctx.lineTo(this.agents[i].x, this.agents[i].y);
                    this.ctx.strokeStyle = lineColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
                
                // Additional connections
                const connections = [
                    [0, 1], [0, 2], // Top center to left and right
                    [4, 5], [4, 6], [5, 6] // Bottom connections
                ];
                
                connections.forEach(([i, j]) => {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.agents[i].x, this.agents[i].y);
                    this.ctx.lineTo(this.agents[j].x, this.agents[j].y);
                    this.ctx.strokeStyle = lineColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.setLineDash([4, 4]);
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
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
            agent.x, agent.y, 0,
            agent.x, agent.y, agent.radius
        );
        
        gradient.addColorStop(0, this.lightenColor(agent.color, 20));
        gradient.addColorStop(1, agent.color);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Add a subtle border
        this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
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
            const stateColors = {
                idle: '#95a5a6',
                working: '#f39c12'
            };
            
            // Draw a larger, more visible indicator
            this.ctx.beginPath();
            this.ctx.arc(agent.x + agent.radius * 0.8, agent.y - agent.radius * 0.8, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = stateColors[agent.behaviorState];
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Add a pulsing effect for working state
            if (agent.behaviorState === 'working') {
                const pulseRadius = 8 + Math.sin(Date.now() * 0.01) * 2;
                this.ctx.beginPath();
                this.ctx.arc(agent.x + agent.radius * 0.8, agent.y - agent.radius * 0.8, pulseRadius, 0, Math.PI * 2);
                this.ctx.strokeStyle = stateColors[agent.behaviorState];
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = 0.5;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        }
        
        // Add hover tooltip
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        const mouseX = this.mouseX - rect.left;
        const mouseY = this.mouseY - rect.top;
        
        // Check if mouse is over this agent
        const distance = Math.sqrt(Math.pow(mouseX - agent.x, 2) + Math.pow(mouseY - agent.y, 2));
        if (distance <= agent.radius) {
            // Show tooltip with agent info
            this.showAgentTooltip(agent);
        }
        
        this.ctx.restore();
    },
    
    // Show tooltip with agent information
    showAgentTooltip(agent) {
        // First, remove any existing tooltips
        const existingTooltip = document.querySelector('.agent-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'agent-tooltip';
        
        // Get agent description based on type
        const descriptions = {
            sender: 'Sender agents initiate communications and actively send messages to other agents.',
            receiver: 'Receiver agents primarily respond to incoming messages and process requests.',
            coordinator: 'Coordinator agents manage and delegate tasks to other agents in the system.',
            worker: 'Worker agents perform specific tasks assigned by coordinators or triggered by events.'
        };
        
        // Get behavior information if available
        let behaviorInfo = '';
        if (agent.behaviorState) {
            const behaviorDescriptions = {
                idle: 'Currently idle, waiting for tasks',
                working: 'Actively executing a task'
            };
            behaviorInfo = `<br><b>State:</b> ${behaviorDescriptions[agent.behaviorState]}`;
        }
        
        if (agent.behaviorType) {
            const behaviorTypeDesc = {
                'cyclic': 'Runs repeatedly at intervals',
                'one-shot': 'Executes once and completes'
            };
            behaviorInfo += `<br><b>Behavior:</b> ${behaviorTypeDesc[agent.behaviorType]}`;
        }
        
        // Set tooltip content
        tooltip.innerHTML = `
            <b>${agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent</b><br>
            ${descriptions[agent.type]}
            ${behaviorInfo}
        `;
        
        // Position tooltip near the agent
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        
        tooltip.style.left = `${rect.left + agent.x + agent.radius + 10}px`;
        tooltip.style.top = `${rect.top + agent.y - 20}px`;
        
        // Add to document
        document.body.appendChild(tooltip);
    },
    
    // Draw a message between agents
    drawMessage(msg) {
        this.ctx.save();
        
        // Draw circle for message
        this.ctx.beginPath();
        this.ctx.arc(msg.x, msg.y, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = msg.color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw label above message
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#333';
        
        // Create background for better readability
        const textWidth = this.ctx.measureText(msg.text).width;
        this.ctx.fillStyle = document.body.classList.contains('dark-mode') ? 'rgba(33,33,33,0.7)' : 'rgba(255,255,255,0.7)';
        this.ctx.fillRect(msg.x - textWidth/2 - 5, msg.y - 20, textWidth + 10, 16);
        
        // Draw text
        this.ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#333';
        this.ctx.fillText(msg.text, msg.x, msg.y - 12);
        
        this.ctx.restore();
    },
    
    // Draw a particle
    drawParticle(particle) {
        this.ctx.save();
        
        // Update position if particle has velocity
        if (particle.vx !== undefined && particle.vy !== undefined) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Slow down
            particle.vx *= 0.98;
            particle.vy *= 0.98;
        }
        
        const opacity = particle.opacity !== undefined ? particle.opacity : 1;
        this.ctx.globalAlpha = opacity;
        
        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        this.ctx.restore();
    },
    
    // Utility to lighten a color
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt,
              G = (num >> 8 & 0x00FF) + amt,
              B = (num & 0x0000FF) + amt;
              
        return '#' + (
            0x1000000 + 
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }
};

// Initialize agent demo when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize other scripts
    // ...
    
    // Initialize agent demo
    if (document.getElementById('agent-canvas')) {
        AgentDemo.init();
    }
});

// Code example selector
document.addEventListener('DOMContentLoaded', function() {
    // Set up code example switcher
    const codeSelectors = document.querySelectorAll('.code-example-selector');
    const codeBlocks = document.querySelectorAll('.code-block');
    const copyButton = document.querySelector('.copy-code-btn');
    
    if (codeSelectors.length > 0 && codeBlocks.length > 0) {
        codeSelectors.forEach(selector => {
            selector.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the example ID
                const exampleId = this.getAttribute('data-example');
                
                // Update dropdown button text
                document.getElementById('codeExampleDropdown').innerHTML = 
                    `<i class="bi bi-code-slash me-1"></i> ${this.textContent}`;
                
                // Hide all code blocks
                codeBlocks.forEach(block => {
                    block.classList.add('d-none');
                });
                
                // Show the selected code block
                const selectedBlock = document.getElementById(`code-${exampleId}`);
                if (selectedBlock) {
                    selectedBlock.classList.remove('d-none');
                    
                    // Update code content and apply syntax highlighting
                    const codeTag = selectedBlock.querySelector('code');
                    if (codeTag && codeExamples[exampleId]) {
                        codeTag.textContent = codeExamples[exampleId];
                        // Re-apply Prism highlighting
                        if (typeof Prism !== 'undefined') {
                            Prism.highlightElement(codeTag);
                        }
                    }
                }
                
                // Sync with demo scenario if possible
                const demoScenario = document.getElementById('demo-scenario');
                if (demoScenario) {
                    // Map example to scenario
                    const scenarioMap = {
                        'simple': 'simple',
                        'behavior': 'behaviors',
                        'network': 'network'
                    };
                    
                    if (scenarioMap[exampleId] && demoScenario.value !== scenarioMap[exampleId]) {
                        demoScenario.value = scenarioMap[exampleId];
                        // Trigger change event to update demo
                        const event = new Event('change');
                        demoScenario.dispatchEvent(event);
                    }
                }
            });
        });
        
        // Implement copy code functionality
        if (copyButton) {
            copyButton.addEventListener('click', function() {
                // Find visible code block
                const visibleBlock = Array.from(codeBlocks).find(block => !block.classList.contains('d-none'));
                
                if (visibleBlock) {
                    const codeText = visibleBlock.querySelector('code').innerText;
                    
                    // Copy to clipboard
                    navigator.clipboard.writeText(codeText).then(function() {
                        // Temporarily change button text
                        const originalText = copyButton.innerHTML;
                        copyButton.innerHTML = '<i class="bi bi-check-lg me-1"></i> Copied!';
                        copyButton.classList.remove('btn-outline-primary');
                        copyButton.classList.add('btn-success');
                        
                        // Reset after 2 seconds
                        setTimeout(function() {
                            copyButton.innerHTML = originalText;
                            copyButton.classList.remove('btn-success');
                            copyButton.classList.add('btn-outline-primary');
                        }, 2000);
                    });
                }
            });
        }
    }
    
    // Sync demo scenario with code example (initial)
    const demoScenario = document.getElementById('demo-scenario');
    if (demoScenario) {
        demoScenario.addEventListener('change', function() {
            // Map scenario to example
            const exampleMap = {
                'simple': 'simple',
                'behaviors': 'behavior',
                'network': 'network'
            };
            
            const exampleId = exampleMap[this.value];
            if (exampleId) {
                // Hide all code blocks
                codeBlocks.forEach(block => {
                    block.classList.add('d-none');
                });
                
                // Show the matching code block
                const selectedBlock = document.getElementById(`code-${exampleId}`);
                if (selectedBlock) {
                    selectedBlock.classList.remove('d-none');
                }
                
                // Update dropdown text
                const selector = document.querySelector(`.code-example-selector[data-example="${exampleId}"]`);
                if (selector && document.getElementById('codeExampleDropdown')) {
                    document.getElementById('codeExampleDropdown').innerHTML = 
                        `<i class="bi bi-code-slash me-1"></i> ${selector.textContent}`;
                }
            }
        });
    }
});

// Code examples content
const codeExamples = {
    simple: `import spade
from spade.agent import Agent
from spade.behaviour import OneShotBehaviour
from spade.message import Message

class SenderAgent(Agent):
    class SendMessageBehaviour(OneShotBehaviour):
        async def run(self):
            msg = Message(to="receiver@localhost")
            msg.body = "Hello from SPADE!"
            await self.send(msg)
            print(f"Message sent to {msg.to}")

    async def setup(self):
        print(f"SenderAgent {self.jid} starting...")
        self.add_behaviour(self.SendMessageBehaviour())

class ReceiverAgent(Agent):
    class ReceiveMessageBehaviour(OneShotBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                print(f"Received message: {msg.body}")

    async def setup(self):
        print(f"ReceiverAgent {self.jid} starting...")
        self.add_behaviour(self.ReceiveMessageBehaviour())

async def main():
    # Create and start agents
    receiver = ReceiverAgent("receiver@localhost", "password")
    sender = SenderAgent("sender@localhost", "password")

    await receiver.start()
    await sender.start()
    
    print("Agents started. Press CTRL+C to stop...")
    try:
        await spade.wait_until_finished([sender, receiver])
    except KeyboardInterrupt:
        print("Stopping agents...")
    finally:
        await sender.stop()
        await receiver.stop()

if __name__ == "__main__":
    spade.run(main())`,

    behavior: `import spade
from spade.agent import Agent
from spade.behaviour import CyclicBehaviour, OneShotBehaviour
from spade.message import Message
import asyncio

class CoordinatorAgent(Agent):
    class TaskDistributionBehaviour(CyclicBehaviour):
        async def run(self):
            # Wait for worker status reports
            msg = await self.receive(timeout=10)
            if msg:
                print(f"Received status from {msg.sender}: {msg.body}")
                
                # Send task assignment back to worker
                response = Message(to=str(msg.sender))
                response.body = "New task: data analysis"
                await self.send(response)
                
            await asyncio.sleep(1)

    async def setup(self):
        self.add_behaviour(self.TaskDistributionBehaviour())

class WorkerAgent(Agent):
    class ReportStatusBehaviour(CyclicBehaviour):
        async def run(self):
            # Send status report to coordinator
            msg = Message(to="coordinator@localhost")
            msg.body = "Status: idle, ready for tasks"
            await self.send(msg)
            
            # Wait for task assignment
            response = await self.receive(timeout=5)
            if response:
                print(f"Received task: {response.body}")
                # Process task...
                
            await asyncio.sleep(5)  # Report status every 5 seconds

    async def setup(self):
        self.add_behaviour(self.ReportStatusBehaviour())

async def main():
    # Create and start agents
    coordinator = CoordinatorAgent("coordinator@localhost", "password")
    worker1 = WorkerAgent("worker1@localhost", "password")
    worker2 = WorkerAgent("worker2@localhost", "password")

    await coordinator.start()
    await worker1.start()
    await worker2.start()
    
    print("Agents started. Press CTRL+C to stop...")
    try:
        await spade.wait_until_finished([coordinator, worker1, worker2])
    except KeyboardInterrupt:
        print("Stopping agents...")
    finally:
        await coordinator.stop()
        await worker1.stop()
        await worker2.stop()

if __name__ == "__main__":
    spade.run(main())`,

    network: `import spade
from spade.agent import Agent
from spade.behaviour import FSMBehaviour, State
from spade.message import Message
import asyncio

# Define states for FSM
STATE_INIT = "STATE_INIT"
STATE_PROCESSING = "STATE_PROCESSING"
STATE_DISTRIBUTING = "STATE_DISTRIBUTING"
STATE_DONE = "STATE_DONE"

class NetworkNode(Agent):
    class NetworkBehaviour(FSMBehaviour):
        async def on_start(self):
            print(f"Agent {self.agent.name} starting network behavior")
            
        async def on_end(self):
            print(f"Agent {self.agent.name} finished network behavior")
    
    class InitState(State):
        async def run(self):
            print(f"{self.agent.name} in init state")
            # Register with network
            msg = Message(to="coordinator@localhost")
            msg.body = f"Register: {self.agent.name} with role {self.agent.role}"
            await self.send(msg)
            self.set_next_state(STATE_PROCESSING)
            
    class ProcessingState(State):
        async def run(self):
            print(f"{self.agent.name} processing")
            msg = await self.receive(timeout=5)
            if msg and msg.body.startswith("Task:"):
                self.agent.current_task = msg.body
                self.set_next_state(STATE_DISTRIBUTING)
            else:
                await asyncio.sleep(1);
                this.set_next_state(STATE_PROCESSING);
    
    class DistributingState(State):
        async def run(self):
            print(f"{self.agent.name} distributing results")
            # Share results with neighbors
            for neighbor in self.agent.neighbors:
                msg = Message(to=f"{neighbor}@localhost")
                msg.body = f"Result from {self.agent.name}: {self.agent.current_task} completed"
                await self.send(msg)
            self.set_next_state(STATE_DONE)
    
    class DoneState(State):
        async def run(self):
            print(f"{self.agent.name} completed network cycle")
            # Reset for next cycle
            await asyncio.sleep(3);
            this.set_next_state(STATE_INIT);
    
    def __init__(self, jid, password, role, neighbors):
        super().__init__(jid, password)
        self.role = role;
        self.neighbors = neighbors;
        self.current_task = None;
    
    async def setup(self):
        fsm = self.NetworkBehaviour()
        fsm.add_state(STATE_INIT, self.InitState())
        fsm.add_state(STATE_PROCESSING, self.ProcessingState())
        fsm.add_state(STATE_DISTRIBUTING, self.DistributingState())
        fsm.add_state(STATE_DONE, self.DoneState())
        
        fsm.add_transition(STATE_INIT, STATE_PROCESSING)
        fsm.add_transition(STATE_PROCESSING, STATE_DISTRIBUTING)
        fsm.add_transition(STATE_PROCESSING, STATE_PROCESSING)
        fsm.add_transition(STATE_DISTRIBUTING, STATE_DONE)
        fsm.add_transition(STATE_DONE, STATE_INIT)
        
        self.add_behaviour(fsm)

# Create a network of 7 agents with different roles
roles = ["coordinator", "processor", "distributor", "collector", "analyzer", "storage", "interface"]
agents = []

# Define connections
connections = {
    "coordinator": ["processor", "distributor", "collector"],
    "processor": ["coordinator", "analyzer"],
    "distributor": ["coordinator", "storage", "interface"],
    "collector": ["coordinator", "analyzer"],
    "analyzer": ["processor", "collector"],
    "storage": ["distributor"],
    "interface": ["distributor"]
}

# Create and start agents
async def main():
    agents = []
    for i, role in enumerate(roles):
        agent = NetworkNode(f"{role}@localhost", "password", role, connections[role])
        agents.append(agent)
        await agent.start()

    print("Agent network started. Press CTRL+C to stop...")
    try:
        await spade.wait_until_finished(agents)
    except KeyboardInterrupt:
        print("Stopping agents...")
    finally:
        for agent in agents:
            await agent.stop()

if __name__ == "__main__":
    spade.run(main())`
};

// Initialize code examples with syntax highlighting
function initializeCodeExamples() {
    console.log('Initializing code examples...');
    
    // Apply syntax highlighting to dynamic code examples
    Object.keys(codeExamples).forEach(key => {
        const codeElement = document.getElementById(`code-${key}`);
        if (codeElement) {
            const codeTag = codeElement.querySelector('code');
            if (codeTag) {
                codeTag.textContent = codeExamples[key];
                // Trigger Prism highlighting
                if (typeof Prism !== 'undefined') {
                    Prism.highlightElement(codeTag);
                    console.log(`Highlighted code for ${key}`);
                } else {
                    console.warn('Prism is not available yet');
                }
            }
        }
    });
    
    // Apply syntax highlighting to all static code blocks
    if (typeof Prism !== 'undefined') {
        // Find all code blocks with language classes
        const codeBlocks = document.querySelectorAll('pre code[class*="language-"]');
        codeBlocks.forEach(block => {
            Prism.highlightElement(block);
        });
        console.log(`Highlighted ${codeBlocks.length} static code blocks`);
    }
}

// Initialize with multiple fallbacks
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing landing page features');
    
    // Initialize Agent Demo
    if (document.getElementById('agent-canvas')) {
        try {
            AgentDemo.init();
            console.log('Agent Demo initialized successfully');
        } catch (error) {
            console.error('Error initializing Agent Demo:', error);
        }
    }
    
    // Initialize syntax highlighting with multiple attempts
    function tryInitializeCodeExamples(attempts = 0) {
        if (typeof Prism !== 'undefined') {
            initializeCodeExamples();
            console.log('Code examples initialized with Prism.js');
        } else if (attempts < 5) {
            console.log(`Waiting for Prism.js... attempt ${attempts + 1}`);
            setTimeout(() => tryInitializeCodeExamples(attempts + 1), 200 * (attempts + 1));
        } else {
            console.warn('Prism.js failed to load after multiple attempts');
        }
    }
    
    tryInitializeCodeExamples();
    
    // Also try on window load as fallback
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (typeof Prism !== 'undefined') {
                initializeCodeExamples();
                console.log('Code examples initialized on window load');
            }
        }, 500);
    });
});
