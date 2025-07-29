import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../../../config/api";

export const destinationsApi = createApi({
  reducerPath: "destinationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.baseUrl}/destinations`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Destination"],
  endpoints: (builder) => ({
    getAllCountries: builder.query({
      query: () => "/countries",
      providesTags: ["Destination"],
    }),
    searchDestinations: builder.query({
      query: (query) => `/search?q=${encodeURIComponent(query)}`,
      providesTags: ["Destination"],
    }),
  }),
});

export const { useGetAllCountriesQuery, useSearchDestinationsQuery } =
  destinationsApi;
