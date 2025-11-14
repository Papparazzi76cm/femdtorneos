import React, { useState, useEffect } from 'react';
import { BlogPost, View } from '../types';
import BlogPostCard from './BlogPostCard';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { postService } from '../services/postService';
import { storageService } from '../services/storageService';

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
}


// Helper function to parse Spanish date strings like "15 jul, 2024"
const monthMap: { [key: string]: number } = {
  'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
  'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
};

const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date(0); // Fallback for empty or null dates
    try {
        // Example format: "15 jul, 2024"
        const cleanedString = dateString.toLowerCase().replace(/ de /g, ' ').replace('.', '').replace(',', '');
        const parts = cleanedString.split(' ');
        
        if (parts.length < 3) return new Date(0); // Invalid format
        
        const day = parseInt(parts[0], 10);
        const monthKey = parts[1].substring(0, 3);
        const month = monthMap[monthKey];
        const year = parseInt(parts[2], 10);
        
        if (isNaN(day) || month === undefined || isNaN(year)) return new Date(0);

        return new Date(year, month, day);
    } catch (e) {
        console.error("Error parsing date:", dateString, e);
        return new Date(0); // Fallback on parsing error
    }
};

interface HomePageProps {
    onPostSelect: (post: BlogPost) => void;
    onNavigate: (view: View) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPostSelect, onNavigate }) => {
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [postsError, setPostsError] = useState<string | null>(null);
    
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [isLoadingGallery, setIsLoadingGallery] = useState(true);
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [heroSlideIndex, setHeroSlideIndex] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoadingPosts(true);
            setPostsError(null);
            try {
                const fetchedPosts = await postService.getPosts();
                // Sort posts by date, from newest to oldest
                const sortedPosts = fetchedPosts.sort((a, b) => {
                    const dateA = parseDate(a.date);
                    const dateB = parseDate(b.date);
                    return dateB.getTime() - dateA.getTime();
                });
                setAllPosts(sortedPosts);
                setDisplayedPosts(sortedPosts.slice(0, 6));
            } catch (error: any) {
                const errorMessage = error?.message || 'Ocurrió un error desconocido.';
                console.error("Failed to fetch posts:", errorMessage);

                if (errorMessage.toLowerCase().includes('could not find the table')) {
                    setPostsError("La base de datos de noticias no está configurada. Un administrador debe ir al Panel de Administración para obtener las instrucciones de configuración.");
                } else {
                    setPostsError("No se pudieron cargar las noticias en este momento. Inténtalo de nuevo más tarde.");
                }
            } finally {
                setIsLoadingPosts(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            setIsLoadingGallery(true);
            try {
                const files = await storageService.listFiles('carteles');
                const images = files.map(file => ({
                    id: file.id ?? file.name,
                    src: storageService.getPublicUrl('carteles', file.name),
                    alt: file.name.split('.').slice(0, -1).join(' ').replace(/[-_]/g, ' '),
                }));
                setGalleryImages(images);
            } catch (error) {
                console.error("Failed to fetch gallery images:", error);
                // The message will be shown in the gallery section if empty
            } finally {
                setIsLoadingGallery(false);
            }
        };
        fetchGalleryImages();
    }, []);
    
    useEffect(() => {
        const validPosts = allPosts.filter(p => p.image_url);
        if (validPosts.length > 1) {
            const interval = setInterval(() => {
                setHeroSlideIndex(prevIndex => (prevIndex + 1) % validPosts.length);
            }, 5000); // Change slide every 5 seconds
            return () => clearInterval(interval);
        }
    }, [allPosts]);

    const totalImages = galleryImages.length;
    const anglePerItem = totalImages > 0 ? 360 / totalImages : 0;
    const radius = "clamp(250px, 30vw, 350px)"; 

    const handlePrev = () => {
        setActiveIndex(prevIndex => (prevIndex - 1 + totalImages) % totalImages);
    };

    const handleNext = () => {
        setActiveIndex(prevIndex => (prevIndex + 1) % totalImages);
    };
    
    const carouselRotation = -activeIndex * anglePerItem;
    
    const heroPosts = allPosts.filter(p => p.image_url);


    return (
        <div>
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden">
                {/* Carousel Background */}
                <div className="absolute inset-0 w-full h-full">
                    {heroPosts.length > 0 ? (
                        heroPosts.map((post, index) => (
                            <img
                                key={post.id}
                                src={post.image_url}
                                alt={post.title}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                    index === heroSlideIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))
                    ) : (
                        // Fallback image if no posts are available or still loading
                        <img
                            src="https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/Carteles/copa-cyl-2025.jpg"
                            alt="Fallback hero image"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                
                {/* Text Content */}
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
                        Vive el Fútbol <span className="text-emerald-400">Como Nunca Antes</span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
                        Torneos y eventos organizados profesionalmente que forjan campeones y crean recuerdos imborrables.
                    </p>
                </div>
            </div>

            {/* Blog Section */}
            <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Últimas <span className="text-emerald-500 dark:text-emerald-400">Noticias y Eventos</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoadingPosts ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">Cargando noticias...</p>
                        ) : postsError ? (
                            <div className="col-span-full bg-yellow-50 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-500 p-4 rounded-lg text-center">
                                <h4 className="font-bold text-md mb-2">Atención</h4>
                                <p>{postsError}</p>
                            </div>
                        ) : displayedPosts.length > 0 ? (
                            displayedPosts.map((post, index) => (
                               <BlogPostCard key={post.id} post={post} index={index} onSelect={onPostSelect} />
                            ))
                        ) : (
                             <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">Aún no hay noticias publicadas.</p>
                        )}
                    </div>
                     {allPosts.length > 6 && (
                        <div className="text-center mt-12">
                            <button
                                onClick={() => onNavigate('blogList')}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 transform hover:scale-105"
                            >
                                Ver Todas las Publicaciones
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Gallery Section */}
            <div className="py-16 sm:py-24 bg-gray-100 dark:bg-gray-800/50 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">
                        Galería de <span className="text-emerald-500 dark:text-emerald-400">Torneos</span>
                    </h2>
                    
                    {isLoadingGallery ? (
                        <div className="h-[500px] flex items-center justify-center">
                           <p className="text-gray-500 dark:text-gray-400">Cargando galería...</p>
                        </div>
                    ) : totalImages > 0 ? (
                        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
                            <div className="w-full h-full" style={{ perspective: '1500px' }}>
                                <div
                                    className="relative w-full h-full transition-transform duration-700 ease-in-out"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: `rotateY(${carouselRotation}deg)`,
                                    }}
                                >
                                    {galleryImages.map((image, index) => {
                                        const imageAngle = index * anglePerItem;
                                        const isSelected = index === activeIndex;
                                        return (
                                            <div
                                                key={image.id}
                                                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                                                style={{
                                                    transform: `rotateY(${imageAngle}deg) translateZ(${radius})`,
                                                }}
                                            >
                                                <div
                                                    className={`w-[240px] h-[360px] md:w-[280px] md:h-[420px] transition-all duration-500 ${isSelected ? 'scale-100' : 'scale-90 opacity-60'}`}
                                                >
                                                    <div
                                                        className={`group w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 border-2 ${isSelected ? 'border-emerald-500 shadow-emerald-500/50' : 'border-gray-300 dark:border-gray-700'}`}
                                                    >
                                                        <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {totalImages > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-0 md:left-4 lg:left-10 top-1/2 -translate-y-1/2 bg-white/50 dark:bg-gray-800/50 hover:bg-emerald-500 text-gray-800 dark:text-white rounded-full p-3 shadow-lg transition-all duration-300 z-10 transform hover:scale-110"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeftIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-0 md:right-4 lg:right-10 top-1/2 -translate-y-1/2 bg-white/50 dark:bg-gray-800/50 hover:bg-emerald-500 text-gray-800 dark:text-white rounded-full p-3 shadow-lg transition-all duration-300 z-10 transform hover:scale-110"
                                        aria-label="Next image"
                                    >
                                        <ChevronRightIcon className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-[500px] flex items-center justify-center">
                             <p className="text-gray-500 dark:text-gray-400">No hay carteles para mostrar. Súbelos desde el Panel de Administración en "Gestor de Archivos" &gt; "Carteles".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;