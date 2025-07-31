# Production Deployment Guide

## Environment Variables

Set these in your Vercel project settings:

### Required Variables
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api
NEXT_PUBLIC_SERVER_URL=https://your-backend-url.com
```

### Optional Variables (for future use)
```bash
# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Build Configuration

The application is configured with production optimizations:

- ✅ **Standalone Output**: Optimized for containerized deployments
- ✅ **Compression**: Gzip compression enabled
- ✅ **Security Headers**: XSS protection, content type sniffing prevention
- ✅ **Package Optimization**: Redux toolkit imports optimized
- ✅ **Image Optimization**: WebP and AVIF support

## Deployment Checklist

### Before Deployment
- [ ] Set all required environment variables
- [ ] Ensure backend API is deployed and accessible
- [ ] Test build locally: `npm run build`
- [ ] Verify all API endpoints work with production URLs

### After Deployment
- [ ] Test authentication flow
- [ ] Verify API connectivity
- [ ] Check all pages load correctly
- [ ] Test trip creation and editing
- [ ] Verify invitation system works
- [ ] Check responsive design on mobile

## Performance Monitoring

### Key Metrics to Monitor
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Tools
- Vercel Analytics (built-in)
- Google PageSpeed Insights
- Web Vitals Chrome Extension

## Security Considerations

- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ CORS properly configured
- ✅ No sensitive data in client-side code
- ✅ Environment variables for API URLs

## Troubleshooting

### Common Issues
1. **API Connection Errors**: Check `NEXT_PUBLIC_API_BASE_URL`
2. **CORS Errors**: Verify backend CORS configuration
3. **Build Failures**: Check TypeScript errors and dependencies
4. **Environment Variables**: Ensure all required vars are set

### Debug Commands
```bash
# Local production build test
npm run build
npm start

# Check environment variables
echo $NEXT_PUBLIC_API_BASE_URL

# Verify API connectivity
curl $NEXT_PUBLIC_API_BASE_URL/health
```