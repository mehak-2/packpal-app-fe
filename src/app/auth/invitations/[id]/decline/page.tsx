"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDeclineInvitationMutation } from "@/redux/slices/api/collaboration/collaboration";

const DeclineInvitationPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const [declineInvitation] = useDeclineInvitationMutation();

  const handleDeclineInvitation = useCallback(
    async (id: string) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Please log in to decline this invitation");
          setIsLoading(false);
          return;
        }

        await declineInvitation(id).unwrap();
        setMessage(
          "Invitation declined successfully! Redirecting to dashboard..."
        );
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/auth/dashboard");
        }, 2000);
      } catch (error: unknown) {
        console.error("Error declining invitation:", error);
        if (
          error &&
          typeof error === "object" &&
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data
        ) {
          setMessage((error.data as { message: string }).message);
        } else {
          setMessage("Failed to decline invitation");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router, declineInvitation]
  );

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      await handleDeclineInvitation(resolvedParams.id);
    };
    resolveParams();
  }, [params, handleDeclineInvitation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {isSuccess ? (
            <div className="text-gray-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          ) : (
            <div className="text-red-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isSuccess ? "Invitation Declined" : "Error"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/auth/dashboard")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineInvitationPage;
