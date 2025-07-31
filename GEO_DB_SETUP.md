# GeoDB Cities API Setup

This project now uses the GeoDB Cities API (via RapidAPI) for real-time destination search in both the onboarding and create trip pages.

## Setup Instructions

### 1. Get a RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up or log in to your account
3. Search for "GeoDB Cities API"
4. Subscribe to the free tier (10,000 requests per month)
5. Copy your API key from the RapidAPI dashboard

### 2. Configure Environment Variables

Create a `.env.local` file in the `client` directory and add your RapidAPI key:

```env
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
```

Replace `your_rapidapi_key_here` with your actual RapidAPI key.

### 3. Features

The integration provides:

- **Real-time destination search** with autocomplete
- **Popular destinations** grid with city cards
- **Multi-select functionality** for onboarding
- **Single-select functionality** for trip creation
- **Country codes** and population information
- **Responsive design** with loading states

### 4. API Endpoints Used

- `GET /cities` - Search cities by name prefix
- `GET /cities` - Get popular cities (sorted by population)

### 5. Components

- `DestinationSelector` - Single destination selection
- `MultiDestinationSelector` - Multiple destination selection
- `geoDbService` - API service wrapper

### 6. Usage

The components are now used in:
- `/auth/onboarding` - Multi-select for preferred destinations
- `/auth/dashboard/create-trip` - Single-select for trip destination

### 7. Error Handling

The service includes error handling for:
- Network failures
- API rate limits
- Invalid responses
- Missing API keys

### 8. Performance

- Caching with react-select
- Debounced search (minimum 2 characters)
- Loading states for better UX
- Optimized API calls

## Troubleshooting

If destinations are not loading:

1. Check that your RapidAPI key is correctly set in `.env.local`
2. Verify your RapidAPI subscription is active
3. Check the browser console for error messages
4. Ensure you have an internet connection

## API Limits

- Free tier: 10,000 requests per month
- Rate limit: 1 request per second
- Maximum results per request: 10 cities 