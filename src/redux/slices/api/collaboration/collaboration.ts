import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../../../config/api";

export const collaborationApi = createApi({
  reducerPath: "collaborationApi",
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
  tagTypes: ["Collaborators", "ActivityLog"],
  endpoints: (builder) => ({
    inviteCollaborator: builder.mutation({
      query: ({ tripId, email, role }) => ({
        url: `/collaboration/trips/${tripId}/invite`,
        method: "POST",
        body: { email, role },
      }),
      invalidatesTags: ["Collaborators"],
    }),
    getCollaborators: builder.query({
      query: (tripId) => `/collaboration/trips/${tripId}/collaborators`,
      providesTags: ["Collaborators"],
    }),
    getActivityLog: builder.query({
      query: ({ tripId, page = 1, limit = 20 }) => ({
        url: `/collaboration/trips/${tripId}/activity-log`,
        params: { page, limit },
      }),
      providesTags: ["ActivityLog"],
    }),
    acceptInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `/collaboration/invitations/${invitationId}/accept`,
        method: "POST",
      }),
    }),
    declineInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `/collaboration/invitations/${invitationId}/decline`,
        method: "POST",
      }),
    }),
    removeCollaborator: builder.mutation({
      query: ({ tripId, userId }) => ({
        url: `/collaboration/trips/${tripId}/collaborators/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Collaborators"],
    }),
    updateCollaboratorRole: builder.mutation({
      query: ({ tripId, userId, role }) => ({
        url: `/collaboration/trips/${tripId}/collaborators/${userId}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["Collaborators"],
    }),
  }),
});

export const {
  useInviteCollaboratorMutation,
  useGetCollaboratorsQuery,
  useGetActivityLogQuery,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
  useRemoveCollaboratorMutation,
  useUpdateCollaboratorRoleMutation,
} = collaborationApi;
