// Animation System
class AnimationController {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSkillBars();
        this.setupCounters();
        this.setupCustomCursor();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add stagger delay for child elements
                    const staggerElements = entry.target.querySelectorAll('.stagger-animation');
                    staggerElements.forEach((el, index) => {
                        el.style.setProperty('--stagger-delay', `${index * 0.1}s`);
                    });
                }
            });
        }, this.observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const width = skillBar.getAttribute('data-width');
                    
                    setTimeout(() => {
                        skillBar.style.setProperty('--skill-width', `${width}%`);
                        skillBar.classList.add('animated');
                    }, 500);
                }
            });
        }, this.observerOptions);

        skillBars.forEach(bar => observer.observe(bar));
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, this.observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    setupCustomCursor() {
        // Only on desktop
        if (window.innerWidth <= 768) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor movement
        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .tool-item');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // Public method to trigger animations manually
    triggerAnimation(element, animationClass = 'animated') {
        element.classList.add(animationClass);
    }

    // Public method to reset animations
    resetAnimation(element, animationClass = 'animated') {
        element.classList.remove(animationClass);
    }
}

// Page Loader
class PageLoader {
    constructor() {
        this.loader = document.getElementById('page-loader');
        this.progressBar = document.getElementById('progress-bar');
        this.progress = 0;
        
        this.init();
    }

    init() {
        this.simulateLoading();
    }

    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hideLoader(), 500);
            }
            
            this.updateProgress();
        }, 100);
    }

    updateProgress() {
        if (this.progressBar) {
            this.progressBar.style.width = `${this.progress}%`;
        }
    }

    hideLoader() {
        if (this.loader) {
            this.loader.classList.add('hidden');
            document.body.classList.remove('loading');
            
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 500);
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController, PageLoader };
}
