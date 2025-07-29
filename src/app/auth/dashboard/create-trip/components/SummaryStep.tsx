"use client";

import React from "react";

interface SummaryStepProps {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  activities: string[];
  weather?: {
    temperature: number;
    condition: string;
    forecast?: Array<{
      date: string;
      temperature: number;
      condition: string;
      precipitation: number;
    }>;
  };
}

const SummaryStep = ({
  destination,
  country,
  startDate,
  endDate,
  activities,
  weather,
}: SummaryStepProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDestinationDescription = (dest: string) => {
    const descriptions: { [key: string]: string } = {
      Paris:
        "Paris, the City of Lights, is renowned for its iconic landmarks, romantic ambiance, and rich cultural heritage. Key highlights include the Eiffel Tower, Louvre Museum, Notre Dame Cathedral, and the charming streets of Montmartre. Travel tips: Pack comfortable shoes for walking, learn a few basic French phrases, and be prepared for crowds at popular attractions. Enjoy the city's culinary delights, from patisseries to fine dining.",
      Tokyo:
        "Tokyo, Japan's bustling capital, offers a perfect blend of ultramodern and traditional elements. From the neon-lit streets of Shibuya to the serene temples of Asakusa, Tokyo provides endless exploration opportunities. Key highlights include the Tokyo Skytree, Senso-ji Temple, and the famous Tsukiji Fish Market. Travel tips: Get a Japan Rail Pass for convenient travel, learn basic Japanese phrases, and embrace the efficient public transportation system.",
      Rome: "Rome, the Eternal City, is a living museum of ancient history and Renaissance art. From the iconic Colosseum to the Vatican Museums, every corner tells a story. Key highlights include the Roman Forum, Trevi Fountain, and the Pantheon. Travel tips: Book Vatican tickets in advance, wear comfortable walking shoes, and don't forget to toss a coin in the Trevi Fountain for good luck.",
      Barcelona:
        "Barcelona, the vibrant capital of Catalonia, is famous for its unique architecture, Mediterranean beaches, and rich cultural scene. Key highlights include the Sagrada Familia, Park Güell, and the Gothic Quarter. Travel tips: Learn some basic Catalan phrases, book tickets for popular attractions online, and enjoy the city's excellent public transportation system.",
    };

    return (
      descriptions[dest] ||
      `${dest} offers a unique blend of culture, history, and modern attractions. From iconic landmarks to hidden gems, this destination provides endless opportunities for exploration and discovery. Travel tips: Research local customs, pack appropriately for the climate, and be open to trying new experiences.`
    );
  };

  const generateWeatherForecast = () => {
    if (weather?.forecast) {
      return weather.forecast;
    }

    const start = new Date(startDate);
    const forecast = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      forecast.push({
        date: date.toISOString().split("T")[0],
        temperature: Math.floor(Math.random() * 10) + 20,
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][
          Math.floor(Math.random() * 4)
        ],
        precipitation: Math.floor(Math.random() * 20),
      });
    }
    return forecast;
  };

  const weatherForecast = generateWeatherForecast();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Weather & Destination Summary
        </h2>
        <p className="text-gray-600">
          Here&apos;s what you need to know about your trip to {destination}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weather Forecast
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precipitation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {weatherForecast.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(day.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {day.temperature}°C
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {day.condition}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {day.precipitation}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Destination Summary
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              {getDestinationDescription(destination)}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Trip Details:</span> {destination}
                , {country} • {formatDate(startDate)} - {formatDate(endDate)} •{" "}
                {activities.length} activities selected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
