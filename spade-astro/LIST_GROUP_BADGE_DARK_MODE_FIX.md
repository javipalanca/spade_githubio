# List Group and Badge Dark Mode Fix

## Issue

Bootstrap list group components (`list-group`, `list-group-item`) and badge components (`badge`)
were missing proper dark mode styling, causing poor visibility and inconsistent theming when dark
mode was enabled.

## Components Affected

- Bootstrap List Groups: `.list-group`, `.list-group-item`, `.list-group-flush`
- Bootstrap Badges: `.badge` with various background classes (`bg-secondary`, `bg-warning`, etc.)

## Solution Implemented

### List Group Styling

Added comprehensive dark mode support for Bootstrap list group components:

```css
/* Dark mode styles for Bootstrap list groups */
body.dark-mode .list-group {
  background-color: var(--dark-card-bg) !important;
  border-color: var(--dark-border) !important;
}

body.dark-mode .list-group-item {
  background-color: transparent !important;
  color: var(--dark-text) !important;
  border-color: var(--dark-border) !important;
}

body.dark-mode .list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: var(--dark-text) !important;
}

body.dark-mode .list-group-item.active {
  background-color: var(--dark-border) !important;
  border-color: var(--dark-border) !important;
  color: var(--dark-text) !important;
}

body.dark-mode .list-group-flush .list-group-item {
  border-color: var(--dark-border) !important;
}

/* Ensure links in list items are properly styled in dark mode */
body.dark-mode .list-group-item a {
  color: #007bff !important;
}

body.dark-mode .list-group-item a:hover {
  color: #0056b3 !important;
  text-decoration: underline;
}
```

### Badge Styling

Added dark mode support for all Bootstrap badge variants:

```css
/* Dark mode styles for Bootstrap badges */
body.dark-mode .badge.bg-secondary {
  background-color: #6c757d !important;
  color: var(--dark-text) !important;
}

body.dark-mode .badge.bg-warning {
  background-color: #ffc107 !important;
  color: #000 !important;
}

body.dark-mode .badge.bg-primary {
  background-color: #0d6efd !important;
  color: var(--dark-text) !important;
}

body.dark-mode .badge.bg-success {
  background-color: #198754 !important;
  color: var(--dark-text) !important;
}

body.dark-mode .badge.bg-danger {
  background-color: #dc3545 !important;
  color: var(--dark-text) !important;
}

body.dark-mode .badge.bg-info {
  background-color: #0dcaf0 !important;
  color: #000 !important;
}

body.dark-mode .badge.bg-light {
  background-color: var(--dark-card-bg) !important;
  color: var(--dark-text) !important;
  border: 1px solid var(--dark-border);
}

body.dark-mode .badge.bg-dark {
  background-color: #495057 !important;
  color: var(--dark-text) !important;
}
```

## Files Modified

- `/src/styles/global.css` - Added list group and badge dark mode styles

## Specific Elements Fixed

- Documentation links list in the main page (`li.list-group-item.border-0.ps-0`)
- Status badges in the interactive demo section (`span.badge.bg-secondary`, `span.badge.bg-warning`)

## CSS Variables Used

- `var(--dark-bg)`: #121212 - Main dark background
- `var(--dark-card-bg)`: #1e1e1e - Card/container backgrounds
- `var(--dark-text)`: #e0e0e0 - Primary text color
- `var(--dark-text-muted)`: #a0a0a0 - Muted text color
- `var(--dark-border)`: #333 - Border color

## Testing

- ✅ Build completes successfully
- ✅ Dev server runs without errors
- ✅ Dark mode toggle functionality preserved
- ✅ List group items now properly styled in dark mode
- ✅ Badge components maintain proper contrast and visibility

## Result

All Bootstrap list group and badge components now have consistent, accessible dark mode styling that
matches the overall design system of the SPADE landing page.
