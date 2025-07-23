// Simple Build System for Portfolio
const fs = require('fs').promises;
const path = require('path');

class PortfolioBuildSystem {
    constructor() {
        this.config = {
            srcDir: '.',
            distDir: 'dist',
            cssFiles: [
                'css/base.css',
                'css/layout.css',
                'css/components.css',
                'css/navigation.css',
                'css/hero.css',
                'css/loader.css',
                'css/modal.css'
            ],
            jsFiles: [
                'js/config-loader.js',
                'js/particles.js',
                'js/typing-animation.js',
                'js/theme-toggle.js',
                'js/navigation.js',
                'js/form-handler.js',
                'js/animations.js',
                'js/projects.js',
                'js/skills-renderer.js',
                'js/performance.js',
                'js/asset-loader.js',
                'js/main.js'
            ],
            htmlComponents: [
                'components/loader.html',
                'components/header.html',
                'components/hero.html',
                'components/about.html',
                'components/projects.html',
                'components/contact.html'
            ]
        };
    }

    async build() {
        console.log('🚀 Starting build process...');
        
        try {
            // Create dist directory
            await this.createDistDirectory();
            
            // Build CSS
            await this.buildCSS();
            
            // Build JavaScript
            await this.buildJS();
            
            // Build HTML
            await this.buildHTML();
            
            // Copy assets
            await this.copyAssets();
            
            console.log('✅ Build completed successfully!');
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    async createDistDirectory() {
        try {
            await fs.access(this.config.distDir);
            // Directory exists, remove it
            await fs.rm(this.config.distDir, { recursive: true });
        } catch {
            // Directory doesn't exist, which is fine
        }
        
        await fs.mkdir(this.config.distDir, { recursive: true });
        console.log('📁 Created dist directory');
    }

    async buildCSS() {
        console.log('🎨 Building CSS...');
        
        let combinedCSS = '';
        
        // Add CSS reset and variables first
        combinedCSS += '/* Combined CSS - Built automatically */\n\n';
        
        for (const cssFile of this.config.cssFiles) {
            try {
                const content = await fs.readFile(cssFile, 'utf8');
                combinedCSS += `/* ${cssFile} */\n${content}\n\n`;
            } catch (error) {
                console.warn(`⚠️  Warning: Could not read ${cssFile}`);
            }
        }
        
        // Basic CSS minification (remove comments and extra whitespace)
        const minifiedCSS = this.minifyCSS(combinedCSS);
        
        await fs.writeFile(path.join(this.config.distDir, 'styles.min.css'), minifiedCSS);
        console.log('✅ CSS built and minified');
    }

    async buildJS() {
        console.log('⚡ Building JavaScript...');
        
        let combinedJS = '';
        
        combinedJS += '// Combined JavaScript - Built automatically\n\n';
        
        for (const jsFile of this.config.jsFiles) {
            try {
                const content = await fs.readFile(jsFile, 'utf8');
                combinedJS += `// ${jsFile}\n${content}\n\n`;
            } catch (error) {
                console.warn(`⚠️  Warning: Could not read ${jsFile}`);
            }
        }
        
        // Basic JS minification (remove comments and extra whitespace)
        const minifiedJS = this.minifyJS(combinedJS);
        
        await fs.writeFile(path.join(this.config.distDir, 'script.min.js'), minifiedJS);
        console.log('✅ JavaScript built and minified');
    }

    async buildHTML() {
        console.log('📄 Building HTML...');
        
        // Read the main index.html template
        let htmlContent = await fs.readFile('index.html', 'utf8');
        
        // Replace component includes with actual content
        for (const componentFile of this.config.htmlComponents) {
            try {
                const componentContent = await fs.readFile(componentFile, 'utf8');
                const componentName = path.basename(componentFile, '.html');
                
                // Replace placeholder comments with actual content
                const placeholder = `<!-- ${componentName.toUpperCase()} COMPONENT -->`;
                htmlContent = htmlContent.replace(placeholder, componentContent);
            } catch (error) {
                console.warn(`⚠️  Warning: Could not read ${componentFile}`);
            }
        }
        
        // Update CSS and JS references
        htmlContent = htmlContent.replace('styles.css', 'styles.min.css');
        htmlContent = htmlContent.replace('script.js', 'script.min.js');
        
        // Minify HTML
        const minifiedHTML = this.minifyHTML(htmlContent);
        
        await fs.writeFile(path.join(this.config.distDir, 'index.html'), minifiedHTML);
        console.log('✅ HTML built and optimized');
    }

    async copyAssets() {
        console.log('📋 Copying assets...');
        
        const assetsToCopy = ['favicon.ico', 'favicon.png'];
        
        for (const asset of assetsToCopy) {
            try {
                await fs.copyFile(asset, path.join(this.config.distDir, asset));
            } catch (error) {
                console.warn(`⚠️  Warning: Could not copy ${asset}`);
            }
        }
        
        // Copy assets directory if it exists
        try {
            await this.copyDirectory('assets', path.join(this.config.distDir, 'assets'));
        } catch (error) {
            console.warn('⚠️  Warning: Could not copy assets directory');
        }
        
        console.log('✅ Assets copied');
    }

    async copyDirectory(src, dest) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
            .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
            .replace(/}\s*/g, '}') // Remove spaces after closing brace
            .replace(/;\s*/g, ';') // Remove spaces after semicolon
            .trim();
    }

    minifyJS(js) {
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
            .replace(/}\s*/g, '}') // Remove spaces after closing brace
            .replace(/;\s*/g, ';') // Remove spaces after semicolon
            .trim();
    }

    minifyHTML(html) {
        return html
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/>\s+</g, '><') // Remove spaces between tags
            .trim();
    }
}

// Run build if this file is executed directly
if (require.main === module) {
    const buildSystem = new PortfolioBuildSystem();
    buildSystem.build();
}

module.exports = PortfolioBuildSystem;
