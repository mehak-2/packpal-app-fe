"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/redux/slices/api/auth/auth";
import MultiDestinationSelector from "@/components/MultiDestinationSelector";
import { GeoDBCity } from "@/services/geoDbService";

interface Activity {
  title: string;
  description: string;
  icon: string;
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    travelFrequency: string;
    travelStyle: string;
    preferredClimate: string;
    preferredDestinations: GeoDBCity[];
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
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();
  const [completeOnboarding] = authApi.useCompleteOnboardingMutation();

  const [activities] = useState<Activity[]>([
    {
      title: "Sightseeing",
      description: "Exploring landmarks and cultural sites",
      icon: "🏛️",
    },
    {
      title: "Adventure",
      description: "Outdoor activities like hiking, biking, or water sports",
      icon: "🏔️",
    },
    {
      title: "Relaxation",
      description: "Relaxing on beaches, spa treatments, or yoga retreats",
      icon: "🏖️",
    },
    {
      title: "Culinary Experiences",
      description: "Trying local cuisine, food tours, or cooking classes",
      icon: "🍽️",
    },
    {
      title: "Entertainment",
      description: "Attending concerts, festivals, or nightlife events",
      icon: "🎭",
    },
    {
      title: "Shopping",
      description: "Shopping for souvenirs, local crafts, or designer goods",
      icon: "🛍️",
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setIsAuthenticated(true);
    setIsLoaded(true);
  }, [router]);

  const steps = [
    {
      id: 1,
      title: "How often do you travel?",
      subtitle: "This helps us understand your packing needs.",
      icon: "🗓️",
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
      icon: "🎒",
      options: ["Business", "Leisure", "Adventure", "Family", "Solo", "Luxury"],
      field: "travelStyle",
    },
    {
      id: 3,
      title: "Preferred climates & destinations",
      subtitle:
        "Tell us about the climates and destinations you prefer to travel to. This will help us suggest the best packing lists for you.",
      icon: "🌍",
      field: "climateAndDestinations",
    },
    {
      id: 4,
      title: "Default Preferences",
      subtitle:
        "Select your preferred activities to customize trip recommendations.",
      icon: "🎯",
      field: "preferences",
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
      await completeOnboarding({ ...formData }).unwrap();
      router.push("/auth/dashboard");
    } catch (error) {
      console.error("Onboarding completion failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (
    field: string,
    value: string | string[] | GeoDBCity[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDestinationsChange = (destinations: GeoDBCity[]) => {
    updateFormData("preferredDestinations", destinations);
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
        <div className="space-y-8">
          <div className="card">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-3 text-2xl">🌡️</span>
              Preferred climates
            </h4>
            <div className="flex flex-wrap gap-3">
              {["Warm", "Cold", "Both"].map((climate) => (
                <button
                  key={climate}
                  onClick={() => updateFormData("preferredClimate", climate)}
                  className={`px-4 py-3 border-2 rounded-xl font-medium transition-all duration-300 ${
                    formData.preferredClimate === climate
                      ? "border-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 shadow-lg transform scale-105"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  {climate}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-3 text-2xl">📍</span>
              Preferred destinations
            </h4>
            <MultiDestinationSelector
              selectedDestinations={formData.preferredDestinations}
              onDestinationsChange={handleDestinationsChange}
              placeholder="Search and select your preferred destinations..."
              maxSelections={8}
            />
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
              className="card hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="text-3xl mr-4">{activity.icon}</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {activity.title}
                    </h4>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleActivity(activity.title)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${
                    formData.preferredActivities.includes(activity.title)
                      ? "bg-gradient-to-r from-gray-600 to-gray-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 shadow-md ${
                      formData.preferredActivities.includes(activity.title)
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {currentStepData.options?.map((option) => (
          <label
            key={option}
            className=" backdrop-blur-sm rounded-2xl   p-6 cursor-pointer transition-all duration-300 "
          >
            <div className="flex items-center justify-between">
              <span className="text-lg text-gray-800 font-medium group-hover:text-gray-900 transition-colors">
                {option}
              </span>
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
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              />
            </div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-gray-600/10 pointer-events-none"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-600 rounded-xl flex items-center justify-center animate-pulse-slow">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <span className="text-3xl font-bold gradient-text">PackPal</span>
            </div>

            <div className="mb-8">
              <div className="flex justify-center space-x-2 mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        currentStep > step.id
                          ? "bg-gradient-to-r from-gray-600 to-gray-600 text-white"
                          : currentStep === step.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step.id ? "✓" : step.id}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-1 mx-2 transition-all duration-300 ${
                          currentStep > step.id
                            ? "bg-gradient-to-r from-gray-600 to-gray-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`space-y-6 ${
                isLoaded ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl mr-4">{currentStepData.icon}</div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentStepData.title}
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                {currentStepData.subtitle}
              </p>
            </div>
          </div>

          <div
            className={`w-full ${
              isLoaded ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            {renderStepContent()}
          </div>

          <div className="flex justify-center pt-8">
            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-primary text-lg px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isLoading || !canProceed()}
                className="btn-primary text-lg px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Completing...
                  </div>
                ) : (
                  "Complete Setup"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
