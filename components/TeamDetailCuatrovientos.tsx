import React from 'react';
import { Team, PlayerStat, Match, RosterMember } from '../types';
import TeamDetailLayout from './TeamDetailLayout';

// --- Data specific to CD Cuatrovientos ---

const roster: RosterMember[] = [
    { dorsal: '1', position: 'Jugador', name: 'Lucas Cerezales Gavela', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '2', position: 'Jugador', name: 'Álvaro Arias Gómez', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '3', position: 'Jugador', name: 'Hugo Chao Asenjo', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '4', position: 'Jugador', name: 'David Hernández Pérez', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '5', position: 'Jugador', name: 'Alejandro Álvarez Retamal', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '6', position: 'Jugador', name: 'Hugo Abella Álvarez', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '7', position: 'Jugador', name: 'Luca Díez Fernández', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '8', position: 'Jugador', name: 'Fabio Monteiro Coutinho', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '9', position: 'Jugador', name: 'Santiago Arias González', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '10', position: 'Jugador', name: 'Ander Perea Prada', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '11', position: 'Jugador', name: 'Lucca Bielevich Fernández', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '12', position: 'Jugador', name: 'Bruno Borrego Fernández', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '13', position: 'Jugador', name: 'Eric Álvarez Ximeno', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '14', position: 'Jugador', name: 'Román Fernández Alonso', age: 9, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '15', position: 'Jugador', name: 'Hugo Escribano Bueno', age: 8, matches: '0', goals: '0', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Entrenador', name: 'Estela Dejuana González', age: 37, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
    { dorsal: '-', position: 'Auxiliar', name: 'Samuel Delgado Delgado', age: 32, matches: '-', goals: '-', yellowCards: 0, redCards: 0 },
];

const uniforms: string[] = [
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
    'https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/imagenes-web/uniforme-placeholder.png',
];

const cuatrovientos: Team = { id: 5, name: 'CD Cuatrovientos', logo_url: 'https://pbs.twimg.com/profile_images/1699742232506699776/vWznsk_G_400x400.jpg' };
const unami: Team = { id: 17, name: 'Unami, CP', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/unami-cp.png?size=40x&lossy=1' };
const laAmistad2000: Team = { id: 18, name: 'CD La Amistad 2000', logo_url: 'https://ui-avatars.com/api/?name=CDLA&background=10b981&color=fff&size=128' };
const santaMarta: Team = { id: 19, name: 'UD Santa Marta', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/ud-santa-marta.png?size=40x&lossy=1' };
const cdcDiocesanos: Team = { id: 15, name: 'CDC Diocesanos', logo_url: 'https://pbs.twimg.com/profile_images/1691033989396279297/w_O888We_400x400.jpg' };
const arandaRiber: Team = { id: 1, name: 'CD Aranda Riber', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/arandina-2021.png?size=40x&lossy=1' };

const lastMatch: Match = {
    id: 1, homeTeam: cuatrovientos, awayTeam: unami, homeScore: 3, awayScore: 0,
    date: 'SÁBADO, 17 DE MAYO DE 2025', location: 'CM ARROYO MOLINO'
};

const topScorers: PlayerStat[] = [
    { id: 1, name: 'Lucas Cerezales Gavela', goals: 0, penalties: 0, average: 0, team: cuatrovientos },
    { id: 2, name: 'Álvaro Arias Gómez', goals: 0, penalties: 0, average: 0, team: cuatrovientos },
    { id: 3, name: 'Hugo Chao Asenjo', goals: 0, penalties: 0, average: 0, team: cuatrovientos },
    { id: 4, name: 'David Hernández Pérez', goals: 0, penalties: 0, average: 0, team: cuatrovientos },
    { id: 5, name: 'Alejandro Álvarez Retamal', goals: 0, penalties: 0, average: 0, team: cuatrovientos },
];

const recentResults: Match[] = [
    { id: 801, homeTeam: cuatrovientos, awayTeam: unami, homeScore: 3, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor'},
    { id: 802, homeTeam: laAmistad2000, awayTeam: cuatrovientos, homeScore: 1, awayScore: 4, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega'},
    { id: 803, homeTeam: santaMarta, awayTeam: cuatrovientos, homeScore: 3, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor'},
    { id: 804, homeTeam: cuatrovientos, awayTeam: cdcDiocesanos, homeScore: 6, awayScore: 2, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad'},
];

const calendar: (Match & { round: string })[] = [
    { id: 901, homeTeam: cuatrovientos, awayTeam: unami, homeScore: 3, awayScore: 0, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor', round: 'FASE DE GRUPOS - GRUPO E - JORNADA 1' },
    { id: 902, homeTeam: laAmistad2000, awayTeam: cuatrovientos, homeScore: 1, awayScore: 4, date: '17.05.2025', location: 'CM Arroyo Molino - Ayto Viana de Cega', round: 'FASE DE GRUPOS - GRUPO E - JORNADA 2' },
    { id: 903, homeTeam: santaMarta, awayTeam: cuatrovientos, homeScore: 3, awayScore: 1, date: '17.05.2025', location: 'CM Arroyo Molino - Campo Cega Motor', round: 'FASE DE GRUPOS - GRUPO E - JORNADA 3' },
    { id: 904, homeTeam: cuatrovientos, awayTeam: cdcDiocesanos, homeScore: 6, awayScore: 2, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE PREVIA ORO - 1/4 DE FINAL' },
    { id: 905, homeTeam: arandaRiber, awayTeam: cuatrovientos, homeScore: 4, awayScore: 2, date: '17.05.2025', location: 'CM Arroyo Molino - Javier Arroyo Abogad', round: 'FASE PREVIA ORO - 1/4 DE FINAL' },
];

interface TeamDetailCuatrovientosProps {
    team: Team;
    onBack: () => void;
}

const TeamDetailCuatrovientos: React.FC<TeamDetailCuatrovientosProps> = ({ team, onBack }) => {
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

export default TeamDetailCuatrovientos;