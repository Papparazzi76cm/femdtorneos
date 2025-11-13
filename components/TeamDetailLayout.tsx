import React, { useState } from 'react';
import { Team, PlayerStat, Match, RosterMember } from '../types';
import { UserIcon } from './icons';

interface TeamDetailLayoutProps {
    team: Team;
    onBack: () => void;
    lastMatch: Match;
    uniforms: string[];
    topScorers: PlayerStat[];
    recentResults: Match[];
    roster: RosterMember[];
    calendar: (Match & { round: string })[];
}

const YellowCardIcon = () => <div className="w-3 h-4 bg-yellow-400 border border-yellow-500 rounded-sm inline-block"></div>;
const RedCardIcon = () => <div className="w-3 h-4 bg-red-500 border border-red-600 rounded-sm inline-block"></div>;

const TeamDetailLayout: React.FC<TeamDetailLayoutProps> = ({
    team,
    onBack,
    lastMatch,
    uniforms,
    topScorers,
    recentResults,
    roster,
    calendar
}) => {
    const [activeTab, setActiveTab] = useState('resumen');

    const tabs = [
        { id: 'resumen', label: 'Resumen' },
        { id: 'plantilla', label: 'Plantilla' },
        { id: 'calendario', label: 'Calendario' },
        { id: 'galeria', label: 'Galería' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'resumen':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Último Partido */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider border-b-4 border-yellow-400 pb-2 inline-block">Último Partido</h3>
                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-semibold mb-6">
                                        <span>FASE DE GRUPOS - GRUPO C</span>
                                        <span>{lastMatch.location}</span>
                                        <span>{lastMatch.date}</span>
                                    </div>
                                    <div className="flex items-center justify-around text-center">
                                        <div className="flex flex-col items-center w-1/3">
                                            <img src={lastMatch.homeTeam.logo_url} alt={lastMatch.homeTeam.name} className="h-20 w-20 object-contain mb-2" />
                                            <span className="font-bold text-lg text-gray-800 dark:text-white">{lastMatch.homeTeam.name}</span>
                                        </div>
                                        <div className="text-5xl font-extrabold text-gray-800 dark:text-white">
                                            {lastMatch.homeScore} - {lastMatch.awayScore}
                                        </div>
                                        <div className="flex flex-col items-center w-1/3">
                                            <img src={lastMatch.awayTeam.logo_url} alt={lastMatch.awayTeam.name} className="h-20 w-20 object-contain mb-2" />
                                            <span className="font-bold text-lg text-gray-800 dark:text-white">{lastMatch.awayTeam.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Uniformes */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider border-b-4 border-yellow-400 pb-2 inline-block">Uniformes</h3>
                                <div className="grid grid-cols-3 gap-6 text-center">
                                    {uniforms.map((uniformUrl, index) => (
                                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <h4 className="font-bold text-gray-800 dark:text-white mb-2">Uniforme {index + 1}</h4>
                                            <img src={uniformUrl} alt={`Uniforme ${index + 1}`} className="w-full h-auto object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Goleadores */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider border-b-4 border-yellow-400 pb-2 inline-block">Goleadores</h3>
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                            <th className="py-2">JUGADOR</th>
                                            <th className="text-center">G</th>
                                            <th className="text-center">P</th>
                                            <th className="text-center">MEDIA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topScorers.map(player => (
                                            <tr key={player.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                                <td className="py-3 flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                                        <UserIcon className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <span className="text-gray-700 dark:text-gray-200">{player.name}</span>
                                                </td>
                                                <td className="text-center text-gray-600 dark:text-gray-300">{player.goals}</td>
                                                <td className="text-center text-gray-600 dark:text-gray-300">{player.penalties}</td>
                                                <td className="text-center font-bold text-gray-800 dark:text-white">{player.average}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Últimos Resultados */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider border-b-4 border-yellow-400 pb-2 inline-block">Últimos Resultados</h3>
                                <div className="space-y-4">
                                    {recentResults.map(match => (
                                        <div key={match.id} className="text-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center text-left w-2/5 truncate">
                                                    <img src={match.homeTeam.logo_url} alt={match.homeTeam.name} className="h-6 w-6 object-contain mr-2 flex-shrink-0" />
                                                    <span className="font-semibold text-gray-700 dark:text-gray-200 truncate">{match.homeTeam.name}</span>
                                                </div>
                                                <span className="font-bold text-gray-800 dark:text-white">{match.homeScore} - {match.awayScore}</span>
                                                <div className="flex items-center justify-end text-right w-2/5 truncate">
                                                    <span className="font-semibold text-gray-700 dark:text-gray-200 truncate">{match.awayTeam.name}</span>
                                                    <img src={match.awayTeam.logo_url} alt={match.awayTeam.name} className="h-6 w-6 object-contain ml-2 flex-shrink-0" />
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                <span>{match.date}</span>
                                                <p className="truncate">{match.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'plantilla':
                return (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider border-b-4 border-yellow-400 pb-2 inline-block">Plantilla</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-gray-500 dark:text-gray-400 uppercase">
                                    <tr>
                                        <th className="py-3 px-4">#</th>
                                        <th className="py-3 px-4">POS</th>
                                        <th className="py-3 px-4">Jugador</th>
                                        <th className="py-3 px-4 text-center">Edad</th>
                                        <th className="py-3 px-4 text-center">Partidos</th>
                                        <th className="py-3 px-4 text-center">Goles</th>
                                        <th className="py-3 px-4 text-center"><YellowCardIcon /></th>
                                        <th className="py-3 px-4 text-center"><RedCardIcon /></th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800 dark:text-gray-200">
                                    {roster.map((member, index) => (
                                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                                            <td className="py-4 px-4 font-semibold">{member.dorsal}</td>
                                            <td className="py-4 px-4 font-semibold">{member.position}</td>
                                            <td className="py-4 px-4">{member.name}</td>
                                            <td className="py-4 px-4 text-center">{member.age}</td>
                                            <td className="py-4 px-4 text-center">{member.matches}</td>
                                            <td className="py-4 px-4 text-center">{member.goals}</td>
                                            <td className="py-4 px-4 text-center">{member.yellowCards}</td>
                                            <td className="py-4 px-4 text-center">{member.redCards}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'calendario':
                 return (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider border-b-4 border-yellow-400 pb-2 inline-block">Calendario</h3>
                        <div className="space-y-2">
                            {calendar.map((match) => (
                                <div key={match.id}>
                                    <div className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2">{match.round}</div>
                                    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                                         <div className="flex items-center justify-end w-2/5 text-right">
                                            <span className="font-bold text-gray-800 dark:text-white mr-3">{match.homeTeam.name}</span>
                                            <img src={match.homeTeam.logo_url} alt={match.homeTeam.name} className="w-8 h-8 object-contain" />
                                        </div>
                                        <div className="w-1/5 text-center">
                                            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{match.homeScore} - {match.awayScore}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{match.date} - {match.location}</div>
                                        </div>
                                        <div className="flex items-center w-2/5">
                                            <img src={match.awayTeam.logo_url} alt={match.awayTeam.name} className="w-8 h-8 object-contain" />
                                            <span className="font-bold text-gray-800 dark:text-white ml-3">{match.awayTeam.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm"><p>Contenido para {activeTab} no disponible todavía.</p></div>;
        }
    };

    return (
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

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-md">
                    <nav className="flex justify-between items-center text-center border-b-2 border-gray-200 dark:border-gray-700">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-4 px-1 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 relative
                                    ${activeTab === tab.id
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`
                                }
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-400 dark:text-gray-500 text-[10px]">EQUIPO</span>
                                    <span>{tab.label}</span>
                                </div>
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 rounded-t-full"></span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-b-lg">
                    {renderContent()}
                </div>

            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default TeamDetailLayout;