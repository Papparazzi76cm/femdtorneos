import React from 'react';
import { Team, PlayerStat, Match, RosterMember } from '../types';
import TeamDetailLayout from './TeamDetailLayout';

// --- Data specific to CD Aranda Riber ---

const roster: RosterMember[] = [
    { dorsal: '2', position: 'Jugador', name: 'Luca Benito Gallo', age: 8, matches: '0', goals: '0', yellowCards: 1, redCards: 1 },
    { dorsal: '3', position: 'Jugador', name: 'Izan Redondo Valderrama', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '4', position: 'Jugador', name: 'Martín Alcalde García', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '5', position: 'Jugador', name: 'Jorge Tudanca Martín', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '6', position: 'Jugador', name: 'Daniel Monterrubio Mayor', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '7', position: 'Jugador', name: 'Yoel Berzal Rodríguez', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '8', position: 'Jugador', name: 'Julián Álvarez Rueda', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '9', position: 'Jugador', name: 'Vadim Cononov Perciun', age: 8, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '10', position: 'Jugador', name: 'Denis Ovejero Portela', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '11', position: 'Jugador', name: 'Julen Fernández Serna', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '13', position: 'Jugador', name: 'Francisco Barona Rodero', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '14', position: 'Jugador', name: 'Rodrigo Zayas Orcajo', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Entrenador', name: 'Eduardo Berzal Mata', age: 41, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Auxiliar', name: 'Óscar Berzal Mata', age: 37, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
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
const cuatrovientos: Team = { id: 5, name: 'CD Cuatrovientos', logo_url: 'https://pbs.twimg.com/profile_images/1699742232506699776/vWznsk_G_400x400.jpg' };
const unionistas: Team = { id: 6, name: 'Unionistas, CF', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/unionistas-de-salamanca-cf.png?size=40x&lossy=1' };
const interVistaAlegre: Team = { id: 7, name: 'CD Inter Vista Alegre', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/inter-vista-alegre.png?size=40x&lossy=1' };

const lastMatch: Match = {
    id: 1, homeTeam: arandaRiber, awayTeam: atleticoPinilla, homeScore: 3, awayScore: 0,
    date: 'SÁBADO, 17 DE MAYO DE 2025', location: 'CM ARROYO MOLINO'
};

const topScorers: PlayerStat[] = [
    { id: 1, name: 'Luca Benito Gallo', goals: 0, penalties: 0, average: 0, team: arandaRiber },
    { id: 2, name: 'Izan Redondo Valderrama', goals: 0, penalties: 0, average: 0, team: arandaRiber },
    { id: 3, name: 'Martín Alcalde García', goals: 0, penalties: 0, average: 0, team: arandaRiber },
    { id: 4, name: 'Jorge Tudanca Martín', goals: 0, penalties: 0, average: 0, team: arandaRiber },
    { id: 5, name: 'Daniel Monterrubio Mayor', goals: 0, penalties: 0, average: 0, team: arandaRiber },
];

const recentResults: Match[] = [
    { id: 101, homeTeam: arandaRiber, awayTeam: atleticoPinilla, homeScore: 3, awayScore: 0, date: '17/05/2025', location: 'CM Arroyo Molino - Ayto Viana de Cega'},
    { id: 102, homeTeam: arandaRiber, awayTeam: cddbDueñas, homeScore: 3, awayScore: 1, date: '17/05/2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
    { id: 103, homeTeam: laCisterniga, awayTeam: arandaRiber, homeScore: 1, awayScore: 3, date: '17/05/2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
    { id: 104, homeTeam: arandaRiber, awayTeam: cuatrovientos, homeScore: 4, awayScore: 2, date: '17/05/2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
    { id: 105, homeTeam: unionistas, awayTeam: arandaRiber, homeScore: 2, awayScore: 4, date: '17/05/2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
];

const calendar: (Match & { round: string })[] = [
    { id: 201, homeTeam: arandaRiber, awayTeam: atleticoPinilla, homeScore: 3, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega', round: 'FASE DE GRUPOS - GRUPO B - JORNADA 1' },
    { id: 202, homeTeam: arandaRiber, awayTeam: cddbDueñas, homeScore: 3, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE DE GRUPOS - GRUPO B - JORNADA 2' },
    { id: 203, homeTeam: laCisterniga, awayTeam: arandaRiber, homeScore: 1, awayScore: 3, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE DE GRUPOS - GRUPO B - JORNADA 3' },
    { id: 204, homeTeam: arandaRiber, awayTeam: cuatrovientos, homeScore: 4, awayScore: 2, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE ORO - 1/4 DE FINAL' },
    { id: 205, homeTeam: unionistas, awayTeam: arandaRiber, homeScore: 2, awayScore: 4, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE ORO - SEMIFINAL' },
    { id: 206, homeTeam: interVistaAlegre, awayTeam: arandaRiber, homeScore: 2, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor', round: 'FASE ORO - FINAL' },
];

interface TeamDetailArandaRiberProps {
    team: Team;
    onBack: () => void;
}

const TeamDetailArandaRiber: React.FC<TeamDetailArandaRiberProps> = ({ team, onBack }) => {
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

export default TeamDetailArandaRiber;