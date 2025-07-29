import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../../../config/api";

export const tripsApi = createApi({
  reducerPath: "tripsApi",
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
    getTrips: builder.query({
      query: () => "/trips",
    }),
    getTripById: builder.query({
      query: (id) => `/trips/${id}`,
    }),
    createTrip: builder.mutation({
      query: (body) => ({
        url: "/trips",
        method: "POST",
        body,
      }),
    }),
    updateTrip: builder.mutation({
      query: ({ id, body }) => ({
        url: `/trips/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}`,
        method: "DELETE",
      }),
    }),
    updatePackingList: builder.mutation({
      query: ({ id, packingList }) => ({
        url: `/trips/${id}/packing-list`,
        method: "PUT",
        body: packingList,
      }),
    }),
    regeneratePackingList: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/regenerate-packing-list`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetTripsQuery,
  useGetTripByIdQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  useUpdatePackingListMutation,
  useRegeneratePackingListMutation,
} = tripsApi;
