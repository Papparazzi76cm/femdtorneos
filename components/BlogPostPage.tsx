
import React from 'react';
import { BlogPost } from '../types';

interface BlogPostPageProps {
    post: BlogPost;
    onBack: () => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onBack }) => {

    const renderContent = (text: string = '') => {
        // Regex to find ![alt](src)
        const imageRegex = /!\[(.*?)\]\((.*?)\)/;
        const paragraphs = text.split('\n').filter(p => p.trim() !== '');

        return paragraphs.map((p, index) => {
            const match = p.match(imageRegex);
            if (match) {
                const [, alt, src] = match;
                return (
                    <img 
                        key={`content-img-${index}`} 
                        src={src} 
                        alt={alt || 'Imagen incrustada en el artículo'} 
                        className="my-8 rounded-lg shadow-xl mx-auto max-w-full h-auto"
                    />
                );
            } else {
                return (
                    <p key={`content-p-${index}`}>{p}</p>
                );
            }
        });
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Image Section */}
            <div className="relative h-[40vh] md:h-[50vh] w-full">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-gray-900 dark:via-gray-900/70"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-12">
                     <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight drop-shadow-lg">
                        {post.title}
                    </h1>
                     <div className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
                        <span>Por {post.author}</span>
                        <span className="mx-2">|</span>
                        <span>{post.date}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <button 
                        onClick={onBack}
                        className="mb-8 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/40 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        &larr; Volver a Noticias
                    </button>
                    
                    <div className="prose dark:prose-invert prose-lg max-w-none 
                                    prose-p:text-gray-600 dark:prose-p:text-gray-300 
                                    prose-headings:text-gray-900 dark:prose-headings:text-white 
                                    prose-strong:text-emerald-600 dark:prose-strong:text-emerald-400 
                                    prose-a:text-emerald-600 dark:prose-a:text-emerald-400 
                                    hover:prose-a:text-emerald-700 dark:hover:prose-a:text-emerald-300">
                        {renderContent(post.content)}
                    </div>
                </div>
            </div>
            
            <style>{`
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

export default BlogPostPage;