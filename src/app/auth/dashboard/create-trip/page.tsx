"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateTripMutation } from "@/redux/slices/api/trips/trips";

export default function CreateTripPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    startDate: "",
    endDate: "",
    activities: [] as string[],
    collaborators: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const [createTrip, { isLoading, error }] = useCreateTripMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setIsLoaded(true);
  }, [router]);

  const steps = [
    { id: 1, title: "Destination", icon: "📍" },
    { id: 2, title: "Dates", icon: "📅" },
    { id: 3, title: "Activities", icon: "🎯" },
    { id: 4, title: "Collaborators", icon: "👥" },
    { id: 5, title: "Summary", icon: "✅" },
  ];

  const popularDestinations = [
    {
      name: "Paris",
      country: "France",
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&h=150&fit=crop",
    },
    {
      name: "Tokyo",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=150&fit=crop",
    },
    {
      name: "New York",
      country: "USA",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=150&fit=crop",
    },
    {
      name: "London",
      country: "UK",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=150&fit=crop",
    },
    {
      name: "Rome",
      country: "Italy",
      image:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&h=150&fit=crop",
    },
    {
      name: "Barcelona",
      country: "Spain",
      image:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=200&h=150&fit=crop",
    },
  ];

  const activityOptions = [
    "Sightseeing",
    "Museums",
    "Food & Dining",
    "Shopping",
    "Adventure",
    "Relaxation",
    "Cultural Events",
    "Nightlife",
    "Nature",
    "Photography",
    "Sports",
    "Wellness",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleActivityToggle = (activity: string) => {
    setFormData({
      ...formData,
      activities: formData.activities.includes(activity)
        ? formData.activities.filter((a) => a !== activity)
        : [...formData.activities, activity],
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }

      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({
        general: "You must be logged in to create a trip. Please log in again.",
      });
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting trip data:", formData);

    try {
      const response = await createTrip({
        destination: formData.destination,
        country: formData.country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        activities: formData.activities,
        collaborators: formData.collaborators,
      }).unwrap();

      console.log("Create trip response:", response);

      if (response.success) {
        router.push(`/auth/dashboard/trips/${response.data._id}`);
      }
    } catch (err: unknown) {
      console.error("Create trip error:", err);

      if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
      ) {
        const errorMessage = (err.data as { message: string }).message;
        console.error("Error message:", errorMessage);
        setErrors({ general: errorMessage });
      } else {
        console.error("Unknown error format:", err);
        setErrors({
          general:
            "An error occurred while creating the trip. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Where are you going?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className={`input-field w-full ${
                      errors.destination ? "border-red-500" : ""
                    }`}
                    placeholder="Enter city name"
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.destination}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`input-field w-full ${
                      errors.country ? "border-red-500" : ""
                    }`}
                    placeholder="Enter country name"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  Popular Destinations
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {popularDestinations.map((dest) => (
                    <div
                      key={dest.name}
                      className="card cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          destination: dest.name,
                          country: dest.country,
                        });
                      }}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                      />
                      <h5 className="font-medium text-gray-800">{dest.name}</h5>
                      <p className="text-sm text-gray-600">{dest.country}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                When are you traveling?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`input-field w-full ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`input-field w-full ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                What activities interest you?
              </h3>
              <p className="text-gray-600 mb-6">
                Select all that apply to help us create a personalized
                experience.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activityOptions.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => handleActivityToggle(activity)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.activities.includes(activity)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Who&apos;s coming with you?
              </h3>
              <p className="text-gray-600 mb-6">
                Invite friends and family to collaborate on your trip planning.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="input-field flex-1"
                  />
                  <button className="btn-primary px-6 py-3">Invite</button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    No collaborators yet. You can always add them later!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Trip Summary
              </h3>
              <div className="card">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium text-black">
                      {formData.destination}, {formData.country}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dates:</span>
                    <span className="font-medium text-black">
                      {formData.startDate} to {formData.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Activities:</span>
                    <div className="text-right">
                      {formData.activities.length > 0 ? (
                        formData.activities.map((activity) => (
                          <span
                            key={activity}
                            className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-1 mb-1"
                          >
                            {activity}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">None selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-600/5"></div>

      <div className="relative z-10">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/dashboard"
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-xl font-bold gradient-text">
                    PackPal
                  </span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Step {currentStep} of {steps.length}
                </span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <div
            className={`mb-8 ${
              isLoaded ? "animate-fade-in-down" : "opacity-0"
            }`}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create New Trip
            </h1>
            <p className="text-gray-600">
              Let&apos;s plan your next adventure together
            </p>
          </div>

          <div
            className={`mb-8 ${isLoaded ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      currentStep >= step.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= step.id ? "text-blue-800" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-blue-800" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`card ${isLoaded ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}
            {renderStepContent()}
          </div>

          <div
            className={`flex justify-between mt-8 ${
              isLoaded ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-4">
              <Link href="/auth/dashboard" className="btn-secondary px-6 py-3">
                Cancel
              </Link>
              {currentStep === steps.length ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isLoading}
                  className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Trip...</span>
                    </>
                  ) : (
                    "Create Trip"
                  )}
                </button>
              ) : (
                <button onClick={nextStep} className="btn-primary px-8 py-3">
                  Next
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
