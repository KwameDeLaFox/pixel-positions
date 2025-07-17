# 🚀 Deploy PixelPositions to Render.com

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub (if not already done)
2. **Render Account**: Sign up at [render.com](https://render.com)

## Quick Deploy Steps

### Option 1: Using render.yaml (Recommended)

1. **Connect GitHub Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub account and select this repository
   - Render will automatically detect the `render.yaml` file

2. **Configure Environment Variables**
   - After deployment starts, go to your service settings
   - Add environment variable:
     ```
     JSEARCH_API_KEY = your_actual_api_key_here
     ```
   - Note: JSearch is currently disabled to save API costs, but you can enable it later

3. **Deploy**
   - Click "Apply" and wait for deployment to complete
   - Your app will be available at `https://your-app-name.onrender.com`

### Option 2: Manual Setup

1. **Create Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Runtime: Node
   Build Command: npm ci && npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV = production
   JSEARCH_API_KEY = your_jsearch_api_key (optional)
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment to complete

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `JSEARCH_API_KEY` | No | JSearch API key (currently disabled) |

## Build Configuration

- **Node Version**: Latest LTS (detected automatically)
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Health Check**: `/` (homepage)

## Post-Deployment

### 1. Test Your Deployment
- Visit your Render URL
- Test job filtering and search
- Verify the split-view layout works
- Check mobile responsiveness

### 2. Custom Domain (Optional)
- In Render Dashboard → Settings → Custom Domains
- Add your domain (e.g., `pixelpositions.com`)
- Configure DNS with your domain provider

### 3. Enable JSearch API (Optional)
If you want to re-enable JSearch for more job listings:
1. Get API key from [RapidAPI JSearch](https://rapidapi.com/letscrape-6bea/api/jsearch)
2. Add `JSEARCH_API_KEY` environment variable in Render
3. Update `src/app/api/jobs/route.ts` to uncomment JSearch integration

## Performance Settings

For better performance on Render's free tier:

1. **Plan**: Start with "Starter" plan ($7/month) for better performance
2. **Region**: Choose region closest to your users
3. **Auto-Deploy**: Enable for automatic deployments on git push

## Monitoring

- **Logs**: View real-time logs in Render Dashboard
- **Metrics**: Monitor CPU, memory, and response times
- **Alerts**: Set up alerts for downtime or errors

## Troubleshooting

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### Runtime Errors
- Check service logs in Render Dashboard
- Verify environment variables are set correctly
- Test locally with `npm run build && npm start`

### Performance Issues
- Consider upgrading to paid plan
- Optimize images and assets
- Enable caching headers

## Cost Optimization

- **Free Tier**: Available but with limitations (spins down after inactivity)
- **Starter Plan**: $7/month for always-on service
- **JSearch API**: Currently disabled to save costs (~$0/month)

## Security Best Practices

1. **Environment Variables**: Never commit API keys to git
2. **HTTPS**: Enabled by default on Render
3. **Dependencies**: Keep dependencies updated
4. **Headers**: Security headers configured in Next.js

---

## 🎉 Your PixelPositions job board is now live!

### Features Deployed:
- ✅ LinkedIn-style split view layout
- ✅ Smart job description cleaning
- ✅ Debounced search with suggestions
- ✅ Mobile-responsive design
- ✅ Professional loading states
- ✅ Modern green design system

### Next Steps:
- Share your job board with designers
- Monitor usage and performance
- Consider adding more API sources
- Gather user feedback for improvements

---

**Need help?** Check Render's [documentation](https://render.com/docs) or reach out to their support team. 