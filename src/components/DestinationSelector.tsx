/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import AsyncSelect from "react-select/async";
import { geoDbService, GeoDBCity } from "@/services/geoDbService";
import { getDestinationImage } from "@/utils/destinationImages";

interface DestinationSelectorProps {
  value?: { label: string; value: string; data: GeoDBCity };
  onChange: (
    option: { label: string; value: string; data: GeoDBCity } | null
  ) => void;
  placeholder?: string;
  className?: string;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  showPopularDestinations?: boolean;
  onPopularDestinationSelect?: (destination: GeoDBCity) => void;
}

interface SelectOption {
  label: string;
  value: string;
  data: GeoDBCity;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  value,
  onChange,
  placeholder = "Search destinations...",
  className = "",
  isMulti = false,
  isClearable = true,
  isSearchable = true,
  showPopularDestinations = false,
  onPopularDestinationSelect,
}) => {
  const [popularDestinations, setPopularDestinations] = useState<GeoDBCity[]>(
    []
  );
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);

  useEffect(() => {
    if (showPopularDestinations) {
      loadPopularDestinations();
    }
  }, [showPopularDestinations]);

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

  const customStyles = {
    control: (provided: any, state: { isFocused: boolean }) => ({
      ...provided,
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
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
        <div className="font-medium text-gray-900">
          {option.data.name}
          {(option as any).type === "country" && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Country
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {option.data.country} • {option.data.population?.toLocaleString()}{" "}
          people
        </div>
      </div>
    </div>
  );

  const popularDestinationOptions = useMemo(() => {
    return popularDestinations.map((city) => ({
      label: `${city.name}, ${city.country}`,
      value: `${city.name}-${city.country}`,
      data: city,
    }));
  }, [popularDestinations]);

  return (
    <div className={`space-y-4 ${className}`}>
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={value}
        onChange={(newValue) =>
          onChange(
            newValue as { label: string; value: string; data: GeoDBCity } | null
          )
        }
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={() => "No destinations found"}
        loadingMessage={() => "Searching destinations..."}
        className="w-full"
      />

      {showPopularDestinations && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Popular destinations
          </h3>
          {isLoadingPopular ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-32 rounded-lg border-2 border-gray-200"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {popularDestinationOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => onPopularDestinationSelect?.(option.data)}
                  className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={getDestinationImage(
                        option.data.name,
                        option.data.country
                      )}
                      alt={`${option.data.name}, ${option.data.country}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all"></div>
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">
                          {option.data.countryCode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h4 className="font-medium text-sm">{option.data.name}</h4>
                    <p className="text-xs opacity-90">{option.data.country}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationSelector;
