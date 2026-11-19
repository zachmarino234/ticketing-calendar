import type { Performance } from '../../core/types';
import { DAYS_OF_WEEK, getMonthFromArray, groupByDate, formatTime } from './calendar-utils';

export default function PerformanceCalendar({ performances, year, month }: { performances: Performance[]; year: number; month: number }) {

    // Calculate the first day of the month and the number of days in the month to create a grid for the calendar. 
    const firstDayIndex = new Date(year, month - 1, 1).getDay()  // month - 1: JS months are 0-based
    const daysInMonth = new Date(year, month, 0).getDate()     // day 0 of next month = last day of this one

    // Create an array of empty slots for the days before the first of the month, and an array of the days in the month. Combine them to create the full calendar grid.
    const emptySlots = Array.from({ length: firstDayIndex }, () => null);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const calendarCells = [...emptySlots, ...monthDays];

    const byDate = groupByDate(performances)

    return (
        <div className="flex items-start gap-5">
            <h4 className="font-display text-xl [writing-mode:sideways-lr]">{getMonthFromArray(month)?.toUpperCase()}</h4>
            <div className="border bg-white border-gray-300 rounded p-6">
                <div className="grid grid-cols-7 gap-3">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="font-alt text-4xl text-center">
                            {day}
                        </div>
                    ))}
                    {calendarCells.map((day, index) => {
                        if (day === null) return <div key={`empty-${index}`} />

                        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        const shows = byDate[dateKey] ?? []

                        return (
                            <div key={dateKey} className="flex flex-col gap-2 p-1">
                                <span className="font-alt text-2xl">{day}</span>
                                {shows.map(p => (
                                    <a key={p.id} href={p.bookingUrl} className="flex items-center gap-2 font-body hover:bg-black hover:text-white transition-colors rounded p-1">
                                        <div className={`size-4 rounded-full show-${p.status}`} />
                                        {formatTime(p.startsAt, p.timezone)}
                                    </a>
                                ))}
                            </div>
                        )
                    })}
                </div>
                <div className="flex gap-5 mt-6">
                    <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full show-available" /><span className="font-body">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full show-limited" /><span className="font-body">Limited</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full show-sold_out" /><span className="font-body">Sold Out</span>
                    </div>
                </div>
            </div>


        </div>

    )
}