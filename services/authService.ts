import { User } from '../types';
import { supabase } from './supabaseClient';

// This service now interacts with Supabase Auth
export const authService = {
    login: async (email: string, pass: string): Promise<{ user: User | null, error: string | null }> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });

        if (error || !data.user) {
            console.error('Login error:', error?.message);
            // Provide a more user-friendly error for invalid credentials
            if (error?.message === 'Invalid login credentials') {
                 return { user: null, error: 'El correo electrónico o la contraseña son incorrectos. Por favor, inténtalo de nuevo.' };
            }
            return { user: null, error: error?.message || 'Credenciales inválidas.' };
        }

        // FIX: Explicitly type `user` as `User` to match the return type and resolve role type incompatibility.
        const user: User = {
            id: data.user.id,
            email: data.user.email!,
            role: data.user.email === 'mariscalimagen@gmail.com' ? 'admin' : 'user',
        };
        return { user, error: null };
    },

    register: async (email: string, pass: string): Promise<{ user: User | null, error: string | null }> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
        });

        if (error || !data.user) {
            console.error('Registration error:', error?.message);
            return { user: null, error: error?.message || 'El usuario ya existe o ha fallado el registro.' };
        }
        
        // FIX: Explicitly type `user` as `User` to match the return type and resolve role type incompatibility.
        const user: User = {
            id: data.user.id,
            email: data.user.email!,
            role: data.user.email === 'mariscalimagen@gmail.com' ? 'admin' : 'user',
        };
        return { user, error: null };
    },

    logout: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
        }
    },

    getCurrentUser: async (): Promise<User | null> => {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
            return null;
        }

        const { user } = session;
        // FIX: Explicitly type the returned user object as `User` to resolve role type incompatibility.
        const appUser: User = {
            id: user.id,
            email: user.email!,
            role: user.email === 'mariscalimagen@gmail.com' ? 'admin' : 'user',
        };
        return appUser;
    },
};