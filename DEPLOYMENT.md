# Deployment Guide for 82 Labs Website

## Vercel Deployment (Recommended)

This project is now configured for static deployment on Vercel. The contact form uses mailto links instead of a backend API.

### Steps to Deploy:

1. **Build the project** (already done):
   ```bash
   vite build
   ```

2. **Deploy to Vercel**:
   - Connect your repository to Vercel
   - Vercel will automatically use the `vercel.json` configuration
   - Build command: `vite build`
   - Output directory: `dist/public`

3. **Contact Form**:
   - The contact form now uses mailto links
   - When users submit the form, it opens their default email client
   - Email address: `contact@82labs.com` (update this in `client/src/pages/home.tsx` if needed)

### Files Created for Deployment:

- `vercel.json` - Vercel configuration
- `dist/public/` - Built static files (favicon, HTML, CSS, JS)
- Updated contact form to use mailto instead of API calls

### Alternative Deployment Options:

1. **Netlify**: Upload the `dist/public` folder
2. **GitHub Pages**: Use the `dist/public` folder as the source
3. **Any static hosting**: Serve files from `dist/public`

### Notes:

- The site is now purely static (no backend required)
- All animations and interactions work client-side
- Contact form opens user's email client with pre-filled message
- Favicon is included and optimized for browsers

### Troubleshooting:

If you see server code instead of the website:
1. Make sure Vercel is configured as a static site (not Node.js)
2. Verify the build output directory is set to `dist/public`
3. Check that the `vercel.json` file is in the root directory