#!/usr/bin/env python3
"""
Script to manage interactive demo scenarios for the SPADE landing page
This script allows you to define new demo scenarios that will be added to the landing page.
"""

import json
import os
import sys
from datetime import datetime

DEMOS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                         "landing-assets", "demos.json")

def load_demos():
    """Load the current demo scenarios"""
    try:
        with open(DEMOS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Create initial demo scenarios
        default_demos = {
            "demos": [
                {
                    "id": "simple",
                    "name": "Basic Communication",
                    "description": "A simple demonstration of two agents exchanging messages.",
                    "agentTypes": ["sender", "receiver"],
                    "features": ["message-passing", "xmpp"]
                },
                {
                    "id": "behaviors",
                    "name": "Agent Behaviors",
                    "description": "Demonstration of different behavior types in SPADE agents.",
                    "agentTypes": ["coordinator", "worker"],
                    "features": ["behaviors", "cyclic", "one-shot"]
                },
                {
                    "id": "network",
                    "name": "Agent Network",
                    "description": "A network of multiple interconnected agents demonstrating complex interactions.",
                    "agentTypes": ["coordinator", "sender", "receiver", "worker"],
                    "features": ["network", "multi-agent", "complexity"]
                }
            ]
        }
        # Save the default demos
        with open(DEMOS_FILE, 'w') as f:
            json.dump(default_demos, f, indent=2)
        return default_demos
    except json.JSONDecodeError:
        print("Error: Demos file is corrupted.")
        sys.exit(1)

def save_demos(data):
    """Save demo scenarios to file"""
    with open(DEMOS_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    print("Demo scenarios saved successfully.")

def list_demos():
    """List all demo scenarios"""
    data = load_demos()
    if not data["demos"]:
        print("No demo scenarios found.")
        return
    
    print("\n=== Current Demo Scenarios ===")
    for idx, item in enumerate(data["demos"], 1):
        print(f"{idx}. {item['name']} (ID: {item['id']})")
        print(f"   Description: {item['description']}")
        print(f"   Agent Types: {', '.join(item['agentTypes'])}")
        print()

def add_demo():
    """Add a new demo scenario"""
    data = load_demos()
    
    # Get user input for the new demo
    demo_id = input("Enter demo ID (lowercase, no spaces): ").strip().lower()
    
    # Check if the ID already exists
    if any(demo['id'] == demo_id for demo in data["demos"]):
        print(f"Error: A demo with ID '{demo_id}' already exists.")
        return
    
    name = input("Enter demo name: ").strip()
    description = input("Enter demo description: ").strip()
    
    # Get agent types
    agent_types = []
    print("\nAvailable agent types: sender, receiver, coordinator, worker")
    agent_input = input("Enter agent types (comma-separated): ").strip()
    agent_types = [t.strip() for t in agent_input.split(",")]
    
    # Get features
    features = []
    features_input = input("Enter features (comma-separated): ").strip()
    features = [f.strip() for f in features_input.split(",")]
    
    # Create new demo object
    new_demo = {
        "id": demo_id,
        "name": name,
        "description": description,
        "agentTypes": agent_types,
        "features": features
    }
    
    # Add to data and save
    data["demos"].append(new_demo)
    save_demos(data)
    print(f"Demo scenario '{name}' added successfully.")

def remove_demo():
    """Remove a demo scenario"""
    data = load_demos()
    list_demos()
    
    if not data["demos"]:
        return
    
    try:
        demo_id = input("\nEnter the ID of the demo to remove: ").strip()
        
        # Find the demo with the specified ID
        for i, demo in enumerate(data["demos"]):
            if demo["id"] == demo_id:
                removed = data["demos"].pop(i)
                save_demos(data)
                print(f"Demo '{removed['name']}' removed successfully.")
                return
        
        print(f"Error: No demo found with ID '{demo_id}'.")
    except (ValueError, IndexError):
        print("Invalid selection. Please try again.")

def edit_demo():
    """Edit an existing demo scenario"""
    data = load_demos()
    list_demos()
    
    if not data["demos"]:
        return
    
    try:
        demo_id = input("\nEnter the ID of the demo to edit: ").strip()
        
        # Find the demo with the specified ID
        for i, demo in enumerate(data["demos"]):
            if demo["id"] == demo_id:
                print(f"\nEditing demo: {demo['name']}")
                
                # Get updated values
                name = input(f"Enter new name [{demo['name']}]: ").strip()
                if name:
                    demo['name'] = name
                
                desc = input(f"Enter new description [{demo['description']}]: ").strip()
                if desc:
                    demo['description'] = desc
                
                agents = input(f"Enter new agent types (comma-separated) [{', '.join(demo['agentTypes'])}]: ").strip()
                if agents:
                    demo['agentTypes'] = [a.strip() for a in agents.split(",")]
                
                features = input(f"Enter new features (comma-separated) [{', '.join(demo['features'])}]: ").strip()
                if features:
                    demo['features'] = [f.strip() for f in features.split(",")]
                
                save_demos(data)
                print(f"Demo '{demo['name']}' updated successfully.")
                return
        
        print(f"Error: No demo found with ID '{demo_id}'.")
    except (ValueError, IndexError):
        print("Invalid selection. Please try again.")

def print_help():
    """Print help information"""
    print("\nSPADE Demo Manager")
    print("==================")
    print("Commands:")
    print("  list    - List all demo scenarios")
    print("  add     - Add a new demo scenario")
    print("  remove  - Remove a demo scenario")
    print("  edit    - Edit an existing demo scenario")
    print("  help    - Show this help message")
    print("  exit    - Exit the program")

def main():
    """Main function"""
    print("SPADE Interactive Demo Manager")
    print("=============================")
    
    # Create the demos file if it doesn't exist
    load_demos()
    
    while True:
        command = input("\nEnter command (list, add, remove, edit, help, exit): ").strip().lower()
        
        if command == "list":
            list_demos()
        elif command == "add":
            add_demo()
        elif command == "remove":
            remove_demo()
        elif command == "edit":
            edit_demo()
        elif command == "help":
            print_help()
        elif command == "exit":
            print("Goodbye!")
            break
        else:
            print("Unknown command. Type 'help' for available commands.")

if __name__ == "__main__":
    main()
