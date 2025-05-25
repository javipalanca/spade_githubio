#!/usr/bin/env python3
"""
Script to manage interactive demo scenarios for the SPADE Astro landing page
This script allows you to define new demo scenarios that will be added to the landing page.
"""

import json
import os
import sys
from datetime import datetime

def validate_demo_item(item):
    """Validate a demo item structure"""
    required_fields = ["id", "name", "description", "agentTypes", "features"]
    for field in required_fields:
        if field not in item:
            return False, f"Missing required field: {field}"
    
    # Validate types
    if not isinstance(item["id"], str) or not item["id"].strip():
        return False, "ID must be a non-empty string"
    if not isinstance(item["name"], str) or not item["name"].strip():
        return False, "Name must be a non-empty string"
    if not isinstance(item["description"], str) or not item["description"].strip():
        return False, "Description must be a non-empty string"
    if not isinstance(item["agentTypes"], list) or not item["agentTypes"]:
        return False, "agentTypes must be a non-empty list"
    if not isinstance(item["features"], list) or not item["features"]:
        return False, "features must be a non-empty list"
    
    return True, "Valid"

def validate_demos_data(data):
    """Validate the entire demos data structure"""
    if "demos" not in data:
        return False, "Missing 'demos' field in data"
    if not isinstance(data["demos"], list):
        return False, "'demos' must be a list"
    
    for i, item in enumerate(data["demos"]):
        is_valid, error = validate_demo_item(item)
        if not is_valid:
            return False, f"Demo {i+1}: {error}"
    
    return True, "Valid"

# Updated path for Astro structure
DEMOS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                         "public", "json", "demos.json")

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
        # Ensure directory exists
        os.makedirs(os.path.dirname(DEMOS_FILE), exist_ok=True)
        # Save the default demos
        with open(DEMOS_FILE, 'w') as f:
            json.dump(default_demos, f, indent=2)
        return default_demos
    except json.JSONDecodeError:
        print("Error: Demos file is corrupted.")
        sys.exit(1)

def save_demos(data):
    """Save demo scenarios to file"""
    # Validate data before saving
    is_valid, error = validate_demos_data(data)
    if not is_valid:
        print(f"Error: Cannot save invalid data - {error}")
        return False
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(DEMOS_FILE), exist_ok=True)
    try:
        with open(DEMOS_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        print("Demo scenarios saved successfully.")
        print("Note: Restart the Astro dev server to see changes in the browser.")
        return True
    except Exception as e:
        print(f"Error saving file: {e}")
        return False

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

def validate_demos_file():
    """Validate the current demos file"""
    try:
        data = load_demos()
        is_valid, error = validate_demos_data(data)
        if is_valid:
            print("✅ Demos file is valid!")
            print(f"Found {len(data['demos'])} demo scenarios.")
        else:
            print(f"❌ Demos file is invalid: {error}")
    except Exception as e:
        print(f"❌ Error validating demos file: {e}")

def print_help():
    """Print help information"""
    print("\nSPADE Astro Demo Manager")
    print("========================")
    print("Commands:")
    print("  list     - List all demo scenarios")
    print("  add      - Add a new demo scenario")
    print("  remove   - Remove a demo scenario")
    print("  edit     - Edit an existing demo scenario")
    print("  validate - Validate the demos file structure")
    print("  help     - Show this help message")
    print("  exit     - Exit the program")
    print()
    print("Note: After making changes, restart the Astro dev server to see updates.")

def main():
    """Main function"""
    print("SPADE Astro Interactive Demo Manager")
    print("====================================")
    
    # Check if we're in the right directory
    if not os.path.exists("astro.config.mjs"):
        print("Error: This script should be run from the repository root directory.")
        print("Current directory:", os.getcwd())
        print("Please navigate to the repository root folder and run this script again.")
        sys.exit(1)
    
    # Create the demos file if it doesn't exist
    load_demos()
    
    while True:
        command = input("\nEnter command (list, add, remove, edit, validate, help, exit): ").strip().lower()
        
        if command == "list":
            list_demos()
        elif command == "add":
            add_demo()
        elif command == "remove":
            remove_demo()
        elif command == "edit":
            edit_demo()
        elif command == "validate":
            validate_demos_file()
        elif command == "help":
            print_help()
        elif command == "exit":
            print("Goodbye!")
            break
        else:
            print("Unknown command. Type 'help' for available commands.")

if __name__ == "__main__":
    main()
