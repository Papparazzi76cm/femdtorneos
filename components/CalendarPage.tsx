
import React, { useState, useEffect, useMemo } from 'react';
import { CalendarEvent } from '../types';
import { eventService } from '../services/eventService';
import EventModal from './EventModal';

const CalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [filterType, setFilterType] = useState<string>('All');

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsData = await eventService.getEvents();
            setEvents(eventsData);
        }
        fetchEvents();
    }, []);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const filteredEvents = useMemo(() => {
        if (filterType === 'All') return events;
        return events.filter(event => event.type === filterType);
    }, [events, filterType]);

    const renderDays = () => {
        const days = [];
        // Add empty cells for days before the start of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200 dark:border-gray-800"></div>);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = date.toDateString() === new Date().toDateString();
            
            const dayEvents = filteredEvents.filter(event => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                eventStart.setHours(0,0,0,0);
                eventEnd.setHours(0,0,0,0);
                date.setHours(0,0,0,0);
                return date >= eventStart && date <= eventEnd;
            }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

            days.push(
                <div key={day} className="border-r border-b border-gray-200 dark:border-gray-800 p-2 min-h-[120px] flex flex-col">
                    <span className={`font-bold ${isToday ? 'bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center' : ''}`}>{day}</span>
                    <div className="mt-1 space-y-1 overflow-y-auto">
                        {dayEvents.map(event => (
                            <div 
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className="bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs p-1 rounded-md cursor-pointer truncate"
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };
    
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => changeMonth(-1)} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg">&lt;</button>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white w-48 text-center">{currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
                        <button onClick={() => changeMonth(1)} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg">&gt;</button>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="All">Todos los Tipos</option>
                            <option value="Tournament">Torneo</option>
                            <option value="Friendly">Amistoso</option>
                            <option value="Training Camp">Campus de Entrenamiento</option>
                            <option value="Scouting Event">Evento de Ojeadores</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-800">
                    {weekDays.map(day => (
                        <div key={day} className="text-center font-bold text-gray-600 dark:text-gray-300 p-2 border-r border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">{day}</div>
                    ))}
                    {renderDays()}
                </div>
            </div>
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </div>
    );
};

export default CalendarPage;