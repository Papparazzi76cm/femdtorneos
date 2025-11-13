import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { postService } from '../services/postService';
import BlogPostCard from './BlogPostCard';

interface BlogListPageProps {
    onPostSelect: (post: BlogPost) => void;
}

// Helper function to parse Spanish date strings like "15 jul, 2024"
const monthMap: { [key: string]: number } = {
  'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
  'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
};

const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date(0); // Fallback for empty or null dates
    try {
        const cleanedString = dateString.toLowerCase().replace(/ de /g, ' ').replace('.', '').replace(',', '');
        const parts = cleanedString.split(' ');
        if (parts.length < 3) return new Date(0);
        const day = parseInt(parts[0], 10);
        const monthKey = parts[1].substring(0, 3);
        const month = monthMap[monthKey];
        const year = parseInt(parts[2], 10);
        if (isNaN(day) || month === undefined || isNaN(year)) return new Date(0);
        return new Date(year, month, day);
    } catch (e) {
        console.error("Error parsing date:", dateString, e);
        return new Date(0);
    }
};

const BlogListPage: React.FC<BlogListPageProps> = ({ onPostSelect }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedPosts = await postService.getPosts();
                const sortedPosts = fetchedPosts.sort((a, b) => {
                    const dateA = parseDate(a.date);
                    const dateB = parseDate(b.date);
                    return dateB.getTime() - dateA.getTime();
                });
                setPosts(sortedPosts);
            } catch (error: any) {
                setError("No se pudieron cargar las noticias en este momento. Inténtalo de nuevo más tarde.");
                console.error("Failed to fetch posts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                    Todas las <span className="text-emerald-500 dark:text-emerald-400">Noticias y Eventos</span>
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">Cargando noticias...</p>
                    ) : error ? (
                        <div className="col-span-full bg-red-100 dark:bg-red-900/30 border border-red-300 text-red-700 dark:text-red-300 p-4 rounded-lg text-center">
                            <p>{error}</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post, index) => (
                           <BlogPostCard key={post.id} post={post} index={index} onSelect={onPostSelect} />
                        ))
                    ) : (
                         <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">Aún no hay noticias publicadas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogListPage;
