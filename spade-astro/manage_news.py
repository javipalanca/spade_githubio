#!/usr/bin/env python3
"""
Script to manage news items for the SPADE Astro landing page
"""

import json
import os
import sys
from datetime import datetime

def validate_news_item(item):
    """Validate a news item structure"""
    required_fields = ["id", "title", "date", "category", "categoryClass", "description", "image", "link"]
    for field in required_fields:
        if field not in item:
            return False, f"Missing required field: {field}"
    
    # Validate types
    if not isinstance(item["id"], int):
        return False, "ID must be an integer"
    if not isinstance(item["title"], str) or not item["title"].strip():
        return False, "Title must be a non-empty string"
    if not isinstance(item["description"], str) or not item["description"].strip():
        return False, "Description must be a non-empty string"
    
    return True, "Valid"

def validate_news_data(data):
    """Validate the entire news data structure"""
    if "news" not in data:
        return False, "Missing 'news' field in data"
    if not isinstance(data["news"], list):
        return False, "'news' must be a list"
    
    for i, item in enumerate(data["news"]):
        is_valid, error = validate_news_item(item)
        if not is_valid:
            return False, f"Item {i+1}: {error}"
    
    return True, "Valid"

# Updated path for Astro structure
NEWS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                         "public", "landing-assets", "news.json")

def load_news():
    """Load the current news items"""
    try:
        with open(NEWS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Create default news structure
        default_news = {"news": []}
        # Ensure directory exists
        os.makedirs(os.path.dirname(NEWS_FILE), exist_ok=True)
        # Save the default news
        with open(NEWS_FILE, 'w') as f:
            json.dump(default_news, f, indent=2)
        return default_news
    except json.JSONDecodeError:
        print("Error: News file is corrupted.")
        sys.exit(1)

def save_news(data):
    """Save news items to file"""
    # Validate data before saving
    is_valid, error = validate_news_data(data)
    if not is_valid:
        print(f"Error: Cannot save invalid data - {error}")
        return False
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(NEWS_FILE), exist_ok=True)
    try:
        with open(NEWS_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        print("News saved successfully.")
        print("Note: Restart the Astro dev server to see changes in the browser.")
        return True
    except Exception as e:
        print(f"Error saving file: {e}")
        return False

def list_news():
    """List all news items"""
    data = load_news()
    if not data["news"]:
        print("No news items found.")
        return
    
    print("\n=== Current News Items ===")
    for idx, item in enumerate(data["news"], 1):
        print(f"{idx}. {item['title']} - {item['date']}")
        print(f"   Category: {item.get('category', 'General')}")
        print(f"   Description: {item['description'][:100]}...")
        print()

def add_news():
    """Add a new news item"""
    data = load_news()
    
    # Calculate next ID
    next_id = 1
    if data["news"]:
        next_id = max(item["id"] for item in data["news"]) + 1
    
    # Get user input
    title = input("Enter news title: ").strip()
    description = input("Enter news description: ").strip()
    
    # Get date (default to today)
    date_input = input("Enter date (YYYY-MM-DD) [today]: ").strip()
    if not date_input:
        date_obj = datetime.now()
        date_str = date_obj.strftime("%B %d, %Y")
    else:
        try:
            date_obj = datetime.strptime(date_input, "%Y-%m-%d")
            date_str = date_obj.strftime("%B %d, %Y")
        except ValueError:
            print("Invalid date format. Using today's date.")
            date_obj = datetime.now()
            date_str = date_obj.strftime("%B %d, %Y")
    
    # Get category
    print("\nAvailable categories:")
    categories = {
        "1": ("Release", "bg-primary"),
        "2": ("Tutorial", "bg-success"),
        "3": ("Community", "bg-info"),
        "4": ("Announcement", "bg-warning"),
        "5": ("Update", "bg-secondary")
    }
    
    for key, (name, _) in categories.items():
        print(f"  {key}. {name}")
    
    category_input = input("Choose category (1-5) [1]: ").strip()
    if category_input not in categories:
        category_input = "1"
    
    category, category_class = categories[category_input]
    
    # Get image (optional)
    print("\nAvailable images in landing-assets/:")
    assets_dir = os.path.join(os.path.dirname(NEWS_FILE))
    if os.path.exists(assets_dir):
        image_files = [f for f in os.listdir(assets_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.svg'))]
        for i, img in enumerate(image_files, 1):
            print(f"  {i}. {img}")
    
    image_input = input("Enter image filename (or leave empty): ").strip()
    if image_input and not image_input.startswith("landing-assets/"):
        image_input = f"landing-assets/{image_input}"
    
    # Get link (optional)
    link = input("Enter link URL (or leave empty for #): ").strip()
    if not link:
        link = "#"
    
    # Create new news item
    new_item = {
        "id": next_id,
        "title": title,
        "date": date_str,
        "category": category,
        "categoryClass": category_class,
        "description": description,
        "link": link
    }
    
    if image_input:
        new_item["image"] = image_input
    
    # Add to data and save
    data["news"].insert(0, new_item)  # Add to beginning for newest first
    save_news(data)
    print(f"News item '{title}' added successfully.")

def remove_news():
    """Remove a news item"""
    data = load_news()
    list_news()
    
    if not data["news"]:
        return
    
    try:
        item_id = int(input("\nEnter the ID of the news item to remove: ").strip())
        
        # Find the news item with the specified ID
        for i, item in enumerate(data["news"]):
            if item["id"] == item_id:
                removed = data["news"].pop(i)
                save_news(data)
                print(f"News item '{removed['title']}' removed successfully.")
                return
        
        print(f"Error: No news item found with ID {item_id}.")
    except (ValueError, IndexError):
        print("Invalid selection. Please enter a valid ID number.")

def edit_news():
    """Edit an existing news item"""
    data = load_news()
    list_news()
    
    if not data["news"]:
        return
    
    try:
        item_id = int(input("\nEnter the ID of the news item to edit: ").strip())
        
        # Find the news item with the specified ID
        for item in data["news"]:
            if item["id"] == item_id:
                print(f"\nEditing news item: {item['title']}")
                
                # Get updated values
                title = input(f"Enter new title [{item['title']}]: ").strip()
                if title:
                    item['title'] = title
                
                desc = input(f"Enter new description [{item['description']}]: ").strip()
                if desc:
                    item['description'] = desc
                
                date_input = input(f"Enter new date (YYYY-MM-DD) [{item['date']}]: ").strip()
                if date_input:
                    try:
                        date_obj = datetime.strptime(date_input, "%Y-%m-%d")
                        item['date'] = date_obj.strftime("%B %d, %Y")
                    except ValueError:
                        print("Invalid date format. Keeping current date.")
                
                link = input(f"Enter new link [{item.get('link', '#')}]: ").strip()
                if link:
                    item['link'] = link
                
                save_news(data)
                print(f"News item '{item['title']}' updated successfully.")
                return
        
        print(f"Error: No news item found with ID {item_id}.")
    except (ValueError, IndexError):
        print("Invalid selection. Please enter a valid ID number.")

def validate_news_file():
    """Validate the current news file"""
    try:
        data = load_news()
        is_valid, error = validate_news_data(data)
        if is_valid:
            print("✅ News file is valid!")
            print(f"Found {len(data['news'])} news items.")
        else:
            print(f"❌ News file is invalid: {error}")
    except Exception as e:
        print(f"❌ Error validating news file: {e}")

def print_help():
    """Print help information"""
    print("\nSPADE Astro News Manager")
    print("========================")
    print("Commands:")
    print("  list     - List all news items")
    print("  add      - Add a new news item")
    print("  remove   - Remove a news item")
    print("  edit     - Edit an existing news item")
    print("  validate - Validate the news file structure")
    print("  help     - Show this help message")
    print("  exit     - Exit the program")
    print()
    print("Note: After making changes, restart the Astro dev server to see updates.")

def main():
    """Main function"""
    print("SPADE Astro News Manager")
    print("========================")
    
    # Check if we're in the right directory
    if not os.path.exists("astro.config.mjs"):
        print("Error: This script should be run from the spade-astro directory.")
        print("Current directory:", os.getcwd())
        print("Please navigate to the spade-astro folder and run this script again.")
        sys.exit(1)
    
    # Create the news file if it doesn't exist
    load_news()
    
    while True:
        command = input("\nEnter command (list, add, remove, edit, validate, help, exit): ").strip().lower()
        
        if command == "list":
            list_news()
        elif command == "add":
            add_news()
        elif command == "remove":
            remove_news()
        elif command == "edit":
            edit_news()
        elif command == "validate":
            validate_news_file()
        elif command == "help":
            print_help()
        elif command == "exit":
            print("Goodbye!")
            break
        else:
            print("Unknown command. Type 'help' for available commands.")

if __name__ == "__main__":
    main()
