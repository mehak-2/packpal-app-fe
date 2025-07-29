"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetTripByIdQuery,
  useUpdateTripMutation,
} from "@/redux/slices/api/trips/trips";

interface Trip {
  _id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  activities: string[];
  collaborators: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

const EditTripSimplePage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tripId, setTripId] = useState<string>("");

  const router = useRouter();
  const {
    data: tripData,
    isLoading: tripLoading,
    error,
  } = useGetTripByIdQuery(tripId, { skip: !tripId });
  const [updateTrip] = useUpdateTripMutation();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setTripId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (tripData?.data) {
      const trip: Trip = tripData.data;
      setFormData({
        tripName: `${trip.destination} Trip`,
        destination: `${trip.destination}, ${trip.country}`,
        startDate: trip.startDate.split("T")[0],
        endDate: trip.endDate.split("T")[0],
        notes: `Activities: ${trip.activities.join(", ")}`,
      });
    }
  }, [tripData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const [destination, country] = formData.destination
        .split(", ")
        .map((s) => s.trim());

      await updateTrip({
        id: tripId,
        destination,
        country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        activities: formData.notes.includes("Activities:")
          ? formData.notes.split("Activities:")[1].trim().split(", ")
          : [],
      }).unwrap();

      router.push(`/auth/dashboard/trips/${tripId}`);
    } catch (error) {
      console.error("Failed to update trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/auth/dashboard/trips/${tripId}`);
  };

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading trip details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading trip details</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Trip</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="tripName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Trip name
              </label>
              <input
                type="text"
                id="tripName"
                value={formData.tripName}
                onChange={(e) => handleInputChange("tripName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter trip name"
              />
            </div>

            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange("destination", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter destination"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Start date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  End date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add notes about your trip..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collaborators
              </label>
              <div className="flex items-center space-x-2">
                {tripData?.data?.collaborators
                  ?.slice(0, 3)
                  .map(
                    (collaborator: {
                      _id: string;
                      name: string;
                      email: string;
                    }) => (
                      <div
                        key={collaborator._id}
                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        title={`${collaborator.name} (${collaborator.email})`}
                      >
                        {collaborator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )
                  )}
                {tripData?.data?.collaborators?.length > 3 && (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                    +{tripData.data.collaborators.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTripSimplePage;
