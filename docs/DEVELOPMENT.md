# Development Guide

This guide covers the development workflow, architecture, and best practices for the Sahil Katariya Portfolio website.

## 🏗️ Architecture Overview

### Modular Design Philosophy

The portfolio follows a modular architecture that separates concerns and promotes maintainability:

- **Components**: Reusable HTML components
- **Styles**: Modular CSS with clear separation of concerns
- **Scripts**: JavaScript modules with specific responsibilities
- **Configuration**: JSON-based configuration for easy customization
- **Build System**: Custom build process for development and production

### File Organization

```
├── components/          # HTML Components
│   ├── header.html     # Navigation and branding
│   ├── hero.html       # Landing section with animations
│   ├── about.html      # Personal information and skills
│   ├── projects.html   # Portfolio showcase
│   ├── contact.html    # Contact form and information
│   └── loader.html     # Page loading animation
│
├── css/                # Modular Stylesheets
│   ├── base.css        # CSS variables, reset, global styles
│   ├── layout.css      # Grid systems, structural layouts
│   ├── components.css  # Reusable UI components
│   ├── navigation.css  # Navigation-specific styles
│   ├── hero.css        # Hero section animations and styles
│   ├── loader.css      # Loading animation styles
│   ├── modal.css       # Modal and overlay styles
│   └── main.css        # Main CSS file with imports
│
├── js/                 # JavaScript Modules
│   ├── particles.js    # Particle animation system
│   ├── typing-animation.js # Typewriter effect
│   ├── theme-toggle.js # Dark/light theme management
│   ├── navigation.js   # Navigation and scroll behavior
│   ├── form-handler.js # Contact form validation and submission
│   ├── animations.js   # Scroll animations and observers
│   ├── projects.js     # Project display and modal management
│   ├── performance.js  # Performance monitoring and optimization
│   ├── asset-loader.js # Asset loading and optimization
│   ├── config-loader.js # Configuration management
│   └── main.js         # Application initialization
│
├── config/             # Configuration Files
│   ├── site.json       # Site metadata and personal information
│   ├── skills.json     # Skills, tools, and expertise data
│   ├── projects.json   # Portfolio projects data
│   ├── theme.json      # Theme colors and styling configuration
│   └── assets.json     # Asset management configuration
```

## 🛠️ Development Workflow

### Setting Up Development Environment

1. **Prerequisites**
   ```bash
   # Node.js 14+ required
   node --version
   npm --version
   ```

2. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd portfolio
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # Opens http://localhost:3000
   ```

### Development Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:port         # Start on custom port (8080)

# Building
npm run build            # Build for production
npm run clean            # Clean build directory

# Testing
npm run test             # Run automated tests
npm run serve            # Serve current directory
npm run serve:dist       # Serve production build

# Utilities
npm start                # Alias for npm run dev
```

### Development Server Features

- **Component Loading**: Automatically injects HTML components
- **Live Reload**: Refreshes on file changes (manual refresh needed)
- **Error Handling**: Displays helpful error messages
- **Asset Serving**: Serves all static assets correctly

## 🎨 Styling Guidelines

### CSS Architecture

The CSS follows a modular approach with clear separation:

1. **base.css**: Foundation styles
   - CSS custom properties (variables)
   - Reset and normalize styles
   - Global typography
   - Utility classes

2. **layout.css**: Structural styles
   - Grid systems
   - Flexbox layouts
   - Container styles
   - Responsive breakpoints

3. **components.css**: UI components
   - Buttons and form elements
   - Cards and containers
   - Interactive elements
   - Reusable patterns

4. **Feature-specific CSS**: Dedicated files for major sections
   - navigation.css
   - hero.css
   - modal.css
   - loader.css

### CSS Custom Properties

The theme system uses CSS custom properties for easy customization:

```css
:root {
  /* Colors */
  --bg-primary: #0a0a0a;
  --text-primary: #ffffff;
  --accent-primary: #6366f1;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 1rem;
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
}
```

### Responsive Design

Mobile-first approach with breakpoints:

```css
/* Mobile first */
.element { /* Mobile styles */ }

/* Tablet and up */
@media (min-width: 768px) {
  .element { /* Tablet styles */ }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element { /* Desktop styles */ }
}
```

## ⚡ JavaScript Architecture

### Module System

Each JavaScript file is a self-contained module with a specific responsibility:

```javascript
// Example module structure
class ModuleName {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialization logic
    }
    
    // Public methods
    publicMethod() {
        // Implementation
    }
    
    // Private methods
    _privateMethod() {
        // Implementation
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModuleName;
}
```

### Event System

Custom events for inter-module communication:

```javascript
// Dispatch custom event
window.dispatchEvent(new CustomEvent('themeChanged', {
    detail: { theme: 'dark' }
}));

// Listen for custom event
window.addEventListener('themeChanged', (e) => {
    console.log('Theme changed to:', e.detail.theme);
});
```

### Performance Considerations

- **Intersection Observer**: For scroll animations and lazy loading
- **RequestAnimationFrame**: For smooth animations
- **Debouncing**: For scroll and resize events
- **Lazy Loading**: For images and non-critical resources

## 🔧 Configuration System

### Configuration Files

All content and settings are managed through JSON configuration files:

1. **site.json**: Site metadata, personal information, contact details
2. **skills.json**: Skills, tools, expertise levels
3. **projects.json**: Portfolio projects with detailed information
4. **theme.json**: Colors, typography, spacing, animations
5. **assets.json**: Asset management and optimization settings

### Configuration Loading

```javascript
// Load configuration
await configLoader.loadAll();

// Access configuration
const siteConfig = configLoader.getSiteConfig();
const projects = configLoader.getProjectsByCategory('web');

// Update configuration
configLoader.set('site.title', 'New Title');
```

### Adding New Configuration

1. Create or update JSON file in `config/`
2. Update `config-loader.js` if needed
3. Use configuration in components

## 🧪 Testing Strategy

### Automated Testing

The test suite covers:
- Configuration loading
- Theme toggle functionality
- Navigation behavior
- Form validation
- Animation initialization
- Performance metrics
- Accessibility compliance
- SEO elements

### Manual Testing

Use the comprehensive checklist in `test/TESTING_CHECKLIST.md`:
- Functionality testing
- Responsive design
- Browser compatibility
- Performance validation
- Accessibility audit

### Testing Workflow

```bash
# Run automated tests
npm run test

# Open test runner
open test/test-runner.html

# Manual testing
# Follow test/TESTING_CHECKLIST.md
```

## 🚀 Build System

### Build Process

The custom build system:

1. **CSS Compilation**
   - Combines modular CSS files
   - Removes comments and whitespace
   - Outputs minified CSS

2. **JavaScript Compilation**
   - Combines JavaScript modules
   - Preserves functionality
   - Removes comments and minifies

3. **HTML Processing**
   - Injects component HTML
   - Updates asset references
   - Optimizes structure

4. **Asset Optimization**
   - Copies and optimizes assets
   - Maintains directory structure

### Build Configuration

Customize the build in `build.js`:

```javascript
const config = {
    srcDir: '.',
    distDir: 'dist',
    cssFiles: [/* CSS files to combine */],
    jsFiles: [/* JS files to combine */],
    htmlComponents: [/* Components to inject */]
};
```

## 📱 Progressive Web App

### PWA Features

- **Service Worker**: Caching and offline functionality
- **Web Manifest**: App-like installation
- **Responsive Design**: Works on all devices
- **Performance**: Fast loading and smooth interactions

### Service Worker

The service worker provides:
- Asset caching for offline access
- Background sync for form submissions
- Push notifications (optional)
- Performance optimizations

## 🔍 SEO and Performance

### SEO Optimization

- **Meta Tags**: Comprehensive meta information
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine directives
- **Open Graph**: Social media optimization

### Performance Optimization

- **Lazy Loading**: Images and content
- **Code Splitting**: Modular loading
- **Compression**: Gzip/Brotli compression
- **Caching**: Aggressive caching strategies
- **Critical CSS**: Above-the-fold optimization

## 🤝 Contributing Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Follow naming conventions
- Add comments for complex logic
- Keep functions small and focused

### Git Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

### Adding Features

1. **Plan the feature**
   - Define requirements
   - Consider impact on existing code

2. **Implement**
   - Follow modular architecture
   - Add appropriate tests
   - Update documentation

3. **Test**
   - Run automated tests
   - Perform manual testing
   - Check performance impact

4. **Document**
   - Update relevant documentation
   - Add code comments
   - Update configuration if needed

## 📞 Support and Resources

### Getting Help

- Check existing documentation
- Review test results for clues
- Use browser developer tools
- Check console for errors

### Useful Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

### Contact

For development questions:
- Email: sahilkatariya2609@gmail.com
- Create GitHub issue for bugs
- Discussion for feature requests

---

**Happy Coding! 💻**
