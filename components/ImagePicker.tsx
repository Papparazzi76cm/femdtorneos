
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { FileObject } from '@supabase/storage-js';
import { CloseIcon } from './icons';

interface ImagePickerProps {
    onImageSelect: (url: string) => void;
    onClose: () => void;
}

// FIX: Changed interface to a type intersection to resolve issues with property inheritance from FileObject.
type ImageFile = FileObject & {
    bucket: string;
    bucketLabel: string;
}

const BUCKETS_TO_SEARCH = [
    { id: 'imagenes-web', label: 'Web' },
    { id: 'imagenes-torneos', label: 'Torneos' },
    { id: 'carteles', label: 'Carteles' },
];

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelect, onClose }) => {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const allFiles: ImageFile[] = [];
                // Use Promise.all to fetch from all buckets concurrently
                const promises = BUCKETS_TO_SEARCH.map(async (bucketInfo) => {
                    try {
                        const files = await storageService.listFiles(bucketInfo.id);
                        return files.map(file => ({ ...file, bucket: bucketInfo.id, bucketLabel: bucketInfo.label }));
                    } catch (e) {
                        console.warn(`Could not fetch from bucket: ${bucketInfo.id}`, e);
                        // Return empty array for this bucket on error, so Promise.all doesn't fail completely
                        return []; 
                    }
                });

                const results = await Promise.all(promises);
                // Flatten the array of arrays into a single array and add to allFiles
                results.flat().forEach(file => allFiles.push(file));
                
                setImages(allFiles);

            } catch (e) {
                setError('Ocurrió un error inesperado al cargar las imágenes.');
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchImages();
    }, []);

    const handleSelect = (imageName: string, bucketId: string) => {
        const url = storageService.getPublicUrl(bucketId, imageName);
        onImageSelect(url);
        onClose(); // Auto-close the modal after selection
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4 animate-fade-in-up">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Seleccionar Imagen para Incrustar</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                {isLoading ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-center text-gray-500 dark:text-gray-400">Cargando imágenes...</p>
                    </div>
                ) : error ? (
                     <div className="flex-grow flex items-center justify-center">
                        <p className="text-center text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto pr-2">
                        {images.length > 0 ? images.map(image => (
                            <div key={`${image.bucket}-${image.id}`} className="cursor-pointer group relative" onClick={() => handleSelect(image.name, image.bucket)}>
                                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border-2 border-transparent group-hover:border-emerald-500 transition-all">
                                    <img 
                                        src={storageService.getPublicUrl(image.bucket, image.name)} 
                                        alt={image.name} 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="text-xs text-center truncate mt-1 text-gray-600 dark:text-gray-400" title={image.name}>{image.name}</p>
                                <span className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">{image.bucketLabel}</span>
                            </div>
                        )) : (
                            <p className="col-span-full text-center text-gray-500 mt-10">No se encontraron imágenes en los buckets de almacenamiento ('imagenes-web', 'imagenes-torneos', 'carteles'). Súbelas desde el Gestor de Archivos.</p>
                        )}
                    </div>
                )}
            </div>
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

export default ImagePicker;
