"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 bg-white"></div>

      <div className="relative z-10">
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center animate-pulse-slow">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold gradient-text">PackPal</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a
              href="/features"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
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
              className={`text-6xl md:text-8xl font-bold mb-8 ${
                isLoaded ? "animate-fade-in-down" : "opacity-0"
              }`}
            >
              <span className="gradient-text">PackPal</span>
            </h1>
            <p
              className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto ${
                isLoaded ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              Your intelligent travel companion that helps you plan, pack, and
              explore with confidence
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-6 justify-center items-center  ${
                isLoaded ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <Link
                href="/auth/signup"
                className="btn-primary text-lg px-8 py-4 animate-pulse-slow"
              >
                Start Your Journey
              </Link>
              <Link
                href="/auth/login"
                className="btn-primary text-lg px-8 py-4 text-white"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className=" grid md:grid-cols-3 gap-8 mb-20">
            <div
              className={`card  text-center ${
                isLoaded ? "animate-slide-in-left" : "opacity-0"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-800 text-center ">
                Smart Planning
              </h3>
              <p className="text-gray-600 text-center">
                AI-powered trip planning with personalized recommendations for
                destinations, activities, and itineraries.
              </p>
            </div>

            <div
              className={`card text-center ${
                isLoaded ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Smart Packing
              </h3>
              <p className="text-gray-600">
                Intelligent packing lists based on destination, weather,
                activities, and travel duration.
              </p>
            </div>

            <div
              className={`card text-center ${
                isLoaded ? "animate-slide-in-right" : "opacity-0"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Collaborate
              </h3>
              <p className="text-gray-600">
                Share trips with friends and family, collaborate on planning,
                and travel together seamlessly.
              </p>
            </div>
          </div>

          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Why Choose PackPal?
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                      AI-Powered Intelligence
                    </h3>
                    <p className="text-gray-600">
                      Advanced AI algorithms provide personalized
                      recommendations and smart suggestions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                      Real-time Weather Integration
                    </h3>
                    <p className="text-gray-600">
                      Get accurate weather forecasts to pack the right clothes
                      for your destination.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                      Smart Notifications
                    </h3>
                    <p className="text-gray-600">
                      Never forget important travel details with intelligent
                      reminders and alerts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl flex items-center justify-center animate-gradient">
                  <div className="texst-center">
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      Start Your Adventure Today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Ready to Transform Your Travel Experience?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of travelers who trust PackPal to make their
              journeys unforgettable.
            </p>
            <Link
              href="/auth/signup"
              className="btn-primary text-xl px-12 py-6 animate-pulse-slow"
            >
              Get Started Now
            </Link>
          </div>
        </main>

        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center flex-row gap-24 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
