import React from 'react';
import { Team, PlayerStat, Match, RosterMember } from '../types';
import TeamDetailLayout from './TeamDetailLayout';

// --- Data specific to CD Boecillo ---

const roster: RosterMember[] = [
    { dorsal: '1', position: 'Jugador', name: 'Santiago Arancón Sánchez', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '2', position: 'Jugador', name: 'Diego Lozano Arranz', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '3', position: 'Jugador', name: 'Alejandro Gallardo Escudero', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '4', position: 'Jugador', name: 'Leo Gutiérrez Sanz', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '5', position: 'Jugador', name: 'Alejandro Herrero Alcalde', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '6', position: 'Jugador', name: 'Izan Alfageme Conde', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '7', position: 'Jugador', name: 'Jorge Sancho Pascual', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '8', position: 'Jugador', name: 'Guillermo Baptista Nistal', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '9', position: 'Jugador', name: 'Pablo Pérez del Valle', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '10', position: 'Jugador', name: 'Martín Escorial Gómez', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '11', position: 'Jugador', name: 'Álvaro Asensio Nieto', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '12', position: 'Jugador', name: 'Mateo Martín González', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '14', position: 'Jugador', name: 'Adrián Acosta del Canto', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Entrenador', name: 'Sergio Gómez Martín', age: 37, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Auxiliar', name: 'David Gómez Martín', age: 34, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Auxiliar', name: 'David Martínez Adame', age: 0, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
];

const uniforms: string[] = [
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
];

const boecillo: Team = { id: 13, name: 'CD Boecillo', logo_url: 'https://pbs.twimg.com/profile_images/1179426993132785664/BNa8oxd__400x400.jpg' };
const sanLorenzo: Team = { id: 14, name: 'CD San Lorenzo', logo_url: 'https://pbs.twimg.com/profile_images/1541785237257322497/j5D7x-n9_400x400.jpg' };
const cdcDiocesanos: Team = { id: 15, name: 'CDC Diocesanos', logo_url: 'https://pbs.twimg.com/profile_images/1691033989396279297/w_O888We_400x400.jpg' };
const udPinillaDuero: Team = { id: 16, name: 'UD Pinilla de Duero', logo_url: 'https://ui-avatars.com/api/?name=UPD&background=10b981&color=fff&size=128' };
const laCisterniga: Team = { id: 4, name: 'CD La Cistérniga', logo_url: 'https://www.cdlacisterniga.es/wp-content/uploads/2023/11/cropped-cropped-cropped-escudo-nuevo-2-2.png' };

const lastMatch: Match = {
    id: 1, homeTeam: sanLorenzo, awayTeam: boecillo, homeScore: 5, awayScore: 3,
    date: 'SÁBADO, 17 DE MAYO DE 2025', location: 'CM ARROYO MOLINO'
};

const topScorers: PlayerStat[] = [
    { id: 1, name: 'Santiago Arancón Sánchez', goals: 0, penalties: 0, average: 0, team: boecillo },
    { id: 2, name: 'Diego Lozano Arranz', goals: 0, penalties: 0, average: 0, team: boecillo },
    { id: 3, name: 'Alejandro Gallardo Escudero', goals: 0, penalties: 0, average: 0, team: boecillo },
    { id: 4, name: 'Leo Gutiérrez Sanz', goals: 0, penalties: 0, average: 0, team: boecillo },
    { id: 5, name: 'Alejandro Herrero Alcalde', goals: 0, penalties: 0, average: 0, team: boecillo },
];

const recentResults: Match[] = [
    { id: 601, homeTeam: sanLorenzo, awayTeam: boecillo, homeScore: 5, awayScore: 3, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
    { id: 602, homeTeam: boecillo, awayTeam: cdcDiocesanos, homeScore: 0, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor'},
    { id: 603, homeTeam: udPinillaDuero, awayTeam: boecillo, homeScore: 0, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega'},
    { id: 604, homeTeam: laCisterniga, awayTeam: boecillo, homeScore: 2, awayScore: 3, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega'},
];

const calendar: (Match & { round: string })[] = [
    { id: 701, homeTeam: sanLorenzo, awayTeam: boecillo, homeScore: 5, awayScore: 3, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE DE GRUPOS - GRUPO F - JORNADA 1' },
    { id: 702, homeTeam: boecillo, awayTeam: cdcDiocesanos, homeScore: 0, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor', round: 'FASE DE GRUPOS - GRUPO F - JORNADA 2' },
    { id: 703, homeTeam: udPinillaDuero, awayTeam: boecillo, homeScore: 0, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega', round: 'FASE DE GRUPOS - GRUPO F - JORNADA 3' },
    { id: 704, homeTeam: laCisterniga, awayTeam: boecillo, homeScore: 2, awayScore: 3, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega', round: 'FASE PLATA - 1/8 DE FINAL' },
];

interface TeamDetailBoecilloProps {
    team: Team;
    onBack: () => void;
}

const TeamDetailBoecillo: React.FC<TeamDetailBoecilloProps> = ({ team, onBack }) => {
    return (
        <TeamDetailLayout
            team={team}
            onBack={onBack}
            lastMatch={lastMatch}
            uniforms={uniforms}
            topScorers={topScorers}
            recentResults={recentResults}
            roster={roster}
            calendar={calendar}
        />
    );
};

export default TeamDetailBoecillo;