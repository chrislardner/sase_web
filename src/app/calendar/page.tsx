'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {FaChevronLeft, FaChevronRight, FaMapMarkerAlt} from 'react-icons/fa';
import {useEvents} from './useEvents';
import type {EventItem} from './types';
import {formatEventDateTime} from './datetime';

const keyLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const monthAnchor = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

const byDateKey = (events: EventItem[]) => {
    const map = new Map<string, EventItem[]>();
    for (const ev of events) {
        const d = new Date(ev.startsAt);
        const k = keyLocal(d);
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push(ev);
    }
    for (const v of map.values()) v.sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
    return map;
};

const nextUpcoming = (events: EventItem[]) => {
    const now = new Date();
    const sorted = [...events].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
    return sorted.find(e => new Date(e.startsAt) >= now) ?? sorted.at(-1) ?? null;
};

const buildMonthGrid = (anchor: Date) => {
    const first = monthAnchor(anchor);
    const firstWeekday = first.getDay();
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells: Date[] = [];
    for (let i = 0; i < firstWeekday; i++) {
        const d = new Date(first);
        d.setDate(d.getDate() - (firstWeekday - i));
        cells.push(d);
    }
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(first.getFullYear(), first.getMonth(), d));
    while (cells.length % 7 !== 0 || cells.length < 42) {
        const d = new Date(cells[cells.length - 1]);
        d.setDate(d.getDate() + 1);
        cells.push(d);
    }
    return cells;
};

function EventInspector({
                            event, sameDayEvents, onPick, onStepPrev, onStepNext, hasPrev, hasNext,
                        }: {
    event: EventItem | null;
    sameDayEvents: EventItem[];
    onPick: (id: string) => void;
    onStepPrev: () => void;
    onStepNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
}) {
    if (!event) {
        return (<article className="card mb-6">
                <div className="card-body">
                    <h3 className="card-title">No event selected</h3>
                    <p className="card-subtle">Pick a date on the calendar below.</p>
                </div>
            </article>);
    }
    const {date, time} = formatEventDateTime(event.startsAt);

    return (<article className="card mb-6">
            <div className="card-body">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="card-title">{event.title}</h3>
                        <p className="card-subtle">
                            {date} • {time}
                            {event.location ? (<> • <FaMapMarkerAlt className="inline -mt-1"
                                                                    aria-hidden/> {event.location}</>) : null}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button className="ev-skip" onClick={onStepPrev} aria-label="Previous event"
                                disabled={!hasPrev}>
                            <FaChevronLeft/>
                        </button>
                        <button className="ev-skip" onClick={onStepNext} aria-label="Next event" disabled={!hasNext}>
                            <FaChevronRight/>
                        </button>
                    </div>
                </div>

                {event.description && <p className="card-desc mt-3">{event.description}</p>}

                <div className="mt-4 flex gap-3">
                    {/*<Link href={`/calendar/${event.id}`} className="btn btn-primary">View Details</Link>*/}
                    {event.rsvpLink && (<Link href={event.rsvpLink} className="btn btn-accent" target="_blank"
                                              rel="noopener noreferrer">
                            RSVP
                        </Link>)}
                </div>

                {sameDayEvents.length > 1 && (<div className="mt-4">
                        <div className="text-sm card-subtle mb-1">Other events this day:</div>
                        <div className="flex flex-wrap gap-2">
                            {sameDayEvents.map(e => (<button
                                    key={e.id}
                                    onClick={() => onPick(e.id)}
                                    className={`btn text-sm ${e.id === event.id ? 'btn-accent' : 'btn-ghost'}`}
                                >
                                    {e.title}
                                </button>))}
                        </div>
                    </div>)}
            </div>
        </article>);
}

function MonthCalendar({
                           anchor, selectedDate, setAnchor, onSelectDate, eventsByDay,
                       }: {
    anchor: Date;
    selectedDate: Date;
    setAnchor: (d: Date) => void;
    onSelectDate: (d: Date) => void;
    eventsByDay: Map<string, EventItem[]>;
}) {
    const cells = useMemo(() => buildMonthGrid(anchor), [anchor]);
    const today = startOfDay(new Date());
    const month = anchor.getMonth();
    const monthLabel = anchor.toLocaleString(undefined, {month: 'long', year: 'numeric'});
    const goto = (delta: number) => {
        const d = new Date(anchor);
        d.setMonth(d.getMonth() + delta);
        setAnchor(monthAnchor(d));
    };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (<section className="calendar-root card">
            <div className="calendar-head">
                <button className="cal-btn" onClick={() => goto(-1)} aria-label="Previous month"><FaChevronLeft/>
                </button>
                <div className="calendar-title">{monthLabel}</div>
                <button className="cal-btn" onClick={() => goto(+1)} aria-label="Next month"><FaChevronRight/></button>
            </div>

            <div className="calendar-grid">
                {dayNames.map(d => <div key={d} className="cal-dow">{d}</div>)}

                {cells.map((d, i) => {
                    const inMonth = d.getMonth() === month;
                    const k = keyLocal(d);
                    const list = eventsByDay.get(k) ?? [];
                    const hasEvents = list.length > 0;
                    const selected = isSameDay(d, selectedDate);
                    const isToday = isSameDay(d, today);

                    const chips = list.slice(0, 2);
                    const more = list.length - chips.length;

                    return (<button
                            key={i}
                            className={['cal-cell', inMonth ? '' : 'is-out', selected ? 'is-selected' : '', isToday ? 'is-today' : '', hasEvents ? 'has-events' : '',].join(' ').trim()}
                            onClick={() => onSelectDate(d)}
                            aria-label={`${d.toDateString()}${hasEvents ? ` (${list.length} event${list.length > 1 ? 's' : ''})` : ''}`}
                        >
                            <span className="cal-num">{d.getDate()}</span>

                            {hasEvents && (<div className="cal-chips">
                                    {chips.map(ev => (<span
                                            key={ev.id}
                                            className="cal-chip"
                                            style={{
                                                /* @ts-expect-error to allow color change*/
                                                '--chip-bg': ev.color ?? 'rgb(128, 0, 0)'
                                            }}
                                            title={ev.title}
                                        >
                      {ev.oneWordTitle}
                    </span>))}
                                    {more > 0 && (<span className="cal-chip cal-chip--more" title={`${more} more`}>
                      +{more}
                    </span>)}
                                </div>)}
                        </button>);
                })}
            </div>
        </section>);
}

export default function CalendarPage() {
    const {events} = useEvents();

    const timeline = useMemo(() => [...events].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)), [events]);
    const idIndex = useMemo(() => {
        const m = new Map<string, number>();
        timeline.forEach((ev, i) => m.set(ev.id, i));
        return m;
    }, [timeline]);

    const eventsBy = useMemo(() => byDateKey(events), [events]);

    const initial = useMemo(() => nextUpcoming(events), [events]);
    const initialDate = initial ? startOfDay(new Date(initial.startsAt)) : startOfDay(new Date());

    const [anchor, setAnchor] = useState(() => monthAnchor(initialDate));
    const [selectedDate, setSelectedDate] = useState<Date>(() => initialDate);
    const [focusEventId, setFocusEventId] = useState<string | null>(initial?.id ?? (timeline[0]?.id ?? null));

    const focusEvent = focusEventId ? timeline[idIndex.get(focusEventId)!] : null;

    const sameDayEvents = useMemo(() => {
        if (!focusEvent) return [];
        const d = startOfDay(new Date(focusEvent.startsAt));
        return eventsBy.get(keyLocal(d)) ?? [];
    }, [eventsBy, focusEvent]);

    const hasPrev = focusEventId != null && (idIndex.get(focusEventId) ?? 0) > 0;
    const hasNext = focusEventId != null && (idIndex.get(focusEventId) ?? -1) < timeline.length - 1;

    const step = (delta: number) => {
        if (!focusEventId) return;
        const cur = idIndex.get(focusEventId);
        if (cur == null) return;
        const ni = Math.min(Math.max(cur + delta, 0), timeline.length - 1);
        const ev = timeline[ni];
        const d = startOfDay(new Date(ev.startsAt));
        setFocusEventId(ev.id);
        setSelectedDate(d);
        setAnchor(monthAnchor(d));
    };

    const handleSelectDate = (d: Date) => {
        const day = startOfDay(d);
        const k = keyLocal(day);
        const list = eventsBy.get(k) ?? [];
        setSelectedDate(day);
        setAnchor(monthAnchor(day));
        if (list.length > 0) {
            setFocusEventId(list[0].id);
        }
    };

    return (<main className="page-shell">
            <h2 className="h2-title">Calendar</h2>

            <EventInspector
                event={focusEvent ?? initial ?? null}
                sameDayEvents={sameDayEvents}
                onPick={setFocusEventId}
                onStepPrev={() => step(-1)}
                onStepNext={() => step(+1)}
                hasPrev={hasPrev}
                hasNext={hasNext}
            />

            <MonthCalendar
                anchor={anchor}
                selectedDate={selectedDate}
                setAnchor={setAnchor}
                onSelectDate={handleSelectDate}
                eventsByDay={eventsBy}
            />
        </main>);
}
