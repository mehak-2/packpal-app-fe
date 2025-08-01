"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAcceptInvitationMutation } from "@/redux/slices/api/collaboration/collaboration";

const AcceptInvitationPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const [acceptInvitation] = useAcceptInvitationMutation();

  const handleAcceptInvitation = useCallback(
    async (id: string) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage(
            "Please log in to accept this invitation. You'll be redirected to the login page."
          );
          setIsLoading(false);
          setTimeout(() => {
            router.push(`/auth/login?redirect=/auth/invitations/${id}/accept`);
          }, 3000);
          return;
        }

        await acceptInvitation(id).unwrap();
        setMessage(
          "Invitation accepted successfully! Redirecting to dashboard..."
        );
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/auth/dashboard");
        }, 2000);
      } catch (error: unknown) {
        console.error("Error accepting invitation:", error);
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
          setMessage("Failed to accept invitation");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router, acceptInvitation]
  );

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      await handleAcceptInvitation(resolvedParams.id);
    };
    resolveParams();
  }, [params, handleAcceptInvitation]);

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
            <div className="text-green-600">
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
                  d="M5 13l4 4L19 7"
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
            {isSuccess ? "Invitation Accepted!" : "Error"}
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

export default AcceptInvitationPage;
