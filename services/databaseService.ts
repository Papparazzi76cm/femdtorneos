import { AppDatabase, CalendarEvent, Participant, Team } from '../types';

const DB_KEY = 'femd_torneos_db';

const getSeedData = (): AppDatabase => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const teams: Team[] = [
        // FIX: Changed id to number and logoUrl to logo_url to match Team interface.
        { id: 1, name: 'Cantera de Héroes FC', logo_url: 'https://via.placeholder.com/40/047857/FFFFFF?text=CH' },
        { id: 2, name: 'Real Sociedad Juvenil', logo_url: 'https://via.placeholder.com/40/1d4ed8/FFFFFF?text=RS' },
        { id: 3, name: 'Atlético de Madrid Cadete', logo_url: 'https://via.placeholder.com/40/b91c1c/FFFFFF?text=AM' },
        { id: 4, name: 'Valencia CF Promesas', logo_url: 'https://via.placeholder.com/40/c2410c/FFFFFF?text=VP' },
    ];

    const participants: Participant[] = [
        // FIX: Changed id and teamId to number and teamId to team_id to match Participant interface.
        { id: 101, name: 'Hugo Pérez', team_id: 1 },
        { id: 102, name: 'Lucas González', team_id: 1 },
        { id: 201, name: 'Martín Sánchez', team_id: 2 },
        { id: 202, name: 'Daniel Romero', team_id: 2 },
        { id: 301, name: 'Leo Fernández', team_id: 3 },
        { id: 401, name: 'Enzo Díaz', team_id: 4 },
    ];

    const events: CalendarEvent[] = [
         {
            // FIX: Changed id to number and teamIds to team_ids with number values to match CalendarEvent interface.
            id: 1,
            title: 'Torneo de Verano Sub-12',
            start: new Date(currentYear, currentMonth, 5, 9, 0, 0).toISOString(),
            end: new Date(currentYear, currentMonth, 6, 18, 0, 0).toISOString(),
            description: 'El primer gran torneo de la temporada de verano para equipos sub-12. Una gran oportunidad para competir contra los mejores talentos locales.',
            type: 'Tournament',
            team_ids: [1, 2]
        },
        {
            // FIX: Changed id to number and teamIds to team_ids with number values to match CalendarEvent interface.
            id: 2,
            title: 'Jornada de Ojeadores Profesionales',
            start: new Date(currentYear, currentMonth, 15, 10, 0, 0).toISOString(),
            end: new Date(currentYear, currentMonth, 15, 16, 0, 0).toISOString(),
            description: 'Un evento exclusivo para jugadores de 16 a 18 años para mostrar sus habilidades frente a ojeadores profesionales de las principales ligas.',
            type: 'Scouting Event',
            team_ids: [3, 4]
        },
        {
            // FIX: Changed id to number and teamIds to team_ids to match CalendarEvent interface.
            id: 3,
            title: 'Campus de Élite para Porteros',
            start: new Date(currentYear, currentMonth, 22, 9, 0, 0).toISOString(),
            end: new Date(currentYear, currentMonth, 24, 15, 0, 0).toISOString(),
            description: 'Un campamento intensivo de 3 días centrado en técnicas avanzadas de portero, dirigido por ex-porteros profesionales.',
            type: 'Training Camp',
            team_ids: []
        },
    ];

    return { events, teams, participants };
}


export const databaseService = {
    getDB: (): AppDatabase => {
        const dbString = localStorage.getItem(DB_KEY);
        if (dbString) {
            return JSON.parse(dbString);
        }
        const seedData = getSeedData();
        localStorage.setItem(DB_KEY, JSON.stringify(seedData));
        return seedData;
    },
    saveDB: (db: AppDatabase): void => {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
};