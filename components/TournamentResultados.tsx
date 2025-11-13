import React from 'react';
import { Team, Match } from '../types';

const mockTeams: Team[] = [
    { id: 1, name: 'CD Aranda Riber', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/arandina-2021.png?size=40x&lossy=1' },
    { id: 2, name: 'CD Atlético Pinilla', logo_url: 'https://pbs.twimg.com/profile_images/1169308695029415936/kSUEtG3F_400x400.jpg' },
    { id: 3, name: 'CDDB Dueñas', logo_url: 'https://pbs.twimg.com/profile_images/1701550920400588800/2Lgdm32c_400x400.jpg' },
    { id: 4, name: 'CD La Cistérniga', logo_url: 'https://www.cdlacisterniga.es/wp-content/uploads/2023/11/cropped-cropped-cropped-escudo-nuevo-2-2.png' },
    { id: 5, name: 'Real Valladolid Promesas', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/valladolid-b.png?size=40x&lossy=1' },
    { id: 6, name: 'CD Parquesol', logo_url: 'https://pbs.twimg.com/profile_images/1577708577908064257/2xM5O5U__400x400.jpg' }
];

const resultsByRound: { round: string, matches: Match[] }[] = [
    {
        round: 'Jornada 1',
        matches: [
            { id: 1, homeTeam: mockTeams[0], awayTeam: mockTeams[1], homeScore: 3, awayScore: 0, date: '17/05/2025', location: 'Campo 1 - Viana' },
            { id: 2, homeTeam: mockTeams[2], awayTeam: mockTeams[3], homeScore: 2, awayScore: 2, date: '17/05/2025', location: 'Campo 2 - Viana' },
            { id: 3, homeTeam: mockTeams[4], awayTeam: mockTeams[5], homeScore: 1, awayScore: 0, date: '17/05/2025', location: 'Campo 1 - Viana' },
        ]
    },
    {
        round: 'Jornada 2',
        matches: [
            { id: 4, homeTeam: mockTeams[5], awayTeam: mockTeams[0], homeScore: 0, awayScore: 2, date: '18/05/2025', location: 'Campo 2 - Viana' },
            { id: 5, homeTeam: mockTeams[3], awayTeam: mockTeams[1], homeScore: 1, awayScore: 1, date: '18/05/2025', location: 'Campo 1 - Viana' },
            { id: 6, homeTeam: mockTeams[4], awayTeam: mockTeams[2], homeScore: 3, awayScore: 1, date: '18/05/2025', location: 'Campo 2 - Viana' },
        ]
    },
    {
        round: 'Semifinales',
        matches: [
            { id: 7, homeTeam: mockTeams[0], awayTeam: mockTeams[2], homeScore: 4, awayScore: 1, date: '24/05/2025', location: 'Estadio Principal' },
            { id: 8, homeTeam: mockTeams[4], awayTeam: mockTeams[1], homeScore: 2, awayScore: 0, date: '24/05/2025', location: 'Estadio Principal' },
        ]
    },
];


const TournamentResultados: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-b-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Resultados de Partidos</h2>
            <div className="space-y-8">
                {resultsByRound.map((roundData) => (
                    <div key={roundData.round}>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 py-2 px-4 rounded-t-md">{roundData.round}</h3>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-md">
                            {roundData.matches.map(match => (
                                <div key={match.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                    <div className="flex items-center justify-end w-2/5 text-right">
                                        <span className="hidden sm:inline font-bold text-gray-800 dark:text-white mr-3">{match.homeTeam.name}</span>
                                        <span className="sm:hidden font-bold text-gray-800 dark:text-white mr-3">{match.homeTeam.name.substring(0,3).toUpperCase()}</span>
                                        <img src={match.homeTeam.logo_url} alt={match.homeTeam.name} className="w-8 h-8 object-contain" />
                                    </div>
                                    <div className="w-1/5 text-center">
                                        <div className="text-2xl font-extrabold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md px-3 py-1 inline-block">{match.homeScore} - {match.awayScore}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{match.location}</div>
                                    </div>
                                    <div className="flex items-center w-2/5">
                                        <img src={match.awayTeam.logo_url} alt={match.awayTeam.name} className="w-8 h-8 object-contain" />
                                        <span className="hidden sm:inline font-bold text-gray-800 dark:text-white ml-3">{match.awayTeam.name}</span>
                                        <span className="sm:hidden font-bold text-gray-800 dark:text-white ml-3">{match.awayTeam.name.substring(0,3).toUpperCase()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentResultados;