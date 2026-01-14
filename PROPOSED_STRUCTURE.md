# Proposed Project Structure

This document outlines a cleaner folder structure to organize the Tonic website.

## Current Concerns
- **Root Clutter**: Too many HTML, JS, and asset files in the root directory.
- **Scattered Assets**: Javascript and CSS files are mixed with HTML.
- **Inconsistent Naming**: `index` vs `intro` versions (e.g., `intro0.html`, `intro9.html`).

## Suggested Structure

### 1. Assets Directory
Move all media and static resources into an `assets` folder.
```
/assets
  /images
  /audio
  /video
  /fonts (if any)
```

### 2. Scripts and Styles
Consolidate all code into dedicated directories.
```
/js
  layout.js
  nav.js
  campus.js
  kript.js
  ...
/css
  style.css
  custom.css
  ...
```

### 3. Pages / Features
Group related HTML files into subdirectories if they represent distinct features.
```
/campus
  campus.html
  dept-body.html
  ...
/intro
  intro.html
  intro0.html ... intro9.html
```

## Implementation Plan
1. **Backup**: Ensure Git is initialized and everything is committed.
2. **Move**: Move files to their new locations.
3. **Update Links**: Use "Find and Replace" to update references in HTML files:
   - `src="js/..."`
   - `href="css/..."`
   - `src="assets/images/..."`

> **Note**: This restructuring will require updating file paths in your HTML files.
