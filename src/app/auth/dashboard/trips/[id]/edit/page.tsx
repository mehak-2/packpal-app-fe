"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetTripByIdQuery,
  useUpdateTripMutation,
} from "@/redux/slices/api/trips/trips";
import DestinationStep from "../../../create-trip/components/DestinationStep";
import DatesStep from "../../../create-trip/components/DatesStep";
import ActivitiesStep from "../../../create-trip/components/ActivitiesStep";
import SummaryStep from "../../../create-trip/components/SummaryStep";
import CollaboratorsStep from "../../../create-trip/components/CollaboratorsStep";

interface Trip {
  _id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  activities: string[];
  weather?: {
    temperature: number;
    condition: string;
    forecast?: Array<{
      date: string;
      temperature: number;
      condition: string;
      precipitation: number;
    }>;
  };
  collaborators: string[];
}

const EditTripPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    startDate: "",
    endDate: "",
    activities: [] as string[],
    weather: undefined as
      | {
          temperature: number;
          condition: string;
          forecast?: Array<{
            date: string;
            temperature: number;
            condition: string;
            precipitation: number;
          }>;
        }
      | undefined,
    collaborators: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const {
    data: tripData,
    isLoading: tripLoading,
    error,
  } = useGetTripByIdQuery(id);
  const [updateTrip] = useUpdateTripMutation();

  const steps = [
    {
      id: 1,
      title: "Destination",
      description: "Where are you going?",
      icon: "📍",
    },
    {
      id: 2,
      title: "Dates",
      description: "When are you traveling?",
      icon: "📅",
    },
    {
      id: 3,
      title: "Activities",
      description: "What will you be doing?",
      icon: "🎯",
    },
    {
      id: 4,
      title: "Summary",
      description: "Review your trip details",
      icon: "📋",
    },
    {
      id: 5,
      title: "Collaborators",
      description: "Invite friends and family",
      icon: "👥",
    },
  ];

  useEffect(() => {
    if (tripData?.data) {
      const trip: Trip = tripData.data;
      setFormData({
        destination: trip.destination,
        country: trip.country,
        startDate: trip.startDate,
        endDate: trip.endDate,
        activities: trip.activities,
        weather: trip.weather,
        collaborators: trip.collaborators,
      });
    }
  }, [tripData]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await updateTrip({ id, body: formData }).unwrap();
      router.push(`/auth/dashboard/trips/${id}`);
    } catch (error) {
      console.error("Failed to update trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.destination && formData.country;
      case 2:
        return formData.startDate && formData.endDate;
      case 3:
        return formData.activities.length > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DestinationStep
            destination={formData.destination}
            country={formData.country}
            onUpdate={updateFormData}
          />
        );

      case 2:
        return (
          <DatesStep
            startDate={formData.startDate}
            endDate={formData.endDate}
            onUpdate={updateFormData}
          />
        );

      case 3:
        return (
          <ActivitiesStep
            activities={formData.activities}
            onUpdate={updateFormData}
          />
        );

      case 4:
        return (
          <SummaryStep
            destination={formData.destination}
            country={formData.country}
            startDate={formData.startDate}
            endDate={formData.endDate}
            activities={formData.activities}
            weather={formData.weather}
          />
        );

      case 5:
        return (
          <CollaboratorsStep
            collaborators={formData.collaborators}
            onUpdate={updateFormData}
          />
        );

      default:
        return null;
    }
  };

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700 font-medium">
            Loading trip details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-xl text-red-600 font-medium">
            Error loading trip details
          </div>
          <p className="text-gray-600 mt-2">
            Something went wrong while loading your trip
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Trip
            </h2>
            <p className="mt-2 text-gray-600 font-medium">
              Step {currentStep} of {steps.length}
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                        currentStep >= step.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > step.id ? "✓" : step.icon}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-sm font-semibold ${
                          currentStep >= step.id
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                        currentStep > step.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-lg">
                    {steps[currentStep - 1].icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {steps[currentStep - 1].title}
                  </h3>
                  <p className="text-gray-600">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {renderStep()}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
                Back
              </div>
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center">
                  Next
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading || !canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 border border-transparent rounded-xl text-sm font-semibold text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Update Trip
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTripPage;
