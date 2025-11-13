import { CalendarEvent } from '../types';
import { supabase } from './supabaseClient';

export const eventService = {
    getEvents: async (): Promise<CalendarEvent[]> => {
        const { data, error } = await supabase.from('events').select('*');
        if (error) {
            console.error("Error fetching events:", error.message);
            throw error;
        }
        return data as CalendarEvent[];
    },

    addEvent: async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
        const { data, error } = await supabase.from('events').insert([eventData]).select().single();
        if (error) {
            console.error("Error adding event:", error.message);
            throw error;
        }
        return data as CalendarEvent;
    },

    updateEvent: async (updatedEvent: CalendarEvent): Promise<CalendarEvent | null> => {
        const { id, ...eventData } = updatedEvent;
        const { data, error } = await supabase.from('events').update(eventData).eq('id', id).select().single();
        if (error) {
            console.error("Error updating event:", error.message);
            throw error;
        }
        return data as CalendarEvent;
    },

    deleteEvent: async (eventId: number): Promise<boolean> => {
        const { error } = await supabase.from('events').delete().eq('id', eventId);
        if (error) {
            console.error("Error deleting event:", error.message);
            throw error;
        }
        return true;
    },
};