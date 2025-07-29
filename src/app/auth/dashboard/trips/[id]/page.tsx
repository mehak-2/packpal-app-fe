"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetTripByIdQuery,
  useDeleteTripMutation,
  useUpdatePackingListMutation,
  useRegeneratePackingListMutation,
} from "@/redux/slices/api/trips/trips";

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
    description: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    sunrise: string;
    sunset: string;
    forecast?: Array<{
      date: string;
      temperature: number;
      condition: string;
      description: string;
      precipitation: number;
      humidity: number;
      windSpeed: number;
    }>;
  };
  destinationInfo?: {
    name: string;
    capital: string;
    region: string;
    population: number;
    currencies: string[];
    languages: string[];
    flag: string;
    emergencyNumbers: {
      police: string;
      ambulance: string;
      fire: string;
    };
    description: string;
    weatherDescription: string;
    popularCities: string[];
  };
  collaborators: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  packingList?: {
    clothing: Array<{ name: string; quantity: number; packed: boolean }>;
    accessories: Array<{ name: string; packed: boolean }>;
    essentials: Array<{ name: string; packed: boolean }>;
    electronics: Array<{ name: string; packed: boolean }>;
    toiletries: Array<{ name: string; packed: boolean }>;
    documents: Array<{ name: string; packed: boolean }>;
    activities: Array<{ name: string; packed: boolean }>;
  };
}

const TripDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setTripId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
  }, [router]);

  const {
    data: tripData,
    isLoading,
    error,
  } = useGetTripByIdQuery(tripId!, { skip: !tripId });
  const [deleteTrip, { isLoading: isDeleting }] = useDeleteTripMutation();
  const [updatePackingList] = useUpdatePackingListMutation();
  const [regeneratePackingList, { isLoading: isRegenerating }] =
    useRegeneratePackingListMutation();

  const trip: Trip | undefined = tripData?.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  };

  const getDestinationImage = (
    destination: string,
    destinationInfo?: Trip["destinationInfo"]
  ) => {
    if (destinationInfo?.flag) {
      return destinationInfo.flag;
    }

    const images: { [key: string]: string } = {
      Paris:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=200&fit=crop",
      Tokyo:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop",
      Rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=200&fit=crop",
      Barcelona:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=200&fit=crop",
    };
    return (
      images[destination] ||
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop"
    );
  };

  const getDestinationDescription = (trip: Trip) => {
    if (trip.destinationInfo?.description) {
      return trip.destinationInfo.description;
    }

    const descriptions: { [key: string]: string } = {
      Paris:
        "Explore the romantic city of Paris, known for its iconic landmarks, art, and cuisine. This trip includes visits to the Eiffel Tower, Louvre Museum, and charming cafes.",
      Tokyo:
        "Discover the vibrant culture of Tokyo, from ancient temples to modern technology. Experience the perfect blend of tradition and innovation in Japan's bustling capital.",
      Rome: "Immerse yourself in the rich history of Rome, the Eternal City. Visit ancient ruins, Renaissance art, and enjoy authentic Italian cuisine.",
      Barcelona:
        "Experience the unique architecture and Mediterranean charm of Barcelona. From Gaudi's masterpieces to beautiful beaches, this city has it all.",
    };
    return (
      descriptions[trip.destination] ||
      `Explore the beautiful city of ${trip.destination} and discover its unique culture, landmarks, and experiences.`
    );
  };

  const getWeatherDescription = (trip: Trip) => {
    if (trip.destinationInfo?.weatherDescription) {
      return trip.destinationInfo.weatherDescription;
    }

    const weatherDescriptions: { [key: string]: string } = {
      Paris:
        "Expect mild temperatures with occasional rain. Pack layers and a waterproof jacket.",
      Tokyo:
        "Variable weather with seasonal changes. Check the forecast and pack accordingly.",
      Rome: "Mediterranean climate with warm summers. Light clothing and comfortable shoes recommended.",
      Barcelona:
        "Pleasant Mediterranean weather. Pack light clothing and beach essentials.",
    };
    return (
      weatherDescriptions[trip.destination] ||
      "Check the local weather forecast and pack appropriate clothing for your destination."
    );
  };

  const handleDelete = async () => {
    try {
      if (!tripId) return;
      await deleteTrip(tripId).unwrap();
      router.push("/auth/dashboard");
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  const handleEdit = () => {
    if (!tripId) return;
    router.push(`/auth/dashboard/trips/${tripId}/edit-simple`);
  };

  const handleRegeneratePackingList = async () => {
    try {
      if (!tripId) return;
      await regeneratePackingList(tripId).unwrap();
    } catch (error) {
      console.error("Failed to regenerate packing list:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading trip details...</div>
      </div>
    );
  }

  if (error) {
    const isUnauthorized = "status" in error && error.status === 401;
    const errorMessage = isUnauthorized
      ? "Authentication required. Please log in again."
      : "Error loading trip details";

    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{errorMessage}</div>
          {isUnauthorized && (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/auth/login");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-red-600">Trip not found</div>
      </div>
    );
  }

  const allPackingItems = [
    ...(trip.packingList?.clothing || []),
    ...(trip.packingList?.accessories || []),
    ...(trip.packingList?.essentials || []),
    ...(trip.packingList?.electronics || []),
    ...(trip.packingList?.toiletries || []),
    ...(trip.packingList?.documents || []),
    ...(trip.packingList?.activities || []),
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/auth/dashboard")}
                className="text-gray-600 hover:text-gray-900 mr-4"
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
              <h1 className="text-2xl font-bold text-gray-900">
                Trip to {trip.destination}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-lg text-gray-600">
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={getDestinationImage(trip.destination, trip.destinationInfo)}
              alt={trip.destination}
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Trip Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {getDestinationDescription(trip)}
                </p>

                {trip.destinationInfo && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        Region:
                      </span>
                      <span className="text-sm text-gray-900">
                        {trip.destinationInfo.region}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        Population:
                      </span>
                      <span className="text-sm text-gray-900">
                        {trip.destinationInfo.population?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        Languages:
                      </span>
                      <span className="text-sm text-gray-900">
                        {trip.destinationInfo.languages?.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        Currency:
                      </span>
                      <span className="text-sm text-gray-900">
                        {trip.destinationInfo.currencies?.join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Weather
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {getWeatherDescription(trip)}
                </p>
                {trip.weather && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Current: {trip.weather.temperature}°C,{" "}
                      {trip.weather.description}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Humidity: {trip.weather.humidity}% | Wind:{" "}
                      {trip.weather.windSpeed} m/s
                    </p>
                    <p className="text-sm text-blue-700">
                      Sunrise: {trip.weather.sunrise} | Sunset:{" "}
                      {trip.weather.sunset}
                    </p>
                  </div>
                )}

                {trip.weather?.forecast && trip.weather.forecast.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      7-Day Forecast
                    </h3>
                    <div className="space-y-2">
                      {trip.weather.forecast?.slice(0, 7).map((day, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </span>
                          <span className="text-gray-900">
                            {day.temperature}°C
                          </span>
                          <span className="text-gray-600">{day.condition}</span>
                          <span className="text-gray-500">
                            {day.precipitation}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {trip.destinationInfo?.emergencyNumbers && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Emergency Numbers
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Police:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {trip.destinationInfo.emergencyNumbers.police}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ambulance:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {trip.destinationInfo.emergencyNumbers.ambulance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fire:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {trip.destinationInfo.emergencyNumbers.fire}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {trip.activities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Activities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {trip.activities.map((activity: string) => (
                      <span
                        key={activity}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Collaborators
                  </h2>
                  <button
                    onClick={() => router.push("/auth/dashboard/collaborators")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Manage Collaborators
                  </button>
                </div>
                {trip.collaborators.length > 0 ? (
                  <div className="space-y-2">
                    {trip.collaborators.map(
                      (collaborator: {
                        _id: string;
                        name: string;
                        email: string;
                      }) => (
                        <div
                          key={collaborator._id}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {collaborator.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {collaborator.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {collaborator.email}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No collaborators yet</p>
                    <button
                      onClick={() =>
                        router.push("/auth/dashboard/collaborators")
                      }
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Invite collaborators
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Packing List
                </h2>
                <button
                  onClick={handleRegeneratePackingList}
                  disabled={isRegenerating}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {isRegenerating ? "Regenerating..." : "Regenerate"}
                </button>
              </div>

              {trip.packingList && (
                <div className="space-y-4">
                  {Object.entries(trip.packingList).map(([category, items]) => (
                    <div
                      key={category}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <h3 className="font-medium text-gray-900 mb-2 capitalize">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <div className="space-y-1">
                        {items.map(
                          (
                            item: {
                              name: string;
                              quantity?: number;
                              packed: boolean;
                            },
                            index: number
                          ) => (
                            <label
                              key={index}
                              className="flex items-center space-x-3 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={item.packed}
                                disabled
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span
                                className={`text-gray-700 ${
                                  item.packed
                                    ? "line-through text-gray-400"
                                    : ""
                                }`}
                              >
                                {item.name}
                                {item.quantity && item.quantity > 1 && (
                                  <span className="text-gray-500 ml-1">
                                    ({item.quantity})
                                  </span>
                                )}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Trip
          </button>
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Edit Trip
          </button>
        </div>
      </main>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Delete trip?
            </h3>
            <p className="text-gray-700 mb-8">
              Are you sure you want to delete this trip? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetailsPage;
