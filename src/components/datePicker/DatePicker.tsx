import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
    label: string;
    name: string;
    value?: string;
    onChange: (date: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    name,
    value,
    onChange,
    placeholder = 'Select a date',
    error,
    required = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value || '');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const pickerRef = useRef<HTMLDivElement>(null);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const handleDateChange = (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        const formattedDate = date.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
        onChange(formattedDate);
        setIsOpen(false);
    };

    const handlePrevMonth = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="form-control flex-1 relative" ref={pickerRef}>
            <label className="label">
                <span className="label-text">
                    {label} {required && <span className="text-error">*</span>}
                </span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={selectedDate}
                    placeholder={placeholder}
                    readOnly
                    className={`input input-bordered w-full pr-10 ${error ? 'input-error' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                />
                <Calendar
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>
            {error && <span className="text-error text-sm mt-1">{error}</span>}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-10">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={handlePrevMonth}
                            aria-label="Previous month"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="font-medium">
                            {monthNames[currentMonth]} {currentYear}
                        </span>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={handleNextMonth}
                            aria-label="Next month"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 p-3">
                        {Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => {
                            const day = i + 1;
                            return (
                                <button
                                    key={day}
                                    className="btn btn-ghost text-sm"
                                    onClick={() => handleDateChange(day)}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
