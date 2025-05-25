# SPADE Astro Project - Python Scripts Documentation

This document provides detailed information about the Python scripts used for managing and
maintaining the SPADE Astro project.

## 🐍 Python Management Scripts

The project includes several Python scripts that help automate common management tasks.

### Scripts Overview

| Script Name        | Description                    | Purpose                                         |
| ------------------ | ------------------------------ | ----------------------------------------------- |
| `spade_manager.py` | Main project management script | Central interface for all management operations |
| `manage_news.py`   | News content management        | Add, edit, delete news entries in news.json     |
| `manage_demos.py`  | Demo scenarios management      | Configure and update interactive demos          |
| `backup_data.py`   | Data backup utility            | Create automatic backups of JSON data files     |

## 📋 Script Details

### spade_manager.py

This is the main entry point for project management. It provides a command-line interface to access
all other management features.

```bash
python3 spade_manager.py
```

#### Features:

- **News Management**: Interface to `manage_news.py`
- **Demo Management**: Interface to `manage_demos.py`
- **Backup Operations**: Trigger data backups
- **Project Status**: Check the state of the project
- **Dependency Management**: Install/update project dependencies

### manage_news.py

This script manages the news content displayed on the landing page.

```bash
python3 manage_news.py
```

#### Features:

- **Add News**: Create new news entries
- **Edit News**: Modify existing news entries
- **Delete News**: Remove outdated news
- **List News**: View all current news entries
- **Export/Import**: Backup and restore news data

### manage_demos.py

This script configures the interactive agent demonstration scenarios.

```bash
python3 manage_demos.py
```

#### Features:

- **Configure Scenarios**: Set up different agent demonstration scenarios
- **Edit Demos**: Modify existing demos
- **Preview**: Test demo configurations
- **Export/Import**: Backup and restore demo configurations

### backup_data.py

This utility script creates automatic backups of critical data files.

```bash
python3 backup_data.py
```

#### Features:

- **Automatic Backups**: Create timestamped backups of JSON data
- **Restore**: Restore from previous backups
- **Cleanup**: Manage backup history and remove old backups

## 📊 Project Architecture

The project has been refactored to improve maintainability:

- **Separation of Concerns**: UI scripts (`scripts.js`) are separated from demo functionality
  (`demos.js`)
- **Component-Based Architecture**: Astro components for better organization
- **Data-Driven**: Content managed through JSON files that can be updated via Python scripts

### JavaScript Architecture

The JavaScript code has been organized as follows:

- `scripts.js`: General UI functionality (dark mode, navigation, code examples)
- `demos.js`: Interactive agent demonstration code (completely separated from UI code)
- `prism-init.js`: Code syntax highlighting initialization

## 🔄 Workflow Integration

The Python scripts are designed to integrate with the development workflow:

1. Use `spade_manager.py` for day-to-day management tasks
2. Any content changes are automatically reflected in the development server
3. Changes to demo scenarios or news items don't require modifying HTML/JS directly
4. Automatic backups ensure data safety

## 🧩 Extending the Scripts

To add new management features:

1. Add new functionality to the appropriate script
2. Update the main `spade_manager.py` to include the new feature
3. Document the changes in this file

## 🚀 Best Practices

- Always run `backup_data.py` before making significant changes
- Use the Python scripts instead of manually editing JSON files
- Test changes in the development environment before deploying
- Keep script documentation updated when adding new features
