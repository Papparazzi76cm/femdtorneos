import React from 'react';
import { Team, Player, Sanction } from '../types';
import { UserIcon } from './icons';

const mockTeams: Team[] = [
    { id: 3, name: 'CDDB Dueñas', logo_url: 'https://pbs.twimg.com/profile_images/1701550920400588800/2Lgdm32c_400x400.jpg' },
    { id: 4, name: 'CD La Cistérniga', logo_url: 'https://www.cdlacisterniga.es/wp-content/uploads/2023/11/cropped-cropped-cropped-escudo-nuevo-2-2.png' },
    { id: 6, name: 'CD Parquesol', logo_url: 'https://pbs.twimg.com/profile_images/1577708577908064257/2xM5O5U__400x400.jpg' }
];

const mockPlayers: Player[] = [
    { id: 301, name: 'Javier García' },
    { id: 401, name: 'Pablo Ruiz' },
    { id: 601, name: 'Sergio Martín' },
];

const sanctionsData: Sanction[] = [
    { player: mockPlayers[0], team: mockTeams[0], reason: 'Roja Directa', games: 2 },
    { player: mockPlayers[1], team: mockTeams[1], reason: 'Doble Amarilla', games: 1 },
    { player: mockPlayers[2], team: mockTeams[2], reason: 'Acumulación Amarillas', games: 1 },
];

const SanctionCard: React.FC<{ sanction: Sanction }> = ({ sanction }) => {
    const reasonStyles = {
        'Roja Directa': 'bg-red-500 text-white',
        'Doble Amarilla': 'bg-yellow-400 text-black',
        'Acumulación Amarillas': 'bg-yellow-200 text-yellow-800',
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50 flex flex-col sm:flex-row items-center p-4 space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                    <UserIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                    <div className="font-bold text-gray-900 dark:text-white">{sanction.player.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{sanction.team.name}</div>
                </div>
            </div>
            <div className="w-full sm:w-1/3 text-center">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${reasonStyles[sanction.reason]}`}>
                    {sanction.reason}
                </span>
            </div>
            <div className="w-full sm:w-1/3 text-center sm:text-right">
                <div className="font-bold text-gray-800 dark:text-gray-100">{sanction.games} {typeof sanction.games === 'number' && sanction.games > 1 ? 'Partidos' : 'Partido'}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">de suspensión</div>
            </div>
        </div>
    );
};


const TournamentSancionados: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-b-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Control de Sanciones</h2>
            {sanctionsData.length > 0 ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {sanctionsData.map((sanction, index) => (
                        <SanctionCard key={index} sanction={sanction} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">No hay jugadores sancionados actualmente.</p>
            )}
        </div>
    );
};

export default TournamentSancionados;