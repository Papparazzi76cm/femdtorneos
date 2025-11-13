import React from 'react';
import { PlayerStat, Team } from '../types';
import { UserIcon } from './icons';

const mockTeams: Team[] = [
    { id: 1, name: 'CD Aranda Riber', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/arandina-2021.png?size=40x&lossy=1' },
    { id: 5, name: 'Real Valladolid Promesas', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/valladolid-b.png?size=40x&lossy=1' },
    { id: 3, name: 'CDDB Dueñas', logo_url: 'https://pbs.twimg.com/profile_images/1701550920400588800/2Lgdm32c_400x400.jpg' },
];

const topScorers: PlayerStat[] = [
    { id: 101, name: 'Adrián Campos', goals: 8, penalties: 2, average: 1.6, team: mockTeams[0] },
    { id: 201, name: 'Marcos Alonso', goals: 6, penalties: 0, average: 1.2, team: mockTeams[1] },
    { id: 301, name: 'Leo Fernández', goals: 5, penalties: 1, average: 1.0, team: mockTeams[0] },
    { id: 401, name: 'Hugo Pérez', goals: 5, penalties: 0, average: 1.0, team: mockTeams[2] },
    { id: 501, name: 'Daniel Romero', goals: 4, penalties: 0, average: 0.8, team: mockTeams[1] },
    { id: 601, name: 'Enzo Díaz', goals: 3, penalties: 1, average: 0.6, team: mockTeams[2] },
];

const TournamentGoleadores: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-b-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Ranking de Goleadores</h2>
             <div className="min-w-full">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-2 sm:px-6 py-3 text-center">#</th>
                            <th scope="col" className="px-2 sm:px-6 py-3">Jugador</th>
                            <th scope="col" className="px-2 sm:px-6 py-3">Equipo</th>
                            <th scope="col" className="px-2 sm:px-6 py-3 text-center">Goles (Penalti)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topScorers.map((player, index) => (
                             <tr key={player.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <td className="px-2 sm:px-6 py-4 font-bold text-center text-gray-900 dark:text-white">{index + 1}</td>
                                <th scope="row" className="px-2 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                            <UserIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        {player.name}
                                    </div>
                                </th>
                                <td className="px-2 sm:px-6 py-4">
                                     <div className="flex items-center">
                                        <img src={player.team.logo_url} alt={player.team.name} className="w-6 h-6 mr-2 object-contain" />
                                        {player.team.name}
                                    </div>
                                </td>
                                <td className="px-2 sm:px-6 py-4 text-center font-bold text-lg text-gray-800 dark:text-gray-100">
                                    {player.goals}
                                    {player.penalties > 0 && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({player.penalties}P)</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TournamentGoleadores;