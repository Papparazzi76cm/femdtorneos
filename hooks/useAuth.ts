
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<{ user: User | null; error: string | null; }>;
    register: (email: string, pass: string) => Promise<{ user: User | null; error: string | null; }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for an active session on initial load
        const checkSession = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        };
        checkSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    role: session.user.email === 'mariscalimagen@gmail.com' ? 'admin' : 'user',
                });
            } else {
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, pass: string) => {
        // State will be updated by onAuthStateChange listener
        return await authService.login(email, pass);
    };

    const register = async (email: string, pass: string) => {
        // State will be updated by onAuthStateChange listener
        return await authService.register(email, pass);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null); // Explicitly set user to null on logout
    };

    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    // The original JSX was causing parsing errors because this file does not have a .tsx extension.
    return React.createElement(AuthContext.Provider, {
        value: { user, login, register, logout }
    }, children);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
