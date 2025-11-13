import React from 'react';
import { Team, PlayerStat, Match, RosterMember } from '../types';
import TeamDetailLayout from './TeamDetailLayout';

// --- Data specific to CD Benavente ---

const roster: RosterMember[] = [
    { dorsal: '1', position: 'Jugador', name: 'Pablo Rodríguez Vega', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '3', position: 'Jugador', name: 'Mouad Zawati Yaddouch', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '5', position: 'Jugador', name: 'Luka Hidalgo Huerga', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '6', position: 'Jugador', name: 'Cayetana Caso Hueso', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '7', position: 'Jugador', name: 'Iker Herrero Pérez', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '8', position: 'Jugador', name: 'Lucas Pastor Redondo', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '9', position: 'Jugador', name: 'Antonio Alonso Aguado', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '10', position: 'Jugador', name: 'Alex Prieto López', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '11', position: 'Jugador', name: 'Jorge Ramos Vecino', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '12', position: 'Jugador', name: 'Pablo Arias Morillo', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '14', position: 'Jugador', name: 'Omar El Abderrahmani Atiti', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '15', position: 'Jugador', name: 'Sulayman Harchi Bouzayne', age: 8, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Entrenador', name: 'Roberto Benítez Martínez', age: 24, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Auxiliar', name: 'Domingo Corral González', age: 76, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Auxiliar', name: 'Ivanov Popop', age: 59, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
];

const uniforms: string[] = [
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
];

const unionistas: Team = { id: 6, name: 'Unionistas, CF', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/unionistas-de-salamanca-cf.png?size=40x&lossy=1' };
const benavente: Team = { id: 9, name: 'CD Benavente', logo_url: 'https://pbs.twimg.com/profile_images/1699039322253328384/Ue_J387h_400x400.jpg' };
const puenteCastro: Team = { id: 10, name: 'Puente Castro, FC', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/puente-castro.png?size=40x&lossy=1' };
const vianaDeCega: Team = { id: 11, name: 'CD Viana de Cega', logo_url: 'https://www.cdvianadecega.es/wp-content/uploads/2021/08/Escudo-CD-Viana-de-Cega_Mesa-de-trabajo-1.png' };
const edLinko: Team = { id: 12, name: 'ED Linko', logo_url: 'https://pbs.twimg.com/profile_images/1709497745778233344/W344zFqJ_400x400.jpg' };

const lastMatch: Match = {
    id: 1, homeTeam: unionistas, awayTeam: benavente, homeScore: 5, awayScore: 0,
    date: 'SÁBADO, 17 DE MAYO DE 2025', location: 'CM ARROYO MOLINO'
};

const topScorers: PlayerStat[] = [
    { id: 1, name: 'Pablo Rodríguez Vega', goals: 0, penalties: 0, average: 0, team: benavente },
    { id: 2, name: 'Mouad Zawati Yaddouch', goals: 0, penalties: 0, average: 0, team: benavente },
    { id: 3, name: 'Luka Hidalgo Huerga', goals: 0, penalties: 0, average: 0, team: benavente },
    { id: 4, name: 'Cayetana Caso Hueso', goals: 0, penalties: 0, average: 0, team: benavente },
    { id: 5, name: 'Iker Herrero Pérez', goals: 0, penalties: 0, average: 0, team: benavente },
];

const recentResults: Match[] = [
    { id: 401, homeTeam: unionistas, awayTeam: benavente, homeScore: 5, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor'},
    { id: 402, homeTeam: benavente, awayTeam: puenteCastro, homeScore: 1, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega'},
    { id: 403, homeTeam: vianaDeCega, awayTeam: benavente, homeScore: 2, awayScore: 7, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega'},
    { id: 404, homeTeam: benavente, awayTeam: edLinko, homeScore: 0, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
];

const calendar: (Match & { round: string })[] = [
    { id: 501, homeTeam: unionistas, awayTeam: benavente, homeScore: 5, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor', round: 'FASE DE GRUPOS - GRUPO C - JORNADA 1' },
    { id: 502, homeTeam: benavente, awayTeam: puenteCastro, homeScore: 1, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega', round: 'FASE DE GRUPOS - GRUPO C - JORNADA 2' },
    { id: 503, homeTeam: vianaDeCega, awayTeam: benavente, homeScore: 2, awayScore: 7, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega', round: 'FASE DE GRUPOS - GRUPO C - JORNADA 3' },
    { id: 504, homeTeam: benavente, awayTeam: edLinko, homeScore: 0, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE PLATA - 1/8 DE FINAL' },
];

interface TeamDetailBenaventeProps {
    team: Team;
    onBack: () => void;
}

const TeamDetailBenavente: React.FC<TeamDetailBenaventeProps> = ({ team, onBack }) => {
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

export default TeamDetailBenavente;