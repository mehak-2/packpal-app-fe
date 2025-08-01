"use client";

import { useState, useEffect } from "react";
import {
  useUpdateUserMutation,
  useUpdatePreferencesMutation,
} from "@/redux/slices/api/auth/auth";

interface User {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
}

interface UserSettings {
  email: string;
  password: string;
  confirmPassword: string;
}

interface UserPreferences {
  notifications: boolean;
  personalizedRecommendations: boolean;
  currency: string;
}

interface SettingsComponentProps {
  user: User | null;
}

const SettingsComponent = ({ user }: SettingsComponentProps) => {
  const [settings, setSettings] = useState<UserSettings>({
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: false,
    personalizedRecommendations: false,
    currency: "USD",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [updateUser] = useUpdateUserMutation();
  const [updatePreferences] = useUpdatePreferencesMutation();

  useEffect(() => {
    if (user) {
      setSettings((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleSettingsChange = (field: keyof UserSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (
    field: keyof UserPreferences,
    value: boolean | string
  ) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateAccount = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      if (settings.password && settings.password !== settings.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        return;
      }

      const updateData: { email: string; password?: string } = {
        email: settings.email,
      };
      if (settings.password) {
        updateData.password = settings.password;
      }

      await updateUser(updateData).unwrap();

      setMessage({ type: "success", text: "Account updated successfully!" });
      setSettings((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to update account";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await updatePreferences(preferences).unwrap();
      setMessage({ type: "success", text: "Preferences saved successfully!" });
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to save preferences";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-8">
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="card">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Account</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingsChange("email", e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Password</label>
              <div className="flex items-center space-x-3">
                <input
                  type="password"
                  value={settings.password}
                  onChange={(e) =>
                    handleSettingsChange("password", e.target.value)
                  }
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  onClick={handleUpdateAccount}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
            {settings.password && (
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) =>
                    handleSettingsChange("confirmPassword", e.target.value)
                  }
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Preferences
          </h3>
          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-800 font-medium">Notifications</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Receive notifications about new trips, recommendations, and
                  updates.
                </p>
              </div>
              <button
                onClick={() =>
                  handlePreferencesChange(
                    "notifications",
                    !preferences.notifications
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  preferences.notifications ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.notifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                ></span>
              </button>
            </div>

            {/* Personalized Recommendations */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-800 font-medium">
                  Personalized Recommendations
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Enable personalized trip recommendations based on your past
                  trips and preferences.
                </p>
              </div>
              <button
                onClick={() =>
                  handlePreferencesChange(
                    "personalizedRecommendations",
                    !preferences.personalizedRecommendations
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  preferences.personalizedRecommendations
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.personalizedRecommendations
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                ></span>
              </button>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-gray-800 font-medium">Currency</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Choose your preferred currency for displaying trip costs and
                  expenses.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                  {preferences.currency}
                </span>
                <select
                  value={preferences.currency}
                  onChange={(e) =>
                    handlePreferencesChange("currency", e.target.value)
                  }
                  className="text-blue-500 hover:text-blue-600 transition-colors bg-transparent border-none focus:outline-none focus:ring-0"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSavePreferences}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
