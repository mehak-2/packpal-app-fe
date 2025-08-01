import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../../../config/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.baseUrl,
  credentials: "include",
});

const authenticatedBaseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      queryFn: async (args, api, extraOptions) => {
        const result = await authenticatedBaseQuery(
          { url: "/auth/logout", method: "POST" },
          api,
          extraOptions
        );
        return result;
      },
    }),
    completeOnboarding: builder.mutation({
      queryFn: async (body, api, extraOptions) => {
        const result = await authenticatedBaseQuery(
          { url: "/auth/complete-onboarding", method: "POST", body },
          api,
          extraOptions
        );
        return result;
      },
    }),
    updateUser: builder.mutation({
      queryFn: async (body, api, extraOptions) => {
        const result = await authenticatedBaseQuery(
          { url: "/auth/update-user", method: "PUT", body },
          api,
          extraOptions
        );
        return result;
      },
    }),
    updatePreferences: builder.mutation({
      queryFn: async (body, api, extraOptions) => {
        const result = await authenticatedBaseQuery(
          { url: "/auth/update-preferences", method: "PUT", body },
          api,
          extraOptions
        );
        return result;
      },
    }),

    getMe: builder.query({
      queryFn: async (args, api, extraOptions) => {
        const result = await authenticatedBaseQuery(
          { url: "/auth/me" },
          api,
          extraOptions
        );
        return result;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useCompleteOnboardingMutation,
  useUpdateUserMutation,
  useUpdatePreferencesMutation,
  useGetMeQuery,
} = authApi;
