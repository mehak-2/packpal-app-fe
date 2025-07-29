"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/redux/slices/api/auth/auth";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    travelFrequency: string;
    travelStyle: string;
    preferredClimate: string;
    preferredDestinations: string[];
    preferredActivities: string[];
  }>({
    travelFrequency: "",
    travelStyle: "",
    preferredClimate: "",
    preferredDestinations: [],
    preferredActivities: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const [completeOnboarding] = authApi.useCompleteOnboardingMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const steps = [
    {
      id: 1,
      title: "How often do you travel?",
      subtitle: "This helps us understand your packing needs.",
      options: [
        "Once a year",
        "A few times a year",
        "Once a month",
        "A few times a month",
        "Once a week",
        "A few times a week",
      ],
      field: "travelFrequency",
    },
    {
      id: 2,
      title: "What's your travel style?",
      subtitle: "This helps us understand your packing preferences.",
      options: ["Business", "Leisure", "Adventure", "Family", "Solo", "Luxury"],
      field: "travelStyle",
    },
    {
      id: 3,
      title: "Preferred climates & destinations",
      subtitle:
        "Tell us about the climates and destinations you prefer to travel to. This will help us suggest the best packing lists for you.",
      field: "climateAndDestinations",
    },
    {
      id: 4,
      title: "Default Preferences",
      subtitle:
        "Select your preferred activities to customize trip recommendations.",
      field: "preferences",
    },
  ];

  const destinations = [
    { name: "San Francisco", location: "San Francisco, California" },
    { name: "New York", location: "New York, New York" },
    { name: "Los Angeles", location: "Los Angeles, California" },
  ];

  const activities = [
    {
      title: "Sightseeing",
      description: "Exploring landmarks and cultural sites",
    },
    {
      title: "Adventure",
      description: "Outdoor activities like hiking, biking, or water sports",
    },
    {
      title: "Relaxation",
      description: "Relaxing on beaches, spa treatments, or yoga retreats",
    },
    {
      title: "Culinary Experiences",
      description: "Trying local cuisine, food tours, or cooking classes",
    },
    {
      title: "Entertainment",
      description: "Attending concerts, festivals, or nightlife events",
    },
    {
      title: "Shopping",
      description: "Shopping for souvenirs, local crafts, or designer goods",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token available:", !!token);
      await completeOnboarding({ ...formData }).unwrap();
      router.push("/auth/dashboard");
    } catch (error) {
      console.error("Onboarding completion failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDestination = (destination: string) => {
    const current = formData.preferredDestinations;
    if (current.includes(destination)) {
      updateFormData(
        "preferredDestinations",
        current.filter((d) => d !== destination)
      );
    } else {
      updateFormData("preferredDestinations", [...current, destination]);
    }
  };

  const toggleActivity = (activity: string) => {
    const current = formData.preferredActivities;
    if (current.includes(activity)) {
      updateFormData(
        "preferredActivities",
        current.filter((a) => a !== activity)
      );
    } else {
      updateFormData("preferredActivities", [...current, activity]);
    }
  };

  const currentStepData = steps[currentStep - 1];

  const renderStepContent = () => {
    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              Preferred climates
            </h4>
            <div className="flex space-x-3">
              {["Warm", "Cold", "Both"].map((climate) => (
                <button
                  key={climate}
                  onClick={() => updateFormData("preferredClimate", climate)}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    formData.preferredClimate === climate
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {climate}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              Preferred destinations
            </h4>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">for destinations</p>
            </div>

            <div className="space-y-2">
              {destinations.map((dest) => (
                <div
                  key={dest.name}
                  onClick={() => toggleDestination(dest.name)}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.preferredDestinations.includes(dest.name)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-4 h-4 mr-3 text-gray-400">📍</div>
                  <div>
                    <div className="font-medium text-gray-900">{dest.name}</div>
                    <div className="text-sm text-gray-600">{dest.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.title}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <button
                onClick={() => toggleActivity(activity.title)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.preferredActivities.includes(activity.title)
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.preferredActivities.includes(activity.title)
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {currentStepData.options?.map((option) => (
          <label
            key={option}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
          >
            <span className="text-gray-900">{option}</span>
            <input
              type="radio"
              name={currentStepData.field}
              value={option}
              checked={
                formData[currentStepData.field as keyof typeof formData] ===
                option
              }
              onChange={(e) =>
                updateFormData(currentStepData.field, e.target.value)
              }
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
          </label>
        ))}
      </div>
    );
  };

  const canProceed = () => {
    if (currentStep === 3) {
      return (
        formData.preferredClimate && formData.preferredDestinations.length > 0
      );
    }
    if (currentStep === 4) {
      return formData.preferredActivities.length > 0;
    }
    return formData[currentStepData.field as keyof typeof formData];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 text-center">
            {currentStepData.title}
          </h3>
          <p className="text-sm text-gray-600 text-center">
            {currentStepData.subtitle}
          </p>

          {renderStepContent()}
        </div>

        <div className="flex justify-center">
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isLoading || !canProceed()}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Completing..." : "Save Preferences"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
