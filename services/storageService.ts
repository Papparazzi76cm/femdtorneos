
import { supabase } from './supabaseClient';
import { FileObject } from '@supabase/storage-js';

export const storageService = {
    listFiles: async (bucketName: string): Promise<FileObject[]> => {
        const { data, error } = await supabase.storage.from(bucketName).list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        });
        if (error) {
            console.error(`Error listing files from ${bucketName}:`, error.message);
            throw error;
        }
        return data || [];
    },

    uploadFile: async (bucketName: string, file: File): Promise<string> => {
        // Sanitize and create a unique file path to avoid overwriting and errors
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '');
        const filePath = `${Date.now()}-${sanitizedName}`;

        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);

        if (error) {
            console.error(`Error uploading file to ${bucketName}:`, error.message);
            throw error;
        }
        
        return filePath;
    },

    deleteFile: async (bucketName: string, filePath: string): Promise<void> => {
        const { error } = await supabase.storage.from(bucketName).remove([filePath]);
        if (error) {
            console.error(`Error deleting file from ${bucketName}:`, error.message);
            throw error;
        }
    },

    getPublicUrl: (bucketName: string, filePath: string): string => {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        return data.publicUrl;
    }
};
