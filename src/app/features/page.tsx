"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../auth/footer/page";

export default function Features() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: (
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
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
          />
        </svg>
      ),
      title: "AI-Powered Trip Planning",
      description:
        "Get personalized travel recommendations based on your preferences, budget, and travel style. Our AI analyzes thousands of destinations to create the perfect itinerary.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: (
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      title: "Smart Packing Lists",
      description:
        "Never forget essential items again. Our intelligent packing system considers weather, activities, destination, and trip duration to create comprehensive packing lists.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Collaborative Travel Planning",
      description:
        "Plan trips together with friends and family. Share itineraries, collaborate on activities, and keep everyone in sync with real-time updates.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: (
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
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      ),
      title: "Real-time Weather Integration",
      description:
        "Get accurate weather forecasts for your destination. Our system automatically adjusts packing recommendations based on current and predicted weather conditions.",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: (
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
            d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V4a1 1 0 00-1-1H5a1 1 0 00-1 1v1zm0 0h6m-6 0H4m0 0V4a1 1 0 011-1h1a1 1 0 011 1v1z"
          />
        </svg>
      ),
      title: "Smart Notifications & Reminders",
      description:
        "Stay on top of your travel plans with intelligent notifications. Get reminders for packing deadlines, flight times, and important travel documents.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: (
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Travel Templates & Presets",
      description:
        "Save and reuse your favorite trip configurations. Create templates for different types of travel - business, leisure, adventure, or family trips.",
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-grey-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-grey-600/10"></div>

      <div className="relative z-10">
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center animate-pulse-slow">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold gradient-text">PackPal</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="/features" className="text-blue-600 font-semibold">
              Features
            </a>
            <a
              href="/about"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-20">
            <h1
              className={`text-5xl md:text-7xl font-bold mb-8 ${
                isLoaded ? "animate-fade-in-down" : "opacity-0"
              }`}
            >
              <span className="gradient-text">Features</span>
            </h1>
            <p
              className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto ${
                isLoaded ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              Discover how PackPal revolutionizes your travel experience with
              cutting-edge features designed for modern travelers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  isLoaded ? "animate-fade-in-up" : "opacity-0"
                }`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 animate-float`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Advanced Capabilities
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Machine Learning Algorithms
                    </h3>
                    <p className="text-gray-600">
                      Our AI continuously learns from your preferences to
                      provide increasingly accurate recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Offline Access
                    </h3>
                    <p className="text-gray-600">
                      Access your travel plans and packing lists even without
                      internet connectivity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Multi-Platform Sync
                    </h3>
                    <p className="text-gray-600">
                      Seamlessly sync your data across all your devices - web,
                      mobile, and tablet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl flex items-center justify-center animate-gradient">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg
                        className="w-12 h-12 text-blue-600"
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
                    </div>
                    <p className="text-lg font-semibold text-gray-700">
                      Powered by Advanced AI
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Ready to Experience the Future of Travel?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of travelers who have already transformed their
              journey with PackPal.
            </p>
            <Link
              href="/auth/signup"
              className="btn-primary text-xl px-12 py-6 animate-pulse-slow"
            >
              Start Your Adventure
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
