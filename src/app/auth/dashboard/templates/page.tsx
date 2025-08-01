"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import {
  useGetTemplatesQuery,
  useDeleteTemplateMutation,
} from "@/redux/slices/api/trips/trips";

interface Template {
  _id: string;
  name: string;
  destination: string;
  country: string;
  packingList: {
    clothing: Array<{ name: string; quantity: number; packed: boolean }>;
    accessories: Array<{ name: string; packed: boolean }>;
    essentials: Array<{ name: string; packed: boolean }>;
    electronics: Array<{ name: string; packed: boolean }>;
    toiletries: Array<{ name: string; packed: boolean }>;
    documents: Array<{ name: string; packed: boolean }>;
    activities: Array<{ name: string; packed: boolean }>;
  };
  createdAt: string;
  updatedAt: string;
}

const TemplatesPage = () => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
  }, [router]);

  const {
    data: templatesData,
    isLoading,
    error,
    refetch,
  } = useGetTemplatesQuery("");
  const [deleteTemplate, { isLoading: isDeleting }] =
    useDeleteTemplateMutation();

  const templates = templatesData?.data || [];

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      await deleteTemplate(templateToDelete).unwrap();
      setShowDeleteConfirm(false);
      setTemplateToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const getItemCount = (template: Template) => {
    let count = 0;
    Object.values(template.packingList).forEach((items) => {
      count += items.length;
    });
    return count;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generatePDF = (template: Template) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text("PackPal - Packing List Template", 20, 20);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${template.name}`, 20, 35);
    doc.text(
      `Destination: ${template.destination}, ${template.country}`,
      20,
      45
    );

    let yPosition = 60;

    Object.entries(template.packingList).forEach(([category, items]) => {
      if (items.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text(
          category.charAt(0).toUpperCase() + category.slice(1),
          20,
          yPosition
        );
        yPosition += 8;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        items.forEach(
          (item: { name: string; quantity?: number; packed?: boolean }) => {
            const itemText = item.quantity
              ? `${item.name} (${item.quantity})`
              : item.name;
            if (yPosition > 280) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(`• ${itemText}`, 25, yPosition);
            yPosition += 6;
          }
        );

        yPosition += 5;
      }
    });

    doc.save(`${template.name}-packing-list.pdf`);
  };

  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  const handleCopy = async (template: Template) => {
    try {
      const packingListText = Object.entries(template.packingList)
        .map(([category, items]) => {
          if (items.length === 0) return null;
          const categoryTitle =
            category.charAt(0).toUpperCase() + category.slice(1);
          const itemsList = items
            .map(
              (item: { name: string; quantity?: number; packed?: boolean }) =>
                item.quantity
                  ? `• ${item.name} (${item.quantity})`
                  : `• ${item.name}`
            )
            .join("\n");
          return `${categoryTitle}:\n${itemsList}`;
        })
        .filter(Boolean)
        .join("\n\n");

      await navigator.clipboard.writeText(packingListText);

      setCopyStatus((prev) => ({ ...prev, [template._id]: true }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [template._id]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    const isUnauthorized = "status" in error && error.status === 401;
    const errorMessage = isUnauthorized
      ? "Authentication required. Please log in again."
      : "Error loading templates";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{errorMessage}</div>
          {isUnauthorized && (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/auth/login");
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-grey-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-grey-600/5"></div>

      <div className="relative z-10">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/auth/dashboard")}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <span className="text-2xl font-bold gradient-text">
                    PackPal
                  </span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-600 bg-clip-text text-transparent">
                  Templates
                </h1>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your Packing Templates
            </h2>
            <p className="text-lg text-gray-600">
              Save and reuse your favorite packing lists for future adventures
            </p>
          </div>

          {templates.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No templates yet
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Create your first template by saving a packing list from one of
                your trips
              </p>
              <button
                onClick={() => router.push("/auth/dashboard")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-gray-600 text-white rounded-xl hover:from-blue-700 hover:to-gray-700 transition-all duration-200 shadow-lg text-lg font-semibold"
              >
                Go to Trips
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template: Template) => (
                <div
                  key={template._id}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {template.destination}, {template.country}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setTemplateToDelete(template._id);
                        setShowDeleteConfirm(true);
                      }}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                      <span className="text-gray-700 font-medium">
                        Total Items:
                      </span>
                      <span className="text-blue-600 font-bold text-lg">
                        {getItemCount(template)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(template.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Updated:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(template.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      Categories:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(template.packingList).map(
                        ([category, items]) =>
                          items.length > 0 && (
                            <span
                              key={category}
                              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-gray-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200"
                            >
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}{" "}
                              ({items.length})
                            </span>
                          )
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => generatePDF(template)}
                      className="flex-1 px-4 py-3 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0014.414 6L10 1.586A2 2 0 008 1.586L3.586 6A2 2 0 002 7.414V4a2 2 0 012-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Export PDF
                    </button>
                    <button
                      onClick={() => handleCopy(template)}
                      className={`flex-1 px-4 py-3 text-sm rounded-xl transition-all duration-200 font-medium flex items-center justify-center ${
                        copyStatus[template._id]
                          ? "bg-green-500 text-white"
                          : "bg-gradient-to-r from-blue-600 to-gray-600 text-white hover:from-blue-700 hover:to-gray-700 shadow-lg"
                      }`}
                    >
                      {copyStatus[template._id] ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Delete Template?
              </h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to delete this template? This action
                cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setTemplateToDelete(null);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
