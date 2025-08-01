"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_CONFIG } from "../../../../config/api";

interface Trip {
  _id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  collaborators: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

interface Invitation {
  _id: string;
  tripId: {
    _id: string;
    destination: string;
    country: string;
    startDate: string;
    endDate: string;
  };
  inviterId: {
    _id: string;
    name: string;
    email: string;
  };
  inviteeId: {
    _id: string;
    name: string;
    email: string;
  };
  status: "pending" | "accepted" | "declined" | "expired";
  sentAt: string;
  expiresAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

const CollaboratorsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>(
    []
  );
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"trips" | "sent" | "received">(
    "trips"
  );

  const fetchTrips = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.baseUrl}/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const allTrips = [
          ...(data.data.upcoming || []),
          ...(data.data.past || []),
        ];
        setTrips(allTrips);
        if (allTrips.length > 0 && !selectedTrip) {
          setSelectedTrip(allTrips[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }, [selectedTrip]);

  const fetchPendingInvitations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_CONFIG.baseUrl}/invitations/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Pending invitations data:", data);
        setReceivedInvitations(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
    }
  }, []);

  const fetchSentInvitations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.baseUrl}/invitations/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sent invitations data:", data);
        setSentInvitations(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching sent invitations:", error);
    }
  }, []);

  const fetchAvailableUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
    fetchPendingInvitations();
    fetchSentInvitations();
    fetchAvailableUsers();
  }, [
    fetchTrips,
    fetchPendingInvitations,
    fetchSentInvitations,
    fetchAvailableUsers,
  ]);

  const handleSendInvite = async () => {
    if (!email.trim() || !selectedTrip) return;

    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.baseUrl}/invitations/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tripId: selectedTrip,
          inviteeEmail: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Invitation sent successfully!");
        setEmail("");
        fetchPendingInvitations();
        fetchSentInvitations();
      } else {
        setMessage(data.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      setMessage("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvite = async (invitationId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_CONFIG.baseUrl}/invitations/${invitationId}/resend`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage("Invitation resent successfully!");
        fetchPendingInvitations();
        fetchSentInvitations();
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to resend invitation");
      }
    } catch (error) {
      console.error("Error resending invite:", error);
      setMessage("Failed to resend invitation");
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_CONFIG.baseUrl}/invitations/${invitationId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage("Invitation accepted successfully!");
        fetchPendingInvitations();
        fetchSentInvitations();
        fetchTrips();
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to accept invitation");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setMessage("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_CONFIG.baseUrl}/invitations/${invitationId}/decline`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage("Invitation declined successfully!");
        fetchPendingInvitations();
        fetchSentInvitations();
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to decline invitation");
      }
    } catch (error) {
      console.error("Error declining invitation:", error);
      setMessage("Failed to decline invitation");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200";
      case "accepted":
        return "text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 border-green-200";
      case "declined":
        return "text-red-700 bg-gradient-to-r from-red-100 to-pink-100 border-red-200";
      case "expired":
        return "text-gray-700 bg-gradient-to-r from-gray-100 to-slate-100 border-gray-200";
      default:
        return "text-gray-700 bg-gradient-to-r from-gray-100 to-slate-100 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "declined":
        return "Declined";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  const selectedTripData = trips.find((trip) => trip._id === selectedTrip);

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
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-xl font-bold gradient-text">
                    PackPal
                  </span>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-600 bg-clip-text text-transparent">
                  Collaborators
                </h1>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Manage Collaborators
            </h2>
            <p className="text-lg text-gray-600">
              Invite friends and family to join your trips and collaborate on
              packing lists
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border ${
                message.includes("successfully")
                  ? "bg-gradient-to-r from-green-50 to-gray-50 text-green-700 border-green-200"
                  : "bg-gradient-to-r from-red-50 to-gray-50 text-red-700 border-red-200"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className={`w-5 h-5 mr-2 ${
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      message.includes("successfully")
                        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    }
                  />
                </svg>
                {message}
              </div>
            </div>
          )}

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl">
            <div className="border-b border-gray-200/50">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("trips")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === "trips"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
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
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                      />
                    </svg>
                    <span>My Trips</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("received")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === "received"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Received ({receivedInvitations.length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("sent")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === "sent"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span>Sent ({sentInvitations.length})</span>
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-8">
              {activeTab === "trips" ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-blue-600"
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
                      Invite Collaborators
                    </h3>

                    {trips.length === 0 ? (
                      <div className="text-center py-16">
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
                              strokeWidth={1.5}
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                            />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          No trips found
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg">
                          Create a trip first to start inviting collaborators!
                        </p>
                        <Link
                          href="/auth/dashboard/create-trip"
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-gray-600 text-white rounded-xl hover:from-blue-700 hover:to-gray-700 transition-all duration-200 shadow-lg text-lg font-semibold"
                        >
                          Create Trip
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Select Trip
                          </label>
                          <select
                            value={selectedTrip}
                            onChange={(e) => setSelectedTrip(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                          >
                            {trips.map((trip) => (
                              <option key={trip._id} value={trip._id}>
                                {trip.destination}, {trip.country} (
                                {new Date(trip.startDate).toLocaleDateString()}{" "}
                                - {new Date(trip.endDate).toLocaleDateString()})
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedTripData && (
                          <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
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
                              Selected Trip
                            </h4>
                            <p className="text-lg font-medium text-gray-900 mb-1">
                              {selectedTripData.destination},{" "}
                              {selectedTripData.country}
                            </p>
                            <p className="text-gray-600 mb-4">
                              {new Date(
                                selectedTripData.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                selectedTripData.endDate
                              ).toLocaleDateString()}
                            </p>
                            {selectedTripData.collaborators.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                  Current collaborators:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedTripData.collaborators.map(
                                    (collaborator) => (
                                      <span
                                        key={collaborator._id}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 border border-blue-200"
                                      >
                                        {collaborator.name}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                          <div className="flex space-x-4">
                            <input
                              type="email"
                              placeholder="Enter email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSendInvite()
                              }
                            />
                            <button
                              onClick={handleSendInvite}
                              disabled={
                                isLoading || !email.trim() || !selectedTrip
                              }
                              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-600 text-white rounded-xl hover:from-blue-700 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-semibold"
                            >
                              {isLoading ? "Sending..." : "Send Invite"}
                            </button>
                          </div>
                        </div>

                        {availableUsers.length > 0 && (
                          <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
                              Quick Invite
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {availableUsers
                                .filter(
                                  (user) =>
                                    !selectedTripData?.collaborators.find(
                                      (c) => c._id === user._id
                                    )
                                )
                                .slice(0, 6)
                                .map((user) => (
                                  <div
                                    key={user._id}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-gray-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        {user.avatar ? (
                                          <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                          />
                                        ) : (
                                          getInitials(user.name)
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {user.email}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setEmail(user.email);
                                        handleSendInvite();
                                      }}
                                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                                    >
                                      Invite
                                    </button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === "received" ? (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Received Invitations
                  </h3>

                  {receivedInvitations.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-12 h-12 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        No invitations yet
                      </h3>
                      <p className="text-gray-600 mb-8 text-lg">
                        You&apos;ll see invitations here when they&apos;re sent
                        to you
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receivedInvitations.map((invitation: Invitation) => (
                        <div
                          key={invitation._id}
                          className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {getInitials(
                                  invitation.inviterId?.name || "Unknown User"
                                )}
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900">
                                  {invitation.inviterId?.name || "Unknown User"}{" "}
                                  invited you to join
                                </p>
                                <p className="text-gray-600 font-medium">
                                  {invitation.tripId.destination},{" "}
                                  {invitation.tripId.country}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    invitation.tripId.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    invitation.tripId.endDate
                                  ).toLocaleDateString()}
                                </p>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 border ${getStatusColor(
                                    invitation.status
                                  )}`}
                                >
                                  {getStatusText(invitation.status)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {invitation.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAcceptInvitation(invitation._id)
                                    }
                                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg font-semibold"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeclineInvitation(invitation._id)
                                    }
                                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg font-semibold"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeTab === "sent" ? (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Sent Invitations
                  </h3>

                  {sentInvitations.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-12 h-12 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        No sent invitations
                      </h3>
                      <p className="text-gray-600 mb-8 text-lg">
                        You haven&apos;t sent any invitations yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sentInvitations.map((invitation: Invitation) => (
                        <div
                          key={invitation._id}
                          className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {getInitials(
                                  invitation.inviteeId?.name || "Unknown User"
                                )}
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900">
                                  You invited{" "}
                                  {invitation.inviteeId?.name || "Unknown User"}{" "}
                                  to join
                                </p>
                                <p className="text-gray-600 font-medium">
                                  {invitation.tripId.destination},{" "}
                                  {invitation.tripId.country}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    invitation.tripId.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    invitation.tripId.endDate
                                  ).toLocaleDateString()}
                                </p>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 border ${getStatusColor(
                                    invitation.status
                                  )}`}
                                >
                                  {getStatusText(invitation.status)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {invitation.status === "pending" && (
                                <button
                                  onClick={() =>
                                    handleResendInvite(invitation._id)
                                  }
                                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-gray-600 text-white rounded-xl hover:from-blue-700 hover:to-gray-700 transition-all duration-200 shadow-lg font-semibold"
                                >
                                  Resend
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CollaboratorsPage;
