"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetReminderSettingsQuery,
  useUpdateReminderSettingsMutation,
} from "@/redux/slices/api/notifications/notifications";

const ReminderSettingsPage = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { data: settingsData, isLoading } =
    useGetReminderSettingsQuery(undefined);
  const [updateSettings] = useUpdateReminderSettingsMutation();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    tripReminderDays: 1,
    tripReminderTime: "09:00",
    packingReminderDays: 2,
    packingReminderTime: "18:00",
    weatherUpdates: true,
    collaborationUpdates: true,
  });

  React.useEffect(() => {
    if (settingsData?.data) {
      setSettings(settingsData.data);
    }
  }, [settingsData]);

  const handleSettingChange = (
    key: string,
    value: boolean | number | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(settings).unwrap();
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

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
                Packing Reminders
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Notification Preferences
          </h2>
          <p className="text-gray-600">
            Choose how you want to be notified about your trips and packing
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "emailNotifications",
                      !settings.emailNotifications
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Push Notification
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive push notifications
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "pushNotifications",
                      !settings.pushNotifications
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.pushNotifications ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.pushNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reminder Timing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days before trip
                </label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={settings.tripReminderDays}
                  onChange={(e) =>
                    handleSettingChange(
                      "tripReminderDays",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many days before your trip to send a reminder
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time of day
                </label>
                <input
                  type="time"
                  value={settings.tripReminderTime}
                  onChange={(e) =>
                    handleSettingChange("tripReminderTime", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  What time to send trip reminders
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days before packing reminder
                </label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={settings.packingReminderDays}
                  onChange={(e) =>
                    handleSettingChange(
                      "packingReminderDays",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many days before your trip to send a packing reminder
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Packing reminder time
                </label>
                <input
                  type="time"
                  value={settings.packingReminderTime}
                  onChange={(e) =>
                    handleSettingChange("packingReminderTime", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  What time to send packing reminders
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Notifications
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Weather Updates
                  </label>
                  <p className="text-sm text-gray-500">
                    Get notified about weather changes for your trips
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "weatherUpdates",
                      !settings.weatherUpdates
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.weatherUpdates ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.weatherUpdates
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Collaboration Updates
                  </label>
                  <p className="text-sm text-gray-500">
                    Get notified about collaboration changes
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "collaborationUpdates",
                      !settings.collaborationUpdates
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.collaborationUpdates
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.collaborationUpdates
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReminderSettingsPage;
