"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetTripsQuery } from "@/redux/slices/api/trips/trips";
import { getDestinationImage } from "@/utils/destinationImages";

export default function TripsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { data: tripsData, isLoading, error } = useGetTripsQuery("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setIsLoaded(true);
  }, [router]);

  const allTrips = tripsData?.data
    ? [...(tripsData.data.upcoming || []), ...(tripsData.data.past || [])]
    : [];

  console.log("All trips data:", tripsData?.data);
  console.log("All trips:", allTrips);

  const filters = [
    { id: "all", label: "All Trips", count: allTrips.length },
    {
      id: "upcoming",
      label: "Upcoming",
      count: tripsData?.data?.upcoming?.length || 0,
    },
    {
      id: "completed",
      label: "Completed",
      count: tripsData?.data?.past?.length || 0,
    },
  ];

  const filteredTrips = allTrips.filter((trip) => {
    const isUpcoming = new Date(trip.startDate) > new Date();
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "upcoming" && isUpcoming) ||
      (activeFilter === "completed" && !isUpcoming);
    const matchesSearch =
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (startDate: string) => {
    const isUpcoming = new Date(startDate) > new Date();
    return isUpcoming
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const getStatusText = (startDate: string) => {
    const isUpcoming = new Date(startDate) > new Date();
    return isUpcoming ? "upcoming" : "completed";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getPackingProgress = (trip: {
    _id: string;
    packingList?: Record<
      string,
      Array<{
        name: string;
        quantity?: number;
        packed: boolean;
        isCustom?: boolean;
      }>
    >;
  }) => {
    console.log(
      "Checking packing progress for trip:",
      trip._id,
      trip.packingList
    );
    if (!trip.packingList) return { packed: 0, total: 0, percentage: 0 };

    let packed = 0;
    let total = 0;

    Object.values(trip.packingList).forEach((items) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          total++;
          if (item.packed) packed++;
        });
      }
    });

    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
    console.log(`Trip ${trip._id}: ${packed}/${total} (${percentage}%)`);
    return { packed, total, percentage };
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-600/5"></div>

      <div className="relative z-10">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/dashboard"
                  className="flex items-center space-x-2"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <span className="text-2xl font-bold gradient-text">
                    PackPal
                  </span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                {/* <button
                  onClick={() => {
                    console.log("=== DASHBOARD DEBUG ===");
                    console.log("Trips data:", tripsData);
                    console.log("All trips:", allTrips);
                    allTrips.forEach((trip) => {
                      const progress = getPackingProgress(trip);
                      console.log(
                        `Trip ${trip._id}: ${progress.packed}/${progress.total} (${progress.percentage}%)`
                      );
                    });
                    alert(
                      `Total trips: ${allTrips.length}\nCheck console for details`
                    );
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm"
                >
                  Debug Data
                </button> */}
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
                  <span>Create Trip</span>
                </Link>
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Trips</h1>
            <p className="text-gray-600">
              Manage and organize all your travel adventures
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search trips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {(() => {
              const allTripsWithPacking = allTrips.filter(
                (trip) => getPackingProgress(trip).total > 0
              );
              if (allTripsWithPacking.length === 0) return null;

              const totalPacked = allTripsWithPacking.reduce((sum, trip) => {
                const progress = getPackingProgress(trip);
                return sum + progress.packed;
              }, 0);

              const totalItems = allTripsWithPacking.reduce((sum, trip) => {
                const progress = getPackingProgress(trip);
                return sum + progress.total;
              }, 0);

              const overallPercentage =
                totalItems > 0
                  ? Math.round((totalPacked / totalItems) * 100)
                  : 0;

              return (
                <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Overall Packing Progress
                    </h3>
                    <span className="text-sm text-gray-600">
                      {totalPacked}/{totalItems} items packed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${overallPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {overallPercentage}% complete across{" "}
                    {allTripsWithPacking.length} trips
                  </div>
                </div>
              );
            })()}
          </div>

          {isLoading ? (
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
          ) : error ? (
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
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
                {searchQuery ? "No trips found" : "No trips yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Start planning your first adventure!"}
              </p>
              {!searchQuery && (
                <Link
                  href="/auth/dashboard/create-trip"
                  className="btn-primary"
                >
                  Create Your First Trip
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <Link
                  key={trip._id}
                  href={`/auth/dashboard/trips/${trip._id}`}
                  className="card group cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="relative mb-4">
                    <img
                      src={getDestinationImage(trip.destination, trip.country)}
                      alt={trip.destination}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop&crop=center&q=80`;
                      }}
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          trip.startDate
                        )}`}
                      >
                        {getStatusText(trip.startDate)}
                      </span>
                      {getPackingProgress(trip).total > 0 && (
                        <Link
                          href={`/auth/dashboard/trips/${trip._id}/packing-list`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          📦
                        </Link>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {trip.destination} Trip
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {trip.destination}, {trip.country}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>{formatDate(trip.startDate)}</span>
                    <span>to</span>
                    <span>{formatDate(trip.endDate)}</span>
                  </div>

                  {(() => {
                    const progress = getPackingProgress(trip);
                    return progress.total > 0 ? (
                      <div className="mb-3">
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                          <span className="font-medium">Packing Progress</span>
                          <span className="text-gray-500">
                            {progress.packed}/{progress.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {progress.percentage}% complete
                        </div>
                      </div>
                    ) : null;
                  })()}

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
        </main>
      </div>
    </div>
  );
}
