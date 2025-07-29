"use client";

import React from "react";

interface ActivitiesStepProps {
  activities: string[];
  onUpdate: (field: string, value: string[]) => void;
}

const ActivitiesStep = ({ activities, onUpdate }: ActivitiesStepProps) => {
  const activityOptions = [
    {
      id: "food-drink",
      title: "Food & Drink",
      description: "Explore the local cuisine and dining scene.",
      icon: (
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>
      ),
    },
    {
      id: "arts-culture",
      title: "Arts & Culture",
      description: "Visit museums, galleries, and historical sites.",
      icon: (
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
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M5 7h2"
          />
        </svg>
      ),
    },
    {
      id: "outdoor-activities",
      title: "Outdoor Activities",
      description:
        "Enjoy outdoor activities like hiking, biking, and water sports.",
      icon: (
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "entertainment",
      title: "Entertainment",
      description: "Attend concerts, shows, and nightlife events.",
      icon: (
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
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
    },
    {
      id: "relaxation",
      title: "Relaxation",
      description: "Relax and unwind at spas, beaches, or scenic spots.",
      icon: (
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
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "shopping",
      title: "Shopping",
      description: "Shop for souvenirs, local crafts, and fashion.",
      icon: (
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
  ];

  const toggleActivity = (activityId: string) => {
    const currentActivities = [...activities];
    if (currentActivities.includes(activityId)) {
      onUpdate(
        "activities",
        currentActivities.filter((id) => id !== activityId)
      );
    } else {
      onUpdate("activities", [...currentActivities, activityId]);
    }
  };

  const isSelected = (activityId: string) => {
    return activities.includes(activityId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What do you want to do?
        </h2>
        <p className="text-gray-600">
          Select the activities you&apos;re interested in. We&apos;ll use this
          to recommend the best places for you.
        </p>
      </div>

      <div className="space-y-3">
        {activityOptions.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="text-gray-600">{activity.icon}</div>
              <div>
                <h3 className="font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
            </div>

            <button
              onClick={() => toggleActivity(activity.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isSelected(activity.id) ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isSelected(activity.id) ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {activities.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                Selected:{" "}
                <span className="font-medium">
                  {activities.length} activities
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesStep;
