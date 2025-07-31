import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../../../config/api";

export const destinationsApi = createApi({
  reducerPath: "destinationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDestinations: builder.query({
      query: () => "/destinations",
    }),
    getDestinationById: builder.query({
      query: (id) => `/destinations/${id}`,
    }),
    getAllCountries: builder.query({
      query: () => "/countries",
    }),
    searchDestinations: builder.query({
      query: (searchQuery) =>
        `/countries/search?q=${encodeURIComponent(searchQuery)}`,
    }),
  }),
});

export const {
  useGetDestinationsQuery,
  useGetDestinationByIdQuery,
  useGetAllCountriesQuery,
  useSearchDestinationsQuery,
} = destinationsApi;
