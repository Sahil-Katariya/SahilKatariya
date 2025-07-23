# Build System Documentation

## Overview

This portfolio uses a custom, lightweight build system that combines modular CSS and JavaScript files into optimized production bundles while maintaining a clean development experience.

## Architecture

### Development Structure
```
├── components/          # HTML components
│   ├── header.html
│   ├── hero.html
│   ├── about.html
│   ├── projects.html
│   ├── contact.html
│   └── loader.html
├── css/                 # Modular CSS files
│   ├── base.css        # Variables, reset, global styles
│   ├── layout.css      # Grid, flexbox, structural layouts
│   ├── components.css  # Buttons, cards, forms, UI elements
│   ├── navigation.css  # Navigation and menu styles
│   ├── hero.css        # Hero section specific styles
│   ├── loader.css      # Page loader styles
│   ├── modal.css       # Modal and overlay styles
│   └── main.css        # Main CSS file with imports
├── js/                  # Modular JavaScript files
│   ├── particles.js    # Particle animation system
│   ├── typing-animation.js # Typing effect
│   ├── theme-toggle.js # Dark/light theme switching
│   ├── navigation.js   # Navigation and scrolling
│   ├── form-handler.js # Contact form handling
│   ├── animations.js   # Scroll animations and effects
│   ├── projects.js     # Projects display and modal
│   └── main.js         # Main app initialization
├── assets/              # Static assets
│   ├── images/
│   └── icons/
├── config/              # Configuration files
├── build.js             # Build system
├── dev-server.js        # Development server
├── index-dev.html       # Development HTML template
└── package.json         # Project configuration
```

### Production Structure (dist/)
```
dist/
├── index.html          # Optimized HTML with inlined components
├── styles.min.css      # Combined and minified CSS
├── script.min.js       # Combined and minified JavaScript
├── favicon.ico
├── favicon.png
└── assets/             # Copied asset files
```

## Build Commands

### Development
```bash
# Start development server with component loading
npm run dev

# Start development server on custom port
npm run dev:port

# Alternative: Use any static server
npm run serve
```

### Production Build
```bash
# Build optimized production files
npm run build

# Serve production build
npm run serve:dist

# Clean build directory
npm run clean
```

### Deployment
```bash
# Build and deploy (customize deploy script)
npm run deploy
```

## Build Process

### 1. CSS Compilation
- Combines all modular CSS files in order
- Removes comments and unnecessary whitespace
- Outputs `styles.min.css`

### 2. JavaScript Compilation
- Combines all modular JavaScript files
- Preserves module structure for debugging
- Removes comments and minifies
- Outputs `script.min.js`

### 3. HTML Processing
- Inlines all component HTML files
- Updates asset references to minified versions
- Removes comments and optimizes structure
- Outputs `index.html`

### 4. Asset Copying
- Copies favicon and static assets
- Maintains directory structure
- Optimizes for production serving

## Development Features

### Component System
- Modular HTML components for maintainability
- Automatic component injection during development
- Hot-reloading for rapid development

### CSS Architecture
- CSS custom properties for theming
- Modular stylesheets for organization
- Import-based development, concatenated for production

### JavaScript Modules
- Class-based modular architecture
- Clear separation of concerns
- Maintained functionality across build process

### Development Server
- Automatic component loading
- Live reload capability
- Error handling and debugging

## Customization

### Adding New Components
1. Create component HTML file in `components/`
2. Add component placeholder to `index-dev.html`
3. Update build configuration in `build.js`

### Adding New CSS Modules
1. Create CSS file in `css/`
2. Add import to `css/main.css`
3. Update build configuration if needed

### Adding New JavaScript Modules
1. Create JS file in `js/`
2. Follow existing class-based pattern
3. Initialize in `js/main.js`
4. Update build configuration

## Performance Optimizations

### CSS
- Removes comments and whitespace
- Combines multiple files to reduce HTTP requests
- Maintains CSS custom properties for theming

### JavaScript
- Combines modules while preserving functionality
- Removes comments and unnecessary whitespace
- Maintains class structure for debugging

### HTML
- Inlines components to reduce HTTP requests
- Removes comments and optimizes structure
- Updates asset references for caching

## Browser Support

- Modern browsers (ES6+ support)
- CSS Grid and Flexbox support
- CSS Custom Properties support
- Intersection Observer API support

## Future Enhancements

- [ ] CSS autoprefixing
- [ ] JavaScript transpilation for older browsers
- [ ] Image optimization pipeline
- [ ] CSS and JS source maps
- [ ] Bundle analysis and optimization
- [ ] Progressive Web App features
- [ ] Service worker for caching

## Troubleshooting

### Build Fails
- Check file paths in build configuration
- Ensure all referenced files exist
- Check Node.js version (requires 14+)

### Development Server Issues
- Ensure port is available
- Check file permissions
- Verify component file paths

### Missing Components
- Check component file exists
- Verify placeholder in HTML template
- Check build configuration includes component
