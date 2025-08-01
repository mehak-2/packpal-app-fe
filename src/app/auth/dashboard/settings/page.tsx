"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SettingsComponent from "@/components/SettingsComponent";

interface User {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
}

export default function SettingsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    setIsLoaded(true);
  }, [router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-2xl font-bold gradient-text">
                    PackPal
                  </span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div
            className={`mb-8 ${
              isLoaded ? "animate-fade-in-down" : "opacity-0"
            }`}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your account preferences and settings
            </p>
          </div>

          <SettingsComponent user={user} />
        </main>
      </div>
    </div>
  );
}
