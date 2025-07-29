"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
        return "text-yellow-600 bg-yellow-100";
      case "accepted":
        return "text-green-600 bg-green-100";
      case "declined":
        return "text-red-600 bg-red-100";
      case "expired":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Collaborators
              </h1>
              <p className="mt-2 text-gray-600">
                Manage trip collaborators and invitations
              </p>
            </div>
            <Link
              href="/auth/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("trips")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "trips"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Trips
              </button>
              <button
                onClick={() => setActiveTab("received")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "received"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Received Invitations ({receivedInvitations.length})
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sent"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Sent Invitations ({sentInvitations.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "trips" ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Invite Collaborators to Trip
                  </h3>

                  {trips.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No trips found. Create a trip first!
                      </p>
                      <Link
                        href="/auth/dashboard/create-trip"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Create Trip
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Trip
                        </label>
                        <select
                          value={selectedTrip}
                          onChange={(e) => setSelectedTrip(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {trips.map((trip) => (
                            <option key={trip._id} value={trip._id}>
                              {trip.destination}, {trip.country} (
                              {new Date(trip.startDate).toLocaleDateString()} -{" "}
                              {new Date(trip.endDate).toLocaleDateString()})
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedTripData && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Selected Trip:
                          </h4>
                          <p className="text-gray-600">
                            {selectedTripData.destination},{" "}
                            {selectedTripData.country}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              selectedTripData.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              selectedTripData.endDate
                            ).toLocaleDateString()}
                          </p>
                          {selectedTripData.collaborators.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                Current collaborators:
                              </p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedTripData.collaborators.map(
                                  (collaborator) => (
                                    <span
                                      key={collaborator._id}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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

                      <div className="flex space-x-3">
                        <input
                          type="email"
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendInvite()
                          }
                        />
                        <button
                          onClick={handleSendInvite}
                          disabled={isLoading || !email.trim() || !selectedTrip}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isLoading ? "Sending..." : "Send Invite"}
                        </button>
                      </div>

                      {availableUsers.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Quick Invite
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                      {user.avatar ? (
                                        <img
                                          src={user.avatar}
                                          alt={user.name}
                                          className="w-8 h-8 rounded-full object-cover"
                                        />
                                      ) : (
                                        getInitials(user.name)
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
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
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Received Invitations
                </h3>

                {receivedInvitations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                      <p className="text-sm">No received invitations</p>
                      <p className="text-xs text-gray-400 mt-1">
                        You&apos;ll see invitations here when they&apos;re sent
                        to you
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedInvitations.map((invitation: Invitation) => (
                      <div
                        key={invitation._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                              {getInitials(invitation.inviterId.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {invitation.inviterId.name} invited you to join
                              </p>
                              <p className="text-sm text-gray-600">
                                {invitation.tripId.destination},{" "}
                                {invitation.tripId.country}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  invitation.tripId.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  invitation.tripId.endDate
                                ).toLocaleDateString()}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                                  invitation.status
                                )}`}
                              >
                                {getStatusText(invitation.status)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {invitation.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleAcceptInvitation(invitation._id)
                                  }
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeclineInvitation(invitation._id)
                                  }
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Sent Invitations
                </h3>

                {sentInvitations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                      <p className="text-sm">No sent invitations</p>
                      <p className="text-xs text-gray-400 mt-1">
                        You haven&apos;t sent any invitations yet
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentInvitations.map((invitation: Invitation) => (
                      <div
                        key={invitation._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                              {getInitials(invitation.inviteeId.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                You invited {invitation.inviteeId.name} to join
                              </p>
                              <p className="text-sm text-gray-600">
                                {invitation.tripId.destination},{" "}
                                {invitation.tripId.country}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  invitation.tripId.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  invitation.tripId.endDate
                                ).toLocaleDateString()}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                                  invitation.status
                                )}`}
                              >
                                {getStatusText(invitation.status)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {invitation.status === "pending" && (
                              <button
                                onClick={() =>
                                  handleResendInvite(invitation._id)
                                }
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
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
      </div>
    </div>
  );
};

export default CollaboratorsPage;
