import React from 'react';
import { Team } from '../types';

const mockTeams: Team[] = [
    { id: 1, name: 'CD Aranda Riber', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/arandina-2021.png?size=120x&lossy=1' },
    { id: 2, name: 'CD Atlético Pinilla', logo_url: 'https://pbs.twimg.com/profile_images/1169308695029415936/kSUEtG3F_400x400.jpg' },
    { id: 3, name: 'CDDB Dueñas', logo_url: 'https://pbs.twimg.com/profile_images/1701550920400588800/2Lgdm32c_400x400.jpg' },
    { id: 4, name: 'CD La Cistérniga', logo_url: 'https://www.cdlacisterniga.es/wp-content/uploads/2023/11/cropped-cropped-cropped-escudo-nuevo-2-2.png' },
    { id: 5, name: 'Real Valladolid Promesas', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/valladolid-b.png?size=120x&lossy=1' },
    { id: 6, name: 'CD Parquesol', logo_url: 'https://pbs.twimg.com/profile_images/1577708577908064257/2xM5O5U__400x400.jpg' },
    { id: 7, name: 'Cultural Leonesa', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/cultural-leonesa.png?size=120x&lossy=1' },
    { id: 8, name: 'CD Numancia', logo_url: 'https://cdn.resfu.com/media/img/teams/480x480/cd-numancia-de-soria.png?size=120x&lossy=1' }
];


const TournamentEquipos: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-b-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Equipos Participantes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {mockTeams.map(team => (
                    <div key={team.id} className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <img src={team.logo_url} alt={`${team.name} logo`} className="h-20 w-20 object-contain mb-3" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentEquipos;