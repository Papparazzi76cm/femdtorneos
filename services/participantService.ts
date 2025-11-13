import { Participant } from '../types';
import { supabase } from './supabaseClient';

export const participantService = {
    getParticipants: async (): Promise<Participant[]> => {
        const { data, error } = await supabase.from('participants').select('*').order('name');
        if (error) {
            console.error("Error fetching participants:", error.message);
            throw error;
        }
        return data as Participant[];
    },

    addParticipant: async (participantData: Omit<Participant, 'id'>): Promise<Participant | null> => {
        const { data, error } = await supabase.from('participants').insert([participantData]).select().single();
        if (error) {
            console.error("Error adding participant:", error.message);
            throw error;
        }
        return data as Participant;
    },

    updateParticipant: async (updatedParticipant: Participant): Promise<Participant | null> => {
        const { id, ...participantData } = updatedParticipant;
        const { data, error } = await supabase.from('participants').update(participantData).eq('id', id).select().single();
        if (error) {
            console.error("Error updating participant:", error.message);
            throw error;
        }
        return data as Participant;
    },

    deleteParticipant: async (participantId: number): Promise<boolean> => {
         const { error } = await supabase.from('participants').delete().eq('id', participantId);
         if (error) {
            console.error("Error deleting participant:", error.message);
            throw error;
        }
        return true;
    },

    deleteParticipantsByTeam: async (teamId: number): Promise<boolean> => {
        const { error } = await supabase.from('participants').delete().eq('team_id', teamId);
        if (error) {
            console.error("Error deleting participants by team:", error.message);
            throw error;
        }
        return true;
    }
};