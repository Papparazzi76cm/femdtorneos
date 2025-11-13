import { Team } from '../types';
import { supabase } from './supabaseClient';
import { participantService } from './participantService';

export const teamService = {
    getTeams: async (): Promise<Team[]> => {
        const { data, error } = await supabase.from('teams').select('*').order('name', { ascending: true });
        if (error) {
            console.error("Error fetching teams:", error.message);
            throw error;
        }
        return (data || []) as Team[];
    },
    
    getTeamById: async (id: number): Promise<Team | undefined> => {
        const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();
         if (error) {
            console.error("Error fetching team by id:", error.message);
            if (error.code === 'PGRST116') {
                return undefined;
            }
            throw error;
        }
        return data ? (data as Team) : undefined;
    },

    addTeam: async (teamData: Omit<Team, 'id'>): Promise<Team | null> => {
        const { data, error } = await supabase.from('teams').insert([teamData]).select().single();
        if (error) {
            console.error("Error adding team:", error.message);
            throw error;
        }
        return data as Team;
    },

    updateTeam: async (updatedTeam: Team): Promise<Team | null> => {
        const { id, ...teamData } = updatedTeam;
        const { data, error } = await supabase.from('teams').update(teamData).eq('id', id).select().single();
        if (error) {
            console.error("Error updating team:", error.message);
            throw error;
        }
        return data as Team;
    },

    deleteTeam: async (teamId: number): Promise<boolean> => {
        // First, delete related participants to maintain data integrity.
        await participantService.deleteParticipantsByTeam(teamId);

        const { error } = await supabase.from('teams').delete().eq('id', teamId);
        if (error) {
            console.error("Error deleting team:", error.message);
            throw error;
        }
        return true;
    },
};