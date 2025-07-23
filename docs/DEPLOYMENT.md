# Deployment Guide

This guide covers various deployment options for the Sahil Katariya Portfolio website.

## 📋 Pre-Deployment Checklist

### 1. Build and Test
- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run serve:dist`
- [ ] Run automated test suite: `npm run test`
- [ ] Complete manual testing checklist
- [ ] Verify all assets load correctly
- [ ] Check performance metrics

### 2. Content Review
- [ ] Update contact information
- [ ] Review all project descriptions
- [ ] Ensure all links work correctly
- [ ] Verify social media links
- [ ] Check for placeholder content

### 3. SEO and Meta Tags
- [ ] Update site URL in configuration
- [ ] Verify meta descriptions
- [ ] Test Open Graph tags
- [ ] Submit sitemap to search engines
- [ ] Set up Google Analytics (optional)

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

**Advantages:**
- Free tier available
- Automatic HTTPS
- Global CDN
- Form handling
- Continuous deployment from Git

**Steps:**
1. Build the project:
   ```bash
   npm run build
   ```

2. **Method A: Drag and Drop**
   - Go to [Netlify](https://netlify.com)
   - Drag the `dist` folder to the deploy area
   - Your site will be live instantly

3. **Method B: Git Integration**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Enable automatic deployments

**Custom Domain:**
1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate will be automatically provisioned

### Option 2: Vercel

**Advantages:**
- Excellent performance
- Edge functions support
- Automatic HTTPS
- Git integration

**Steps:**
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   npm run build
   cd dist
   vercel
   ```

3. **Or use Git integration:**
   - Connect repository at [vercel.com](https://vercel.com)
   - Set build command: `npm run build`
   - Set output directory: `dist`

### Option 3: GitHub Pages

**Advantages:**
- Free hosting for public repositories
- Integrated with GitHub
- Custom domain support

**Steps:**
1. Build the project:
   ```bash
   npm run build
   ```

2. **Method A: gh-pages branch**
   ```bash
   # Install gh-pages
   npm install -g gh-pages
   
   # Deploy
   gh-pages -d dist
   ```

3. **Method B: GitHub Actions**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Option 4: Firebase Hosting

**Advantages:**
- Google's global CDN
- Excellent performance
- Free tier available
- Easy custom domain setup

**Steps:**
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase login
   firebase init hosting
   ```

3. Configure `firebase.json`:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Option 5: AWS S3 + CloudFront

**Advantages:**
- Highly scalable
- Global CDN
- Cost-effective for high traffic
- Full control over configuration

**Steps:**
1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist` folder contents
4. Set up CloudFront distribution
5. Configure custom domain with Route 53

### Option 6: Traditional Web Hosting

**For shared hosting or VPS:**

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload `dist` folder contents to your web server's public directory (usually `public_html` or `www`)

3. Configure web server:
   - **Apache**: Use `.htaccess` for URL rewriting
   - **Nginx**: Configure location blocks
   - **IIS**: Use `web.config` for URL rewriting

## 🔧 Configuration for Production

### Environment-Specific Settings

Update configuration files for production:

1. **Site URL** in `config/site.json`:
   ```json
   {
     "site": {
       "url": "https://yourdomain.com"
     }
   }
   ```

2. **Analytics** (optional):
   Add Google Analytics or other tracking codes to the HTML template.

3. **Contact Form**:
   Configure form submission endpoint in `js/form-handler.js`

### Performance Optimizations

1. **Enable Compression**:
   - Gzip/Brotli compression on server
   - Most hosting services enable this automatically

2. **Set Cache Headers**:
   ```
   Cache-Control: public, max-age=31536000, immutable
   ```

3. **CDN Configuration**:
   - Use CDN for static assets
   - Configure proper cache policies

## 🔒 Security Considerations

### Content Security Policy (CSP)

Add CSP headers to prevent XSS attacks:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:;">
```

### HTTPS

- Always use HTTPS in production
- Most modern hosting services provide automatic SSL
- Redirect HTTP to HTTPS

### Security Headers

Configure these headers on your server:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📊 Monitoring and Analytics

### Performance Monitoring

1. **Google PageSpeed Insights**
   - Test your deployed site
   - Monitor Core Web Vitals

2. **Lighthouse**
   - Run regular audits
   - Monitor performance, accessibility, SEO

3. **Real User Monitoring**
   - Consider tools like Google Analytics
   - Monitor actual user experience

### Error Tracking

1. **Browser Console**
   - Monitor for JavaScript errors
   - Set up error reporting

2. **Uptime Monitoring**
   - Use services like UptimeRobot
   - Get alerts for downtime

## 🔄 Continuous Deployment

### Automated Deployment Workflow

1. **Code Changes**
   - Push to main branch
   - Automated tests run

2. **Build Process**
   - Automated build on CI/CD
   - Run test suite

3. **Deployment**
   - Automatic deployment to staging
   - Manual promotion to production

### Rollback Strategy

1. **Version Control**
   - Tag releases
   - Keep deployment history

2. **Quick Rollback**
   - Ability to quickly revert
   - Database backup strategy (if applicable)

## 📞 Support

If you encounter issues during deployment:

1. Check the build logs for errors
2. Verify all file paths are correct
3. Test locally first with `npm run serve:dist`
4. Check browser console for errors
5. Verify DNS configuration for custom domains

For additional help:
- Email: sahilkatariya2609@gmail.com
- Create an issue on GitHub

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Web.dev Performance Guide](https://web.dev/performance/)

---

**Happy Deploying! 🚀**
