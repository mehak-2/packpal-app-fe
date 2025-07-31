export const ENV_CONFIG = {
  development: {
    apiBaseUrl: "http://localhost:5000/api",
    serverUrl: "http://localhost:5000",
  },
  production: {
    apiBaseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://packpal-app-be.onrender.com/api",
    serverUrl:
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "https://packpal-app-be.onrender.com",
  },
  RAPIDAPI_KEY:
    process.env.NEXT_PUBLIC_RAPIDAPI_KEY ||
    "481449c788msh69e72119f2789b3p104c18jsn11d466e3b9d7",
  RAPIDAPI_HOST:
    process.env.NEXT_PUBLIC_RAPIDAPI_HOST || "wft-geo-db.p.rapidapi.com",
};

const isDevelopment = process.env.NODE_ENV === "development";
const config = isDevelopment ? ENV_CONFIG.development : ENV_CONFIG.production;

export const API_CONFIG = {
  baseUrl: config.apiBaseUrl,
  serverUrl: config.serverUrl,
};
