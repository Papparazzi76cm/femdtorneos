
import React, { useState, useEffect } from 'react';
import { CalendarEvent, Team } from '../types';
import { teamService } from '../services/teamService';
import { CloseIcon, CalendarIcon, UsersIcon } from './icons';

interface EventModalProps {
    event: CalendarEvent;
    onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
    const [participatingTeams, setParticipatingTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            if (event.team_ids && event.team_ids.length > 0) {
                const allTeams = await teamService.getTeams();
                const teams = allTeams.filter(team => event.team_ids.includes(team.id));
                setParticipatingTeams(teams);
            } else {
                setParticipatingTeams([]);
            }
        };
        fetchTeams();
    }, [event]);
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
    };

    const eventTypeMap: {[key: string]: string} = {
        'Tournament': 'Torneo',
        'Friendly': 'Amistoso',
        'Training Camp': 'Campus de Entrenamiento',
        'Scouting Event': 'Evento de Ojeadores'
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <CloseIcon className="h-6 w-6" />
                </button>
                <div className="flex items-center mb-4">
                     <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg mr-4">
                        <CalendarIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h2>
                        <span className="bg-emerald-100 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2 py-1 rounded-full">{eventTypeMap[event.type] || event.type}</span>
                    </div>
                </div>
                <div className="text-gray-600 dark:text-gray-300 space-y-4">
                    <p>{event.description || "No hay descripción para este evento."}</p>
                    <div>
                        <p><strong>Inicio:</strong> {formatDate(event.start)}</p>
                        <p><strong>Fin:</strong> {formatDate(event.end)}</p>
                    </div>

                    {participatingTeams.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-2"><UsersIcon className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" /> Equipos Participantes:</h3>
                            <ul className="space-y-1 pl-2">
                                {participatingTeams.map(team => (
                                    <li key={team.id} className="flex items-center">
                                        <img src={team.logo_url} alt={team.name} className="w-5 h-5 rounded-full mr-2" />
                                        <span>{team.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
             {/* FIX: Removed the 'jsx' prop from the <style> tag as it is not supported in this React setup and was causing a TypeScript error. The animation styles will now be applied globally. */}
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default EventModal;