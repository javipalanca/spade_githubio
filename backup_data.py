#!/usr/bin/env python3
"""
SPADE Data Backup Utility
Creates backups of the content data files (news.json and demos.json)
"""

import json
import os
import sys
import shutil
from datetime import datetime
from pathlib import Path

def create_backup():
    """Create a backup of the data files"""
    
    # Check if we're in the right directory
    if not os.path.exists("astro.config.mjs"):
        print("❌ Error: This script should be run from the repository root directory.")
        print(f"Current directory: {os.getcwd()}")
        return False
    
    # Create backup directory
    backup_dir = Path("backups")
    backup_dir.mkdir(exist_ok=True)
    
    # Generate timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Files to backup
    data_files = [
        "public/json/news.json",
        "public/json/demos.json"
    ]
    
    backup_count = 0
    
    for file_path in data_files:
        if os.path.exists(file_path):
            # Create backup filename
            file_name = Path(file_path).name
            backup_name = f"{timestamp}_{file_name}"
            backup_path = backup_dir / backup_name
            
            try:
                # Copy file
                shutil.copy2(file_path, backup_path)
                print(f"✅ Backed up {file_path} → {backup_path}")
                backup_count += 1
            except Exception as e:
                print(f"❌ Failed to backup {file_path}: {e}")
        else:
            print(f"⚠️ File not found: {file_path}")
    
    if backup_count > 0:
        print(f"\n🎉 Successfully created {backup_count} backup(s) in the 'backups' directory")
        return True
    else:
        print("\n❌ No files were backed up")
        return False

def restore_backup():
    """Restore from a backup"""
    backup_dir = Path("backups")
    
    if not backup_dir.exists():
        print("❌ No backup directory found")
        return False
    
    # List available backups
    backup_files = list(backup_dir.glob("*.json"))
    if not backup_files:
        print("❌ No backup files found")
        return False
    
    print("\n📂 Available backups:")
    print("=" * 40)
    
    # Group by timestamp
    backups_by_time = {}
    for backup_file in backup_files:
        # Extract timestamp from filename
        name_parts = backup_file.name.split("_")
        if len(name_parts) >= 3:
            timestamp = f"{name_parts[0]}_{name_parts[1]}"
            if timestamp not in backups_by_time:
                backups_by_time[timestamp] = []
            backups_by_time[timestamp].append(backup_file)
    
    # Display grouped backups
    sorted_timestamps = sorted(backups_by_time.keys(), reverse=True)
    for i, timestamp in enumerate(sorted_timestamps, 1):
        # Parse timestamp for display
        try:
            dt = datetime.strptime(timestamp, "%Y%m%d_%H%M%S")
            formatted_time = dt.strftime("%Y-%m-%d %H:%M:%S")
            print(f"{i}. {formatted_time}")
            for backup_file in backups_by_time[timestamp]:
                file_type = backup_file.name.split("_", 2)[-1]
                print(f"   └── {file_type}")
        except ValueError:
            print(f"{i}. {timestamp} (malformed)")
    
    print("\n0. Cancel")
    
    # Get user choice
    try:
        choice = int(input("\nSelect backup to restore: "))
        if choice == 0:
            print("Restore cancelled")
            return False
        
        if choice < 1 or choice > len(sorted_timestamps):
            print("❌ Invalid selection")
            return False
        
        selected_timestamp = sorted_timestamps[choice - 1]
        selected_files = backups_by_time[selected_timestamp]
        
        # Confirm restore
        print(f"\n⚠️ This will restore the following files:")
        for backup_file in selected_files:
            file_type = backup_file.name.split("_", 2)[-1]
            target_path = f"public/json/{file_type}"
            print(f"   {target_path}")
        
        confirm = input("\nAre you sure? (y/N): ").strip().lower()
        if confirm not in ['y', 'yes']:
            print("Restore cancelled")
            return False
        
        # Perform restore
        restored_count = 0
        for backup_file in selected_files:
            file_type = backup_file.name.split("_", 2)[-1]
            target_path = f"public/json/{file_type}"
            
            try:
                # Ensure target directory exists
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                
                # Copy backup to target location
                shutil.copy2(backup_file, target_path)
                print(f"✅ Restored {backup_file.name} → {target_path}")
                restored_count += 1
            except Exception as e:
                print(f"❌ Failed to restore {backup_file.name}: {e}")
        
        if restored_count > 0:
            print(f"\n🎉 Successfully restored {restored_count} file(s)")
            print("⚠️ Note: Restart the Astro dev server to see changes")
            return True
        else:
            print("\n❌ No files were restored")
            return False
        
    except ValueError:
        print("❌ Please enter a valid number")
        return False

def list_backups():
    """List all available backups"""
    backup_dir = Path("backups")
    
    if not backup_dir.exists():
        print("📂 No backup directory found")
        return
    
    backup_files = list(backup_dir.glob("*.json"))
    if not backup_files:
        print("📂 No backup files found")
        return
    
    print(f"\n📂 Found {len(backup_files)} backup files:")
    print("=" * 50)
    
    # Group by timestamp and sort
    backups_by_time = {}
    for backup_file in backup_files:
        name_parts = backup_file.name.split("_")
        if len(name_parts) >= 3:
            timestamp = f"{name_parts[0]}_{name_parts[1]}"
            if timestamp not in backups_by_time:
                backups_by_time[timestamp] = []
            backups_by_time[timestamp].append(backup_file)
    
    # Display
    for timestamp in sorted(backups_by_time.keys(), reverse=True):
        try:
            dt = datetime.strptime(timestamp, "%Y%m%d_%H%M%S")
            formatted_time = dt.strftime("%Y-%m-%d %H:%M:%S")
            print(f"\n📅 {formatted_time}")
            
            for backup_file in backups_by_time[timestamp]:
                file_type = backup_file.name.split("_", 2)[-1]
                file_size = backup_file.stat().st_size
                print(f"   📄 {file_type} ({file_size} bytes)")
        except ValueError:
            print(f"\n📅 {timestamp} (malformed timestamp)")

def cleanup_old_backups():
    """Remove backups older than 30 days"""
    backup_dir = Path("backups")
    
    if not backup_dir.exists():
        print("📂 No backup directory found")
        return
    
    cutoff_date = datetime.now().timestamp() - (30 * 24 * 60 * 60)  # 30 days ago
    removed_count = 0
    
    for backup_file in backup_dir.glob("*.json"):
        if backup_file.stat().st_mtime < cutoff_date:
            try:
                backup_file.unlink()
                print(f"🗑️ Removed old backup: {backup_file.name}")
                removed_count += 1
            except Exception as e:
                print(f"❌ Failed to remove {backup_file.name}: {e}")
    
    if removed_count > 0:
        print(f"\n🧹 Cleaned up {removed_count} old backup(s)")
    else:
        print("\n✨ No old backups to clean up")

def main():
    """Main function"""
    print("🔄 SPADE Data Backup Utility")
    print("=" * 30)
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == "create":
            create_backup()
        elif command == "restore":
            restore_backup()
        elif command == "list":
            list_backups()
        elif command == "cleanup":
            cleanup_old_backups()
        else:
            print(f"❓ Unknown command: {command}")
            print("Available commands: create, restore, list, cleanup")
        return
    
    # Interactive mode
    while True:
        print("\nAvailable commands:")
        print("1. Create backup")
        print("2. Restore backup")
        print("3. List backups")
        print("4. Cleanup old backups")
        print("5. Exit")
        
        try:
            choice = input("\nSelect option (1-5): ").strip()
            
            if choice == "1":
                create_backup()
            elif choice == "2":
                restore_backup()
            elif choice == "3":
                list_backups()
            elif choice == "4":
                cleanup_old_backups()
            elif choice == "5":
                print("👋 Goodbye!")
                break
            else:
                print("❓ Invalid option. Please choose 1-5.")
        
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except EOFError:
            print("\n👋 Goodbye!")
            break

if __name__ == "__main__":
    main()
