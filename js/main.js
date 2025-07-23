// Main JavaScript File - Initializes all modules
class PortfolioApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Initialize page loader first
            this.modules.pageLoader = new PageLoader();

            // Initialize theme toggle
            this.modules.themeToggle = new ThemeToggle();

            // Initialize navigation
            this.modules.navigation = new Navigation();

            // Initialize animations
            this.modules.animationController = new AnimationController();

            // Initialize particles (if canvas exists)
            const particlesCanvas = document.getElementById('particles-canvas');
            if (particlesCanvas) {
                this.modules.particleSystem = new ParticleSystem(particlesCanvas);
            }

            // Initialize typing animation (if element exists)
            const typingElement = document.getElementById('typing-text');
            if (typingElement) {
                const typingTexts = [
                    'Full Stack Developer',
                    'AI/ML Engineer',
                    'Robotics Enthusiast',
                    'Problem Solver',
                    'Tech Innovator'
                ];
                this.modules.typingAnimation = new TypingAnimation(typingElement, typingTexts);
            }

            // Initialize projects manager
            this.modules.projectsManager = new ProjectsManager();

            // Initialize form handler (if form exists)
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                this.modules.formHandler = new FormHandler('contact-form');
            }

            // Initialize skills renderer (if skills container exists)
            const skillsContainer = document.getElementById('skills-container');
            if (skillsContainer && typeof SkillsRenderer !== 'undefined') {
                this.modules.skillsRenderer = new SkillsRenderer();
            }

            // Setup additional event listeners
            this.setupGlobalEventListeners();

            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio app:', error);
        }
    }

    setupGlobalEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle visibility change (for performance optimization)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle scroll for performance optimizations
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScrollEnd();
            }, 150);
        });
    }

    handleResize() {
        // Notify modules about resize
        if (this.modules.particleSystem) {
            this.modules.particleSystem.resize();
        }

        // Update custom cursor on mobile/desktop switch
        if (window.innerWidth <= 768) {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.style.display = 'none';
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause animations for performance
            this.pauseAnimations();
        } else {
            // Page is visible - resume animations
            this.resumeAnimations();
        }
    }

    handleScrollEnd() {
        // Trigger any scroll-end specific functionality
        // This can be used for lazy loading or other optimizations
    }

    pauseAnimations() {
        // Pause resource-intensive animations when page is not visible
        if (this.modules.typingAnimation) {
            this.modules.typingAnimation.stop();
        }
    }

    resumeAnimations() {
        // Resume animations when page becomes visible
        if (this.modules.typingAnimation) {
            this.modules.typingAnimation.start();
        }
    }

    // Public API methods
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    navigateToSection(sectionId) {
        if (this.modules.navigation) {
            this.modules.navigation.navigateToSection(sectionId);
        }
    }

    toggleTheme() {
        if (this.modules.themeToggle) {
            this.modules.themeToggle.toggle();
        }
    }

    openProject(projectId) {
        if (this.modules.projectsManager) {
            this.modules.projectsManager.openModal(projectId);
        }
    }
}

// Initialize the app
const portfolioApp = new PortfolioApp();

// Make app globally available for debugging
window.portfolioApp = portfolioApp;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
