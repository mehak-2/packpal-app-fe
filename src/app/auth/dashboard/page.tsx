"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetTripsQuery } from "@/redux/slices/api/trips/trips";
import { useLogoutMutation } from "@/redux/slices/api/auth/auth";
import { getDestinationImage } from "@/utils/destinationImages";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
}

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const {
    data: tripsData,
    isLoading: tripsLoading,
    error: tripsError,
  } = useGetTripsQuery("");
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    setIsLoaded(true);
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/login");
    }
  };

  const trips = tripsData?.data
    ? [...(tripsData.data.upcoming || []), ...(tripsData.data.past || [])]
    : [];

  const stats = {
    totalTrips: trips.length,
    upcomingTrips: tripsData?.data?.upcoming?.length || 0,
    completedTrips: tripsData?.data?.past?.length || 0,
    totalDays: trips.reduce((total, trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      return total + days;
    }, 0),
  };

  const recentTrips = trips.slice(0, 3);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-grey-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-600/5"></div>

      <div className="relative z-10">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center animate-pulse-slow">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold gradient-text">
                  PackPal
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <Link
                  href="/auth/dashboard/notifications"
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
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
                      d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75a6 6 0 006 6h7.5a6 6 0 006-6v-3.75a6 6 0 00-6-6h-7.5z"
                    />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </Link>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user ? getUserInitials(user.name) : "U"}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user ? user.name : "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div
            className={`mb-8 ${
              isLoaded ? "animate-fade-in-down" : "opacity-0"
            }`}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user ? user.name.split(" ")[0] : "Traveler"}!
            </h1>
            <p className="text-gray-600">Ready for your next adventure?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div
              className={`card ${
                isLoaded ? "animate-slide-in-left" : "opacity-0"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Trips</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {tripsLoading ? "..." : stats.totalTrips}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className={`card ${
                isLoaded ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {tripsLoading ? "..." : stats.upcomingTrips}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className={`card ${
                isLoaded ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {tripsLoading ? "..." : stats.completedTrips}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
              </div>
            </div>

            <div
              className={`card ${
                isLoaded ? "animate-slide-in-right" : "opacity-0"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Days</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {tripsLoading ? "..." : stats.totalDays}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {["overview", "trips", "activities"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <Link
                href="/auth/dashboard/settings"
                className="px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-600 hover:text-gray-800"
              >
                Settings
              </Link>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-8">
              <div
                className={`${isLoaded ? "animate-fade-in-up" : "opacity-0"}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Recent Trips
                  </h2>
                  <Link
                    href="/auth/dashboard/trips"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all
                  </Link>
                </div>

                {tripsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="card animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : tripsError ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Failed to load trips. Please try again.
                    </p>
                  </div>
                ) : recentTrips.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No trips yet. Start planning your first adventure!
                    </p>
                    <Link
                      href="/auth/dashboard/create-trip"
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
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
                      <span>Create Your First Trip</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentTrips.map((trip, index) => (
                      <Link
                        key={`${trip._id}-${index}`}
                        href={`/auth/dashboard/trips/${trip._id}`}
                        className="card group cursor-pointer hover:scale-105 transition-transform"
                      >
                        <div className="relative mb-4">
                          <Image
                            src={getDestinationImage(
                              trip.destination,
                              trip.country
                            )}
                            alt={trip.destination}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop&crop=center&q=80`;
                            }}
                          />
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                new Date(trip.startDate) > new Date()
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {new Date(trip.startDate) > new Date()
                                ? "upcoming"
                                : "completed"}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {trip.destination} Trip
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {trip.destination}, {trip.country}
                        </p>

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>
                            {new Date(trip.startDate).toLocaleDateString()}
                          </span>
                          <span>to</span>
                          <span>
                            {new Date(trip.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${
                  isLoaded ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: "0.3s" }}
              >
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/auth/dashboard/create-trip"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
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
                      <div>
                        <p className="font-medium text-gray-800">
                          Create New Trip
                        </p>
                        <p className="text-sm text-gray-600">
                          Plan your next adventure
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/auth/dashboard/templates"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Use Template
                        </p>
                        <p className="text-sm text-gray-600">
                          Start with a pre-made plan
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/auth/dashboard/collaborators"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Invite Friends
                        </p>
                        <p className="text-sm text-gray-600">Travel together</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "trips" && (
            <div className={`${isLoaded ? "animate-fade-in-up" : "opacity-0"}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  All My Trips
                </h2>
                <Link
                  href="/auth/dashboard/create-trip"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
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
                  <span>Create New Trip</span>
                </Link>
              </div>

              {tripsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : tripsError ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Failed to load trips
                  </h3>
                  <p className="text-gray-600 mb-4">
                    There was an error loading your trips. Please try again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                </div>
              ) : trips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-12 h-12 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No trips yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start planning your first adventure!
                  </p>
                  <Link
                    href="/auth/dashboard/create-trip"
                    className="btn-primary"
                  >
                    Create Your First Trip
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip, index) => (
                    <Link
                      key={`${trip._id}-${index}`}
                      href={`/auth/dashboard/trips/${trip._id}`}
                      className="card group cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div className="relative mb-4">
                        <Image
                          src={getDestinationImage(
                            trip.destination,
                            trip.country
                          )}
                          alt={trip.destination}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop&crop=center&q=80`;
                          }}
                        />
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              new Date(trip.startDate) > new Date()
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {new Date(trip.startDate) > new Date()
                              ? "upcoming"
                              : "completed"}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {trip.destination} Trip
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {trip.destination}, {trip.country}
                      </p>

                      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                        <span>
                          {new Date(trip.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span>to</span>
                        <span>
                          {new Date(trip.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {trip.activities && trip.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {trip.activities
                            .slice(0, 3)
                            .map((activity: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {activity}
                              </span>
                            ))}
                          {trip.activities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{trip.activities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "activities" && (
            <div className={`${isLoaded ? "animate-fade-in-up" : "opacity-0"}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Activities
                </h2>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    All Activities
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Trip Activities
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Activities
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {trips.reduce(
                            (total, trip) =>
                              total +
                              (trip.activities ? trip.activities.length : 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Upcoming Activities
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {trips
                            .filter(
                              (trip) => new Date(trip.startDate) > new Date()
                            )
                            .reduce(
                              (total, trip) =>
                                total +
                                (trip.activities ? trip.activities.length : 0),
                              0
                            )}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Completed Activities
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {trips
                            .filter(
                              (trip) => new Date(trip.startDate) <= new Date()
                            )
                            .reduce(
                              (total, trip) =>
                                total +
                                (trip.activities ? trip.activities.length : 0),
                              0
                            )}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-purple-600"
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
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Favorite Activity
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          Hiking
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Activity Timeline
                  </h3>

                  {tripsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-4 animate-pulse"
                        >
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : trips.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                      <p className="text-gray-500">
                        No activities yet. Create a trip to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {trips
                        .filter(
                          (trip) =>
                            trip.activities && trip.activities.length > 0
                        )
                        .slice(0, 10)
                        .map((trip, tripIndex) => (
                          <div
                            key={`${trip._id}-${tripIndex}`}
                            className="border-l-4 border-blue-500 pl-6"
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <h4 className="font-semibold text-gray-800">
                                {trip.destination} Trip
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  new Date(trip.startDate) > new Date()
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {new Date(trip.startDate) > new Date()
                                  ? "Upcoming"
                                  : "Completed"}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {trip.activities.map(
                                (activity: string, activityIndex: number) => (
                                  <div
                                    key={activityIndex}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <svg
                                        className="w-4 h-4 text-blue-600"
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
                                    <div>
                                      <p className="font-medium text-gray-800">
                                        {activity}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {new Date(
                                          trip.startDate
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Popular Activities */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Popular Activities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "Hiking", icon: "🏔️", count: 12 },
                      { name: "Swimming", icon: "🏊", count: 8 },
                      { name: "Photography", icon: "📸", count: 15 },
                      { name: "Local Food", icon: "🍽️", count: 20 },
                      { name: "Museums", icon: "🏛️", count: 6 },
                      { name: "Shopping", icon: "🛍️", count: 10 },
                      { name: "Beach", icon: "🏖️", count: 14 },
                      { name: "Nightlife", icon: "🌃", count: 7 },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="text-3xl mb-2">{activity.icon}</div>
                        <p className="font-medium text-gray-800">
                          {activity.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.count} times
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
