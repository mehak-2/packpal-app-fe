import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../../../config/api";

export const citiesApi = createApi({
  reducerPath: "citiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.baseUrl}/cities`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["City"],
  endpoints: (builder) => ({
    searchCities: builder.query({
      query: (query) => `/search?q=${encodeURIComponent(query)}`,
      providesTags: ["City"],
    }),
    getPopularCities: builder.query({
      query: (limit = 20) => `/popular?limit=${limit}`,
      providesTags: ["City"],
    }),
    getCityDetails: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "City", id }],
    }),
    getNearbyCities: builder.query({
      query: ({ latitude, longitude, radius = 100, limit = 10 }) =>
        `/nearby/${latitude}/${longitude}?radius=${radius}&limit=${limit}`,
      providesTags: ["City"],
    }),
    getCitiesByCountry: builder.query({
      query: ({ countryCode, limit = 20 }) =>
        `/country/${countryCode}?limit=${limit}`,
      providesTags: ["City"],
    }),
  }),
});

export const {
  useSearchCitiesQuery,
  useGetPopularCitiesQuery,
  useGetCityDetailsQuery,
  useGetNearbyCitiesQuery,
  useGetCitiesByCountryQuery,
} = citiesApi;
