import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DateOfBirthPickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({ 
  value, 
  onChange,
  placeholder = "Select date of birth"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDisplayDate = (date: string) => {
    if (!date) return placeholder;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = newDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleMonthClick = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setViewMode('days');
  };

  const handleYearClick = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setViewMode('months');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const getYearRange = () => {
    const currentYear = currentDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    return Array.from({ length: 10 }, (_, i) => startYear + i);
  };

  const renderDaysView = () => (
    <>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentDate).map((day, index) => (
          <button
            key={index}
            onClick={() => day && handleDayClick(day)}
            disabled={!day}
            className={`
              h-8 w-8 text-sm rounded-md transition-colors
              ${!day ? 'invisible' : ''}
              ${day === new Date(value).getDate() && 
                currentDate.getMonth() === new Date(value).getMonth() && 
                currentDate.getFullYear() === new Date(value).getFullYear()
                ? 'bg-button-primary text-white' 
                : ' text-gray-700'
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </>
  );

  const renderMonthsView = () => (
    <div className="grid grid-cols-3 gap-2">
      {months.map((month, index) => (
        <button
          key={month}
          onClick={() => handleMonthClick(index)}
          className={`
            p-3 text-sm rounded-lg transition-colors
            ${index === currentDate.getMonth()
              ? 'bg-button-primary text-white'
              : ' text-gray-700'
            }
          `}
        >
          {month.slice(0, 3)}
        </button>
      ))}
    </div>
  );

  const renderYearsView = () => (
    <div className="grid grid-cols-2 gap-2">
      {getYearRange().map((year) => (
        <button
          key={year}
          onClick={() => handleYearClick(year)}
          className={`
            p-3 text-sm rounded-lg transition-colors
            ${year === currentDate.getFullYear()
              ? 'bg-button-primary text-white'
              : 'text-gray-700'
            }
          `}
        >
          {year}
        </button>
      ))}
    </div>
  );

  const renderHeader = () => {
    if (viewMode === 'days') {
      return (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0s"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('months')}
              className=" text-sm font-medium"
            >
              {months[currentDate.getMonth()]}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('years')}
              className=" text-sm font-medium"
            >
              {currentDate.getFullYear()}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      );
    }

    if (viewMode === 'months') {
      return (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateYear('prev')}
            className="h-8 w-8 p-0 "
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('years')}
            className=" text-sm font-medium"
          >
            {currentDate.getFullYear()}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateYear('next')}
            className="h-8 w-8 p-0 "
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      );
    }

    if (viewMode === 'years') {
      return (
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), 1))}
            className="h-8 w-8 p-0 "
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {getYearRange()[0]} - {getYearRange()[9]}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear() + 10, currentDate.getMonth(), 1))}
            className="h-8 w-8 p-0 "
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer transition-colors bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="h-4 w-4 " />
        <span className={`flex-1 ${!value ? 'text-gray-500' : 'text-gray-900'}`}>
          {formatDisplayDate(value)}
        </span>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar Dropdown */}
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {renderHeader()}
            </div>

            {/* Calendar Content */}
            {viewMode === 'days' && renderDaysView()}
            {viewMode === 'months' && renderMonthsView()}
            {viewMode === 'years' && renderYearsView()}
          </div>
        </>
      )}
    </div>
  );
};

export default DateOfBirthPicker;