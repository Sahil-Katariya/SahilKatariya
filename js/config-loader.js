// Configuration Loader and Manager
class ConfigLoader {
    constructor() {
        this.config = {
            site: null,
            skills: null,
            projects: null,
            theme: null,
            assets: null
        };
        this.loaded = false;
        this.loadingPromise = null;
    }

    async loadAll() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this._loadAllConfigs();
        return this.loadingPromise;
    }

    async _loadAllConfigs() {
        try {
            const configFiles = [
                { key: 'site', path: 'config/site.json' },
                { key: 'skills', path: 'config/skills.json' },
                { key: 'projects', path: 'config/projects.json' },
                { key: 'theme', path: 'config/theme.json' },
                { key: 'assets', path: 'config/assets.json' }
            ];

            const promises = configFiles.map(async ({ key, path }) => {
                try {
                    const response = await fetch(path);
                    if (!response.ok) {
                        throw new Error(`Failed to load ${path}: ${response.status}`);
                    }
                    const data = await response.json();
                    this.config[key] = data;
                    return { key, success: true };
                } catch (error) {
                    console.warn(`Failed to load ${key} config:`, error);
                    this.config[key] = this._getDefaultConfig(key);
                    return { key, success: false, error };
                }
            });

            const results = await Promise.all(promises);
            this.loaded = true;

            console.log('Configuration loaded:', results);
            return this.config;
        } catch (error) {
            console.error('Failed to load configurations:', error);
            throw error;
        }
    }

    _getDefaultConfig(key) {
        const defaults = {
            site: {
                site: {
                    title: "Portfolio",
                    description: "Personal portfolio website",
                    author: "Developer"
                },
                personal: {
                    name: "Developer",
                    title: "Full Stack Developer"
                }
            },
            skills: {
                skillCategories: [],
                tools: [],
                expertise: []
            },
            projects: {
                projects: [],
                categories: []
            },
            theme: {
                themes: {
                    dark: { colors: {}, typography: {}, spacing: {} },
                    light: { colors: {}, typography: {}, spacing: {} }
                }
            },
            assets: {
                assets: {},
                optimization: {},
                caching: {}
            }
        };

        return defaults[key] || {};
    }

    // Getter methods for easy access
    getSiteConfig() {
        return this.config.site;
    }

    getSkillsConfig() {
        return this.config.skills;
    }

    getProjectsConfig() {
        return this.config.projects;
    }

    getThemeConfig() {
        return this.config.theme;
    }

    getAssetsConfig() {
        return this.config.assets;
    }

    // Get specific configuration values
    get(path, defaultValue = null) {
        try {
            const keys = path.split('.');
            let current = this.config;
            
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    return defaultValue;
                }
            }
            
            return current;
        } catch (error) {
            console.warn(`Failed to get config value for path: ${path}`, error);
            return defaultValue;
        }
    }

    // Set configuration values (for runtime updates)
    set(path, value) {
        try {
            const keys = path.split('.');
            const lastKey = keys.pop();
            let current = this.config;
            
            for (const key of keys) {
                if (!current[key] || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }
            
            current[lastKey] = value;
            
            // Dispatch event for config change
            window.dispatchEvent(new CustomEvent('configChanged', {
                detail: { path, value }
            }));
            
            return true;
        } catch (error) {
            console.error(`Failed to set config value for path: ${path}`, error);
            return false;
        }
    }

    // Apply theme configuration to CSS custom properties
    applyTheme(themeName = 'dark') {
        const theme = this.get(`theme.themes.${themeName}`);
        if (!theme) {
            console.warn(`Theme '${themeName}' not found`);
            return;
        }

        const root = document.documentElement;
        
        // Apply color variables
        if (theme.colors) {
            this._applyColorVariables(root, theme.colors);
        }

        // Apply typography variables
        if (theme.typography) {
            this._applyTypographyVariables(root, theme.typography);
        }

        // Apply spacing variables
        if (theme.spacing) {
            this._applySpacingVariables(root, theme.spacing);
        }

        // Apply other theme variables
        if (theme.borderRadius) {
            this._applyBorderRadiusVariables(root, theme.borderRadius);
        }

        if (theme.shadows) {
            this._applyShadowVariables(root, theme.shadows);
        }
    }

    _applyColorVariables(root, colors) {
        const flattenColors = (obj, prefix = '') => {
            Object.entries(obj).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    flattenColors(value, `${prefix}${key}-`);
                } else {
                    root.style.setProperty(`--${prefix}${key}`, value);
                }
            });
        };

        flattenColors(colors);
    }

    _applyTypographyVariables(root, typography) {
        if (typography.fontFamily) {
            root.style.setProperty('--font-family', typography.fontFamily);
        }

        if (typography.fontSizes) {
            Object.entries(typography.fontSizes).forEach(([key, value]) => {
                root.style.setProperty(`--font-size-${key}`, value);
            });
        }

        if (typography.fontWeights) {
            Object.entries(typography.fontWeights).forEach(([key, value]) => {
                root.style.setProperty(`--font-weight-${key}`, value);
            });
        }

        if (typography.lineHeights) {
            Object.entries(typography.lineHeights).forEach(([key, value]) => {
                root.style.setProperty(`--line-height-${key}`, value);
            });
        }
    }

    _applySpacingVariables(root, spacing) {
        Object.entries(spacing).forEach(([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value);
        });
    }

    _applyBorderRadiusVariables(root, borderRadius) {
        Object.entries(borderRadius).forEach(([key, value]) => {
            root.style.setProperty(`--border-radius-${key}`, value);
        });
    }

    _applyShadowVariables(root, shadows) {
        Object.entries(shadows).forEach(([key, value]) => {
            root.style.setProperty(`--shadow-${key}`, value);
        });
    }

    // Get projects by category
    getProjectsByCategory(category = 'all') {
        const projects = this.get('projects.projects', []);
        
        if (category === 'all') {
            return projects;
        }
        
        return projects.filter(project => project.category === category);
    }

    // Get featured projects
    getFeaturedProjects() {
        const projects = this.get('projects.projects', []);
        return projects.filter(project => project.featured);
    }

    // Get skills by category
    getSkillsByCategory(category) {
        const skillCategories = this.get('skills.skillCategories', []);
        const categoryData = skillCategories.find(cat => cat.name === category);
        return categoryData ? categoryData.skills : [];
    }

    // Check if configuration is loaded
    isLoaded() {
        return this.loaded;
    }

    // Wait for configuration to be loaded
    async waitForLoad() {
        if (this.loaded) {
            return this.config;
        }
        
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        
        return this.loadAll();
    }
}

// Create global instance
const configLoader = new ConfigLoader();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigLoader;
} else {
    // Make available globally
    window.configLoader = configLoader;
}
