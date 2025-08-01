"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useGetTripByIdQuery } from "@/redux/slices/api/trips/trips";
import {
  useInviteCollaboratorMutation,
  useGetCollaboratorsQuery,
  useRemoveCollaboratorMutation,
  useUpdateCollaboratorRoleMutation,
} from "@/redux/slices/api/collaboration/collaboration";

interface Collaborator {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "edit" | "view";
  joinedAt: string;
}

const ShareTripPage = () => {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"view" | "edit">("view");
  const [showInviteForm, setShowInviteForm] = useState(false);

  const { data: tripData, isLoading: tripLoading } =
    useGetTripByIdQuery(tripId);
  const { data: collaboratorsData, isLoading: collaboratorsLoading } =
    useGetCollaboratorsQuery(tripId);

  const [inviteCollaborator, { isLoading: isInviting }] =
    useInviteCollaboratorMutation();
  const [removeCollaborator] = useRemoveCollaboratorMutation();
  const [updateCollaboratorRole] = useUpdateCollaboratorRoleMutation();

  const trip =
    tripData && typeof tripData === "object" && "data" in tripData
      ? (tripData as { data: { destination: string } }).data
      : undefined;
  const collaborators = collaboratorsData?.collaborators || [];

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await inviteCollaborator({
        tripId,
        email: email.trim(),
        role,
      }).unwrap();

      setEmail("");
      setRole("view");
      setShowInviteForm(false);
    } catch (error) {
      console.error("Failed to invite collaborator:", error);
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    try {
      await removeCollaborator({ tripId, userId }).unwrap();
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: "view" | "edit") => {
    try {
      await updateCollaboratorRole({ tripId, userId, role: newRole }).unwrap();
    } catch (error) {
      console.error("Failed to update collaborator role:", error);
    }
  };

  if (tripLoading || collaboratorsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Trip not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
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
              <h1 className="text-2xl font-bold text-gray-900">Share Trip</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Trip to {trip.destination}
          </h2>
          <p className="text-gray-600">
            Invite collaborators to help plan your trip
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invite by email
              </h3>

              {!showInviteForm ? (
                <button
                  onClick={() => setShowInviteForm(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Invite Collaborator
                </button>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="view"
                          checked={role === "view"}
                          onChange={(e) =>
                            setRole(e.target.value as "view" | "edit")
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            Can view
                          </div>
                          <div className="text-sm text-gray-500">
                            Collaborators can view the trip details
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="edit"
                          checked={role === "edit"}
                          onChange={(e) =>
                            setRole(e.target.value as "view" | "edit")
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            Can edit
                          </div>
                          <div className="text-sm text-gray-500">
                            Collaborators can view and edit the trip details
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowInviteForm(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isInviting || !email.trim()}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isInviting ? "Inviting..." : "Invite"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current collaborators
              </h3>

              {collaborators.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No collaborators yet
                </p>
              ) : (
                <div className="space-y-4">
                  {collaborators.map((collaborator: Collaborator) => (
                    <div
                      key={collaborator._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {collaborator.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {collaborator.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {collaborator.role === "owner"
                              ? "Owner"
                              : collaborator.role === "edit"
                              ? "Can edit"
                              : "Can view"}
                          </div>
                        </div>
                      </div>

                      {collaborator.role !== "owner" && (
                        <div className="flex items-center space-x-2">
                          <select
                            value={collaborator.role}
                            onChange={(e) =>
                              handleUpdateRole(
                                collaborator._id,
                                e.target.value as "view" | "edit"
                              )
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="view">Can view</option>
                            <option value="edit">Can edit</option>
                          </select>
                          <button
                            onClick={() =>
                              handleRemoveCollaborator(collaborator._id)
                            }
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShareTripPage;
