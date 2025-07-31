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
  tagTypes: ["Trips"],
  endpoints: (builder) => ({
    getTrips: builder.query({
      query: () => "/trips",
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({
                type: "Trips" as const,
                id: _id,
              })),
              { type: "Trips", id: "LIST" },
            ]
          : [{ type: "Trips", id: "LIST" }],
    }),
    getTripById: builder.query({
      query: (id) => `/trips/${id}`,
      providesTags: (result, error, id) => [{ type: "Trips", id }],
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
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(tripsApi.util.invalidateTags([{ type: "Trips", id }]));
          dispatch(
            tripsApi.util.invalidateTags([{ type: "Trips", id: "LIST" }])
          );
        } catch {}
      },
    }),
    regeneratePackingList: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/regenerate-packing-list`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(tripsApi.util.invalidateTags([{ type: "Trips", id }]));
          dispatch(
            tripsApi.util.invalidateTags([{ type: "Trips", id: "LIST" }])
          );
        } catch {}
      },
    }),
    generateAIPackingList: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/ai-packing-list`,
        method: "POST",
      }),
    }),
    getAIPackingSuggestions: builder.query({
      query: (id) => `/trips/${id}/ai-suggestions`,
    }),
    createTemplate: builder.mutation({
      query: (body) => ({
        url: "/templates",
        method: "POST",
        body,
      }),
    }),
    getTemplates: builder.query({
      query: () => "/templates",
    }),
    deleteTemplate: builder.mutation({
      query: (id) => ({
        url: `/templates/${id}`,
        method: "DELETE",
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
  useGenerateAIPackingListMutation,
  useGetAIPackingSuggestionsQuery,
  useCreateTemplateMutation,
  useGetTemplatesQuery,
  useDeleteTemplateMutation,
} = tripsApi;
