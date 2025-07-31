/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { geoDbService, GeoDBCity } from "@/services/geoDbService";

interface MultiDestinationSelectorProps {
  selectedDestinations: GeoDBCity[];
  onDestinationsChange: (destinations: GeoDBCity[]) => void;
  placeholder?: string;
  className?: string;
  maxSelections?: number;
}

interface SelectOption {
  label: string;
  value: string;
  data: GeoDBCity;
}

const MultiDestinationSelector: React.FC<MultiDestinationSelectorProps> = ({
  selectedDestinations,
  onDestinationsChange,
  placeholder = "Search and select destinations...",
  className = "",
  maxSelections = 10,
}) => {
  const [popularDestinations, setPopularDestinations] = useState<GeoDBCity[]>(
    []
  );
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);

  useEffect(() => {
    loadPopularDestinations();
  }, []);

  const loadPopularDestinations = async () => {
    setIsLoadingPopular(true);
    try {
      const cities = await geoDbService.getPopularCities(6);
      setPopularDestinations(cities);
    } catch (error) {
      console.error("Error loading popular destinations:", error);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const loadOptions = async (inputValue: string): Promise<SelectOption[]> => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    try {
      const [cities, countries] = await Promise.all([
        geoDbService.searchCities(inputValue, 8),
        geoDbService.searchCountries(inputValue, 4),
      ]);

      const cityOptions = cities.map((city) => ({
        label: `${city.name}, ${city.country}`,
        value: `${city.name}-${city.country}`,
        data: city,
        type: "city" as const,
      }));

      const countryOptions = countries.map((country) => ({
        label: `${country.name} (Country)`,
        value: `${country.name}-${country.code}`,
        data: {
          id: country.id,
          name: country.name,
          country: country.name,
          countryCode: country.code,
          region: country.region,
          regionCode: country.code,
          latitude: 0,
          longitude: 0,
          population: country.population,
          timezone: "UTC",
        } as GeoDBCity,
        type: "country" as const,
      }));

      return [...cityOptions, ...countryOptions];
    } catch (error) {
      console.error("Error loading options:", error);
      return [];
    }
  };

  const selectedOptions = useMemo(() => {
    return selectedDestinations.map((dest) => ({
      label: `${dest.name}, ${dest.country}`,
      value: `${dest.name}-${dest.country}`,
      data: dest,
    }));
  }, [selectedDestinations]);

  const handleSelectionChange = (options: readonly SelectOption[]) => {
    const destinations = options.map((option) => option.data);
    onDestinationsChange(destinations);
  };

  const handlePopularDestinationSelect = (destination: GeoDBCity) => {
    if (selectedDestinations.length >= maxSelections) {
      return;
    }

    const isAlreadySelected = selectedDestinations.some(
      (dest) => dest.id === destination.id
    );

    if (!isAlreadySelected) {
      onDestinationsChange([...selectedDestinations, destination]);
    }
  };

  const removeDestination = (destinationId: number) => {
    const updatedDestinations = selectedDestinations.filter(
      (dest) => dest.id !== destinationId
    );
    onDestinationsChange(updatedDestinations);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customStyles = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: (provided: any, state: { isFocused: boolean }) => ({
      ...provided,
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    option: (
      provided: any,
      state: { isSelected: boolean; isFocused: boolean }
    ) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#3b82f6",
      color: "white",
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "white",
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "white",
      "&:hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  const formatOptionLabel = (option: SelectOption) => (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className="w-6 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {option.data.countryCode}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{option.data.name}</div>
        <div className="text-sm text-gray-500">
          {option.data.country} • {option.data.population?.toLocaleString()}{" "}
          people
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          value={selectedOptions}
          onChange={handleSelectionChange}
          placeholder={placeholder}
          isMulti
          isClearable
          isSearchable
          styles={customStyles}
          formatOptionLabel={formatOptionLabel}
          noOptionsMessage={() => "No destinations found"}
          loadingMessage={() => "Searching destinations..."}
          className="w-full"
          isDisabled={selectedDestinations.length >= maxSelections}
        />
        {selectedDestinations.length >= maxSelections && (
          <p className="text-sm text-gray-500 mt-2">
            Maximum {maxSelections} destinations selected
          </p>
        )}
      </div>

      {selectedDestinations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-3">
            Selected Destinations ({selectedDestinations.length}/{maxSelections}
            )
          </h4>
          <div className="space-y-2">
            {selectedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {dest.countryCode}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{dest.name}</div>
                    <div className="text-sm text-gray-500">{dest.country}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeDestination(dest.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Popular destinations
        </h3>
        {isLoadingPopular ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2 mt-1"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularDestinations.map((city) => {
              const isSelected = selectedDestinations.some(
                (dest) => dest.id === city.id
              );
              const isDisabled =
                selectedDestinations.length >= maxSelections && !isSelected;

              return (
                <div
                  key={city.id}
                  onClick={() =>
                    !isDisabled && handlePopularDestinationSelect(city)
                  }
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected
                      ? "border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg transform scale-105"
                      : isDisabled
                      ? "border-gray-200 opacity-50 cursor-not-allowed"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-2">🏙️</div>
                      <div className="text-xs font-bold">
                        {city.countryCode}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h4 className="font-medium text-sm">{city.name}</h4>
                    <p className="text-xs opacity-90">{city.country}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiDestinationSelector;
