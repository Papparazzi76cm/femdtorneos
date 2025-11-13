import React from 'react';
import { Team, TeamStanding } from '../types';

const mockTeams: Team[] = [
    { id: 1, name: 'CD Aranda Riber', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/arandina-2021.png?size=40x&lossy=1' },
    { id: 2, name: 'CD Atlético Pinilla', logo_url: 'https://pbs.twimg.com/profile_images/1169308695029415936/kSUEtG3F_400x400.jpg' },
    { id: 3, name: 'CDDB Dueñas', logo_url: 'https://pbs.twimg.com/profile_images/1701550920400588800/2Lgdm32c_400x400.jpg' },
    { id: 4, name: 'CD La Cistérniga', logo_url: 'https://www.cdlacisterniga.es/wp-content/uploads/2023/11/cropped-cropped-cropped-escudo-nuevo-2-2.png' },
    { id: 5, name: 'Real Valladolid Promesas', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/valladolid-b.png?size=40x&lossy=1' },
    { id: 6, name: 'CD Parquesol', logo_url: 'https://pbs.twimg.com/profile_images/1577708577908064257/2xM5O5U__400x400.jpg' }
];

const standingsData: TeamStanding[] = [
    { position: 1, team: mockTeams[0], points: 12, played: 5, won: 4, drawn: 0, lost: 1, goalsFor: 15, goalsAgainst: 4, goalDifference: 11 },
    { position: 2, team: mockTeams[4], points: 10, played: 5, won: 3, drawn: 1, lost: 1, goalsFor: 10, goalsAgainst: 5, goalDifference: 5 },
    { position: 3, team: mockTeams[2], points: 9, played: 5, won: 3, drawn: 0, lost: 2, goalsFor: 8, goalsAgainst: 7, goalDifference: 1 },
    { position: 4, team: mockTeams[1], points: 7, played: 5, won: 2, drawn: 1, lost: 2, goalsFor: 6, goalsAgainst: 9, goalDifference: -3 },
    { position: 5, team: mockTeams[3], points: 4, played: 5, won: 1, drawn: 1, lost: 3, goalsFor: 5, goalsAgainst: 12, goalDifference: -7 },
    { position: 6, team: mockTeams[5], points: 1, played: 5, won: 0, drawn: 1, lost: 4, goalsFor: 3, goalsAgainst: 10, goalDifference: -7 },
];


const TournamentClasificacion: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-b-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Clasificación - Grupo A</h2>
            <div className="min-w-full">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-2 sm:px-6 py-3 text-center">Pos</th>
                            <th scope="col" className="px-2 sm:px-6 py-3">Equipo</th>
                            <th scope="col" className="px-2 sm:px-4 py-3 text-center" title="Puntos">PTS</th>
                            <th scope="col" className="px-2 sm:px-4 py-3 text-center" title="Partidos Jugados">PJ</th>
                            <th scope="col" className="px-2 sm:px-4 py-3 text-center" title="Victorias">V</th>
                            <th scope="col" className="px-2 sm:px-4 py-3 text-center" title="Empates">E</th>
                            <th scope="col" className="px-2 sm:px-4 py-3 text-center" title="Derrotas">D</th>
                            <th scope="col" className="px-2 sm:px-4 py-3 text-center" title="Goles a Favor">GF</th>
                            <th scope="col" className="px-2 sm:px-4 py-3 text-center" title="Goles en Contra">GC</th>
                            <th scope="col" className="px-2 sm:px-4 py-3 text-center" title="Diferencia de Goles">DG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standingsData.map((s, index) => (
                            <tr key={s.team.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <td className="px-2 sm:px-6 py-4 font-bold text-center text-gray-900 dark:text-white">
                                    <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center text-white ${index < 3 ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500'}`}>
                                        {s.position}
                                    </span>
                                </td>
                                <th scope="row" className="px-2 sm:px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img src={s.team.logo_url} alt={s.team.name} className="w-6 h-6 mr-2 object-contain" />
                                        {s.team.name}
                                    </div>
                                </th>
                                <td className="px-2 sm:px-4 py-4 text-center font-bold text-gray-800 dark:text-gray-100">{s.points}</td>
                                <td className="px-2 sm:px-4 py-4 text-center">{s.played}</td>
                                <td className="px-2 sm:px-4 py-4 text-center">{s.won}</td>
                                <td className="px-2 sm:px-4 py-4 text-center">{s.drawn}</td>
                                <td className="px-2 sm:px-4 py-4 text-center">{s.lost}</td>
                                <td className="px-2 sm:px-4 py-4 text-center">{s.goalsFor}</td>
                                <td className="px-2 sm:px-4 py-4 text-center">{s.goalsAgainst}</td>
                                <td className="px-2 sm:px-4 py-4 text-center font-semibold">{s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TournamentClasificacion;