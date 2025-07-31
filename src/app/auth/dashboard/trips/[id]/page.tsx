"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetTripByIdQuery,
  useDeleteTripMutation,
  useUpdatePackingListMutation,
  useRegeneratePackingListMutation,
  useCreateTemplateMutation,
  tripsApi,
} from "@/redux/slices/api/trips/trips";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

interface PackingItem {
  name: string;
  quantity?: number;
  packed: boolean;
  category: string;
  isCustom?: boolean;
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
  const dispatch = useDispatch<AppDispatch>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number>(-1);
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [templateName, setTemplateName] = useState("");

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
  const [createTemplate] = useCreateTemplateMutation();

  const trip =
    tripData && typeof tripData === "object" && "data" in tripData
      ? (tripData as { data: Trip }).data
      : undefined;

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

  const getDestinationImage = (
    destination: string,
    destinationInfo?: Trip["destinationInfo"]
  ) => {
    if (destinationInfo?.flag) {
      return destinationInfo.flag;
    }

    const destinationMap: { [key: string]: string } = {
      "New York":
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop&crop=center&q=80",
      "Washington, D.C.":
        "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
      "Washington DC":
        "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
      Washington:
        "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
      "Los Angeles":
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Chicago:
        "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
      Miami:
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      "San Francisco":
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop&crop=center&q=80",
      "Las Vegas":
        "https://images.unsplash.com/photo-1581350917348-867d3e3f3c8e?w=800&h=400&fit=crop&crop=center&q=80",
      Seattle:
        "https://images.unsplash.com/photo-1502173173179-7e09bbf17e39?w=800&h=400&fit=crop&crop=center&q=80",
      Boston:
        "https://images.unsplash.com/photo-1508697014387-db70aad34f4d?w=800&h=400&fit=crop&crop=center&q=80",
      Denver:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Nashville:
        "https://images.unsplash.com/photo-1514896856000-91cb788aa01e?w=800&h=400&fit=crop&crop=center&q=80",
      "New Orleans":
        "https://images.unsplash.com/photo-1514896856000-91cb788aa01e?w=800&h=400&fit=crop&crop=center&q=80",
      Austin:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Portland:
        "https://images.unsplash.com/photo-1502173173179-7e09bbf17e39?w=800&h=400&fit=crop&crop=center&q=80",
      Philadelphia:
        "https://images.unsplash.com/photo-1508697014387-db70aad34f4d?w=800&h=400&fit=crop&crop=center&q=80",
      Phoenix:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      "San Diego":
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Dallas:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Houston:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Atlanta:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Orlando:
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      Tampa:
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      Minneapolis:
        "https://images.unsplash.com/photo-1502173173179-7e09bbf17e39?w=800&h=400&fit=crop&crop=center&q=80",
      Detroit:
        "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
      Cleveland:
        "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
      Pittsburgh:
        "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
      Cincinnati:
        "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
      "Kansas City":
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      "St. Louis":
        "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
      Indianapolis:
        "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
      Columbus:
        "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
      Charlotte:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Raleigh:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Jacksonville:
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      "Fort Worth":
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Arlington:
        "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
      Sacramento:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Oakland:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop&crop=center&q=80",
      Fresno:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      "Long Beach":
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Mesa: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      "Virginia Beach":
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      "Colorado Springs":
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Omaha:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Honolulu:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Anaheim:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Lexington:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Stockton:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Henderson:
        "https://images.unsplash.com/photo-1581350917348-867d3e3f3c8e?w=800&h=400&fit=crop&crop=center&q=80",
      Riverside:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Newark:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop&crop=center&q=80",
      "Saint Paul":
        "https://images.unsplash.com/photo-1502173173179-7e09bbf17e39?w=800&h=400&fit=crop&crop=center&q=80",
      "Santa Ana":
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      "Corpus Christi":
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      Irvine:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Fremont:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop&crop=center&q=80",
      Spokane:
        "https://images.unsplash.com/photo-1502173173179-7e09bbf17e39?w=800&h=400&fit=crop&crop=center&q=80",
      Glendale:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      "San Jose":
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop&crop=center&q=80",
      Chandler:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Laredo:
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      "Chula Vista":
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Gilbert:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
      Reno: "https://images.unsplash.com/photo-1581350917348-867d3e3f3c8e?w=800&h=400&fit=crop&crop=center&q=80",
      "Baton Rouge":
        "https://images.unsplash.com/photo-1514896856000-91cb788aa01e?w=800&h=400&fit=crop&crop=center&q=80",
      Hialeah:
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      Greensboro:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Garland:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Plano:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Norfolk:
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      "Winston-Salem":
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      "North Las Vegas":
        "https://images.unsplash.com/photo-1581350917348-867d3e3f3c8e?w=800&h=400&fit=crop&crop=center&q=80",
      Irving:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      Chesapeake:
        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
      London:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop&crop=center&q=80",
      Paris:
        "https://images.unsplash.com/photo-1502602898534-47d3c0c8705b?w=800&h=400&fit=crop&crop=center&q=80",
      Tokyo:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&crop=center&q=80",
      Rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=400&fit=crop&crop=center&q=80",
      Barcelona:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=400&fit=crop&crop=center&q=80",
      Amsterdam:
        "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=400&fit=crop&crop=center&q=80",
      Berlin:
        "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=400&fit=crop&crop=center&q=80",
      Prague:
        "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=400&fit=crop&crop=center&q=80",
      Vienna:
        "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=400&fit=crop&crop=center&q=80",
      Budapest:
        "https://images.unsplash.com/photo-1551867633-194f125695d7?w=800&h=400&fit=crop&crop=center&q=80",
      Dubai:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop&crop=center&q=80",
      Singapore:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=400&fit=crop&crop=center&q=80",
      Bangkok:
        "https://images.unsplash.com/photo-1508009603885-50cf7c079365?w=800&h=400&fit=crop&crop=center&q=80",
      "Hong Kong":
        "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&h=400&fit=crop&crop=center&q=80",
      Seoul:
        "https://images.unsplash.com/photo-1538485399081-7c8ce013b5ba?w=800&h=400&fit=crop&crop=center&q=80",
      Sydney:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=400&fit=crop&crop=center&q=80",
      Melbourne:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=400&fit=crop&crop=center&q=80",
      Cairo:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&crop=center&q=80",
      "Cape Town":
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
      "Rio de Janeiro":
        "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=400&fit=crop&crop=center&q=80",
      "Mexico City":
        "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
    };

    // Try to find exact match first
    if (destinationMap[destination]) {
      return destinationMap[destination];
    }

    // Fallback to a generic travel image
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop&crop=center&q=80";
  };

  const getDestinationDescription = (trip: Trip) => {
    if (trip.destinationInfo?.description) {
      return trip.destinationInfo.description;
    }
    return `Explore the beautiful destination of ${trip.destination}, ${trip.country}.`;
  };

  const getWeatherDescription = (trip: Trip) => {
    if (trip.weather) {
      return `The weather in ${trip.destination} is currently ${trip.weather.description} with a temperature of ${trip.weather.temperature}°C.`;
    }
    return `Weather information for ${trip.destination} will be available closer to your trip date.`;
  };

  const handleDelete = async () => {
    try {
      await deleteTrip(tripId!).unwrap();
      router.push("/auth/dashboard");
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/auth/dashboard/trips/${tripId}/edit`);
  };

  const handleRegeneratePackingList = async () => {
    if (!tripId) return;
    try {
      const result = await regeneratePackingList(tripId).unwrap();
      console.log("Regenerated packing list:", result);

      if (result && typeof result === "object" && "data" in result) {
        const resultData = result as { data: { packingList: unknown } };
        dispatch(
          tripsApi.util.updateQueryData("getTrips", "", (draft) => {
            if (draft?.data) {
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
                    resultData.data.packingList;
                }
              } else if (
                draft.data.past &&
                draft.data.past.find((t: { _id: string }) => t._id === tripId)
              ) {
                const pastIndex = draft.data.past.findIndex(
                  (t: { _id: string }) => t._id === tripId
                );
                if (pastIndex !== -1) {
                  draft.data.past[pastIndex].packingList =
                    resultData.data.packingList;
                }
              }
            }
          })
        );
      }
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

      const result = await updatePackingList({
        id: tripId!,
        packingList: updatedPackingList,
      }).unwrap();

      dispatch(
        tripsApi.util.updateQueryData("getTrips", "", (draft) => {
          if (draft?.data) {
            if (
              draft.data.upcoming &&
              draft.data.upcoming.find((t: { _id: string }) => t._id === tripId)
            ) {
              const upcomingIndex = draft.data.upcoming.findIndex(
                (t: { _id: string }) => t._id === tripId
              );
              if (upcomingIndex !== -1) {
                draft.data.upcoming[upcomingIndex].packingList =
                  updatedPackingList;
              }
            } else if (
              draft.data.past &&
              draft.data.past.find((t: { _id: string }) => t._id === tripId)
            ) {
              const pastIndex = draft.data.past.findIndex(
                (t: { _id: string }) => t._id === tripId
              );
              if (pastIndex !== -1) {
                draft.data.past[pastIndex].packingList = updatedPackingList;
              }
            }
          }
        })
      );

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

      const result = await updatePackingList({
        id: tripId!,
        packingList: updatedPackingList,
      }).unwrap();

      dispatch(
        tripsApi.util.updateQueryData("getTrips", "", (draft) => {
          if (draft?.data) {
            if (
              draft.data.upcoming &&
              draft.data.upcoming.find((t: { _id: string }) => t._id === tripId)
            ) {
              const upcomingIndex = draft.data.upcoming.findIndex(
                (t: { _id: string }) => t._id === tripId
              );
              if (upcomingIndex !== -1) {
                draft.data.upcoming[upcomingIndex].packingList =
                  updatedPackingList;
              }
            } else if (
              draft.data.past &&
              draft.data.past.find((t: { _id: string }) => t._id === tripId)
            ) {
              const pastIndex = draft.data.past.findIndex(
                (t: { _id: string }) => t._id === tripId
              );
              if (pastIndex !== -1) {
                draft.data.past[pastIndex].packingList = updatedPackingList;
              }
            }
          }
        })
      );

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

      const result = await updatePackingList({
        id: tripId!,
        packingList: updatedPackingList,
      }).unwrap();

      dispatch(
        tripsApi.util.updateQueryData("getTrips", "", (draft) => {
          if (draft?.data) {
            if (
              draft.data.upcoming &&
              draft.data.upcoming.find((t: { _id: string }) => t._id === tripId)
            ) {
              const upcomingIndex = draft.data.upcoming.findIndex(
                (t: { _id: string }) => t._id === tripId
              );
              if (upcomingIndex !== -1) {
                draft.data.upcoming[upcomingIndex].packingList =
                  updatedPackingList;
              }
            } else if (
              draft.data.past &&
              draft.data.past.find((t: { _id: string }) => t._id === tripId)
            ) {
              const pastIndex = draft.data.past.findIndex(
                (t: { _id: string }) => t._id === tripId
              );
              if (pastIndex !== -1) {
                draft.data.past[pastIndex].packingList = updatedPackingList;
              }
            }
          }
        })
      );
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleTogglePacked = async (category: string, index: number) => {
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
        )[index].packed = !(
          updatedPackingList[categoryKey] as Array<{
            name: string;
            quantity?: number;
            packed: boolean;
            isCustom?: boolean;
          }>
        )[index].packed;
      }

      const result = await updatePackingList({
        id: tripId!,
        packingList: updatedPackingList,
      }).unwrap();

      dispatch(
        tripsApi.util.updateQueryData("getTrips", "", (draft) => {
          if (draft?.data) {
            if (
              draft.data.upcoming &&
              draft.data.upcoming.find((t: { _id: string }) => t._id === tripId)
            ) {
              const upcomingIndex = draft.data.upcoming.findIndex(
                (t: { _id: string }) => t._id === tripId
              );
              if (upcomingIndex !== -1) {
                draft.data.upcoming[upcomingIndex].packingList =
                  updatedPackingList;
              }
            } else if (
              draft.data.past &&
              draft.data.past.find((t: { _id: string }) => t._id === tripId)
            ) {
              const pastIndex = draft.data.past.findIndex(
                (t: { _id: string }) => t._id === tripId
              );
              if (pastIndex !== -1) {
                draft.data.past[pastIndex].packingList = updatedPackingList;
              }
            }
          }
        })
      );
    } catch (error) {
      console.error("Failed to toggle packed status:", error);
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
    item: {
      name: string;
      quantity?: number;
      packed: boolean;
      isCustom?: boolean;
    },
    category: string,
    index: number
  ) => {
    setEditingItem({
      name: item.name,
      quantity: item.quantity,
      packed: item.packed,
      isCustom: item.isCustom,
      category: category,
    });
    setEditingCategory(category);
    setEditingItemIndex(index);
    setShowEditItemModal(true);
  };

  const getPackedCount = () => {
    console.log("getPackedCount called, trip packingList:", trip?.packingList);
    if (!trip?.packingList) return 0;
    let count = 0;
    Object.values(trip.packingList).forEach((items) => {
      if (Array.isArray(items)) {
        items.forEach((item: { packed: boolean }) => {
          if (item.packed) count++;
        });
      }
    });
    console.log("Packed count:", count);
    return count;
  };

  const getTotalCount = () => {
    console.log("getTotalCount called, trip packingList:", trip?.packingList);
    if (!trip?.packingList) return 0;
    let count = 0;
    Object.values(trip.packingList).forEach((items) => {
      if (Array.isArray(items)) {
        count += items.length;
      }
    });
    console.log("Total count:", count);
    return count;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/auth/dashboard")}
                className="text-gray-600 hover:text-blue-600 mr-4 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
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
                  Trip to {trip.destination}
                </h1>
                <p className="text-sm text-gray-500">
                  {formatDateRange(trip.startDate, trip.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* <button
                onClick={() => {
                  console.log("=== TRIP DETAILS DEBUG ===");
                  console.log("Trip data:", trip);
                  console.log("Packing list:", trip?.packingList);
                  console.log("Packed count:", getPackedCount());
                  console.log("Total count:", getTotalCount());
                  console.log("========================");
                  alert(
                    `Packed: ${getPackedCount()}/${getTotalCount()}\nCheck console for details`
                  );
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs"
              >
                Debug
              </button> */}
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  {getPackedCount()}/{getTotalCount()} Packed
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative">
              <img
                src={getDestinationImage(
                  trip.destination,
                  trip.destinationInfo
                )}
                alt={trip.destination}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop&crop=center&q=80`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-3xl font-bold mb-1">{trip.destination}</h2>
                <p className="text-lg opacity-90">{trip.country}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
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
                  Trip Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {getDestinationDescription(trip)}
                </p>

                {trip.destinationInfo && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Region
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {trip.destinationInfo.region}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-green-600 uppercase tracking-wide">
                        Population
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {trip.destinationInfo.population?.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                        Languages
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {trip.destinationInfo.languages?.join(", ")}
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                        Currency
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {trip.destinationInfo.currencies?.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  Weather
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {getWeatherDescription(trip)}
                </p>
                {trip.weather && (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-300 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold">
                        {trip.weather.temperature}°C
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90">
                          {trip.weather.description}
                        </div>
                        <div className="text-xs opacity-75">
                          {trip.weather.condition}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 opacity-75"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                        <span>Humidity: {trip.weather.humidity}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 opacity-75"
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
                        <span>Wind: {trip.weather.windSpeed} m/s</span>
                      </div>
                    </div>
                  </div>
                )}

                {trip.weather?.forecast && trip.weather.forecast.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      7-Day Forecast
                    </h3>
                    <div className="grid grid-cols-7 gap-2">
                      {trip.weather.forecast
                        ?.slice(0, 7)
                        .map((day: unknown, index: number) => (
                          <div
                            key={index}
                            className="bg-white/50 rounded-lg p-2 text-center"
                          >
                            <div className="text-xs font-medium text-gray-600 mb-1">
                              {new Date(
                                (day as { date: string }).date
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                              {(day as { temperature: number }).temperature}°
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(day as { precipitation: number }).precipitation}
                              %
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {trip.destinationInfo?.emergencyNumbers && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-red-600"
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
                    Emergency Numbers
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between bg-red-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Police
                        </span>
                      </div>
                      <span className="text-sm font-bold text-red-600">
                        {trip.destinationInfo.emergencyNumbers.police}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Ambulance
                        </span>
                      </div>
                      <span className="text-sm font-bold text-orange-600">
                        {trip.destinationInfo.emergencyNumbers.ambulance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Fire
                        </span>
                      </div>
                      <span className="text-sm font-bold text-yellow-600">
                        {trip.destinationInfo.emergencyNumbers.fire}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {trip.activities.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
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
                    Activities
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {trip.activities.map((activity: string) => (
                      <span
                        key={activity}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-200"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    Collaborators
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/auth/dashboard/trips/${tripId}/share`)
                      }
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Share Trip
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/auth/dashboard/trips/${tripId}/activity`)
                      }
                      className="text-sm bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors duration-200 hover:text-gray-600"
                    >
                      Activity Log
                    </button>
                  </div>
                </div>
                {trip.collaborators.length > 0 ? (
                  <div className="space-y-3">
                    {trip.collaborators.map(
                      (collaborator: {
                        _id: string;
                        name: string;
                        email: string;
                      }) => (
                        <div
                          key={collaborator._id}
                          className="flex items-center space-x-3 bg-white/50 rounded-lg p-3 hover:bg-white/70 transition-colors duration-200"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {collaborator.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
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
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <p className="text-sm mb-2">No collaborators yet</p>
                    <button
                      onClick={() =>
                        router.push(`/auth/dashboard/trips/${tripId}/share`)
                      }
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Invite collaborators
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
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
                  Packing List
                </h2>
                {/* <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/auth/dashboard/trips/${tripId}/ai-assistant`
                      )
                    }
                    className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    AI Assistant
                  </button>
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => setShowSaveTemplateModal(true)}
                    className="text-sm bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={handleRegeneratePackingList}
                    disabled={isRegenerating}
                    className="text-sm bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isRegenerating ? "Regenerating..." : "Regenerate"}
                  </button>
                </div> */}
              </div>

              <div className="text-center py-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-blue-400"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Packing List Ready
                  </h3>
                  <p className="text-gray-600 mb-4">
                    PackPal is ready for your trip to {trip.destination}!
                  </p>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {getPackedCount()}
                      </div>
                      <div className="text-xs text-gray-500">Packed</div>
                    </div>
                    <div className="text-gray-300">/</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {getTotalCount()}
                      </div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <button
                      onClick={() => {
                        alert(
                          `Packing List Data:\n${JSON.stringify(
                            trip.packingList,
                            null,
                            2
                          )}`
                        );
                      }}
                      className="text-sm text-blue-600 underline"
                    >
                      Show Packing List Data
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() =>
                        router.push(
                          `/auth/dashboard/trips/${tripId}/packing-list`
                        )
                      }
                      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      View Full Packing List
                    </button>
                    {(!trip.packingList || getTotalCount() === 0) && (
                      <button
                        onClick={handleRegeneratePackingList}
                        disabled={isRegenerating}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isRegenerating
                          ? "Generating..."
                          : "Generate Packing List"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Delete Trip</span>
          </button>
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
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
            <span>Edit Trip</span>
          </button>
        </div>
      </main>

      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
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
              Add custom item
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item name
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  placeholder="e.g. Hiking boots"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomItem}
                disabled={!newItem.name || !newItem.category}
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditItemModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEditItemModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleEditItem}
                disabled={!editingItem.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Save packing list as template
            </h3>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsTemplate}
                disabled={!templateName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
