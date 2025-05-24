# SPADE Landing Page

This is a modern, responsive landing page for the SPADE (Smart Python Agent Development Environment) project.

## Features

- Modern and responsive design using Bootstrap 5
- Comprehensive information about SPADE's features and advantages
- Code examples, use cases, and comparisons
- FAQ and testimonials sections
- News and updates section
- Plugins and extensions showcase
- Dark mode support with theme persistence
- Multiple logo designs representing SPADE's multi-agent nature
- Interactive agent demo visualizing SPADE concepts

## How to View the Landing Page

Simply run:

```bash
python3 view_landing_page.py
```

This script starts a local web server and opens the landing page in your default browser.

## File Structure

- `landing-page.html`: The main HTML file
- `styles.css`: CSS styles including dark mode support
- `scripts.js`: JavaScript for interactivity and dark mode toggle
- `landing-assets/`: Directory containing logos and images
  - `demos.json`: Configuration for interactive demo scenarios
  - `news.json`: News items shown in the news section
  - `LOGO_SYSTEM.md`: Documentation for logo designs
  - `INTERACTIVE_DEMO.md`: Documentation for the interactive demo

## Management Scripts

- `view_landing_page.py`: Start a local server to view the landing page
- `manage_news.py`: Script to manage news items
- `manage_demos.py`: Script to manage interactive demo scenarios
- `view_landing_page.py`: Python script to serve and view the landing page

## Logo System

The landing page includes several logo variants, each highlighting different aspects of SPADE:

1. **Network-based logos**: Emphasize the multi-agent, connected nature of the platform
2. **Python-inspired logos**: Incorporate Python's blue and yellow colors
3. **Behavior-focused logos**: Highlight SPADE's behavior-based agent model
4. **Dark mode logos**: Optimized for dark backgrounds

See `/landing-assets/LOGO_SYSTEM.md` for detailed information about the logo designs and usage guidelines.

## Customization

You can easily customize this landing page by editing the HTML, CSS, and JavaScript files. The images can be replaced in the `landing-assets/` directory.

### Changing Colors

The color scheme can be customized by editing the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #3498db;  /* Main brand color */
    --secondary-color: #2ecc71; /* Secondary brand color */
    --dark-color: #2c3e50;     /* Dark accents */
    --light-color: #ecf0f1;    /* Light accents */
    
    /* Dark mode variables */
    --dark-bg: #121212;        /* Dark mode background */
    --dark-card-bg: #1e1e1e;   /* Dark mode card background */
    --dark-text: #e0e0e0;      /* Dark mode text */
}
```

## News System

The landing page features a news section that loads content dynamically from a JSON file. To update the news:

1. Edit the `/landing-assets/news.json` file
2. Each news item has the following structure:
   ```json
   {
     "id": 1,
     "title": "News Title",
     "date": "Month DD, YYYY",
     "category": "Category Name",
     "categoryClass": "bg-primary", // Bootstrap color class
     "description": "News description text",
     "image": "path/to/image.png",
     "link": "url-to-full-article"
   }
   ```
3. You can add, remove, or modify news items as needed
4. The news will automatically update on the landing page when the file is changed

Bootstrap color classes for category badges: `bg-primary`, `bg-secondary`, `bg-success`, `bg-danger`, `bg-warning`, `bg-info`, `bg-light`, `bg-dark`.

## Managing News

To help manage news items, a utility script `manage_news.py` is included. This script provides a simple command-line interface to:

- List all current news items
- Add new news items
- Edit existing news items
- Delete news items

To use it, simply run:

```bash
python3 manage_news.py
```

or

```bash
./manage_news.py
```

The script will guide you through the process with interactive prompts.

## Interactive Demo

The landing page includes an interactive demo that visualizes key SPADE concepts:

### Demo Features

- Animated visualization of agent communication and behaviors
- Multiple scenarios showcasing different aspects of SPADE:
  - Basic communication between two agents
  - Agent behaviors (cyclic, one-shot)
  - Complex agent networks with multiple interactions
- Canvas-based animation with responsive design
- Dark mode support

### Managing Demo Scenarios

The demo scenarios can be managed using the `manage_demos.py` script:

```bash
python3 manage_demos.py
```

This interactive script allows you to:
- List all available demo scenarios
- Add new demo scenarios
- Remove existing scenarios
- Edit scenario details

### Demo Configuration

Demo scenarios are stored in `landing-assets/demos.json`. Each scenario defines:

- `id`: Unique identifier for the scenario
- `name`: Display name
- `description`: Brief explanation of what the scenario demonstrates
- `agentTypes`: Types of agents used in the scenario
- `features`: Key SPADE features highlighted by the scenario

To create a custom demo scenario, use the management script or edit the JSON file directly.

## Contact

For more information about SPADE, visit [spade-mas.readthedocs.io](https://spade-mas.readthedocs.io) or the [GitHub repository](https://github.com/javipalanca/spade).
