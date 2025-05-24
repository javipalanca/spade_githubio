# SPADE Python Management Scripts

This directory contains several Python scripts to help manage the SPADE Astro landing page project.
These scripts provide an easy way to manage content, start the development server, and maintain the
project.

## 🚀 Quick Start

The main entry point is the **SPADE Project Manager**:

```bash
python3 spade_manager.py
```

This launches an interactive menu with all available commands.

## 📁 Available Scripts

### 1. `spade_manager.py` - Main Project Manager

**The central hub for all project management tasks.**

```bash
python3 spade_manager.py
```

**Available commands:**

- `status` - Check project health and status
- `info` - Show project information
- `install` - Install/update npm dependencies
- `news` - Manage news items
- `demos` - Manage demo scenarios
- `backup` - Backup data files
- `help` - Show help message
- `exit` - Exit the manager

### 2. `manage_news.py` - News Content Manager

**Manage news items for the landing page.**

```bash
python3 manage_news.py
```

**Available commands:**

- `list` - List all news items
- `add` - Add a new news item
- `remove` - Remove a news item
- `edit` - Edit an existing news item
- `validate` - Validate the news file structure
- `images` - List available images in landing-assets
- `upload` - Upload a new image for news items
- `help` - Show help message
- `exit` - Exit the manager

**News Item Structure:**

```json
{
  "id": 1,
  "title": "SPADE 3.3.2 Released",
  "date": "May 24, 2025",
  "category": "Release",
  "categoryClass": "bg-primary",
  "description": "New features and bug fixes...",
  "image": "landing-assets/spade_index.png",
  "link": "https://github.com/javipalanca/spade"
}
```

### 3. `manage_demos.py` - Demo Scenarios Manager

**Manage interactive demo scenarios for the landing page.**

```bash
python3 manage_demos.py
```

**Available commands:**

- `list` - List all demo scenarios
- `add` - Add a new demo scenario
- `remove` - Remove a demo scenario
- `edit` - Edit an existing demo scenario
- `validate` - Validate the demos file structure
- `help` - Show help message
- `exit` - Exit the manager

**Demo Item Structure:**

```json
{
  "id": "simple",
  "name": "Basic Communication",
  "description": "A simple demonstration of two agents exchanging messages.",
  "agentTypes": ["sender", "receiver"],
  "features": ["message-passing", "xmpp"]
}
```

## 📂 Data Files

All content is stored in JSON files under `public/landing-assets/`:

- `news.json` - News items displayed in the News section
- `demos.json` - Demo scenarios for the Interactive Demo section

### Data Validation

All scripts include built-in validation to ensure data integrity:

- ✅ **Structure validation** - Ensures all required fields are present
- ✅ **Type checking** - Validates data types (strings, numbers, arrays)
- ✅ **Content validation** - Ensures non-empty required fields
- ✅ **JSON format validation** - Checks for valid JSON syntax

## 🔧 Development Workflow

### Starting Development

```bash
# Start the development server using npm
npm run dev

# Or directly with Astro
npm run start
```

### Adding News Items

```bash
# Option 1: Through project manager
python3 spade_manager.py
# Then type: news

# Option 2: Direct script
python3 manage_news.py
```

### Managing Demo Scenarios

```bash
# Option 1: Through project manager
python3 spade_manager.py
# Then type: demos

# Option 2: Direct script
python3 manage_demos.py
```

### Building for Production

```bash
python3 spade_manager.py
# Then type: build
```

## 🛠️ Environment Requirements

- **Python 3.6+**
- **Node.js 16+**
- **npm**

### Devcontainer Support

All scripts automatically detect devcontainer environments and adjust accordingly:

- ✅ Adds `--host` flag to Astro dev server
- ✅ Uses environment variables for browser detection
- ✅ Handles network limitations gracefully

## 🎯 Features

### Smart Environment Detection

- Automatically detects if running in a devcontainer
- Configures server settings appropriately
- Handles browser opening in various environments

### Data Integrity

- Validates JSON structure before saving
- Prevents corruption of content files
- Provides clear error messages

### User-Friendly Interface

- Interactive menu system
- Clear command descriptions
- Helpful error messages
- Progress indicators

### Seamless Integration

- Works with existing Astro build system
- Preserves all Astro features and capabilities
- No conflicts with standard npm commands

## 📋 Troubleshooting

### Common Issues

**Script says "wrong directory":**

```bash
cd /workspaces/spade_githubio/spade-astro
python3 spade_manager.py
```

**Node.js/npm not found:**

```bash
# Check if installed
node --version
npm --version

# If not installed, the script will show installation instructions
```

**Permission errors:**

```bash
chmod +x *.py
```

**JSON validation errors:**

```bash
# Use the validate command to check files
python3 manage_news.py
# Then type: validate
```

### Development Server Issues

**Server won't start:**

1. Check if dependencies are installed: `npm install`
2. Check if port 4321 is free
3. Try the project manager: `python3 spade_manager.py` → `dev`

**Browser won't open automatically:**

- This is normal in devcontainers
- Manually open: `http://localhost:4321`
- In devcontainers, the port should be forwarded automatically

## 🚀 Advanced Usage

### Command Line Arguments

Most scripts support direct command execution:

```bash
# Check project status
echo "status" | python3 spade_manager.py

# List news items
echo "list" | python3 manage_news.py

# Validate demos
echo "validate" | python3 manage_demos.py
```

### Automation

Scripts can be integrated into CI/CD pipelines:

```bash
# Validate all content files
python3 -c "
import sys
sys.path.append('.')
from manage_news import validate_news_file
from manage_demos import validate_demos_file
validate_news_file()
validate_demos_file()
"
```

## 📝 Contributing

When modifying these scripts:

1. **Maintain backward compatibility** with existing JSON structures
2. **Add validation** for any new fields or data types
3. **Update help text** and documentation
4. **Test in both local and devcontainer environments**
5. **Follow the existing coding style** and patterns

## 🔗 Related Files

- `astro.config.mjs` - Astro configuration
- `package.json` - npm dependencies and scripts
- `public/landing-assets/` - Content data files
- `src/components/` - Astro components that consume the data
