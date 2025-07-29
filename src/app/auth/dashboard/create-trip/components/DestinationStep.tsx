"use client";

import React, { useState, useEffect } from "react";
import {
  useGetAllCountriesQuery,
  useSearchDestinationsQuery,
} from "@/redux/slices/api/destinations/destinations";

interface DestinationStepProps {
  destination: string;
  country: string;
  onUpdate: (field: string, value: string) => void;
}

interface DestinationData {
  name: string;
  capital: string;
  region: string;
  population: number;
  currencies: string[];
  languages: string[];
  flag: string;
  flagPng: string;
  cca2: string;
  cca3: string;
  callingCodes: string[];
  timezones: string[];
  borders: string[];
  area: number;
  coordinates: number[];
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
  description: string;
  weatherDescription: string;
  popularCities: string[];
}

const DestinationStep = ({
  destination,
  country,
  onUpdate,
}: DestinationStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationData | null>(null);

  const {
    data: allCountries,
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useGetAllCountriesQuery(undefined);
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useSearchDestinationsQuery(searchQuery, {
    skip: searchQuery.length < 2,
  });

  const popularDestinations = allCountries?.data?.slice(0, 12) || [];

  console.log("DestinationStep - allCountries:", allCountries);
  console.log("DestinationStep - isLoadingCountries:", isLoadingCountries);
  console.log("DestinationStep - countriesError:", countriesError);
  console.log("DestinationStep - popularDestinations:", popularDestinations);

  const handleDestinationSelect = (dest: DestinationData) => {
    setSelectedDestination(dest);
    onUpdate("destination", dest.capital || dest.name);
    onUpdate("country", dest.name);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.length >= 2);
  };

  const isSelected = (dest: DestinationData) => {
    return destination === (dest.capital || dest.name) && country === dest.name;
  };

  const getDestinationImage = (dest: DestinationData) => {
    if (dest.flagPng) {
      return dest.flagPng;
    }
    return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop&q=${dest.name}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search for destination
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search countries, cities..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {showSearchResults && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isLoadingSearch ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : searchResults?.data?.length > 0 ? (
              searchResults.data.map((dest: DestinationData) => (
                <div
                  key={dest.cca2}
                  onClick={() => handleDestinationSelect(dest)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={dest.flagPng}
                      alt={dest.name}
                      className="w-6 h-4 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {dest.capital || dest.name}
                      </div>
                      <div className="text-sm text-gray-500">{dest.name}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No destinations found
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Popular destinations
        </h3>
        {isLoadingCountries ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2 mt-1"></div>
              </div>
            ))}
          </div>
        ) : popularDestinations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularDestinations.map((dest: DestinationData) => (
              <div
                key={dest.cca2}
                onClick={() => handleDestinationSelect(dest)}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                  isSelected(dest)
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={getDestinationImage(dest)}
                  alt={dest.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h4 className="font-medium text-sm">
                    {dest.capital || dest.name}
                  </h4>
                  <p className="text-xs opacity-90">{dest.name}</p>
                </div>
                {isSelected(dest) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No destinations available</p>
          </div>
        )}
      </div>

      {selectedDestination && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                src={selectedDestination.flagPng}
                alt={selectedDestination.name}
                className="w-8 h-6 object-cover rounded"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                Selected:{" "}
                <span className="font-medium">
                  {selectedDestination.capital || selectedDestination.name},{" "}
                  {selectedDestination.name}
                </span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {selectedDestination.region} •{" "}
                {selectedDestination.population?.toLocaleString()} people
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationStep;
