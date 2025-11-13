import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { teamService } from '../services/teamService';

interface TeamsPageProps {
    onTeamSelect: (teamId: number) => void;
}

const TeamCard: React.FC<{ team: Team; onClick: () => void }> = ({ team, onClick }) => (
    <div 
        onClick={onClick}
        className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 cursor-pointer flex flex-col items-center p-6 text-center"
    >
        <img src={team.logo_url} alt={`${team.name} logo`} className="h-24 w-24 object-contain mb-4 transition-transform duration-300 group-hover:scale-110" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">{team.name}</h3>
    </div>
);


const TeamsPage: React.FC<TeamsPageProps> = ({ onTeamSelect }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedTeams = await teamService.getTeams();
                setTeams(fetchedTeams);
            } catch (error: any) {
                const friendlyMessage = `No se pudieron cargar los equipos. Detalle técnico: "${error.message}". Por favor, asegúrate de que la base de datos esté configurada correctamente como se indica en el Panel de Administración.`;
                setError(friendlyMessage);
                console.error("Failed to fetch teams:", error.message || error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, []);


    return (
        <div className="bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Nuestros Equipos</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Explora los clubes que compiten en nuestros torneos.</p>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">Cargando equipos...</div>
                ) : error ? (
                    <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 border border-red-400 p-4 rounded-lg">{error}</div>
                ) : teams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {teams.map(team => (
                            <TeamCard key={team.id} team={team} onClick={() => onTeamSelect(team.id)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">No hay equipos para mostrar. Un administrador puede añadirlos desde el Panel de Administración.</div>
                )}
            </div>
        </div>
    );
};

export default TeamsPage;
