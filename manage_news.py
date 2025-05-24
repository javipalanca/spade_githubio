#!/usr/bin/env python3
"""
Script to manage news items for the SPADE landing page
"""

import json
import os
import sys
from datetime import datetime

NEWS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                         "landing-assets", "news.json")

def load_news():
    """Load the current news items"""
    try:
        with open(NEWS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"news": []}
    except json.JSONDecodeError:
        print("Error: News file is corrupted.")
        sys.exit(1)

def save_news(data):
    """Save news items to file"""
    with open(NEWS_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    print("News saved successfully.")

def list_news():
    """List all news items"""
    data = load_news()
    if not data["news"]:
        print("No news items found.")
        return
    
    print("\n=== Current News Items ===")
    for idx, item in enumerate(data["news"], 1):
        print(f"{idx}. {item['title']} - {item['date']}")
    print()

def add_news():
    """Add a new news item"""
    data = load_news()
    
    # Calculate next ID
    next_id = 1
    if data["news"]:
        next_id = max(item["id"] for item in data["news"]) + 1
    
    # Get user input
    title = input("Title: ")
    date = input("Date (e.g., May 24, 2025) [Today]: ")
    if not date:
        date = datetime.now().strftime("%B %d, %Y")
    
    category = input("Category (e.g., Release, Tutorial, Community): ")
    
    print("\nAvailable category styles:")
    print("1. Primary (blue)")
    print("2. Success (green)")
    print("3. Info (light blue)")
    print("4. Warning (yellow)")
    print("5. Danger (red)")
    print("6. Secondary (gray)")
    
    style_choice = input("Choose style [1]: ") or "1"
    category_class = {
        "1": "bg-primary",
        "2": "bg-success",
        "3": "bg-info",
        "4": "bg-warning",
        "5": "bg-danger",
        "6": "bg-secondary",
    }.get(style_choice, "bg-primary")
    
    description = input("Description: ")
    image = input("Image path (e.g., landing-assets/spade_index.png): ")
    link = input("Link URL [#]: ") or "#"
    
    # Create new item
    new_item = {
        "id": next_id,
        "title": title,
        "date": date,
        "category": category,
        "categoryClass": category_class,
        "description": description,
        "image": image,
        "link": link
    }
    
    # Add to data
    data["news"].insert(0, new_item)  # Add at the beginning
    save_news(data)
    
    print(f"\nAdded new news item: {title}")

def edit_news():
    """Edit an existing news item"""
    data = load_news()
    if not data["news"]:
        print("No news items to edit.")
        return
    
    list_news()
    choice = input("Enter number of news item to edit: ")
    try:
        idx = int(choice) - 1
        if idx < 0 or idx >= len(data["news"]):
            print("Invalid selection.")
            return
    except ValueError:
        print("Please enter a valid number.")
        return
    
    item = data["news"][idx]
    print(f"\nEditing: {item['title']}")
    
    # Get updated information
    title = input(f"Title [{item['title']}]: ") or item['title']
    date = input(f"Date [{item['date']}]: ") or item['date']
    category = input(f"Category [{item['category']}]: ") or item['category']
    
    print("\nCurrent category style:", item['categoryClass'])
    print("Available category styles:")
    print("1. Primary (blue)")
    print("2. Success (green)")
    print("3. Info (light blue)")
    print("4. Warning (yellow)")
    print("5. Danger (red)")
    print("6. Secondary (gray)")
    print("0. Keep current")
    
    style_choice = input("Choose style [0]: ") or "0"
    if style_choice != "0":
        category_class = {
            "1": "bg-primary",
            "2": "bg-success",
            "3": "bg-info",
            "4": "bg-warning",
            "5": "bg-danger",
            "6": "bg-secondary",
        }.get(style_choice, item['categoryClass'])
    else:
        category_class = item['categoryClass']
    
    description = input(f"Description [{item['description']}]: ") or item['description']
    image = input(f"Image path [{item['image']}]: ") or item['image']
    link = input(f"Link URL [{item['link']}]: ") or item['link']
    
    # Update item
    item.update({
        "title": title,
        "date": date,
        "category": category,
        "categoryClass": category_class,
        "description": description,
        "image": image,
        "link": link
    })
    
    save_news(data)
    print(f"\nUpdated news item: {title}")

def delete_news():
    """Delete a news item"""
    data = load_news()
    if not data["news"]:
        print("No news items to delete.")
        return
    
    list_news()
    choice = input("Enter number of news item to delete: ")
    try:
        idx = int(choice) - 1
        if idx < 0 or idx >= len(data["news"]):
            print("Invalid selection.")
            return
    except ValueError:
        print("Please enter a valid number.")
        return
    
    item = data["news"][idx]
    confirm = input(f"Are you sure you want to delete '{item['title']}'? (y/n): ")
    if confirm.lower() not in ('y', 'yes'):
        print("Deletion cancelled.")
        return
    
    data["news"].pop(idx)
    save_news(data)
    print(f"\nDeleted news item: {item['title']}")

def main():
    """Main menu function"""
    while True:
        print("\n=== SPADE News Manager ===")
        print("1. List news items")
        print("2. Add new item")
        print("3. Edit item")
        print("4. Delete item")
        print("5. Exit")
        
        choice = input("\nSelect an option: ")
        
        if choice == "1":
            list_news()
        elif choice == "2":
            add_news()
        elif choice == "3":
            edit_news()
        elif choice == "4":
            delete_news()
        elif choice == "5":
            print("Exiting...")
            break
        else:
            print("Invalid option. Please try again.")

if __name__ == "__main__":
    main()
