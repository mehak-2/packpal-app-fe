"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useGetReminderSettingsQuery,
  useUpdateReminderSettingsMutation,
} from "@/redux/slices/api/notifications/notifications";
import {
  useUpdateUserMutation,
  useGetMeQuery,
} from "@/redux/slices/api/auth/auth";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  icon?: string;
  read: boolean;
  createdAt: string;
  tripId?: {
    _id: string;
    destination: string;
    country: string;
  };
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  tripReminderDays: number;
  tripReminderTime: string;
  packingReminderDays: number;
  packingReminderTime: string;
  weatherUpdates: boolean;
  collaborationUpdates: boolean;
}

interface UserData {
  notifications: boolean;
}

const NotificationsPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<"notifications" | "settings">(
    "notifications"
  );
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      pushNotifications: true,
      tripReminderDays: 1,
      tripReminderTime: "09:00",
      packingReminderDays: 2,
      packingReminderTime: "18:00",
      weatherUpdates: true,
      collaborationUpdates: true,
    });
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] =
    useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  const { data: notificationsData, isLoading } = useGetNotificationsQuery({
    page: currentPage,
    limit: 20,
    unreadOnly: showUnreadOnly,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [updateUser] = useUpdateUserMutation();
  const [updateReminderSettings] = useUpdateReminderSettingsMutation();

  const { data: userData } = useGetMeQuery(undefined);
  const { data: reminderSettingsData } = useGetReminderSettingsQuery(undefined);

  const notifications = notificationsData?.data?.notifications || [];
  const totalPages = notificationsData?.data?.totalPages || 1;

  useEffect(() => {
    if (
      userData &&
      typeof userData === "object" &&
      "data" in userData &&
      userData.data &&
      typeof userData.data === "object" &&
      "notifications" in userData.data
    ) {
      setGlobalNotificationsEnabled(
        (userData.data as UserData).notifications || false
      );
    }
  }, [userData]);

  useEffect(() => {
    if (
      reminderSettingsData &&
      typeof reminderSettingsData === "object" &&
      "data" in reminderSettingsData &&
      reminderSettingsData.data
    ) {
      setNotificationSettings(
        reminderSettingsData.data as NotificationSettings
      );
    }
  }, [reminderSettingsData]);

  const handleGlobalNotificationToggle = async () => {
    try {
      setIsLoadingSettings(true);
      await updateUser({ notifications: !globalNotificationsEnabled }).unwrap();
      setGlobalNotificationsEnabled(!globalNotificationsEnabled);
    } catch (error) {
      console.error("Error updating global notification setting:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSettingChange = async (
    setting: keyof NotificationSettings,
    value: boolean | number | string
  ) => {
    try {
      setIsLoadingSettings(true);
      const updatedSettings = { ...notificationSettings, [setting]: value };

      await updateReminderSettings(updatedSettings).unwrap();
      setNotificationSettings(updatedSettings);
    } catch (error) {
      console.error("Error updating notification setting:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const getNotificationIcon = (type: string, icon?: string) => {
    if (icon) {
      switch (icon) {
        case "airplane":
          return (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          );
        case "suitcase":
          return (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          );
        case "checkmark":
          return (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          );
        case "location":
          return (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          );
        case "home":
          return (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          );
        case "plus":
          return (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          );
        default:
          return (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          );
      }
    }

    switch (type) {
      case "trip_reminder":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        );
      case "packing_reminder":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case "collaboration_invite":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(undefined).unwrap();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId).unwrap();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

    if (notification.tripId) {
      router.push(`/auth/dashboard/trips/${notification.tripId._id}`);
    }
  };

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Notifications
          </h2>
          <div className="flex space-x-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Unread only</span>
            </label>
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading notifications...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {showUnreadOnly
              ? "No unread notifications"
              : "No notifications yet"}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification: Notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-colors ${
                notification.read ? "opacity-75" : "border-blue-300 bg-blue-50"
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 ${
                    notification.read ? "text-gray-400" : "text-blue-600"
                  }`}
                >
                  {getNotificationIcon(notification.type, notification.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-sm font-medium ${
                          notification.read ? "text-gray-900" : "text-blue-900"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.tripId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Trip: {notification.tripId.destination},{" "}
                          {notification.tripId.country}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.createdAt)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification._id);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Notification Settings
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900">
                Global Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Enable or disable all notifications
              </p>
            </div>
            <button
              onClick={handleGlobalNotificationToggle}
              disabled={isLoadingSettings}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                globalNotificationsEnabled ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  globalNotificationsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              ></span>
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Notification Types
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Email Notifications
                  </h4>
                  <p className="text-xs text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "emailNotifications",
                      !notificationSettings.emailNotifications
                    )
                  }
                  disabled={isLoadingSettings || !globalNotificationsEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    notificationSettings.emailNotifications &&
                    globalNotificationsEnabled
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.emailNotifications &&
                      globalNotificationsEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Push Notifications
                  </h4>
                  <p className="text-xs text-gray-600">
                    Receive notifications in the app
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "pushNotifications",
                      !notificationSettings.pushNotifications
                    )
                  }
                  disabled={isLoadingSettings || !globalNotificationsEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    notificationSettings.pushNotifications &&
                    globalNotificationsEnabled
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.pushNotifications &&
                      globalNotificationsEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Weather Updates
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get weather updates for your trips
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "weatherUpdates",
                      !notificationSettings.weatherUpdates
                    )
                  }
                  disabled={isLoadingSettings || !globalNotificationsEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    notificationSettings.weatherUpdates &&
                    globalNotificationsEnabled
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.weatherUpdates &&
                      globalNotificationsEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Collaboration Updates
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get updates about trip collaborations
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "collaborationUpdates",
                      !notificationSettings.collaborationUpdates
                    )
                  }
                  disabled={isLoadingSettings || !globalNotificationsEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    notificationSettings.collaborationUpdates &&
                    globalNotificationsEnabled
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.collaborationUpdates &&
                      globalNotificationsEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Reminder Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-800">
                  Trip Reminders
                </h4>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Days before trip
                  </label>
                  <select
                    value={notificationSettings.tripReminderDays}
                    onChange={(e) =>
                      handleSettingChange(
                        "tripReminderDays",
                        parseInt(e.target.value)
                      )
                    }
                    disabled={isLoadingSettings || !globalNotificationsEnabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value={1}>1 day</option>
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={7}>1 week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={notificationSettings.tripReminderTime}
                    onChange={(e) =>
                      handleSettingChange("tripReminderTime", e.target.value)
                    }
                    disabled={isLoadingSettings || !globalNotificationsEnabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-800">
                  Packing Reminders
                </h4>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Days before trip
                  </label>
                  <select
                    value={notificationSettings.packingReminderDays}
                    onChange={(e) =>
                      handleSettingChange(
                        "packingReminderDays",
                        parseInt(e.target.value)
                      )
                    }
                    disabled={isLoadingSettings || !globalNotificationsEnabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value={1}>1 day</option>
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={7}>1 week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={notificationSettings.packingReminderTime}
                    onChange={(e) =>
                      handleSettingChange("packingReminderTime", e.target.value)
                    }
                    disabled={isLoadingSettings || !globalNotificationsEnabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 mr-4"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "notifications"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === "notifications"
          ? renderNotificationsTab()
          : renderSettingsTab()}
      </main>
    </div>
  );
};

export default NotificationsPage;
