import React from 'react';
import { Team, PlayerStat, Match, RosterMember } from '../types';
import TeamDetailLayout from './TeamDetailLayout';

// --- Data specific to CD Atlético Pinilla ---

const roster: RosterMember[] = [
    { dorsal: '1', position: 'Jugador', name: 'Guzmán Pérez Devesa', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '2', position: 'Jugador', name: 'Lucas López Castaño', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '4', position: 'Jugador', name: 'Manuel Reyero Martínez', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '6', position: 'Jugador', name: 'Asier Sánchez Blanco', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '7', position: 'Jugador', name: 'Imran Oumeziane Ouzaid', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '8', position: 'Jugador', name: 'Lucas Ferreiro Herrero', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '9', position: 'Jugador', name: 'Iker Romero Iban', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '10', position: 'Jugador', name: 'Pablo Novoa Vallejo', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '11', position: 'Jugador', name: 'Imran Cherib Abati', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '14', position: 'Jugador', name: 'Enzo Romero Iban', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Entrenador', name: 'Rubén Álvarez Albalá', age: 22, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Auxiliar', name: 'Daniel Calvo Castaño', age: 22, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
];

const uniforms: string[] = [
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
];

const arandaRiber: Team = { id: 1, name: 'CD Aranda Riber', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/arandina-2021.png?size=40x&lossy=1' };
const atleticoPinilla: Team = { id: 2, name: 'CD Atlético Pinilla', logo_url: 'https://pbs.twimg.com/profile_images/1169308695029415936/kSUEtG3F_400x400.jpg' };
const cddbDueñas: Team = { id: 3, name: 'CDDB Dueñas', logo_url: 'https://pbs.twimg.com/profile_images/1701550920400588800/2Lgdm32c_400x400.jpg' };
const laCisterniga: Team = { id: 4, name: 'CD La Cistérniga', logo_url: 'https://www.cdlacisterniga.es/wp-content/uploads/2023/11/cropped-cropped-cropped-escudo-nuevo-2-2.png' };
const laVirgenDelCamino: Team = { id: 8, name: 'CD La Virgen del Camino', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/virgen-del-camino.png?size=40x&lossy=1' };

const lastMatch: Match = {
    id: 1, homeTeam: arandaRiber, awayTeam: atleticoPinilla, homeScore: 3, awayScore: 0,
    date: 'SÁBADO, 17 DE MAYO DE 2025', location: 'CM ARROYO MOLINO'
};

const topScorers: PlayerStat[] = [
    { id: 1, name: 'Guzmán Pérez Devesa', goals: 0, penalties: 0, average: 0, team: atleticoPinilla },
    { id: 2, name: 'Lucas López Castaño', goals: 0, penalties: 0, average: 0, team: atleticoPinilla },
    { id: 3, name: 'Manuel Reyero Martínez', goals: 0, penalties: 0, average: 0, team: atleticoPinilla },
    { id: 4, name: 'Asier Sánchez Blanco', goals: 0, penalties: 0, average: 0, team: atleticoPinilla },
    { id: 5, name: 'Imran Oumeziane Ouzaid', goals: 0, penalties: 0, average: 0, team: atleticoPinilla },
];

const recentResults: Match[] = [
    { id: 101, homeTeam: arandaRiber, awayTeam: atleticoPinilla, homeScore: 3, awayScore: 0, date: '17/05/2025', location: 'CM Arroyo Molino - Ayto Viana de Cega'},
    { id: 102, homeTeam: atleticoPinilla, awayTeam: laCisterniga, homeScore: 1, awayScore: 0, date: '17/05/2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
    { id: 103, homeTeam: cddbDueñas, awayTeam: atleticoPinilla, homeScore: 2, awayScore: 0, date: '17/05/2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
    { id: 104, homeTeam: atleticoPinilla, awayTeam: laVirgenDelCamino, homeScore: 2, awayScore: 3, date: '17/05/2025', location: 'CM Arroyo Molino - Ayto Viana de Cega'},
];

const calendar: (Match & { round: string })[] = [
    { id: 301, homeTeam: arandaRiber, awayTeam: atleticoPinilla, homeScore: 3, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega', round: 'FASE DE GRUPOS - GRUPO B - JORNADA 1' },
    { id: 302, homeTeam: atleticoPinilla, awayTeam: laCisterniga, homeScore: 1, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE DE GRUPOS - GRUPO B - JORNADA 2' },
    { id: 303, homeTeam: cddbDueñas, awayTeam: atleticoPinilla, homeScore: 2, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE DE GRUPOS - GRUPO B - JORNADA 3' },
    { id: 304, homeTeam: atleticoPinilla, awayTeam: laVirgenDelCamino, homeScore: 2, awayScore: 3, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega', round: 'FASE PLATA - 1/8 DE FINAL' },
];

interface TeamDetailAtleticoPinillaProps {
    team: Team;
    onBack: () => void;
}

const TeamDetailAtleticoPinilla: React.FC<TeamDetailAtleticoPinillaProps> = ({ team, onBack }) => {
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

export default TeamDetailAtleticoPinilla;