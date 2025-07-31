"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  useGetTripByIdQuery,
  useGenerateAIPackingListMutation,
  useGetAIPackingSuggestionsQuery,
} from "@/redux/slices/api/trips/trips";

interface AISuggestion {
  name: string;
  category: string;
  reason: string;
}

const AIAssistantPage = () => {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: tripData, isLoading: tripLoading } =
    useGetTripByIdQuery(tripId);
  const { data: suggestionsData, isLoading: suggestionsLoading } =
    useGetAIPackingSuggestionsQuery(tripId, {
      skip: !showSuggestions,
    });

  const [generateAIPackingList, { isLoading: isGenerating }] =
    useGenerateAIPackingListMutation();

  const trip = tripData?.data;
  const suggestions = suggestionsData?.data?.suggestions || [];

  const handleGeneratePackingList = async () => {
    try {
      await generateAIPackingList(tripId).unwrap();
      router.push(`/auth/dashboard/trips/${tripId}`);
    } catch (error) {
      console.error("Failed to generate AI packing list:", error);
    }
  };

  const handleGetSuggestions = () => {
    setShowSuggestions(true);
  };

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700 font-medium">
            Loading your trip...
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-xl text-red-600 font-medium">Trip not found</div>
          <p className="text-gray-600 mt-2">
            The trip you&apos;re looking for doesn&apos;t exist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Packing Assistant
                </h1>
                <p className="text-sm text-gray-600">
                  Powered by intelligent recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Trip to {trip.destination}
              </h2>
              <p className="text-gray-600">
                Let AI create your perfect packing list
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Trip Details
                </h3>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destination
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {trip.destination}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="text-lg font-medium text-gray-900">
                      {new Date(trip.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="text-lg font-medium text-gray-900">
                      {new Date(trip.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weather
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {trip.weather
                      ? `${trip.weather.description}, ${trip.weather.temperature}°C`
                      : "Not available"}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Activities
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {trip.activities?.join(", ") || "General travel"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  AI Packing Assistant
                </h3>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-2">
                        Generate Complete Packing List
                      </h4>
                      <p className="text-sm text-blue-700 mb-4">
                        AI will analyze your trip details and create a
                        comprehensive packing list tailored to your destination,
                        weather, and activities.
                      </p>
                      <button
                        onClick={handleGeneratePackingList}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {isGenerating ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Generating...
                          </div>
                        ) : (
                          "Generate Packing List"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-900 mb-2">
                        Get Smart Suggestions
                      </h4>
                      <p className="text-sm text-green-700 mb-4">
                        Get AI-powered suggestions for items you might have
                        forgotten or need for your specific trip.
                      </p>
                      <button
                        onClick={handleGetSuggestions}
                        disabled={suggestionsLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {suggestionsLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Loading...
                          </div>
                        ) : (
                          "Get Suggestions"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showSuggestions && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    AI Suggestions
                  </h3>
                </div>

                {suggestionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <div className="text-gray-600 font-medium">
                      Loading suggestions...
                    </div>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🤔</div>
                    <p className="text-gray-500 font-medium">
                      No suggestions available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map(
                      (suggestion: AISuggestion, index: number) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-r-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="font-bold text-gray-900 text-lg mb-2">
                            {suggestion.name}
                          </div>
                          <div className="text-sm text-emerald-700 font-medium mb-2">
                            Category: {suggestion.category}
                          </div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {suggestion.reason}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPage;
