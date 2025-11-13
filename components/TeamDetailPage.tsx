import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { teamService } from '../services/teamService';
import TeamDetailArandaRiber from './TeamDetailArandaRiber';
import TeamDetailAtleticoPinilla from './TeamDetailAtleticoPinilla';
import TeamDetailBenavente from './TeamDetailBenavente';
import TeamDetailBoecillo from './TeamDetailBoecillo';
import TeamDetailCuatrovientos from './TeamDetailCuatrovientos';


interface TeamDetailPageProps {
    teamId: number;
    onBack: () => void;
}

const GenericTeamDetail: React.FC<{ team: Team, onBack: () => void }> = ({ team, onBack }) => (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-6 py-8">
            <div className="bg-gray-800 dark:bg-black text-white p-8 rounded-lg shadow-2xl mb-8">
                <div className="flex flex-col md:flex-row items-center">
                    <img src={team.logo_url} alt={team.name} className="h-24 w-24 object-contain mb-4 md:mb-0 md:mr-6" />
                    <div>
                        <h1 className="text-4xl font-extrabold text-center md:text-left">{team.name.toUpperCase()}</h1>
                        <p className="text-lg text-gray-300 text-center md:text-left">COPA CYL: EDICIÓN VIANA DE CEGA 2024/2025 BENJAMIN 2016</p>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                <p>La información detallada para este equipo estará disponible próximamente.</p>
                <button
                    onClick={onBack}
                    className="mt-6 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/40 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    &larr; Volver a Equipos
                </button>
            </div>
        </div>
    </div>
);


const TeamDetailPage: React.FC<TeamDetailPageProps> = ({ teamId, onBack }) => {
    const [team, setTeam] = useState<Team | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            setIsLoading(true);
            try {
                const fetchedTeam = await teamService.getTeamById(teamId);
                setTeam(fetchedTeam || null);
            } catch (error) {
                console.error("Failed to fetch team details:", error);
                setTeam(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeam();
    }, [teamId]);

    if (isLoading) {
        return <div className="text-center py-20">Cargando datos del equipo...</div>;
    }

    if (!team) {
        return <div className="text-center py-20">No se pudo encontrar el equipo.</div>;
    }
    
    switch (team.name) {
        case 'CD Aranda Riber':
            return <TeamDetailArandaRiber team={team} onBack={onBack} />;
        case 'CD Atlético Pinilla':
            return <TeamDetailAtleticoPinilla team={team} onBack={onBack} />;
        case 'CD Benavente':
            return <TeamDetailBenavente team={team} onBack={onBack} />;
        case 'CD Boecillo':
            return <TeamDetailBoecillo team={team} onBack={onBack} />;
        case 'CD Cuatrovientos':
            return <TeamDetailCuatrovientos team={team} onBack={onBack} />;
        default:
            return <GenericTeamDetail team={team} onBack={onBack} />;
    }
};

export default TeamDetailPage;