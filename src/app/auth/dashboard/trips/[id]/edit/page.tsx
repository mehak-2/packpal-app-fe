"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const EditTripPage = ({ params }: { params: { id: string } }) => {
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
  } = useGetTripByIdQuery(params.id);
  const [updateTrip] = useUpdateTripMutation();

  const steps = [
    { id: 1, title: "Destination", description: "Where are you going?" },
    { id: 2, title: "Dates", description: "When are you traveling?" },
    { id: 3, title: "Activities", description: "What will you be doing?" },
    { id: 4, title: "Summary", description: "Review your trip details" },
    { id: 5, title: "Collaborators", description: "Invite friends and family" },
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
      await updateTrip({ id: params.id, ...formData }).unwrap();
      router.push(`/auth/dashboard/trips/${params.id}`);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading trip details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading trip details</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Edit Trip
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                {steps[currentStep - 1].title}
              </h3>
              <p className="text-sm text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {renderStep()}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading || !canProceed()}
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update Trip"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTripPage;
