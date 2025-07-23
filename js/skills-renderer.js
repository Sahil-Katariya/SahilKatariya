// Enhanced Skills Renderer with Transparency Effects
class SkillsRenderer {
    constructor() {
        this.container = null;
        this.skillsData = null;
        this.animationObserver = null;
        
        this.init();
    }

    async init() {
        this.container = document.getElementById('skills-container');
        if (!this.container) return;

        // Wait for configuration to load
        if (typeof configLoader !== 'undefined') {
            await configLoader.waitForLoad();
            this.skillsData = configLoader.getSkillsConfig();
        } else {
            // Fallback data if config loader is not available
            this.skillsData = await this.loadFallbackData();
        }

        this.render();
        this.setupAnimations();
    }

    async loadFallbackData() {
        try {
            const response = await fetch('config/skills.json');
            return await response.json();
        } catch (error) {
            console.warn('Could not load skills configuration:', error);
            return { skillCategories: [] };
        }
    }

    render() {
        if (!this.skillsData || !this.skillsData.skillCategories) return;

        const skillsHTML = this.skillsData.skillCategories.map(category => 
            this.renderSkillCategory(category)
        ).join('');

        this.container.innerHTML = skillsHTML;
    }

    renderSkillCategory(category) {
        const categoryColor = category.color || '#6366f1';
        
        return `
            <div class="skill-category" style="--category-color: ${categoryColor}">
                <h4>
                    <span class="category-icon" style="color: ${categoryColor}">●</span>
                    ${category.name}
                </h4>
                <p class="skill-category-description">${category.description || ''}</p>
                <div class="skills-tiles">
                    ${category.skills.map(skill => this.renderSkillTile(skill)).join('')}
                </div>
            </div>
        `;
    }

    renderSkillTile(skill) {
        return `
            <div class="skill-tile" data-skill-level="${skill.level}">
                <div class="skill-header">
                    <div class="skill-info">
                        <span class="skill-icon">${skill.icon}</span>
                        <span class="skill-name">${skill.name}</span>
                    </div>
                    <span class="skill-level">${skill.level}%</span>
                </div>
                
                <p class="skill-description">${skill.description || ''}</p>
                
                <div class="skill-progress">
                    <div class="skill-fill" data-width="${skill.level}" style="--skill-width: ${skill.level}%"></div>
                </div>
                
                <div class="skill-details">
                    <div class="skill-projects">
                        <span>📁</span>
                        <span>${skill.projects || 0} projects</span>
                    </div>
                    <div class="skill-experience">
                        <span>⏱️</span>
                        <span>${skill.experience || 'Learning'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    setupAnimations() {
        // Setup intersection observer for skill animations
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillCategory(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        });

        // Observe all skill categories
        const skillCategories = this.container.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            this.animationObserver.observe(category);
        });

        // Setup hover effects for skill tiles
        this.setupHoverEffects();
    }

    animateSkillCategory(categoryElement) {
        // Add stagger animation to skill tiles
        const skillTiles = categoryElement.querySelectorAll('.skill-tile');
        const skillFills = categoryElement.querySelectorAll('.skill-fill');
        
        skillTiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.classList.add('animate-in');
            }, index * 100);
        });

        // Animate skill progress bars
        setTimeout(() => {
            skillFills.forEach((fill, index) => {
                setTimeout(() => {
                    fill.classList.add('animated');
                }, index * 150);
            });
        }, 300);

        // Unobserve after animation
        this.animationObserver.unobserve(categoryElement);
    }

    setupHoverEffects() {
        const skillTiles = this.container.querySelectorAll('.skill-tile');
        
        skillTiles.forEach(tile => {
            tile.addEventListener('mouseenter', () => {
                this.onSkillTileHover(tile, true);
            });
            
            tile.addEventListener('mouseleave', () => {
                this.onSkillTileHover(tile, false);
            });
        });
    }

    onSkillTileHover(tile, isHovering) {
        const skillLevel = parseInt(tile.dataset.skillLevel);
        const skillFill = tile.querySelector('.skill-fill');
        
        if (isHovering) {
            // Add glow effect based on skill level
            const glowIntensity = skillLevel / 100;
            tile.style.setProperty('--glow-opacity', glowIntensity * 0.3);
            
            // Enhance progress bar on hover
            if (skillFill) {
                skillFill.style.transform = 'scaleY(1.2)';
                skillFill.style.filter = 'brightness(1.2)';
            }
        } else {
            // Remove hover effects
            tile.style.removeProperty('--glow-opacity');
            
            if (skillFill) {
                skillFill.style.transform = '';
                skillFill.style.filter = '';
            }
        }
    }

    // Public method to refresh skills display
    async refresh() {
        if (typeof configLoader !== 'undefined') {
            await configLoader.waitForLoad();
            this.skillsData = configLoader.getSkillsConfig();
            this.render();
            this.setupAnimations();
        }
    }

    // Public method to filter skills by category
    filterByCategory(categoryName) {
        const categories = this.container.querySelectorAll('.skill-category');
        
        categories.forEach(category => {
            const categoryTitle = category.querySelector('h4').textContent.trim();
            
            if (categoryName === 'all' || categoryTitle.toLowerCase().includes(categoryName.toLowerCase())) {
                category.style.display = 'block';
                category.classList.add('fade-in');
            } else {
                category.style.display = 'none';
                category.classList.remove('fade-in');
            }
        });
    }

    // Public method to highlight skills by level
    highlightByLevel(minLevel) {
        const skillTiles = this.container.querySelectorAll('.skill-tile');
        
        skillTiles.forEach(tile => {
            const skillLevel = parseInt(tile.dataset.skillLevel);
            
            if (skillLevel >= minLevel) {
                tile.classList.add('highlighted');
            } else {
                tile.classList.remove('highlighted');
            }
        });
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsRenderer;
}
