import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authApi } from "./slices/api/auth/auth";
import { tripsApi } from "./slices/api/trips/trips";
import { destinationsApi } from "./slices/api/destinations/destinations";
import { citiesApi } from "./slices/api/cities/cities";
import { collaborationApi } from "./slices/api/collaboration/collaboration";
import { notificationsApi } from "./slices/api/notifications/notifications";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [tripsApi.reducerPath]: tripsApi.reducer,
  [destinationsApi.reducerPath]: destinationsApi.reducer,
  [citiesApi.reducerPath]: citiesApi.reducer,
  [collaborationApi.reducerPath]: collaborationApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      tripsApi.middleware,
      destinationsApi.middleware,
      citiesApi.middleware,
      collaborationApi.middleware,
      notificationsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
