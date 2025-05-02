'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface FormattedDateProps {
  date: Date | number | string;
  formatString?: string;
}

export function FormattedDate({ date, formatString = 'PP' }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    // Ensure date is only formatted on the client side after hydration
    try {
        const dateToFormat = typeof date === 'string' ? new Date(date) : date;
        // Check if the date is valid before formatting
        if (!isNaN(dateToFormat.getTime())) {
             setFormattedDate(format(dateToFormat, formatString));
        } else {
             setFormattedDate("Invalid Date");
        }
    } catch (error) {
        console.error("Error formatting date:", error);
        setFormattedDate("Invalid Date"); // Handle potential errors
    }
  }, [date, formatString]);

  // Render nothing or a placeholder during SSR and initial client render before useEffect runs
  if (formattedDate === null) {
    // Render a placeholder matching the expected text size to avoid layout shifts
    return <span className="text-sm text-transparent select-none">Loading...</span>;
    // Or return <Skeleton className="h-4 w-20" />;
  }

  return <>{formattedDate}</>;
}
