# JSearch API Integration Setup Guide

## 🚀 Quick Setup

### 1. Get Your JSearch API Key

1. **Sign up for RapidAPI**: Go to [RapidAPI.com](https://rapidapi.com) and create a free account
2. **Subscribe to JSearch**: Visit [JSearch API on RapidAPI](https://rapidapi.com/letscrape-6bea/api/jsearch)
3. **Choose Free Plan**: The free tier includes **2,500 searches/month** - perfect for development and small projects
4. **Get API Key**: Copy your API key from the RapidAPI dashboard

### 2. Configure Environment Variables

Update your `.env.local` file:

```bash
# JSearch API Configuration (RapidAPI)
JSEARCH_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: Replace `your_actual_api_key_here` with your real API key from RapidAPI

### 3. Test the Integration

Start your development server:

```bash
npm run dev
```

Visit `http://localhost:3000` and you should see:

- Jobs from **both Remotive and JSearch** sources
- **Automatic deduplication** removing similar jobs
- **Enhanced job cards** with better parsed data
- **Multi-source filtering** working across both APIs

## 📊 What You Get with JSearch Integration

### **Before (Remotive Only)**
- ~40-60 design jobs
- Single source reliability risk
- Limited job variety

### **After (Remotive + JSearch)**
- **100+ design jobs** (deduplicated)
- **Multi-source reliability** (if one API fails, the other continues)
- **Better job coverage** across different platforms
- **Enhanced data quality** with improved parsing

## 🔧 Advanced Configuration

### API Endpoints
The integration uses these endpoints:
- **Remotive**: `https://remotive.com/api/remote-jobs`
- **JSearch**: `https://jsearch.p.rapidapi.com/search`

### Rate Limits
- **Remotive**: No API key required, ~1000 requests/day
- **JSearch Free**: 2,500 searches/month (83 searches/day)
- **JSearch Pro**: 25,000 searches/month ($27/month)

### Deduplication Logic
The system automatically:
- **Detects duplicates** using 85% similarity matching
- **Compares**: Job title + company + location
- **Prioritizes**: JSearch > Remotive (JSearch typically has newer data)
- **Removes jobs** posted within 7 days of each other

## 🛠️ Troubleshooting

### "JSearch API key not configured" in logs
- Check your `.env.local` file
- Ensure the key is named `JSEARCH_API_KEY` (not `NEXT_PUBLIC_JSEARCH_API_KEY`)
- Restart your development server after adding the key

### No JSearch jobs appearing
1. **Check API key**: Test it on RapidAPI directly
2. **Check rate limits**: Free tier is 2,500/month
3. **Check search terms**: Default query is "designer UI UX graphic design"

### API Errors
Check the browser console and terminal logs for:
- `Remotive API error:` - Remotive service issues
- `JSearch API error:` - JSearch/RapidAPI issues
- Deduplication statistics in console

## 📈 Monitoring & Analytics

The API now returns enhanced metadata:

```json
{
  "jobs": [...],
  "total": 156,
  "sources": {
    "Remotive": 67,
    "JSearch": 89
  },
  "deduplication": {
    "originalCount": 178,
    "deduplicatedCount": 156,
    "duplicatesRemoved": 22,
    "duplicateRate": 12.36
  }
}
```

## 🎯 Next Steps

With JSearch integration complete, you can now:

1. **Scale up**: Upgrade to JSearch Pro for 25,000 searches/month
2. **Add more sources**: Integrate additional job APIs
3. **Improve matching**: Fine-tune deduplication algorithms
4. **Add analytics**: Track user preferences and popular jobs

## 💡 Tips for Production

- **Monitor usage**: Track your RapidAPI usage dashboard
- **Cache responses**: Implement Redis caching for better performance
- **Error handling**: The system gracefully falls back to Remotive if JSearch fails
- **Backup strategy**: Always keep Remotive as a reliable fallback

---

## 🔗 Useful Links

- [JSearch API Documentation](https://rapidapi.com/letscrape-6bea/api/jsearch)
- [RapidAPI Dashboard](https://rapidapi.com/developer/dashboard)
- [JSearch Pricing Plans](https://rapidapi.com/letscrape-6bea/api/jsearch/pricing)

Happy job hunting! 🎉 