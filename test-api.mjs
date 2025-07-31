import axios from 'axios';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local file
function loadEnvFile() {
  try {
    const envPath = join(__dirname, '.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.log('❌ .env.local file not found');
    return {};
  }
}

const envVars = loadEnvFile();
const API_KEY = envVars.NEXT_PUBLIC_RAPIDAPI_KEY;
const API_HOST = 'wft-geo-db.p.rapidapi.com';

async function testAPI() {
  console.log('🔍 Testing RapidAPI Key...');
  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');
  
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.log('❌ Please set your actual API key in .env.local file');
    console.log('📝 Edit .env.local and replace "your_api_key_here" with your real API key');
    return;
  }

  try {
    console.log('🌐 Making API request...');
    const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      params: {
        limit: 3,
        sort: '-population',
        types: 'CITY'
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });

    console.log('✅ API Key is working!');
    console.log('📊 Found cities:', response.data.data.length);
    console.log('🌍 Sample cities:');
    response.data.data.forEach(city => {
      console.log(`   - ${city.name}, ${city.country} (Population: ${city.population?.toLocaleString() || 'N/A'})`);
    });

    console.log('\n🎉 Your API key is valid! You can now restart your dev server to use real-time data.');

  } catch (error) {
    console.log('❌ API Key test failed:');
    if (error.response?.status === 403) {
      console.log('   - Invalid API key or not subscribed to GeoDB Cities API');
      console.log('   - Make sure you subscribed to the GeoDB Cities API on RapidAPI');
    } else if (error.response?.status === 429) {
      console.log('   - Rate limit exceeded (try again in a few seconds)');
    } else {
      console.log('   - Error:', error.response?.data || error.message);
    }
  }
}

testAPI(); 