// Performance Optimization Module
class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0
        };
        
        this.init();
    }

    init() {
        this.measurePerformance();
        this.optimizeImages();
        this.implementCriticalResourceHints();
        this.setupIntersectionObserver();
        this.optimizeAnimations();
        this.setupServiceWorker();
    }

    measurePerformance() {
        // Measure Core Web Vitals
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
        this.measureBasicMetrics();
    }

    measureLCP() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                console.log('LCP:', lastEntry.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    measureFID() {
        // First Input Delay
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    console.log('FID:', this.metrics.firstInputDelay);
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    measureCLS() {
        // Cumulative Layout Shift
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cumulativeLayoutShift = clsValue;
                console.log('CLS:', clsValue);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    measureBasicMetrics() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
            this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            
            // Paint metrics
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach((entry) => {
                if (entry.name === 'first-paint') {
                    this.metrics.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                }
            });

            console.log('Performance Metrics:', this.metrics);
        });
    }

    optimizeImages() {
        // Implement responsive images and lazy loading
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading attribute for native lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding attribute for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // Optimize image loading
            this.optimizeImageLoading(img);
        });
    }

    optimizeImageLoading(img) {
        // Create intersection observer for advanced lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    
                    // Preload the image
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.classList.add('loaded');
                    }
                    
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    }

    implementCriticalResourceHints() {
        // Preload critical resources
        const criticalResources = [
            { href: 'css/main.css', as: 'style' },
            { href: 'js/main.js', as: 'script' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });

        // DNS prefetch for external domains
        const externalDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    setupIntersectionObserver() {
        // Optimize animations based on visibility
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                } else if (entry.boundingClientRect.top > 0) {
                    // Element is below viewport, remove animation class to save resources
                    entry.target.classList.remove('animated');
                }
            });
        }, {
            rootMargin: '10px 0px',
            threshold: 0.1
        });

        animatedElements.forEach(el => animationObserver.observe(el));
    }

    optimizeAnimations() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
            
            // Disable resource-intensive animations
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused');
            } else {
                document.body.classList.remove('paused');
            }
        });
    }

    setupServiceWorker() {
        // Register service worker for caching
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Public method to get performance metrics
    getMetrics() {
        return this.metrics;
    }

    // Public method to report performance to analytics
    reportPerformance() {
        // This would typically send data to an analytics service
        console.log('Performance Report:', this.metrics);
        
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                custom_parameter: this.metrics.loadTime
            });
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
