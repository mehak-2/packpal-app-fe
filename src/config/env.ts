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
};

const isDevelopment = process.env.NODE_ENV === "development";
const config = isDevelopment ? ENV_CONFIG.development : ENV_CONFIG.production;

export const API_CONFIG = {
  baseUrl: config.apiBaseUrl,
  serverUrl: config.serverUrl,
};
