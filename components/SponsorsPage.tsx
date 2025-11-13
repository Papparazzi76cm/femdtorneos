import React, { useState, useEffect } from 'react';
import { View, Sponsor } from '../types';
import { sponsorService } from '../services/sponsorService';

interface SponsorsPageProps {
    onNavigate: (view: View) => void;
}

const SponsorsPage: React.FC<SponsorsPageProps> = ({ onNavigate }) => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSponsors = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedSponsors = await sponsorService.getSponsors();
                setSponsors(fetchedSponsors);
            } catch (err: any) {
                console.error("Failed to fetch sponsors:", err);
                setError("No se pudieron cargar los patrocinadores. Por favor, asegúrate de que la base de datos esté configurada correctamente.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSponsors();
    }, []);


    return (
        <div className="bg-white dark:bg-gray-900 py-16 sm:py-24 animate-fade-in">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                    Nuestros <span className="text-emerald-500 dark:text-emerald-400">Patrocinadores</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Agradecemos enormemente el apoyo de nuestros patrocinadores, quienes hacen posible que nuestros torneos sean una realidad y un éxito.
                </p>

                <div className="mt-16">
                    {isLoading ? (
                        <p>Cargando patrocinadores...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : sponsors.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 items-center">
                            {sponsors.map((sponsor, index) => (
                                <a
                                    key={sponsor.id}
                                    href={sponsor.website_url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-center items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                                    style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                                >
                                    <img
                                        src={sponsor.logo_url}
                                        alt={sponsor.name}
                                        className="h-16 md:h-20 object-contain transition-transform duration-300 filter grayscale hover:grayscale-0 hover:scale-110"
                                    />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p>Aún no tenemos patrocinadores. ¡Contacta con nosotros para ser el primero!</p>
                    )}
                </div>

                <div className="mt-20 bg-gray-100 dark:bg-gray-800 rounded-lg p-8 md:p-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">¿Interesado en patrocinar?</h2>
                    <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Únete a nuestra familia y conecta con miles de jóvenes deportistas y sus familias.
                    </p>
                    <button
                        onClick={() => onNavigate('contact')}
                        className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 transform hover:scale-105"
                    >
                        Contacta con Nosotros
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SponsorsPage;