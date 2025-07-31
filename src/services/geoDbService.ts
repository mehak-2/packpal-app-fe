import axios from "axios";
import { ENV_CONFIG } from "@/config/env";

const RAPIDAPI_KEY = ENV_CONFIG.RAPIDAPI_KEY;
const RAPIDAPI_HOST = ENV_CONFIG.RAPIDAPI_HOST;

// Fallback data for testing when API key is not available
const FALLBACK_CITIES: GeoDBCity[] = [
  {
    id: 1,
    name: "New York",
    country: "United States",
    countryCode: "US",
    region: "New York",
    regionCode: "NY",
    latitude: 40.7128,
    longitude: -74.006,
    population: 8336817,
    timezone: "America/New_York",
  },
  {
    id: 2,
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    region: "England",
    regionCode: "ENG",
    latitude: 51.5074,
    longitude: -0.1278,
    population: 8982000,
    timezone: "Europe/London",
  },
  {
    id: 3,
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    region: "Tokyo",
    regionCode: "13",
    latitude: 35.6762,
    longitude: 139.6503,
    population: 13929286,
    timezone: "Asia/Tokyo",
  },
  {
    id: 4,
    name: "Paris",
    country: "France",
    countryCode: "FR",
    region: "Île-de-France",
    regionCode: "11",
    latitude: 48.8566,
    longitude: 2.3522,
    population: 2161000,
    timezone: "Europe/Paris",
  },
  {
    id: 5,
    name: "Sydney",
    country: "Australia",
    countryCode: "AU",
    region: "New South Wales",
    regionCode: "NSW",
    latitude: -33.8688,
    longitude: 151.2093,
    population: 5312000,
    timezone: "Australia/Sydney",
  },
  {
    id: 6,
    name: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    region: "Dubai",
    regionCode: "DU",
    latitude: 25.2048,
    longitude: 55.2708,
    population: 3331000,
    timezone: "Asia/Dubai",
  },
  {
    id: 7,
    name: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    region: "Central Region",
    regionCode: "01",
    latitude: 1.3521,
    longitude: 103.8198,
    population: 5850342,
    timezone: "Asia/Singapore",
  },
  {
    id: 8,
    name: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    region: "Catalonia",
    regionCode: "CT",
    latitude: 41.3851,
    longitude: 2.1734,
    population: 1620000,
    timezone: "Europe/Madrid",
  },
  {
    id: 9,
    name: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    region: "North Holland",
    regionCode: "NH",
    latitude: 52.3676,
    longitude: 4.9041,
    population: 821752,
    timezone: "Europe/Amsterdam",
  },
  {
    id: 10,
    name: "Berlin",
    country: "Germany",
    countryCode: "DE",
    region: "Berlin",
    regionCode: "BE",
    latitude: 52.52,
    longitude: 13.405,
    population: 3669491,
    timezone: "Europe/Berlin",
  },
  {
    id: 11,
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    region: "Lazio",
    regionCode: "62",
    latitude: 41.9028,
    longitude: 12.4964,
    population: 4342212,
    timezone: "Europe/Rome",
  },
  {
    id: 12,
    name: "Vienna",
    country: "Austria",
    countryCode: "AT",
    region: "Vienna",
    regionCode: "9",
    latitude: 48.2082,
    longitude: 16.3738,
    population: 1897000,
    timezone: "Europe/Vienna",
  },
];

export interface GeoDBCity {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  population: number;
  timezone: string;
}

export interface GeoDBResponse {
  data: GeoDBCity[];
  links: {
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };
  metadata: {
    currentOffset: number;
    totalCount: number;
  };
}

export interface GeoDBCountry {
  id: number;
  name: string;
  code: string;
  population: number;
  region: string;
  subregion: string;
  capital: string;
  flag: string;
}

class GeoDBService {
  constructor() {
    if (!RAPIDAPI_KEY) {
      console.warn(
        "⚠️ No RapidAPI key found. Using fallback data. To enable real-time search, set NEXT_PUBLIC_RAPIDAPI_KEY in your .env.local file"
      );
    } else {
      console.log(
        "✅ RapidAPI key found! Real-time destination search is enabled."
      );
    }
  }

  private api = axios.create({
    baseURL: "https://wft-geo-db.p.rapidapi.com/v1/geo",
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": RAPIDAPI_HOST,
    },
  });

  async searchCities(query: string, limit: number = 10): Promise<GeoDBCity[]> {
    if (!query || query.length < 2) {
      return [];
    }

    // If no API key is available, use fallback data
    if (!RAPIDAPI_KEY) {
      console.log("No API key available, using fallback data");
      return FALLBACK_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          city.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }

    try {
      const response = await this.api.get<GeoDBResponse>("/cities", {
        params: {
          namePrefix: query,
          limit: Math.min(limit, 5), // Free plan limit
          sort: "-population",
          types: "CITY",
          includeDeleted: "NONE",
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status: number; data: unknown };
      };
      console.error(
        "Error searching cities:",
        axiosError?.response?.data || error
      );

      // Check for specific error types
      if (axiosError?.response?.status === 403) {
        console.warn("API key might be invalid. Using fallback data.");
      } else if (axiosError?.response?.status === 429) {
        console.warn("Rate limit exceeded. Using fallback data.");
      }

      // Fallback to static data on API error
      return FALLBACK_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          city.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }
  }

  async getPopularCities(limit: number = 6): Promise<GeoDBCity[]> {
    // If no API key is available, use fallback data
    if (!RAPIDAPI_KEY) {
      console.log("No API key available, using fallback popular cities");
      return FALLBACK_CITIES.slice(0, limit);
    }

    try {
      const response = await this.api.get<GeoDBResponse>("/cities", {
        params: {
          limit: Math.min(limit, 6), // Free plan limit
          sort: "-population",
          types: "CITY",
          includeDeleted: "NONE",
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status: number; data: unknown };
      };
      console.error(
        "Error fetching popular cities:",
        axiosError?.response?.data || error
      );

      // Check for specific error types
      if (axiosError?.response?.status === 403) {
        console.warn("API key might be invalid. Using fallback data.");
      } else if (axiosError?.response?.status === 429) {
        console.warn("Rate limit exceeded. Using fallback data.");
      }

      // Fallback to static data on API error
      return FALLBACK_CITIES.slice(0, limit);
    }
  }

  async searchCitiesByCountry(
    query: string,
    countryCode: string,
    limit: number = 10
  ): Promise<GeoDBCity[]> {
    if (!query || query.length < 2) {
      return [];
    }

    // If no API key is available, use fallback data
    if (!RAPIDAPI_KEY) {
      return FALLBACK_CITIES.filter((city) => city.countryCode === countryCode)
        .filter(
          (city) =>
            city.name.toLowerCase().includes(query.toLowerCase()) ||
            city.country.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);
    }

    try {
      const response = await this.api.get<GeoDBResponse>("/cities", {
        params: {
          namePrefix: query,
          countryIds: countryCode,
          limit,
          sort: "-population",
          types: "CITY",
          includeDeleted: "NONE",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error searching cities by country:", error);
      return [];
    }
  }

  async searchCountries(
    query: string,
    limit: number = 10
  ): Promise<GeoDBCountry[]> {
    if (!query || query.length < 2) {
      return [];
    }

    // If no API key is available, return empty
    if (!RAPIDAPI_KEY) {
      return [];
    }

    try {
      const response = await this.api.get("/countries", {
        params: {
          namePrefix: query,
          limit,
          sort: "-population",
        },
      });

      return response.data.data || [];
    } catch (error) {
      console.error("Error searching countries:", error);
      return [];
    }
  }
}

export const geoDbService = new GeoDBService();
