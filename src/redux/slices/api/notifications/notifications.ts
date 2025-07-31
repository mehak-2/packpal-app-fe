import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../../../config/api";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
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

  tagTypes: ["Notifications", "ReminderSettings"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({
        page = 1,
        limit = 20,
        unreadOnly = false,
      }: { page?: number; limit?: number; unreadOnly?: boolean } = {}) => ({
        url: "/notifications",
        params: { page, limit, unreadOnly },
      }),
      providesTags: ["Notifications"],
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
    getReminderSettings: builder.query({
      query: () => "/notifications/reminder-settings",
      providesTags: ["ReminderSettings"],
    }),
    updateReminderSettings: builder.mutation({
      query: (settings) => ({
        url: "/notifications/reminder-settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["ReminderSettings"],
    }),
    createNotification: builder.mutation({
      query: (notification) => ({
        url: "/notifications",
        method: "POST",
        body: notification,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useGetReminderSettingsQuery,
  useUpdateReminderSettingsMutation,
  useCreateNotificationMutation,
} = notificationsApi;
