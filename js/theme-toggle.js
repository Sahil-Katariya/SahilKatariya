// Theme Toggle System
class ThemeToggle {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.toggleButton = document.getElementById('theme-toggle');
        
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener to toggle button
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggle());
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
        
        // Update toggle button state
        this.updateToggleButton();
    }

    updateToggleButton() {
        if (!this.toggleButton) return;
        
        const sunIcon = this.toggleButton.querySelector('.sun-icon');
        const moonIcon = this.toggleButton.querySelector('.moon-icon');
        
        if (this.currentTheme === 'light') {
            this.toggleButton.setAttribute('aria-label', 'Switch to dark theme');
            if (sunIcon) sunIcon.style.opacity = '1';
            if (moonIcon) moonIcon.style.opacity = '0';
        } else {
            this.toggleButton.setAttribute('aria-label', 'Switch to light theme');
            if (sunIcon) sunIcon.style.opacity = '0';
            if (moonIcon) moonIcon.style.opacity = '1';
        }
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add a subtle animation to the toggle button
        if (this.toggleButton) {
            this.toggleButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.toggleButton.style.transform = 'scale(1)';
            }, 150);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeToggle;
}
