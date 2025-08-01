"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Image from "next/image";
import {
  useGetTripsQuery,
  tripsApi,
  useUpdatePackingListMutation,
} from "@/redux/slices/api/trips/trips";
import { getDestinationImage } from "@/utils/destinationImages";
import { AppDispatch } from "@/redux/store";

export default function TripsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: tripsData } = useGetTripsQuery("");
  const [updatePackingList] = useUpdatePackingListMutation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addDemoPackedItems = async () => {
    if (!tripsData?.data?.upcoming || tripsData.data.upcoming.length === 0) {
      alert("No upcoming trips found. Please create a trip first.");
      return;
    }

    const firstTrip = tripsData.data.upcoming[0];
    if (!firstTrip.packingList) {
      alert(
        "No packing list found for this trip. Please generate a packing list first."
      );
      return;
    }

    const updatedPackingList = JSON.parse(
      JSON.stringify(firstTrip.packingList)
    );

    Object.keys(updatedPackingList).forEach((category) => {
      const items = updatedPackingList[category];
      if (Array.isArray(items) && items.length > 0) {
        items.forEach((item, index) => {
          if (index < 2) {
            items[index] = { ...item, packed: true };
          }
        });
      }
    });

    try {
      const result = await updatePackingList({
        id: firstTrip._id,
        packingList: updatedPackingList,
      }).unwrap();

      console.log("Demo packing list updated successfully:", result);

      dispatch(
        tripsApi.util.updateQueryData("getTripById", firstTrip._id, (draft) => {
          if (draft && typeof draft === "object" && "data" in draft) {
            (
              draft as {
                data: {
                  packingList: Record<
                    string,
                    Array<{ name: string; quantity?: number; packed: boolean }>
                  >;
                };
              }
            ).data.packingList = updatedPackingList;
          }
        })
      );

      alert("Demo packed items added! Check the progress tracking now.");
    } catch (error) {
      console.error("Error adding demo items:", error);
      alert("Failed to add demo items.");
    }
  };

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
      Array<{ name: string; quantity?: number; packed: boolean }>
    >;
  }) => {
    if (!trip.packingList) {
      return { packed: 0, total: 0, percentage: 0 };
    }

    let packed = 0;
    let total = 0;

    const categories = [
      "clothing",
      "accessories",
      "essentials",
      "electronics",
      "toiletries",
      "documents",
      "activities",
    ];

    categories.forEach((category) => {
      const items = trip.packingList?.[category];
      if (Array.isArray(items)) {
        items.forEach(
          (item: { name: string; quantity?: number; packed: boolean }) => {
            total++;
            if (item.packed) {
              packed++;
            }
          }
        );
      }
    });

    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-gray-600/5"></div>

      <div className="relative z-10">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/dashboard"
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-2xl font-bold gradient-text">
                    PackPal
                  </span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                {/* <button
                  onClick={addDemoPackedItems}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                >
                  Demo Progress
                </button> */}
                {/* <button
                  onClick={() => {
                    console.log("=== PACKING PROGRESS DEBUG ===");
                    console.log("Trips data:", tripsData);
                    console.log("All trips:", allTrips);
                    allTrips.forEach((trip) => {
                      const progress = getPackingProgress(trip);
                      console.log(
                        `Trip ${trip._id} (${trip.destination}):`,
                        `Packing list exists: ${!!trip.packingList}`,
                        `Categories: ${
                          trip.packingList
                            ? Object.keys(trip.packingList).join(", ")
                            : "none"
                        }`,
                        `Progress: ${progress.packed}/${progress.total} (${progress.percentage}%)`
                      );
                    });
                    alert(
                      `Debug info logged to console\nTotal trips: ${
                        allTrips.length
                      }\nTrips with packing lists: ${
                        allTrips.filter(
                          (t) =>
                            t.packingList &&
                            Object.keys(t.packingList).length > 0
                        ).length
                      }`
                    );
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  Debug Progress
                </button> */}
                {/* <button
                  onClick={() => {
                    refetch();
                    alert("Data refreshed! Check the progress updates.");
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Refresh Data
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

              if (allTripsWithPacking.length === 0) {
                const tripsWithPackingLists = allTrips.filter(
                  (trip) =>
                    trip.packingList && Object.keys(trip.packingList).length > 0
                );

                if (tripsWithPackingLists.length > 0) {
                  return (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-600 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="text-yellow-800">
                          <div className="font-medium mb-1">
                            {tripsWithPackingLists.length} trip
                            {tripsWithPackingLists.length > 1 ? "s" : ""} have
                            packing lists but no items are marked as packed yet.
                          </div>
                          <div className="text-sm text-yellow-700">
                            💡 Tip: Click on items in your packing list to mark
                            them as packed and see your progress update!
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="text-blue-800">
                        <div className="font-medium mb-1">
                          No packing lists found for your trips.
                        </div>
                        <div className="text-sm text-blue-700">
                          💡 Tip: Create a trip and generate a packing list to
                          start tracking your packing progress!
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

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
                <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-blue-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Overall Packing Progress
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {totalPacked}/{totalItems} items packed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${overallPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {overallPercentage}% complete across{" "}
                      {allTripsWithPacking.length} trip
                      {allTripsWithPacking.length > 1 ? "s" : ""}
                    </span>
                    {overallPercentage === 100 && (
                      <span className="text-green-600 font-medium flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        All packed!
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {filteredTrips.length === 0 ? (
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
                    <Image
                      src={getDestinationImage(trip.destination, trip.country)}
                      alt={trip.destination}
                      width={800}
                      height={400}
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            router.push(
                              `/auth/dashboard/trips/${trip._id}/packing-list`
                            );
                          }}
                          className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          📦
                        </button>
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
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
                          <span className="font-semibold flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Packing Progress
                          </span>
                          <span className="font-medium text-gray-600 bg-white px-2 py-1 rounded-full text-xs">
                            {progress.packed}/{progress.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">
                            {progress.percentage}% complete
                          </span>
                          {progress.percentage === 100 && (
                            <span className="text-green-600 font-medium flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Ready!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : trip.packingList &&
                      Object.keys(trip.packingList).length > 0 ? (
                      <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center text-sm text-yellow-700">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">
                            Start packing your items
                          </span>
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
