import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../../../config/api";

export const tripsApi = createApi({
  reducerPath: "tripsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.baseUrl}/trips`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Trip"],
  endpoints: (builder) => ({
    getTrips: builder.query({
      query: () => "",
      providesTags: ["Trip"],
    }),
    getTripById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Trip", id }],
    }),
    createTrip: builder.mutation({
      query: (tripData) => ({
        url: "",
        method: "POST",
        body: tripData,
      }),
      invalidatesTags: ["Trip"],
    }),
    updateTrip: builder.mutation({
      query: ({ id, ...tripData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: tripData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Trip", id },
        "Trip",
      ],
    }),
    deleteTrip: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trip"],
    }),
    updatePackingList: builder.mutation({
      query: ({ id, packingList }) => ({
        url: `/${id}/packing-list`,
        method: "PUT",
        body: { packingList },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Trip", id },
        "Trip",
      ],
    }),
    regeneratePackingList: builder.mutation({
      query: (id) => ({
        url: `/${id}/regenerate-packing-list`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Trip", id }, "Trip"],
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
