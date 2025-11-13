import { BlogPost } from '../types';
import { supabase } from './supabaseClient';

export const postService = {
    getPosts: async (): Promise<BlogPost[]> => {
        const { data, error } = await supabase.from('posts').select('*').order('id', { ascending: false });
        if (error) {
            console.error("Error fetching posts:", error.message);
            throw error;
        }
        return data as BlogPost[];
    },

    addPost: async (postData: Omit<BlogPost, 'id'>): Promise<BlogPost | null> => {
        const { data, error } = await supabase.from('posts').insert([postData]).select().single();
        if (error) {
            console.error("Error adding post:", error.message);
            throw error;
        }
        return data as BlogPost;
    },

    updatePost: async (updatedPost: BlogPost): Promise<BlogPost | null> => {
        const { id, ...postData } = updatedPost;
        const { data, error } = await supabase.from('posts').update(postData).eq('id', id).select().single();
        if (error) {
            console.error("Error updating post:", error.message);
            throw error;
        }
        return data as BlogPost;
    },

    deletePost: async (postId: number): Promise<boolean> => {
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) {
            console.error("Error deleting post:", error.message);
            throw error;
        }
        return true;
    },
};