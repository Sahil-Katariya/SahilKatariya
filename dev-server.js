// Simple Development Server with Component Loading
const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const url = require('url');

class DevServer {
    constructor(port = 3000) {
        this.port = port;
        this.mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };
    }

    async start() {
        const server = http.createServer(async (req, res) => {
            await this.handleRequest(req, res);
        });

        server.listen(this.port, () => {
            console.log(`🚀 Development server running at http://localhost:${this.port}`);
            console.log(`📁 Serving files from: ${process.cwd()}`);
            console.log(`🔄 Auto-reloading enabled for development`);
        });
    }

    async handleRequest(req, res) {
        try {
            const parsedUrl = url.parse(req.url, true);
            let pathname = parsedUrl.pathname;

            // Default to index-dev.html for development
            if (pathname === '/') {
                pathname = '/index-dev.html';
            }

            // Handle component loading for development
            if (pathname === '/index-dev.html') {
                await this.serveDevHTML(res);
                return;
            }

            // Serve static files
            await this.serveStaticFile(pathname, res);
        } catch (error) {
            console.error('Server error:', error);
            this.sendError(res, 500, 'Internal Server Error');
        }
    }

    async serveDevHTML(res) {
        try {
            // Read the development HTML template
            let htmlContent = await fs.readFile('index-dev.html', 'utf8');

            // Load and inject components
            const components = [
                { placeholder: '<!-- LOADER COMPONENT -->', file: 'components/loader.html' },
                { placeholder: '<!-- HEADER COMPONENT -->', file: 'components/header.html' },
                { placeholder: '<!-- HERO COMPONENT -->', file: 'components/hero.html' },
                { placeholder: '<!-- ABOUT COMPONENT -->', file: 'components/about.html' },
                { placeholder: '<!-- PROJECTS COMPONENT -->', file: 'components/projects.html' },
                { placeholder: '<!-- CONTACT COMPONENT -->', file: 'components/contact.html' }
            ];

            for (const component of components) {
                try {
                    const componentContent = await fs.readFile(component.file, 'utf8');
                    htmlContent = htmlContent.replace(component.placeholder, componentContent);
                } catch (error) {
                    console.warn(`⚠️  Warning: Could not load ${component.file}`);
                    htmlContent = htmlContent.replace(component.placeholder, `<!-- ${component.file} not found -->`);
                }
            }

            // Add development features
            htmlContent = this.addDevFeatures(htmlContent);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        } catch (error) {
            console.error('Error serving dev HTML:', error);
            this.sendError(res, 500, 'Could not load development page');
        }
    }

    addDevFeatures(html) {
        // Add auto-reload script for development
        const devScript = `
        <script>
            // Development auto-reload (check every 2 seconds)
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                let lastModified = null;
                
                setInterval(async () => {
                    try {
                        const response = await fetch('/dev-status');
                        const data = await response.json();
                        
                        if (lastModified && data.lastModified !== lastModified) {
                            console.log('🔄 Files changed, reloading...');
                            location.reload();
                        }
                        
                        lastModified = data.lastModified;
                    } catch (error) {
                        // Ignore errors in development
                    }
                }, 2000);
            }
        </script>
        `;

        return html.replace('</body>', `${devScript}</body>`);
    }

    async serveStaticFile(pathname, res) {
        const filePath = path.join(process.cwd(), pathname);
        
        try {
            const stats = await fs.stat(filePath);
            
            if (stats.isFile()) {
                const ext = path.extname(filePath);
                const mimeType = this.mimeTypes[ext] || 'application/octet-stream';
                
                const content = await fs.readFile(filePath);
                
                res.writeHead(200, { 
                    'Content-Type': mimeType,
                    'Cache-Control': 'no-cache' // Disable caching in development
                });
                res.end(content);
            } else {
                this.sendError(res, 404, 'File not found');
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.sendError(res, 404, 'File not found');
            } else {
                this.sendError(res, 500, 'Server error');
            }
        }
    }

    sendError(res, statusCode, message) {
        res.writeHead(statusCode, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error ${statusCode}</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #e74c3c; }
                </style>
            </head>
            <body>
                <h1>Error ${statusCode}</h1>
                <p>${message}</p>
                <a href="/">← Back to Home</a>
            </body>
            </html>
        `);
    }
}

// Start the development server if this file is run directly
if (require.main === module) {
    const port = process.argv[2] || 3000;
    const server = new DevServer(port);
    server.start();
}

module.exports = DevServer;
