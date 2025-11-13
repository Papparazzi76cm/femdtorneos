import React, { useState } from 'react';
import { TournamentTab } from '../types';
import TournamentClasificacion from './TournamentClasificacion';
import TournamentResultados from './TournamentResultados';
import TournamentGoleadores from './TournamentGoleadores';
import TournamentEquipos from './TournamentEquipos';
import TournamentSancionados from './TournamentSancionados';

const TournamentsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TournamentTab>('clasificacion');

    const renderContent = () => {
        switch (activeTab) {
            case 'clasificacion':
                return <TournamentClasificacion />;
            case 'resultados':
                return <TournamentResultados />;
            case 'goleadores':
                return <TournamentGoleadores />;
            case 'equipos':
                return <TournamentEquipos />;
            case 'sancionados':
                return <TournamentSancionados />;
            default:
                return <TournamentClasificacion />;
        }
    };

    const tabs: { id: TournamentTab; label: string }[] = [
        { id: 'clasificacion', label: 'Clasificación' },
        { id: 'resultados', label: 'Resultados' },
        { id: 'goleadores', label: 'Ranking de Goleadores' },
        { id: 'equipos', label: 'Equipos' },
        { id: 'sancionados', label: 'Jugadores Sancionados' },
    ];

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">Competiciones</h1>
            
            <div className="w-full max-w-5xl mx-auto">
                {/* Selector de Torneo (placeholder) */}
                <div className="mb-6">
                    <label htmlFor="tournament-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecciona una Competición:</label>
                    <select id="tournament-select" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>Copa CYL Viana 2025</option>
                        <option>Medina International Cup 2025</option>
                        <option>Copa Rioseco 2025</option>
                    </select>
                </div>

                {/* Barra de Navegación del Torneo */}
                <nav className="bg-gray-800 dark:bg-gray-900 rounded-t-lg shadow-lg">
                    <div className="flex justify-center space-x-2 sm:space-x-4 p-2 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 font-bold text-xs sm:text-sm rounded-md transition-colors duration-200 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-emerald-500 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                {tab.label.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Contenido de la Pestaña */}
                <div className="animate-fade-in shadow-lg">
                    {renderContent()}
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out forwards;
                }
                nav::-webkit-scrollbar {
                  height: 4px;
                }
                nav::-webkit-scrollbar-thumb {
                  background-color: #374151; /* dark:bg-gray-700 */
                  border-radius: 2px;
                }
            `}</style>
        </div>
    );
};

export default TournamentsPage;