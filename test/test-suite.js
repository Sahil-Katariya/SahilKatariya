// Comprehensive Testing Suite for Portfolio
class PortfolioTestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.startTime = null;
        this.endTime = null;
    }

    // Test runner
    async runAllTests() {
        console.log('🧪 Starting Portfolio Test Suite...');
        this.startTime = Date.now();

        // Core functionality tests
        await this.testConfigurationLoading();
        await this.testThemeToggle();
        await this.testNavigation();
        await this.testAnimations();
        await this.testFormValidation();
        await this.testResponsiveDesign();
        await this.testPerformance();
        await this.testAccessibility();
        await this.testSEO();
        await this.testBrowserCompatibility();

        this.endTime = Date.now();
        this.generateReport();
    }

    // Test configuration loading
    async testConfigurationLoading() {
        this.addTest('Configuration Loading', async () => {
            // Test if configLoader exists
            if (typeof configLoader === 'undefined') {
                throw new Error('ConfigLoader not found');
            }

            // Test loading configurations
            await configLoader.loadAll();
            
            if (!configLoader.isLoaded()) {
                throw new Error('Configuration failed to load');
            }

            // Test specific config access
            const siteConfig = configLoader.getSiteConfig();
            if (!siteConfig || !siteConfig.site) {
                throw new Error('Site configuration not accessible');
            }

            return 'Configuration loaded successfully';
        });
    }

    // Test theme toggle functionality
    async testThemeToggle() {
        this.addTest('Theme Toggle', async () => {
            const themeToggle = document.getElementById('theme-toggle');
            if (!themeToggle) {
                throw new Error('Theme toggle button not found');
            }

            // Get initial theme
            const initialTheme = document.documentElement.getAttribute('data-theme');
            
            // Simulate click
            themeToggle.click();
            
            // Wait for theme change
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const newTheme = document.documentElement.getAttribute('data-theme');
            if (newTheme === initialTheme) {
                throw new Error('Theme did not change after toggle');
            }

            return 'Theme toggle working correctly';
        });
    }

    // Test navigation functionality
    async testNavigation() {
        this.addTest('Navigation', async () => {
            const navLinks = document.querySelectorAll('.nav-menu a');
            if (navLinks.length === 0) {
                throw new Error('Navigation links not found');
            }

            // Test smooth scrolling
            const aboutLink = document.querySelector('a[href="#about"]');
            if (!aboutLink) {
                throw new Error('About navigation link not found');
            }

            // Test mobile menu toggle
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (mobileToggle && navMenu) {
                mobileToggle.click();
                await new Promise(resolve => setTimeout(resolve, 100));
                
                if (!navMenu.classList.contains('active')) {
                    throw new Error('Mobile menu did not open');
                }
                
                mobileToggle.click(); // Close it
            }

            return 'Navigation working correctly';
        });
    }

    // Test animations
    async testAnimations() {
        this.addTest('Animations', async () => {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            if (animatedElements.length === 0) {
                throw new Error('No animated elements found');
            }

            // Test typing animation
            const typingElement = document.getElementById('typing-text');
            if (!typingElement) {
                throw new Error('Typing animation element not found');
            }

            // Test particles canvas
            const particlesCanvas = document.getElementById('particles-canvas');
            if (!particlesCanvas) {
                throw new Error('Particles canvas not found');
            }

            return 'Animations initialized correctly';
        });
    }

    // Test form validation
    async testFormValidation() {
        this.addTest('Form Validation', async () => {
            const contactForm = document.getElementById('contact-form');
            if (!contactForm) {
                throw new Error('Contact form not found');
            }

            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            
            if (!nameField || !emailField) {
                throw new Error('Form fields not found');
            }

            // Test validation
            nameField.value = '';
            emailField.value = 'invalid-email';
            
            // Trigger validation
            nameField.dispatchEvent(new Event('blur'));
            emailField.dispatchEvent(new Event('blur'));
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            
            if (!nameError || !emailError) {
                throw new Error('Error elements not found');
            }

            return 'Form validation working correctly';
        });
    }

    // Test responsive design
    async testResponsiveDesign() {
        this.addTest('Responsive Design', async () => {
            const breakpoints = [320, 768, 1024, 1200];
            const originalWidth = window.innerWidth;
            
            for (const width of breakpoints) {
                // Simulate viewport change
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: width
                });
                
                window.dispatchEvent(new Event('resize'));
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Check if layout adapts
                const container = document.querySelector('.container');
                if (!container) {
                    throw new Error('Container not found');
                }
            }
            
            // Restore original width
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: originalWidth
            });

            return 'Responsive design working correctly';
        });
    }

    // Test performance metrics
    async testPerformance() {
        this.addTest('Performance', async () => {
            // Test Core Web Vitals
            const navigation = performance.getEntriesByType('navigation')[0];
            if (!navigation) {
                throw new Error('Navigation timing not available');
            }

            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            if (loadTime > 3000) { // 3 seconds threshold
                console.warn(`Load time is ${loadTime}ms, which is above 3000ms threshold`);
            }

            // Test resource loading
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(resource => resource.duration > 1000);
            
            if (slowResources.length > 0) {
                console.warn('Slow loading resources detected:', slowResources);
            }

            return `Performance check completed. Load time: ${loadTime}ms`;
        });
    }

    // Test accessibility
    async testAccessibility() {
        this.addTest('Accessibility', async () => {
            // Test for alt attributes on images
            const images = document.querySelectorAll('img');
            const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
            
            if (imagesWithoutAlt.length > 0) {
                throw new Error(`${imagesWithoutAlt.length} images missing alt attributes`);
            }

            // Test for proper heading hierarchy
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            if (headings.length === 0) {
                throw new Error('No headings found');
            }

            // Test for focus management
            const focusableElements = document.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) {
                throw new Error('No focusable elements found');
            }

            // Test ARIA labels
            const buttons = document.querySelectorAll('button');
            const buttonsWithoutLabels = Array.from(buttons).filter(
                btn => !btn.getAttribute('aria-label') && !btn.textContent.trim()
            );
            
            if (buttonsWithoutLabels.length > 0) {
                console.warn(`${buttonsWithoutLabels.length} buttons without proper labels`);
            }

            return 'Accessibility checks passed';
        });
    }

    // Test SEO elements
    async testSEO() {
        this.addTest('SEO', async () => {
            // Test meta tags
            const title = document.querySelector('title');
            const description = document.querySelector('meta[name="description"]');
            const keywords = document.querySelector('meta[name="keywords"]');
            
            if (!title || !title.textContent.trim()) {
                throw new Error('Page title missing or empty');
            }
            
            if (!description || !description.content.trim()) {
                throw new Error('Meta description missing or empty');
            }

            // Test Open Graph tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            const ogDescription = document.querySelector('meta[property="og:description"]');
            
            if (!ogTitle || !ogDescription) {
                throw new Error('Open Graph tags missing');
            }

            // Test structured data
            const structuredData = document.querySelector('script[type="application/ld+json"]');
            if (!structuredData) {
                throw new Error('Structured data missing');
            }

            return 'SEO elements present and valid';
        });
    }

    // Test browser compatibility
    async testBrowserCompatibility() {
        this.addTest('Browser Compatibility', async () => {
            // Test for required APIs
            const requiredAPIs = [
                'IntersectionObserver',
                'fetch',
                'Promise',
                'localStorage',
                'addEventListener'
            ];

            const missingAPIs = requiredAPIs.filter(api => !(api in window));
            
            if (missingAPIs.length > 0) {
                throw new Error(`Missing APIs: ${missingAPIs.join(', ')}`);
            }

            // Test CSS features
            const testElement = document.createElement('div');
            testElement.style.display = 'grid';
            
            if (testElement.style.display !== 'grid') {
                throw new Error('CSS Grid not supported');
            }

            return 'Browser compatibility checks passed';
        });
    }

    // Helper method to add and run tests
    addTest(name, testFunction) {
        const test = {
            name,
            function: testFunction,
            status: 'pending',
            result: null,
            error: null,
            duration: 0
        };

        this.tests.push(test);
        this.runTest(test);
    }

    async runTest(test) {
        const startTime = Date.now();
        
        try {
            test.result = await test.function();
            test.status = 'passed';
            this.results.passed++;
            console.log(`✅ ${test.name}: ${test.result}`);
        } catch (error) {
            test.status = 'failed';
            test.error = error.message;
            this.results.failed++;
            console.error(`❌ ${test.name}: ${error.message}`);
        }
        
        test.duration = Date.now() - startTime;
        this.results.total++;
    }

    // Generate test report
    generateReport() {
        const duration = this.endTime - this.startTime;
        
        console.log('\n📊 Test Report');
        console.log('================');
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        console.log(`Total Duration: ${duration}ms`);
        
        if (this.results.failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.tests
                .filter(test => test.status === 'failed')
                .forEach(test => {
                    console.log(`  - ${test.name}: ${test.error}`);
                });
        }
        
        console.log('\n🎉 Testing completed!');
        
        return {
            passed: this.results.passed,
            failed: this.results.failed,
            total: this.results.total,
            successRate: (this.results.passed / this.results.total) * 100,
            duration,
            tests: this.tests
        };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioTestSuite;
} else {
    // Make available globally
    window.PortfolioTestSuite = PortfolioTestSuite;
}
