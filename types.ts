export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
}

export interface Player {
    id: number;
    name: string;
}

export interface BlogPost {
    id: number;
    title: string;
    description: string;
    image_url: string;
    author: string;
    date: string;
    content: string; // Added full content for the blog post page
}

export interface Participant {
    id: number;
    name: string;
    team_id: number;
}

export interface Team {
    id: number;
    name: string;
    logo_url: string;
    localidad?: string;
    provincia?: string;
    fecha_alta?: string;
    telefono?: string;
    correo?: string;
    uniforme?: string;
}

export interface Sponsor {
    id: number;
    name: string;
    logo_url: string;
    website_url?: string;
    category?: string;
}

export interface CalendarEvent {
    id: number;
    title: string;
    start: string; // ISO String format
    end: string;   // ISO String format
    description: string;
    type: 'Tournament' | 'Friendly' | 'Training Camp' | 'Scouting Event';
    team_ids: number[]; // IDs of participating teams
}

// FIX: Add AppDatabase interface to resolve import error.
export interface AppDatabase {
    events: CalendarEvent[];
    teams: Team[];
    participants: Participant[];
}

export type View = 'home' | 'admin' | 'calendar' | 'blog' | 'tournaments' | 'teams' | 'teamDetail' | 'sponsors' | 'contact' | 'blogList';

export type TournamentTab = 'clasificacion' | 'resultados' | 'goleadores' | 'equipos' | 'sancionados';

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

export interface PlayerStat {
    id: number;
    name: string;
    goals: number;
    penalties: number;
    average: number;
    team: Team;
}

export interface Match {
    id: number;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: number;
    awayScore: number;
    date: string;
    location: string;
}

export interface TeamStanding {
    position: number;
    team: Team;
    points: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
}

export interface Sanction {
    player: Player;
    team: Team;
    reason: 'Roja Directa' | 'Acumulación Amarillas' | 'Doble Amarilla';
    games: number | string;
}

export interface RosterMember {
    dorsal: string;
    position: string;
    name: string;
    age: number;
    matches: string;
    goals: string;
    yellowCards: number;
    redCards: number;
}