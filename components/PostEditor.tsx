
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { postService } from '../services/postService';
import { storageService } from '../services/storageService';
import { SparklesIcon, UploadIcon, ImageIcon } from './icons';
import { BlogPost } from '../types';
import ImagePicker from './ImagePicker';

interface PostEditorProps {
    generatedImageUrl: string;
    postToEdit: BlogPost | null;
    onSave: () => void;
    onCancel: () => void;
}

const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };
    const formatted = new Date().toLocaleDateString('es-ES', options);
    return formatted.replace(/ de /g, ' ').replace('.', ',');
};

const PostEditor: React.FC<PostEditorProps> = ({ generatedImageUrl, postToEdit, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState('Admin');
    const [date, setDate] = useState(getFormattedDate());
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isImagePickerOpen, setImagePickerOpen] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    
    const isEditing = postToEdit !== null;

    useEffect(() => {
        if (postToEdit) {
            setTitle(postToEdit.title);
            setDescription(postToEdit.description);
            setContent(postToEdit.content);
            setImageUrl(postToEdit.image_url);
            setAuthor(postToEdit.author);
            setDate(postToEdit.date);
        } else {
            resetForm();
        }
    }, [postToEdit]);


    useEffect(() => {
        if (generatedImageUrl && !isEditing) {
            setImageUrl(generatedImageUrl);
        }
    }, [generatedImageUrl, isEditing]);
    
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setContent('');
        setImageUrl('');
        setAuthor('Admin');
        setDate(getFormattedDate());
    };

    const handleGenerateDescription = async () => {
        if (!title) {
            alert("Por favor, introduce primero un título para generar una descripción.");
            return;
        }
        setIsGeneratingDesc(true);
        try {
            const desc = await geminiService.generatePostDescription(title);
            setDescription(desc);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsGeneratingDesc(false);
        }
    };
    
    const handleGenerateContent = async () => {
        if (!title) {
            alert("Por favor, introduce primero un título para generar el contenido completo.");
            return;
        }
        setIsGeneratingContent(true);
        try {
            const fullContent = await geminiService.generateFullPostContent(title);
            setContent(fullContent);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsGeneratingContent(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        setUploadError(null);
        try {
            const filePath = await storageService.uploadFile('imagenes-web', file);
            const publicUrl = storageService.getPublicUrl('imagenes-web', filePath);
            setImageUrl(publicUrl);
        } catch (error) {
            const err = error as Error;
            console.error("Image upload failed:", err.message);
            if (err.message.toLowerCase().includes('bucket not found')) {
                setUploadError('Error: El bucket "imagenes-web" no existe. Un administrador debe crearlo desde la sección "Storage" de Supabase, asegurándose de que sea público.');
            } else {
                 setUploadError(`Error al subir la imagen. Asegúrate de que el bucket sea público y tengas permisos.`);
            }
        } finally {
            setIsUploadingImage(false);
            if(imageInputRef.current) {
                imageInputRef.current.value = ""; 
            }
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const postData = {
            title,
            description,
            content,
            image_url: imageUrl,
            author,
            date
        };

        try {
            if (isEditing) {
                await postService.updatePost({ ...postData, id: postToEdit.id });
                alert(`¡Publicación "${title}" actualizada con éxito!`);
            } else {
                await postService.addPost(postData);
                alert(`¡Publicación "${title}" creada con éxito!`);
            }
            onSave(); // This will trigger a refresh and close the editor view
        } catch (error) {
            const err = error as Error;
            alert(`Error al guardar la publicación: ${err.message}`);
            console.error(err);
        }
    };

    const handleEmbedImage = (url: string) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const markdown = `\n\n![imagen](${url})\n\n`;
        
        const newText = text.substring(0, start) + markdown + text.substring(end);
        
        setContent(newText);
        
        // Focus and set cursor position after the inserted markdown
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
        }, 0);
    };


    return (
        <>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{isEditing ? 'Editar Publicación' : 'Crear Nueva Publicación'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Título de la Publicación</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Ej: 'Resumen del Campeonato Juvenil de Verano'"
                        required
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Autor</label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Fecha</label>
                        <input
                            type="text"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
                <div>
                     <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Descripción Corta</label>
                    <div className="relative">
                       <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            rows={3}
                            placeholder="Escribe una descripción o genera una a partir del título."
                            required
                        />
                         <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGeneratingDesc || !title}
                            className="absolute bottom-2 right-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-2 rounded-lg flex items-center text-sm disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            <SparklesIcon className="w-4 h-4 mr-1" /> {isGeneratingDesc ? 'Generando...' : 'Generar'}
                        </button>
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Contenido Completo del Artículo</label>
                        <button type="button" onClick={() => setImagePickerOpen(true)} className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                            <ImageIcon className="w-4 h-4 mr-1" />
                            Incrustar Imagen
                        </button>
                    </div>
                    <div className="relative">
                       <textarea
                            id="content"
                            ref={contentRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            rows={8}
                            placeholder="Escribe el artículo completo o genéralo con IA a partir del título."
                            required
                        />
                         <button
                            type="button"
                            onClick={handleGenerateContent}
                            disabled={isGeneratingContent || !title}
                            className="absolute bottom-2 right-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-2 rounded-lg flex items-center text-sm disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            <SparklesIcon className="w-4 h-4 mr-1" /> {isGeneratingContent ? 'Generando...' : 'Generar Artículo'}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">URL de la Imagen (Principal)</label>
                     <div className="flex items-center gap-2">
                        <input
                            type="text"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="flex-grow bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Pega la URL o sube una imagen."
                            required
                        />
                         <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                         <button 
                            type="button" 
                            onClick={() => imageInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center disabled:bg-gray-500"
                        >
                            <UploadIcon className="w-5 h-5 mr-2"/>
                            {isUploadingImage ? 'Subiendo...' : 'Subir'}
                        </button>
                    </div>
                    {uploadError && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{uploadError}</p>}
                    {imageUrl && !uploadError && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Previsualización</label>
                            <img src={imageUrl} alt="Previsualización de la imagen" className="rounded-lg max-h-48 w-auto border-2 border-gray-300 dark:border-gray-600" />
                        </div>
                    )}
                </div>
                 <div className="flex justify-end space-x-2 pt-2">
                    {isEditing && (
                        <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                            Cancelar Edición
                        </button>
                    )}
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        {isEditing ? 'Actualizar Publicación' : 'Crear Publicación'}
                    </button>
                </div>
            </form>
        </div>
        {isImagePickerOpen && (
            <ImagePicker 
                onImageSelect={handleEmbedImage} 
                onClose={() => setImagePickerOpen(false)} 
            />
        )}
        </>
    );
};

export default PostEditor;
