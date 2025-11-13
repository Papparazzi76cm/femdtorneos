import { Sponsor } from '../types';
import { supabase } from './supabaseClient';

export const sponsorService = {
    getSponsors: async (): Promise<Sponsor[]> => {
        const { data, error } = await supabase.from('sponsors').select('*').order('name', { ascending: true });
        if (error) {
            console.error("Error fetching sponsors:", error.message);
            throw error;
        }
        return (data || []) as Sponsor[];
    },
    
    addSponsor: async (sponsorData: Omit<Sponsor, 'id'>): Promise<Sponsor | null> => {
        const { data, error } = await supabase.from('sponsors').insert([sponsorData]).select().single();
        if (error) {
            console.error("Error adding sponsor:", error.message);
            throw error;
        }
        return data as Sponsor;
    },

    updateSponsor: async (updatedSponsor: Sponsor): Promise<Sponsor | null> => {
        const { id, ...sponsorData } = updatedSponsor;
        const { data, error } = await supabase.from('sponsors').update(sponsorData).eq('id', id).select().single();
        if (error) {
            console.error("Error updating sponsor:", error.message);
            throw error;
        }
        return data as Sponsor;
    },

    deleteSponsor: async (sponsorId: number): Promise<boolean> => {
        const { error } = await supabase.from('sponsors').delete().eq('id', sponsorId);
        if (error) {
            console.error("Error deleting sponsor:", error.message);
            throw error;
        }
        return true;
    },
};
