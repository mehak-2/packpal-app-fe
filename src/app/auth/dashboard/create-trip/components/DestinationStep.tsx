"use client";

import React, { useState } from "react";
import Image from "next/image";
import DestinationSelector from "@/components/DestinationSelector";
import { GeoDBCity } from "@/services/geoDbService";
import { getDestinationImage } from "@/utils/destinationImages";

interface DestinationStepProps {
  destination: string;
  country: string;
  onUpdate: (field: string, value: string) => void;
}

const DestinationStep = ({ onUpdate }: DestinationStepProps) => {
  const [selectedDestination, setSelectedDestination] =
    useState<GeoDBCity | null>(null);

  const handleDestinationSelect = (
    option: { label: string; value: string; data: GeoDBCity } | null
  ) => {
    if (option) {
      const city = option.data;
      setSelectedDestination(city);
      onUpdate("destination", city.name);
      onUpdate("country", city.country);
    } else {
      setSelectedDestination(null);
      onUpdate("destination", "");
      onUpdate("country", "");
    }
  };

  const handlePopularDestinationSelect = (city: GeoDBCity) => {
    setSelectedDestination(city);
    onUpdate("destination", city.name);
    onUpdate("country", city.country);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search for destination
        </label>
        <DestinationSelector
          value={
            selectedDestination
              ? {
                  label: `${selectedDestination.name}, ${selectedDestination.country}`,
                  value: `${selectedDestination.name}-${selectedDestination.country}`,
                  data: selectedDestination,
                }
              : undefined
          }
          onChange={handleDestinationSelect}
          placeholder="Search countries, cities..."
          showPopularDestinations={true}
          onPopularDestinationSelect={handlePopularDestinationSelect}
        />
      </div>

      {selectedDestination && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="relative h-48 w-full">
            <Image
              src={getDestinationImage(
                selectedDestination.name,
                selectedDestination.country
              )}
              alt={`${selectedDestination.name}, ${selectedDestination.country}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute top-4 left-4">
              <div className="w-8 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">
                  {selectedDestination.countryCode}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {selectedDestination.name}, {selectedDestination.country}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {selectedDestination.region} •{" "}
              {selectedDestination.population?.toLocaleString()} people
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {selectedDestination.latitude.toFixed(2)},{" "}
              {selectedDestination.longitude.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationStep;
