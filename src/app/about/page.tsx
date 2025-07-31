"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../auth/footer/page";

export default function About() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former travel industry executive with 15+ years experience in digital transformation and customer experience.",
      avatar: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      bio: "AI/ML expert with a passion for building intelligent systems that solve real-world problems.",
      avatar: "MR",
    },
    {
      name: "Emily Watson",
      role: "Head of Product",
      bio: "Product strategist focused on creating intuitive user experiences that delight travelers worldwide.",
      avatar: "EW",
    },
    {
      name: "David Kim",
      role: "Lead Engineer",
      bio: "Full-stack developer specializing in scalable architectures and real-time collaboration features.",
      avatar: "DK",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Travelers" },
    { number: "150+", label: "Countries Covered" },
    { number: "1M+", label: "Trips Planned" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>

      <div className="relative z-10">
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold gradient-text">PackPal</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <a
              href="/features"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a href="/about" className="text-blue-600 font-semibold">
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
              <span className="gradient-text">About PackPal</span>
            </h1>
            <p
              className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto ${
                isLoaded ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              We&apos;re on a mission to make travel planning effortless,
              intelligent, and enjoyable for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div
              className={`space-y-6 ${
                isLoaded ? "animate-slide-in-left" : "opacity-0"
              }`}
            >
              <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                PackPal was born from a simple frustration: planning trips was
                too complicated, and packing was always a last-minute scramble.
                Our founders experienced this firsthand during a family vacation
                that almost went wrong due to forgotten essentials.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We realized that modern travelers needed a smarter solution -
                one that combines the power of AI with intuitive design to
                transform the entire travel planning experience. From that
                moment, PackPal was conceived.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we&apos;re proud to serve travelers worldwide, helping
                them plan unforgettable journeys with confidence and ease.
              </p>
            </div>

            <div
              className={`relative ${
                isLoaded ? "animate-slide-in-right" : "opacity-0"
              }`}
            >
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    Since 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">
              Our Mission
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div
                className={`card p-8 text-center ${
                  isLoaded ? "animate-fade-in-up" : "opacity-0"
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Simplify Travel
                </h3>
                <p className="text-gray-600">
                  Make travel planning effortless and enjoyable for everyone,
                  regardless of experience level.
                </p>
              </div>

              <div
                className={`card p-8 text-center ${
                  isLoaded ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Empower with AI
                </h3>
                <p className="text-gray-600">
                  Leverage artificial intelligence to provide personalized,
                  intelligent travel recommendations.
                </p>
              </div>

              <div
                className={`card p-8 text-center ${
                  isLoaded ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Connect People
                </h3>
                <p className="text-gray-600">
                  Bring travelers together through collaborative planning and
                  shared experiences.
                </p>
              </div>
            </div>
          </div>

          {/* <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">
              By the Numbers
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center ${
                    isLoaded ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div> */}

          {/* <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className={`card p-6 text-center ${
                    isLoaded ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    {member.avatar}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div> */}

          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Join Us on This Journey
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              We&apos;re constantly innovating and improving PackPal to serve
              our community better. Your feedback and experiences help shape the
              future of travel planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/auth/signup"
                className="btn-primary text-lg px-8 py-4 animate-pulse-slow"
              >
                Start Planning Today
              </Link>
              <Link
                href="/contact"
                className="btn-secondary text-lg px-8 py-4 text-white"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </main>

        <Footer />
        {/* <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold">PackPal</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your personal travel companion for smart planning and packing.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
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
        </footer> */}
      </div>
    </div>
  );
}
