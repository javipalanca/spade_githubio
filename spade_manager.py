#!/usr/bin/env python3
"""
SPADE Project Manager
A unified script to manage the SPADE GitHub Pages project.
This script provides easy access to all project management tasks.
"""

import os
import sys
import subprocess
from pathlib import Path

def check_environment():
    """Check if we're in the correct environment"""
    if not os.path.exists("astro.config.mjs"):
        print("❌ Error: This script should be run from the repository root directory.")
        print(f"Current directory: {os.getcwd()}")
        print("Please navigate to the repository root folder and run this script again.")
        return False
    return True

def manage_news():
    """Launch the news management script"""
    print("📰 Launching news manager...")
    try:
        subprocess.run([sys.executable, "manage_news.py"], check=True)
    except subprocess.CalledProcessError:
        print("❌ Error launching news manager.")
    except KeyboardInterrupt:
        print("\n⏹️ News manager closed.")

def manage_demos():
    """Launch the demos management script"""
    print("🎮 Launching demos manager...")
    try:
        subprocess.run([sys.executable, "manage_demos.py"], check=True)
    except subprocess.CalledProcessError:
        print("❌ Error launching demos manager.")
    except KeyboardInterrupt:
        print("\n⏹️ Demos manager closed.")

def backup_data():
    """Launch the data backup utility"""
    print("🔄 Launching data backup utility...")
    try:
        subprocess.run([sys.executable, "backup_data.py"], check=True)
    except subprocess.CalledProcessError:
        print("❌ Error launching backup utility.")
    except KeyboardInterrupt:
        print("\n⏹️ Backup utility closed.")

def build_project():
    """Build the project for production"""
    print("🔨 Building project for production...")
    try:
        subprocess.run(["npm", "run", "build"], check=True)
        print("✅ Project built successfully!")
        print("📁 Build output is in the 'dist' directory.")
    except subprocess.CalledProcessError:
        print("❌ Error building project.")

def preview_build():
    """Preview the production build"""
    print("👀 Starting preview of production build...")
    try:
        subprocess.run(["npm", "run", "preview"], check=True)
    except subprocess.CalledProcessError:
        print("❌ Error starting preview.")
    except KeyboardInterrupt:
        print("\n⏹️ Preview server stopped.")

def install_dependencies():
    """Install or update npm dependencies"""
    print("📦 Installing/updating npm dependencies...")
    try:
        subprocess.run(["npm", "install"], check=True)
        print("✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError:
        print("❌ Error installing dependencies.")

def check_status():
    """Check project status and health"""
    print("🔍 Checking project status...\n")
    
    # Check if node_modules exists
    if os.path.exists("node_modules"):
        print("✅ npm dependencies installed")
    else:
        print("❌ npm dependencies not installed (run 'npm install')")
    
    # Check if JSON files exist and are valid
    json_files = [
        "public/landing-assets/news.json",
        "public/landing-assets/demos.json"
    ]
    
    for json_file in json_files:
        if os.path.exists(json_file):
            try:
                import json
                with open(json_file, 'r') as f:
                    json.load(f)
                print(f"✅ {json_file} exists and is valid")
            except json.JSONDecodeError:
                print(f"❌ {json_file} exists but is corrupted")
        else:
            print(f"⚠️ {json_file} not found (will be created when needed)")
    
    # Check if dist directory exists
    if os.path.exists("dist"):
        print("✅ Production build exists in 'dist' directory")
    else:
        print("ℹ️ No production build found (run build command to create)")
    
    print()

def show_project_info():
    """Show project information"""
    print("📋 SPADE Astro Landing Page Project")
    print("=" * 40)
    print("🌐 Framework: Astro")
    print("📦 Package Manager: npm")
    print("🎨 Styling: CSS with Bootstrap-like utilities")
    print("🔧 TypeScript: Enabled")
    print("📁 Content: JSON-based (news & demos)")
    print("🚀 Deployment: Static site generation")
    print()
    print("📂 Key Directories:")
    print("  src/components/    - Astro components")
    print("  src/pages/         - Page routes")
    print("  src/styles/        - Global styles")
    print("  public/            - Static assets")
    print("  public/landing-assets/ - Content JSON files")
    print()

def print_help():
    """Print help information"""
    print("\n🛠️ SPADE Project Manager")
    print("=" * 40)
    print("Available commands:")
    print()
    print("📊 Project Management:")
    print("  status     - Check project health and status")
    print("  info       - Show project information")
    print("  install    - Install/update npm dependencies")
    print()
    print("📰 Content Management:")
    print("  news       - Manage news items")
    print("  demos      - Manage demo scenarios")
    print("  backup     - Backup data files")
    print()
    print("❓ Help & Info:")
    print("  help       - Show this help message")
    print("  exit       - Exit the manager")
    print()

def main():
    """Main function"""
    print("🎯 SPADE Project Manager")
    print("=" * 30)
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    print("✅ Environment OK")
    print("Type 'help' for available commands.\n")
    
    while True:
        try:
            command = input("🔧 spade-manager> ").strip().lower()
            
            if command == "news":
                manage_news()
            elif command == "demos":
                manage_demos()
            elif command == "backup":
                backup_data()
            elif command == "build":
                build_project()
            elif command == "preview":
                preview_build()
            elif command == "install":
                install_dependencies()
            elif command == "status":
                check_status()
            elif command == "info":
                show_project_info()
            elif command == "help":
                print_help()
            elif command == "exit":
                print("👋 Goodbye!")
                break
            elif command == "":
                continue
            else:
                print(f"❓ Unknown command: '{command}'. Type 'help' for available commands.")
        
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except EOFError:
            print("\n👋 Goodbye!")
            break

if __name__ == "__main__":
    main()
