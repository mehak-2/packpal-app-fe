# RapidAPI Key Setup Guide

## Current Status
The application is currently using a fallback API key that may be invalid or rate-limited. You need to set up your own RapidAPI key for full functionality.

## Step-by-Step Setup

### 1. Get Your Own RapidAPI Key

1. **Go to RapidAPI**: Visit [https://rapidapi.com/](https://rapidapi.com/)
2. **Sign up/Login**: Create an account or log in
3. **Search for GeoDB Cities API**: Search for "GeoDB Cities API" in the marketplace
4. **Subscribe to Free Plan**: 
   - Click "Subscribe to Test"
   - Choose the "Basic" plan (free tier)
   - This gives you 10,000 requests per month
5. **Copy Your API Key**:
   - Go to your RapidAPI dashboard
   - Find "GeoDB Cities API" in your subscriptions
   - Copy the API key (starts with something like `abc123def456...`)

### 2. Set Up Environment Variable

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_RAPIDAPI_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your actual RapidAPI key.

### 3. Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### 4. Verify It's Working

1. Open your browser console (F12)
2. Look for: `"✅ RapidAPI key found! Real-time destination search is enabled."`
3. Try searching for destinations in the onboarding or create trip pages

## API Limits (Free Tier)

- **Monthly requests**: 10,000
- **Rate limit**: 1 request per second
- **Search results**: Up to 5 cities per search
- **Popular cities**: Up to 6 cities

## Troubleshooting

### If you see "403 Forbidden":
- Your API key is invalid or expired
- Check that you copied the key correctly
- Make sure you're subscribed to the GeoDB Cities API

### If you see "429 Too Many Requests":
- You've hit the rate limit
- Wait a few seconds and try again
- The app will automatically use fallback data

### If you see "Query limit exceeded":
- The free plan has restrictions on query parameters
- The app automatically adjusts to stay within limits

## Current Fallback System

Even without a valid API key, the app works with:
- 12 popular cities as fallback data
- Search functionality that filters the fallback data
- Full user experience with static data

## Testing the API

You can test your API key manually:

```bash
curl -X GET "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=3&sort=-population&types=CITY" \
  -H "X-RapidAPI-Key: YOUR_API_KEY_HERE" \
  -H "X-RapidAPI-Host: wft-geo-db.p.rapidapi.com"
```

Replace `YOUR_API_KEY_HERE` with your actual API key.

## Expected Behavior

**With valid API key:**
- Real-time search for any city/country worldwide
- Live population data
- Geographic information

**Without API key (current state):**
- 12 popular cities as fallback
- Search within fallback data
- Still fully functional for testing 