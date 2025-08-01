"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { API_CONFIG } from "../../../../../config/api";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Invitation {
  _id: string;
  tripId: string;
  inviterId: User;
  inviteeId: User;
  status: "pending" | "accepted" | "declined" | "expired";
  sentAt: string;
  expiresAt: string;
}

interface CollaboratorsStepProps {
  tripId?: string;
  collaborators?: string[];
  onUpdate?: (field: string, value: unknown) => void;
}

const CollaboratorsStep = ({ tripId }: CollaboratorsStepProps) => {
  const [email, setEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<Invitation[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const fetchTripInvitations = useCallback(async () => {
    if (!tripId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_CONFIG.baseUrl}/invitations/trip/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInvitedUsers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching trip invitations:", error);
    }
  }, [tripId]);

  useEffect(() => {
    fetchAvailableUsers();
    if (tripId) {
      fetchTripInvitations();
    }
  }, [fetchAvailableUsers, fetchTripInvitations, tripId]);

  const handleSendInvite = async () => {
    if (!email.trim()) return;

    if (!tripId) {
      setMessage(
        "Please complete the trip creation first to send invitations."
      );
      return;
    }

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
          tripId,
          inviteeEmail: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Invitation sent successfully!");
        setEmail("");
        fetchTripInvitations();
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
        fetchTripInvitations();
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to resend invitation");
      }
    } catch (error) {
      console.error("Error resending invite:", error);
      setMessage("Failed to resend invitation");
    }
  };

  const handleRemoveInvite = async (invitationId: string) => {
    // For now, we'll just remove from local state
    // In a full implementation, you might want to add a "cancel invitation" endpoint
    const updatedInvitedUsers = invitedUsers.filter(
      (inv) => inv._id !== invitationId
    );
    setInvitedUsers(updatedInvitedUsers);
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invite collaborators
        </h2>
        <p className="text-gray-600">
          Invite friends and family to join your trip
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex space-x-3">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && handleSendInvite()}
          />
          <button
            onClick={handleSendInvite}
            disabled={isLoading || !email.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Sending..." : "Send invite"}
          </button>
        </div>

        {invitedUsers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Invited
            </h3>
            <div className="space-y-3">
              {invitedUsers.map((invitation) => (
                <div
                  key={invitation._id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {invitation.inviteeId.avatar ? (
                        <Image
                          src={invitation.inviteeId.avatar}
                          alt={invitation.inviteeId.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(invitation.inviteeId.name)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invitation.inviteeId.email}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
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
                        onClick={() => handleResendInvite(invitation._id)}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Resend
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveInvite(invitation._id)}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableUsers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Users
            </h3>
            <div className="space-y-2">
              {availableUsers
                .filter(
                  (user) =>
                    !invitedUsers.find((inv) => inv.inviteeId._id === user._id)
                )
                .slice(0, 5)
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        {user.avatar ? (
                          <Image
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
                        <p className="text-xs text-gray-500">{user.email}</p>
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

      {invitedUsers.length === 0 && (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-sm">No collaborators invited yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Start by entering an email address above
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorsStep;
