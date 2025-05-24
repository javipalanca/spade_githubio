# SPADE Interactive Demo Documentation

This document describes the implementation details of the SPADE interactive demo on the landing page.

## Overview

The interactive demo visualizes core SPADE concepts in an engaging and educational way, showing:

1. Agent communication via message passing
2. Different agent types and their roles
3. Agent behaviors and state transitions
4. Multi-agent networks and interactions

## Implementation Details

### Technologies Used

- HTML5 Canvas for rendering
- Vanilla JavaScript for logic and animation
- JSON configuration for scenario definitions

### Core Components

#### AgentDemo Object

The main controller with methods for:
- Initializing the canvas and event listeners
- Managing agent state and rendering
- Handling user interactions
- Animating agent communications

#### Agent Representations

Agents are represented as colored circles with:
- Unique identifiers and types (sender, receiver, coordinator, worker)
- Visual indicators for different states and behaviors
- Interactive tooltips showing detailed information

#### Message System

Messages are visualized as animated particles traveling between agents:
- Message content is displayed above the particle
- Particle trails show the communication path
- Visual effects indicate message arrival

#### Scenarios

Three built-in scenarios demonstrate different SPADE capabilities:
1. **Basic Communication**: Simple sender-receiver setup showing message exchange
2. **Agent Behaviors**: Demonstrates cyclic and one-shot behaviors with a coordinator and workers
3. **Agent Network**: Complex network of interconnected agents with different roles

## Customization

The demo system can be extended by:

1. Adding new scenarios to the `landing-assets/demos.json` file
2. Using the `manage_demos.py` script to manage scenarios
3. Modifying the JavaScript to implement custom scenario logic

### Adding a New Scenario

1. Run `python3 manage_demos.py` and select "add"
2. Provide details for the new scenario
3. Implement the scenario logic in `scripts.js` by adding:
   - A setup function: `setupNewScenario()`
   - An update function: `updateNewScenario(elapsed)`

## Code Examples Integration

The demo includes corresponding Python code examples that show:
- How to implement the visualized concepts in real SPADE code
- Best practices for agent communication and behavior design
- Different patterns for organizing multi-agent systems

## Future Enhancements

Planned improvements:
- More interactive elements allowing users to create and modify agents
- Detailed behavior state machine visualization
- Real-time demonstration of XMPP protocol details
- Integration with live SPADE instances for educational purposes
