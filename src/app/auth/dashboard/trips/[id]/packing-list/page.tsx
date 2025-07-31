"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetTripByIdQuery,
  useUpdatePackingListMutation,
  useRegeneratePackingListMutation,
  useCreateTemplateMutation,
  tripsApi,
} from "@/redux/slices/api/trips/trips";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { API_CONFIG } from "@/config/api";

interface PackingItem {
  name: string;
  quantity?: number;
  packed: boolean;
  category: string;
  isCustom?: boolean;
}

type PackingListType = {
  [key: string]: Array<{
    name: string;
    quantity?: number;
    packed: boolean;
    isCustom?: boolean;
  }>;
};

interface Trip {
  _id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  activities: string[];
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

const PackingListPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [tripId, setTripId] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number>(-1);
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [templateName, setTemplateName] = useState("");
  const [localPackingList, setLocalPackingList] =
    useState<PackingListType | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 1,
  });

  const categories = [
    "clothing",
    "accessories",
    "essentials",
    "electronics",
    "toiletries",
    "documents",
    "activities",
  ];

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

    console.log("Token found:", token ? "Yes" : "No");
    console.log("Token length:", token ? token.length : 0);

    const validateToken = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.message === "Invalid token") {
            console.log("Token is invalid, redirecting to login");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/auth/login");
          }
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    if (tripId) {
      validateToken();
    }
  }, [router, tripId]);

  const {
    data: tripData,
    isLoading,
    error,
    refetch,
  } = useGetTripByIdQuery(tripId!, { skip: !tripId });
  const [updatePackingList, { isLoading: isUpdatingPackingList }] =
    useUpdatePackingListMutation();
  const [regeneratePackingList, { isLoading: isRegenerating }] =
    useRegeneratePackingListMutation();
  const [createTemplate] = useCreateTemplateMutation();

  const trip = tripData?.data;

  useEffect(() => {
    if (trip?.packingList && !localPackingList) {
      console.log("Initializing local packing list from trip data");
      setLocalPackingList(trip.packingList);
    }
  }, [trip?.packingList]);

  useEffect(() => {
    if (trip?.packingList && localPackingList === null) {
      console.log("Setting local packing list from trip data (null check)");
      setLocalPackingList(trip.packingList);
    }
  }, [trip?.packingList, localPackingList]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handleRegeneratePackingList = async () => {
    try {
      await regeneratePackingList(tripId!).unwrap();
    } catch (error) {
      console.error("Failed to regenerate packing list:", error);
    }
  };

  const handleAddCustomItem = async () => {
    if (!newItem.name || !newItem.category) return;

    try {
      const updatedPackingList = JSON.parse(
        JSON.stringify(trip?.packingList || {})
      );
      const categoryKey = newItem.category as string;

      if (updatedPackingList[categoryKey]) {
        (
          updatedPackingList[categoryKey] as Array<{
            name: string;
            quantity?: number;
            packed: boolean;
            isCustom?: boolean;
          }>
        ).push({
          name: newItem.name,
          quantity: newItem.quantity,
          packed: false,
          isCustom: true,
        });
      } else {
        (
          updatedPackingList as Record<
            string,
            Array<{
              name: string;
              quantity?: number;
              packed: boolean;
              isCustom?: boolean;
            }>
          >
        )[categoryKey] = [
          {
            name: newItem.name,
            quantity: newItem.quantity,
            packed: false,
            isCustom: true,
          },
        ];
      }

      await updatePackingList({
        id: tripId!,
        packingList: updatedPackingList,
      }).unwrap();

      setNewItem({ name: "", category: "", quantity: 1 });
      setShowAddItemModal(false);
    } catch (error) {
      console.error("Failed to add custom item:", error);
    }
  };

  const handleEditItem = async () => {
    if (!editingItem || editingItemIndex === -1) return;

    try {
      const updatedPackingList = JSON.parse(
        JSON.stringify(trip?.packingList || {})
      );
      const categoryKey = editingCategory as keyof typeof updatedPackingList;

      if (updatedPackingList[categoryKey]) {
        (
          updatedPackingList[categoryKey] as Array<{
            name: string;
            quantity?: number;
            packed: boolean;
            isCustom?: boolean;
          }>
        )[editingItemIndex] = {
          name: editingItem.name,
          quantity: editingItem.quantity,
          packed: editingItem.packed,
          isCustom: editingItem.isCustom,
        };
      }

      await updatePackingList({
        id: tripId!,
        packingList: updatedPackingList,
      }).unwrap();

      setEditingItem(null);
      setEditingItemIndex(-1);
      setEditingCategory("");
      setShowEditItemModal(false);
    } catch (error) {
      console.error("Failed to edit item:", error);
    }
  };

  const handleDeleteItem = async (category: string, index: number) => {
    try {
      const updatedPackingList = JSON.parse(
        JSON.stringify(trip?.packingList || {})
      );
      const categoryKey = category as keyof typeof updatedPackingList;

      if (updatedPackingList[categoryKey]) {
        (
          updatedPackingList[categoryKey] as Array<{
            name: string;
            quantity?: number;
            packed: boolean;
            isCustom?: boolean;
          }>
        ).splice(index, 1);
      }

      await updatePackingList({
        id: tripId!,
        packingList: updatedPackingList,
      }).unwrap();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleTogglePacked = async (category: string, index: number) => {
    const itemKey = `${category}-${index}`;

    if (!localPackingList || !localPackingList[category]) {
      console.error("No local packing list or category found");
      return;
    }

    const items = localPackingList[category];
    if (!items[index]) {
      console.error("Item not found at index:", index);
      return;
    }

    const currentItem = items[index];
    const newPackedStatus = !currentItem.packed;

    console.log(
      `Toggling ${category}[${index}]: ${currentItem.name} from ${currentItem.packed} to ${newPackedStatus}`
    );

    const updatedLocalList = { ...localPackingList };
    updatedLocalList[category] = [...items];
    updatedLocalList[category][index] = {
      ...currentItem,
      packed: newPackedStatus,
    };

    console.log("Updated local list:", updatedLocalList);
    setLocalPackingList(updatedLocalList);
    setUpdatingItems((prev) => new Set(prev).add(itemKey));

    try {
      const result = await updatePackingList({
        id: tripId!,
        packingList: updatedLocalList,
      }).unwrap();

      console.log("API response:", result);

      dispatch(
        tripsApi.util.updateQueryData("getTripById", tripId!, (draft) => {
          if (draft?.data) {
            draft.data.packingList = updatedLocalList;
          }
        })
      );

      dispatch(
        tripsApi.util.updateQueryData("getTrips", "", (draft) => {
          if (draft?.data) {
            const allTrips = [
              ...(draft.data.upcoming || []),
              ...(draft.data.past || []),
            ];
            const tripIndex = allTrips.findIndex(
              (t: { _id: string }) => t._id === tripId
            );
            if (tripIndex !== -1) {
              if (
                draft.data.upcoming &&
                draft.data.upcoming.find(
                  (t: { _id: string }) => t._id === tripId
                )
              ) {
                const upcomingIndex = draft.data.upcoming.findIndex(
                  (t: { _id: string }) => t._id === tripId
                );
                if (upcomingIndex !== -1) {
                  draft.data.upcoming[upcomingIndex].packingList =
                    updatedLocalList;
                }
              } else if (
                draft.data.past &&
                draft.data.past.find((t: { _id: string }) => t._id === tripId)
              ) {
                const pastIndex = draft.data.past.findIndex(
                  (t: { _id: string }) => t._id === tripId
                );
                if (pastIndex !== -1) {
                  draft.data.past[pastIndex].packingList = updatedLocalList;
                }
              }
            }
          }
        })
      );
    } catch (error) {
      console.error("Failed to toggle packed status:", error);
      alert("Failed to update packing status. Please try again.");
      if (localPackingList) {
        const revertedList = { ...localPackingList };
        revertedList[category] = [...items];
        revertedList[category][index] = {
          ...currentItem,
          packed: currentItem.packed,
        };
        setLocalPackingList(revertedList);
      }
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!templateName.trim()) return;

    try {
      const templateData = {
        name: templateName,
        packingList: trip?.packingList,
        destination: trip?.destination,
        country: trip?.country,
      };

      await createTemplate(templateData).unwrap();

      setTemplateName("");
      setShowSaveTemplateModal(false);
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };

  const openEditModal = (
    item: PackingItem,
    category: string,
    index: number
  ) => {
    setEditingItem(item);
    setEditingCategory(category);
    setEditingItemIndex(index);
    setShowEditItemModal(true);
  };

  const getPackedCount = () => {
    if (!localPackingList) return 0;
    let count = 0;
    Object.values(localPackingList).forEach((items) => {
      (items as unknown as Array<{ packed: boolean }>).forEach((item) => {
        if (item.packed) count++;
      });
    });
    return count;
  };

  const getTotalCount = () => {
    if (!localPackingList) return 0;
    let count = 0;
    Object.values(localPackingList).forEach((items) => {
      count += (items as unknown as Array<unknown>).length;
    });
    return count;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700 font-medium">
            Loading packing list...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isUnauthorized = "status" in error && error.status === 401;
    const errorMessage = isUnauthorized
      ? "Authentication required. Please log in again."
      : "Error loading packing list";

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-xl text-red-600 font-medium mb-4">
            {errorMessage}
          </div>
          {isUnauthorized && (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/auth/login");
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Go to Login
            </button>
          )}
          <button
            onClick={() => {
              refetch();
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-4"
          >
            🔄 Retry Loading
          </button>
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

  const packedCount = getPackedCount();
  const totalCount = getTotalCount();
  const progressPercentage =
    totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push(`/auth/dashboard/trips/${tripId}`)}
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
                  Packing List
                </h1>
                <p className="text-sm text-gray-600">
                  For your trip to {trip.destination}
                </p>
              </div>
            </div>
            {/* <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">
                  {packedCount} of {totalCount} packed
                </p>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    if (localPackingList) {
                      await updatePackingList({
                        id: tripId!,
                        packingList: localPackingList,
                      }).unwrap();
                      alert("Packing list saved successfully!");
                    }
                  } catch (error) {
                    console.error("Failed to save packing list:", error);
                    alert("Failed to save packing list. Please try again.");
                  }
                }}
                disabled={isUpdatingPackingList}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                {isUpdatingPackingList ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  "💾 Save List"
                )}
              </button>
              <button
                onClick={() => {
                  refetch();
                  alert("Data refreshed!");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                🔄 Refresh
              </button>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  console.log("Current token:", token);

                  try {
                    const response = await fetch(
                      `${API_CONFIG.baseUrl}/trips/${tripId}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }
                    );

                    if (response.ok) {
                      const data = await response.json();
                      console.log("Auth test successful:", data);
                      alert("Authentication working! Check console for data.");
                    } else {
                      const errorData = await response.json();
                      console.error(
                        "Auth test failed:",
                        response.status,
                        errorData
                      );

                      if (
                        response.status === 403 &&
                        errorData.message === "Invalid token"
                      ) {
                        alert("Token is invalid. Redirecting to login...");
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        router.push("/auth/login");
                      } else {
                        alert(
                          `Authentication failed: ${response.status} ${errorData.message}`
                        );
                      }
                    }
                  } catch (error) {
                    console.error("Auth test error:", error);
                    alert("Authentication test error. Check console.");
                  }
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                🔐 Test Auth
              </button>
            </div> */}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg text-gray-700 font-medium">
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          {/* <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Packing List
          </h2> */}
          {/* <div className="flex space-x-3">
            <button
              onClick={() => {
                console.log("=== DEBUG INFO ===");
                console.log("Trip ID:", tripId);
                console.log("Local packing list:", localPackingList);
                console.log("Original packing list:", trip?.packingList);
                console.log("Packed count:", getPackedCount());
                console.log("Total count:", getTotalCount());
                console.log(
                  "Progress:",
                  `${((getPackedCount() / getTotalCount()) * 100).toFixed(1)}%`
                );
                console.log("==================");
                alert(
                  `Packed: ${getPackedCount()}/${getTotalCount()} (${(
                    (getPackedCount() / getTotalCount()) *
                    100
                  ).toFixed(1)}%)`
                );
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm"
            >
              Debug ({getPackedCount()}/{getTotalCount()})
            </button>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
                Add Item
              </div>
            </button>
            <button
              onClick={() => setShowSaveTemplateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Save as Template
              </div>
            </button>
            <button
              onClick={handleRegeneratePackingList}
              disabled={isRegenerating}
              className="px-6 py-3 text-blue-600 hover:text-blue-800 disabled:opacity-50 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              {isRegenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Regenerating...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Regenerate
                </div>
              )}
            </button>
          </div> */}
        </div>

        {localPackingList && (
          <div className="space-y-8">
            {Object.entries(localPackingList).map(([category, items]) => (
              <div
                key={category}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-4">
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
                  <h3 className="text-xl font-bold text-gray-900 capitalize">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                </div>
                <div className="space-y-3">
                  {(
                    items as unknown as Array<{
                      name: string;
                      quantity?: number;
                      packed: boolean;
                      isCustom?: boolean;
                    }>
                  ).map(
                    (
                      item: {
                        name: string;
                        quantity?: number;
                        packed: boolean;
                        isCustom?: boolean;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="flex items-center justify-between group p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100 hover:border-gray-200"
                      >
                        <label className="flex items-center space-x-4 cursor-pointer flex-1">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={Boolean(item.packed)}
                              onChange={() => {
                                console.log(
                                  "Checkbox clicked for:",
                                  item.name,
                                  "in category:",
                                  category,
                                  "index:",
                                  index,
                                  "current packed status:",
                                  item.packed
                                );
                                handleTogglePacked(category, index);
                              }}
                              disabled={updatingItems.has(
                                `${category}-${index}`
                              )}
                              className="w-6 h-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {updatingItems.has(`${category}-${index}`) && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-gray-700 text-lg font-medium ${
                              item.packed ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {item.name}
                            {item.quantity && item.quantity > 1 && (
                              <span className="text-gray-500 ml-2 font-normal">
                                ({item.quantity})
                              </span>
                            )}
                            {item.isCustom && (
                              <span className="text-blue-500 ml-2 text-sm font-normal">
                                (custom)
                              </span>
                            )}
                          </span>
                        </label>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              openEditModal(
                                { ...item, category },
                                category,
                                index
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                          >
                            Edit
                          </button>
                          {item.isCustom && (
                            <button
                              onClick={() => handleDeleteItem(category, index)}
                              className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {(!localPackingList || Object.keys(localPackingList).length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="text-gray-400 mb-6">
                <svg
                  className="w-24 h-24 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No packing list yet
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start by adding items to your packing list
              </p>
              <button
                onClick={() => setShowAddItemModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Add First Item
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
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
              <h3 className="text-xl font-bold text-gray-900">
                Add custom item
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item name
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  placeholder="e.g. Hiking boots"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  placeholder="e.g. 1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex justify-end mt-8 space-x-3">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomItem}
                disabled={!newItem.name || !newItem.category}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditItemModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Edit Item</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-8 space-x-3">
              <button
                onClick={() => setShowEditItemModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditItem}
                disabled={!editingItem.name}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Save packing list as template
              </h3>
              <p className="text-gray-600 mt-2">
                Create a reusable template for future trips
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-3">
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsTemplate}
                disabled={!templateName.trim()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingListPage;
