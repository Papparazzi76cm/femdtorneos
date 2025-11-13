
import React from 'react';
import { BlogPost } from '../types';

interface BlogPostCardProps {
    post: BlogPost;
    index: number;
    onSelect: (post: BlogPost) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, index, onSelect }) => {

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onSelect(post);
    };

    return (
        <div 
            onClick={handleCardClick}
            className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 cursor-pointer"
            style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
        >
            <div className="overflow-hidden h-56">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{post.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                    <span>Por {post.author}</span>
                    <span>{post.date}</span>
                </div>
            </div>
            {/* FIX: Removed the 'jsx' prop from the <style> tag as it is not supported in this React setup and was causing a TypeScript error. The animation styles will now be applied globally. */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default BlogPostCard;