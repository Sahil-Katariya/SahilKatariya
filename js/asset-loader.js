// Asset Loading and Optimization System
class AssetLoader {
    constructor() {
        this.config = null;
        this.loadedAssets = new Map();
        this.loadingPromises = new Map();
        this.supportsWebP = null;
        
        this.init();
    }

    async init() {
        await this.loadConfig();
        await this.detectWebPSupport();
        this.setupLazyLoading();
    }

    async loadConfig() {
        try {
            const response = await fetch('config/assets.json');
            this.config = await response.json();
        } catch (error) {
            console.warn('Could not load asset configuration:', error);
            this.config = { assets: {}, optimization: {}, caching: {}, lazyLoading: {} };
        }
    }

    async detectWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.supportsWebP = (webP.height === 2);
                resolve(this.supportsWebP);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    setupLazyLoading() {
        if (!this.config.lazyLoading?.enabled) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: this.config.lazyLoading.threshold || '50px'
        });

        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    async loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        try {
            // Check if we should use WebP
            const optimizedSrc = this.getOptimizedImageSrc(src);
            
            // Create a promise for this image if not already loading
            if (!this.loadingPromises.has(optimizedSrc)) {
                this.loadingPromises.set(optimizedSrc, this.createImageLoadPromise(optimizedSrc));
            }

            await this.loadingPromises.get(optimizedSrc);
            
            // Update the image source
            img.src = optimizedSrc;
            img.classList.add('loaded');
            
            // Remove placeholder
            if (img.classList.contains('placeholder')) {
                img.classList.remove('placeholder');
            }

        } catch (error) {
            console.warn('Failed to load image:', src, error);
            // Fallback to original source
            img.src = src;
        }
    }

    createImageLoadPromise(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.loadedAssets.set(src, true);
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    getOptimizedImageSrc(src) {
        if (!this.supportsWebP) return src;

        // Convert to WebP if supported and configuration allows
        if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')) {
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
            return webpSrc;
        }

        return src;
    }

    // Get asset path from configuration
    getAssetPath(category, name) {
        try {
            const path = category.split('.').reduce((obj, key) => obj[key], this.config.assets);
            return path[name] || null;
        } catch (error) {
            console.warn('Asset path not found:', category, name);
            return null;
        }
    }

    // Preload critical assets
    async preloadCriticalAssets() {
        const criticalAssets = [
            this.getAssetPath('icons.favicon', 'ico'),
            this.getAssetPath('icons.favicon', 'png'),
            // Add other critical assets
        ].filter(Boolean);

        const preloadPromises = criticalAssets.map(src => {
            if (src.endsWith('.css')) {
                return this.preloadCSS(src);
            } else if (src.endsWith('.js')) {
                return this.preloadJS(src);
            } else {
                return this.preloadImage(src);
            }
        });

        try {
            await Promise.all(preloadPromises);
            console.log('Critical assets preloaded');
        } catch (error) {
            console.warn('Some critical assets failed to preload:', error);
        }
    }

    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    preloadCSS(src) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = src;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    preloadJS(src) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Create responsive image element
    createResponsiveImage(src, alt, sizes = []) {
        const img = document.createElement('img');
        img.alt = alt;
        img.loading = 'lazy';
        
        if (this.config.lazyLoading?.enabled) {
            img.dataset.src = src;
            img.src = this.config.lazyLoading.placeholder || '';
            img.classList.add('placeholder');
        } else {
            img.src = src;
        }

        // Add srcset for responsive images
        if (sizes.length > 0) {
            const srcset = sizes.map(size => {
                const responsiveSrc = this.getResponsiveImageSrc(src, size);
                return `${responsiveSrc} ${size}w`;
            }).join(', ');
            
            img.srcset = srcset;
            img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        }

        return img;
    }

    getResponsiveImageSrc(src, width) {
        const ext = src.split('.').pop();
        const baseName = src.replace(`.${ext}`, '');
        return `${baseName}-${width}w.${ext}`;
    }

    // Update all images to use optimized loading
    updateAllImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (img.src && !img.dataset.optimized) {
                const originalSrc = img.src;
                img.dataset.src = originalSrc;
                img.src = this.config.lazyLoading?.placeholder || '';
                img.classList.add('placeholder');
                img.dataset.optimized = 'true';
            }
        });

        // Re-setup lazy loading for new images
        this.setupLazyLoading();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetLoader;
}
