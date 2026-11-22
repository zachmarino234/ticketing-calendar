import type { Performance } from '../../core/types';
import { DAYS_OF_WEEK, getMonthFromArray, groupByDate, formatTime, formatStatus, buildCalendar, upcomingOnly } from './calendar-utils';

export default function PerformanceCalendar({ performances, year, month, displayAvailability }: { performances: Performance[]; year: number; month: number; displayAvailability: boolean }) {

    const weeks = buildCalendar(year, month, upcomingOnly(performances));

    return (
        <div className="flex flex-col items-start gap-5" aria-label={`Performance calendar for ${getMonthFromArray(month)} ${year}`}>
            <h4 className="font-display text-4xl">{getMonthFromArray(month)?.toUpperCase()}</h4>
            <div className="border bg-white border-gray-300 rounded p-6" aria-label='Calendar'>
                <table className="w-full table-fixed border-separate border-spacing-3">
                    <thead>
                        <tr>
                            {DAYS_OF_WEEK.map((day) => (
                                <th key={day} scope="col" className="font-body text-xl text-center">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((week, w) => (
                            <tr key={w}>
                                {week.map((cell, d) => {
                                    if (cell.kind === 'empty') return <td key={`empty-${w}-${d}`} />
                                    return (
                                        <td key={cell.dateKey} className="align-top">
                                            <div className="flex flex-col gap-2 p-1">
                                                <span className="font-body text-2xl">{cell.day}</span>
                                                {cell.performances.map((p) =>
                                                    p.status === 'sold_out' ? (
                                                        <div key={p.id} className="flex items-center gap-2 font-alt rounded p-1" tabIndex={0} aria-label={`Tickets ${displayAvailability ? formatStatus(p.status) : ''} for performance on ${getMonthFromArray(month)} ${cell.day}, ${year} at ${formatTime(p.startsAt, p.timezone)}`}>
                                                            {displayAvailability && (<div className={`size-4 rounded-full show-${p.status}`} />)}
                                                            {formatTime(p.startsAt, p.timezone)}
                                                        </div>
                                                    ) : (
                                                        <a key={p.id} href={p.bookingUrl} className="flex items-center gap-2 font-alt hover:bg-black hover:text-white transition-colors rounded p-1" aria-label={`Tickets ${displayAvailability ? formatStatus(p.status) : ''} for performance on ${getMonthFromArray(month)} ${cell.day}, ${year} at ${formatTime(p.startsAt, p.timezone)}`}>
                                                            {displayAvailability && (<div className={`size-4 rounded-full show-${p.status}`} />)}
                                                            {formatTime(p.startsAt, p.timezone)}
                                                        </a>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {displayAvailability && (
                    <div className="flex gap-5 mt-6" aria-label="Legend">
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
                )}
            </div>
        </div>

    )
}