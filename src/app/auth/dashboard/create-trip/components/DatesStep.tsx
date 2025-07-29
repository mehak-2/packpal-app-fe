"use client";

import React, { useState } from "react";

interface DatesStepProps {
  startDate: string;
  endDate: string;
  onUpdate: (field: string, value: string) => void;
}

const DatesStep = ({ startDate, endDate, onUpdate }: DatesStepProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    return "";
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const isStartDate = (date: Date) => {
    if (!startDate) return false;
    const start = new Date(startDate);
    return date.toDateString() === start.toDateString();
  };

  const isEndDate = (date: Date) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    return date.toDateString() === end.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      onUpdate("startDate", date.toISOString().split("T")[0]);
      onUpdate("endDate", "");
    } else {
      const start = new Date(startDate);
      if (date < start) {
        onUpdate("startDate", date.toISOString().split("T")[0]);
        onUpdate("endDate", startDate);
      } else {
        onUpdate("endDate", date.toISOString().split("T")[0]);
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const renderCalendar = (monthOffset: number) => {
    const monthDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      1
    );
    const days = getDaysInMonth(monthDate);
    const monthName = monthDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={monthOffset === 0 ? prevMonth : () => {}}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={monthOffset === 1}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h3 className="font-medium text-gray-900">{monthName}</h3>
          <button
            onClick={monthOffset === 0 ? nextMonth : () => {}}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={monthOffset === 1}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="h-8 flex items-center justify-center">
              {day ? (
                <button
                  onClick={() => handleDateClick(day)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    isStartDate(day) || isEndDate(day)
                      ? "bg-blue-500 text-white"
                      : isInRange(day)
                      ? "bg-gray-200 text-gray-900"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  {day.getDate()}
                </button>
              ) : (
                <div className="w-8 h-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>Create a trip</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">When&apos;s your trip?</span>
      </div>

      <div className="flex space-x-8">
        {renderCalendar(0)}
        {renderCalendar(1)}
      </div>

      {startDate && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Your trip</h4>
          <div>
            <span className="text-sm text-gray-600">Dates</span>
            <p className="text-sm font-medium text-gray-900">
              {formatDateRange()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatesStep;
