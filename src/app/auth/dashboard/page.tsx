"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/redux/slices/api/auth/auth";
import { useGetTripsQuery } from "@/redux/slices/api/trips/trips";

interface User {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
}

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
  };
  collaborators: User[];
}

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const [logout] = authApi.useLogoutMutation();
  const {
    data: tripsData,
    isLoading: tripsLoading,
    error,
  } = useGetTripsQuery("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/login");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  };

  const getDestinationImage = (destination: string) => {
    const images: { [key: string]: string } = {
      Paris:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=150&h=100&fit=crop",
      Tokyo:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=150&h=100&fit=crop",
      Rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=150&h=100&fit=crop",
      Barcelona:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=150&h=100&fit=crop",
    };
    return (
      images[destination] ||
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=100&fit=crop"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/auth/dashboard/collaborators")}
                className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Collaborators
              </button>
              <button
                onClick={() => router.push("/auth/dashboard/create-trip")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Create Trip
              </button>
              <span className="text-gray-700">
                Welcome, {user?.name || "User"}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {tripsLoading ? (
          <div className="text-center py-8">
            <div className="text-xl">Loading trips...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-xl text-red-600">Error loading trips</div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming</h2>
              {tripsData?.data?.upcoming &&
              tripsData.data.upcoming.length > 0 ? (
                <div className="space-y-4">
                  {tripsData.data.upcoming.map((trip: Trip) => (
                    <div
                      key={trip._id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/auth/dashboard/trips/${trip._id}`)
                      }
                    >
                      <img
                        src={getDestinationImage(trip.destination)}
                        alt={trip.destination}
                        className="w-16 h-12 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {trip.destination}, {trip.country}
                        </h3>
                        <p className="text-sm text-blue-600">
                          {formatDateRange(trip.startDate, trip.endDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming trips. Create your first trip!
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Past</h2>
              {tripsData?.data?.past && tripsData.data.past.length > 0 ? (
                <div className="space-y-4">
                  {tripsData.data.past.map((trip: Trip) => (
                    <div
                      key={trip._id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/auth/dashboard/trips/${trip._id}`)
                      }
                    >
                      <img
                        src={getDestinationImage(trip.destination)}
                        alt={trip.destination}
                        className="w-16 h-12 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {trip.destination}, {trip.country}
                        </h3>
                        <p className="text-sm text-blue-600">
                          {formatDateRange(trip.startDate, trip.endDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No past trips yet.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
