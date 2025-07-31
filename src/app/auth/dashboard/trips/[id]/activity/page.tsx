"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useGetTripByIdQuery } from "@/redux/slices/api/trips/trips";
import {
  useGetCollaboratorsQuery,
  useGetActivityLogQuery,
} from "@/redux/slices/api/collaboration/collaboration";

interface Activity {
  _id: string;
  action: string;
  description: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface Collaborator {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "edit" | "view";
  joinedAt: string;
}

const ActivityLogPage = () => {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"collaborators" | "activity">(
    "collaborators"
  );

  const { data: tripData, isLoading: tripLoading } =
    useGetTripByIdQuery(tripId);
  const { data: collaboratorsData, isLoading: collaboratorsLoading } =
    useGetCollaboratorsQuery(tripId);
  const { data: activityData, isLoading: activityLoading } =
    useGetActivityLogQuery({
      tripId,
      page: currentPage,
      limit: 20,
    });

  const trip =
    tripData && typeof tripData === "object" && "data" in tripData
      ? (tripData as { data: { destination: string } }).data
      : undefined;
  const collaborators = collaboratorsData?.collaborators || [];
  const activities = activityData?.activities || [];
  const totalPages = activityData?.totalPages || 1;

  const getActionIcon = (action: string) => {
    switch (action) {
      case "trip_created":
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        );
      case "collaborator_added":
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        );
      case "packing_list_updated":
      case "item_added":
      case "item_removed":
      case "item_toggled":
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        );
      case "destination_updated":
      case "dates_updated":
      case "activities_updated":
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
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
        );
      default:
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
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

  if (tripLoading || collaboratorsLoading) {
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Collaborators & Activity Log
                </h1>
                <p className="text-sm text-gray-600">
                  Track changes and team members
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mr-4">
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
                Trip to {trip?.destination || "Unknown Destination"}
              </h2>
              <p className="text-gray-600">
                Track collaborators and recent changes
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Collaborators
                </h3>
              </div>

              {collaborators.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👥</div>
                  <p className="text-gray-500 font-medium">
                    No collaborators yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Invite friends to join your trip
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {collaborators.map((collaborator: Collaborator) => (
                    <div
                      key={collaborator._id}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-gray-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-lg">
                            {collaborator.name}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {collaborator.email}
                          </div>
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {collaborator.role === "owner"
                              ? "👑 Owner"
                              : collaborator.role === "edit"
                              ? "✏️ Can edit"
                              : "👁️ Can view"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3">
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Activity Log
                </h3>
              </div>

              {activityLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <div className="text-gray-600 font-medium">
                    Loading activity...
                  </div>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-500 font-medium">No activity yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Changes will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    {activities.map((activity: Activity, index: number) => (
                      <div key={activity._id} className="relative">
                        <div className="flex items-start space-x-4">
                          {getActionIcon(activity.action)}
                          <div className="flex-1 min-w-0">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                              <div className="text-sm font-semibold text-gray-900 mb-2">
                                {activity.description}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                  {activity.user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </div>
                                <span className="font-medium">
                                  {activity.user.name}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                  {formatTimestamp(activity.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < activities.length - 1 && (
                          <div className="absolute left-5 top-12 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-8">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-medium shadow-sm"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-medium shadow-sm"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivityLogPage;
