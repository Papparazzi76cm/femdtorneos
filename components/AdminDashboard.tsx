import React, { useState, useCallback, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { eventService } from '../services/eventService';
import { teamService } from '../services/teamService';
import { participantService } from '../services/participantService';
import { postService } from '../services/postService';
import { storageService } from '../services/storageService';
import { sponsorService } from '../services/sponsorService';
import { FileObject } from '@supabase/storage-js';
import { ImageIcon, SparklesIcon, SearchIcon, MapPinIcon, BrainIcon, CalendarIcon, TrashIcon, PencilIcon, UsersIcon, UserAddIcon, UploadIcon, ClipboardCopyIcon, StarIcon } from './icons';
import PostEditor from './PostEditor';
import EventEditor from './EventEditor';
import { CalendarEvent, Team, Participant, BlogPost, Sponsor } from '../types';

const ToolCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6">
        <div className="flex items-center mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2 rounded-lg mr-4">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
        <div>{children}</div>
    </div>
);

interface StorageBucketManagerProps {
    bucketId: string;
    title: string;
}

const StorageBucketManager: React.FC<StorageBucketManagerProps> = ({ bucketId, title }) => {
    const [files, setFiles] = useState<FileObject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fileList = await storageService.listFiles(bucketId);
            setFiles(fileList);
        } catch (e: any) {
            const err = e as Error;
            console.error(`Error loading files for ${bucketId}:`, err);
            if (err.message.toLowerCase().includes('bucket not found')) {
                const bucketInstructions = `El bucket de almacenamiento "${bucketId}" no se ha encontrado.

Para solucionarlo:
1. Ve a la sección 'Storage' de tu proyecto Supabase.
2. Haz clic en 'New Bucket'.
3. Introduce el nombre del bucket: ${bucketId}
4. Asegúrate de que la opción 'Public bucket' está activada.
5. Haz clic en 'Create Bucket'.`;
                setError(bucketInstructions);
            } else {
                setError(`Error al cargar archivos: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, [bucketId]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await storageService.uploadFile(bucketId, file);
            await loadFiles(); // Refresh file list
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsUploading(false);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDeleteFile = async (filePath: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${filePath}"? Esta acción no se puede deshacer.`)) {
            try {
                await storageService.deleteFile(bucketId, filePath);
                await loadFiles();
            } catch (error) {
                alert((error as Error).message);
            }
        }
    };

    const handleCopyUrl = (filePath: string) => {
        const url = storageService.getPublicUrl(bucketId, filePath);
        navigator.clipboard.writeText(url).then(() => {
            alert('URL copiada al portapapeles.');
        }, () => {
            alert('No se pudo copiar la URL.');
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                {!error && (
                    <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center">
                        <UploadIcon className="w-5 h-5 mr-2" />
                        Subir
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                    </label>
                )}
            </div>
            {isUploading && <p className="text-center text-emerald-500 dark:text-emerald-400 my-2">Subiendo archivo...</p>}
            {error ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg">
                    <h4 className="font-bold text-md mb-2">Error de Configuración del Bucket</h4>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md text-xs whitespace-pre-wrap font-mono">{error}</pre>
                </div>
            ) : isLoading ? <p className="text-center">Cargando archivos...</p> : (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {files.length > 0 ? files.map(file => (
                        <li key={file.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md text-sm">
                            <span className="truncate pr-2" title={file.name}>{file.name}</span>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button onClick={() => handleCopyUrl(file.name)} className="p-1 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300" title="Copiar URL"><ClipboardCopyIcon className="w-5 h-5" /></button>
                                <button onClick={() => handleDeleteFile(file.name)} className="p-1 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300" title="Eliminar"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </li>
                    )) : <p className="text-gray-500 dark:text-gray-400 text-center py-4">No hay archivos en este bucket.</p>}
                </ul>
            )}
        </div>
    );
};


const AdminDashboard: React.FC = () => {
    // State for AI tools
    const [imagePrompt, setImagePrompt] = useState('Un disparo dinámico de un futbolista marcando un gol, con iluminación cinematográfica');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [searchQuery, setSearchQuery] = useState('últimas noticias de fichajes en La Liga');
    const [searchResult, setSearchResult] = useState<{text: string, sources: any[]} | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [mapsQuery, setMapsQuery] = useState('mejores academias de fútbol base cerca de Barcelona');
    const [mapsResult, setMapsResult] = useState<{text: string, sources: any[]} | null>(null);
    const [isSearchingMaps, setIsSearchingMaps] = useState(false);
    const [complexQuery, setComplexQuery] = useState('Analiza la evolución táctica de la formación 4-3-3 en la última década y sugiere ejercicios de entrenamiento innovadores para que los jugadores jóvenes la dominen.');
    const [complexResult, setComplexResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // State for Data Management
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
    const [newParticipantName, setNewParticipantName] = useState('');
    const [newParticipantTeam, setNewParticipantTeam] = useState<number | ''>('');
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

    const [isTeamFormVisible, setIsTeamFormVisible] = useState(false);
    const [isParticipantFormVisible, setIsParticipantFormVisible] = useState(false);
    const [isSponsorFormVisible, setIsSponsorFormVisible] = useState(false);

    const initialNewTeamState: Omit<Team, 'id'> = {
        name: '', logo_url: '', localidad: '', provincia: '', fecha_alta: '', telefono: '', correo: '', uniforme: ''
    };
    const [newTeamData, setNewTeamData] = useState(initialNewTeamState);
    
    const initialNewSponsorState: Omit<Sponsor, 'id'> = {
        name: '', logo_url: '', website_url: '', category: 'Colaborador'
    };
    const [newSponsorData, setNewSponsorData] = useState(initialNewSponsorState);


    // State for setup errors
    const [setupError, setSetupError] = useState<string | null>(null);


    const refreshData = useCallback(async () => {
        try {
            // Check all services to ensure tables exist
            const [eventsData, teamsData, participantsData, postsData, sponsorsData] = await Promise.all([
                eventService.getEvents(),
                teamService.getTeams(),
                participantService.getParticipants(),
                postService.getPosts(),
                sponsorService.getSponsors(),
            ]);
            
            setEvents(eventsData);
            setTeams(teamsData);
            setParticipants(participantsData);
            setPosts(postsData);
            setSponsors(sponsorsData);
            setSetupError(null); // Clear error on success
        } catch (e: any) {
            const error = e as Error;
            console.error("Dashboard data loading error:", error);
            if (error.message.toLowerCase().includes('does not exist') || error.message.toLowerCase().includes('could not find the table') || error.message.toLowerCase().includes('rls')) {
                const instructions = `¡Atención! Parece que tu base de datos o almacenamiento no están configurados correctamente.
Por favor, ejecuta el siguiente script SQL completo en el Editor de SQL de tu proyecto Supabase para solucionarlo.

-- =================================================================
-- SCRIPT DE CONFIGURACIÓN COMPLETO PARA SUPABASE
-- =================================================================

-- PASO 1: CREACIÓN DE TABLAS (SI NO EXISTEN)
CREATE TABLE IF NOT EXISTS public.teams (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT NOT NULL, logo_url TEXT, localidad TEXT, provincia TEXT, fecha_alta DATE, telefono TEXT, correo TEXT, uniforme TEXT);
CREATE TABLE IF NOT EXISTS public.participants (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT NOT NULL, team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS public.events (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title TEXT NOT NULL, description TEXT, start TIMESTAMPTZ NOT NULL, "end" TIMESTAMPTZ NOT NULL, type TEXT, team_ids BIGINT[]);
CREATE TABLE IF NOT EXISTS public.posts (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title TEXT NOT NULL, description TEXT, image_url TEXT, author TEXT, date TEXT, content TEXT);
CREATE TABLE IF NOT EXISTS public.sponsors (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT NOT NULL, logo_url TEXT, website_url TEXT, category TEXT);

-- PASO 2: CARGA INICIAL DE DATOS DE EQUIPOS
-- Limpiamos la tabla de equipos para empezar de cero.
DELETE FROM public.teams;

-- Insertamos la lista completa de equipos.
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('ACD Alcova', 'https://ui-avatars.com/api/?name=ACD&background=10b981&color=fff&size=128', 'Comerma Vello', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('AD Colmenar Viejo', 'https://ui-avatars.com/api/?name=AD%20&background=10b981&color=fff&size=128', 'Colmenar Viejo', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('AD Hogar Alcarreño', 'https://ui-avatars.com/api/?name=AD%20&background=10b981&color=fff&size=128', 'Guadalajara', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('AD Hogar Artea', 'https://ui-avatars.com/api/?name=AD%20&background=10b981&color=fff&size=128', 'Lemoa', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('AD Mérida, SAD', 'https://ui-avatars.com/api/?name=AD%20&background=10b981&color=fff&size=128', 'Mérida', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('AD Villa Rosa', 'https://ui-avatars.com/api/?name=AD%20&background=10b981&color=fff&size=128', 'Hortaleza', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Arandina, CF', 'https://ui-avatars.com/api/?name=Ara&background=10b981&color=fff&size=128', 'Aranda de Duero', 'Burgos');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Astrabuduako, FT', 'https://ui-avatars.com/api/?name=Ast&background=10b981&color=fff&size=128', 'Vizcaya', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Atarcon, CF', 'https://ui-avatars.com/api/?name=Ata&background=10b981&color=fff&size=128', 'sijes', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Atlético Aranda 1503, CF', 'https://ui-avatars.com/api/?name=Atl&background=10b981&color=fff&size=128', 'Aranda de Duero', 'Burgos');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Atlético de Madrid, SAD', 'https://ui-avatars.com/api/?name=Atl&background=10b981&color=fff&size=128', 'Madrid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Atlético Tordesillas', 'https://ui-avatars.com/api/?name=Atl&background=10b981&color=fff&size=128', 'Tordesillas', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Baskauri, FE', 'https://ui-avatars.com/api/?name=Bas&background=10b981&color=fff&size=128', 'Basauri', 'Vizcaya');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Betis Pegaso, CF', 'https://ui-avatars.com/api/?name=Bet&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Betis, CF', 'https://ui-avatars.com/api/?name=Bet&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CA Osasuna', 'https://ui-avatars.com/api/?name=CA%20&background=10b981&color=fff&size=128', 'Pamplona', 'Navarra');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Cagcacol, CF', 'https://ui-avatars.com/api/?name=Cag&background=10b981&color=fff&size=128', 'Burgos', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD ADZ Zamora', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Zamora', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Alba Castellae', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Burgos', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Aranda Riber', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Aranda de Duero', 'Burgos');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Aranda Riber B', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Aranda de Duero', 'Burgos');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Aranda Riber C', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Aranda de Duero', 'Burgos');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Arcade', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Arcade', 'Pontevedra');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Arces', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Arévalo, CF', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Arévalo', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Atlético de Laguna', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Laguna de Duero', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Atlético Pinilla', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'León', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Benavente', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Benavente', 'Zamora');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Boecillo', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Boecillo', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Bosco de Arévalo', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Arévalo', 'Ávila');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Bridgestone', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'A Coruña', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Calasanz', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'A Coruña', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Cantalejo', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Cantalejo', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Claret', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Segovia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Contrafuertes', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Ponferrada', 'León');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Diocesano', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Don Bosco', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Flores del Sil', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Ponferrada', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Gauza Berriok', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Artachin', 'Navarra');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Golmayo Camaretas', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Golmayo', 'Soria');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Groggys Gamonal', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Burgos', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Guijuelo', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Guijuelo', 'Salamanca');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Inter Vista Alegre', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Burgos', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Iscar', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Iscar', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Juventud Rondilla', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Kirol Sport', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'A Coruña', 'A Coruña');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD La Amistad 2000', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Zamora', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD La Cistérniga', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Cistérniga', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD La Virgen del Camino', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'La Virgen del Camino', 'León');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Laguna', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Laguna de Duero', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Leganés, SAD', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Leganés', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Mainha Sport', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Solía de la Mainha', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Monte', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Salcedo', 'Pontevedra');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Montes Soccer Feminas', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Monte', 'Cantabria');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Monteresma', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valverde del Majano', 'Segovia');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Numancia, SAD', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Soria', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Olímpico de León', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'León', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Pan y Guindas', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Palencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Parquesol', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Parquesol B', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Quintanar', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Segovia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Raudense', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Roa', 'Burgos');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Renedo', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Renedo de Esgueva', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Ribert', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Salamanca', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Rioseco', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Medina de Rioseco', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD San Agustín', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD San Felices', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Soria', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD San Juanillo', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Palencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD San Lorenzo', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'León', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD San Pedro Buprecon', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Burgos', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD San Roque Balompié', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Sevilla', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD San Roque Peñafiel', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Peñafiel', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD San Telmo', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Palencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Toledo, SAD', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Toledo', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Unión Telsat/Bernardos', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Bernardos', 'Segovia');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Viana de Cega', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Viana de Cega', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Victoria', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Villa de Simancas', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Simancas', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Villamayor', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Villamayor', 'Salamanca');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Zafiro', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CD Zona Norte', 'https://ui-avatars.com/api/?name=CD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CDCD Diocesanos', 'https://ui-avatars.com/api/?name=CDC&background=10b981&color=fff&size=128', 'Ávila', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CDCF Dueñas', 'https://ui-avatars.com/api/?name=CDC&background=10b981&color=fff&size=128', 'Dueñas', 'Palencia');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CDE Paracuellos Sport', 'https://ui-avatars.com/api/?name=CDE&background=10b981&color=fff&size=128', 'Paracuellos de Jarama', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CDF Ávila Atlético', 'https://ui-avatars.com/api/?name=CDF&background=10b981&color=fff&size=128', 'Ávila', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CDF La Robla', 'https://ui-avatars.com/api/?name=CDF&background=10b981&color=fff&size=128', 'La Robla', 'León');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CDF San Antonio', 'https://ui-avatars.com/api/?name=CDF&background=10b981&color=fff&size=128', 'Palencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CF Inter San José', 'https://ui-avatars.com/api/?name=CF%20&background=10b981&color=fff&size=128', 'Valencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CF Santo Domingo Juventud', 'https://ui-avatars.com/api/?name=CF%20&background=10b981&color=fff&size=128', 'Palencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CF Sporting Beniferri', 'https://ui-avatars.com/api/?name=CF%20&background=10b981&color=fff&size=128', 'Valencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CF Trival Valderas', 'https://ui-avatars.com/api/?name=CF%20&background=10b981&color=fff&size=128', 'Alcorcón', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Chinese Football Boy', 'https://ui-avatars.com/api/?name=Chi&background=10b981&color=fff&size=128', 'Beijing', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('CyD Leonesa, SAD', 'https://ui-avatars.com/api/?name=CyD&background=10b981&color=fff&size=128', 'León', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Deportivo Alavés, SAD', 'https://ui-avatars.com/api/?name=Dep&background=10b981&color=fff&size=128', 'Vitoria', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('DVT Madrid', 'https://ui-avatars.com/api/?name=DVT&background=10b981&color=fff&size=128', 'Madrid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('ED Linko', 'https://ui-avatars.com/api/?name=ED%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('ED Val Miñor Nigran', 'https://ui-avatars.com/api/?name=ED%20&background=10b981&color=fff&size=128', 'Nigrán', 'Pontevedra');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('ED Xuventude Oroso', 'https://ui-avatars.com/api/?name=ED%20&background=10b981&color=fff&size=128', 'Oroso', 'A Coruña');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('FBCD Catarroja', 'https://ui-avatars.com/api/?name=FBC&background=10b981&color=fff&size=128', 'Catarroja', 'Valencia');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('FC Barcelona', 'https://ui-avatars.com/api/?name=FC%20&background=10b981&color=fff&size=128', 'Barcelona', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('FC Porto', 'https://ui-avatars.com/api/?name=FC%20&background=10b981&color=fff&size=128', 'Oporto', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Gernika Club', 'https://ui-avatars.com/api/?name=Ger&background=10b981&color=fff&size=128', 'Gernika', 'Vizcaya');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Getafe, CF SAD', 'https://ui-avatars.com/api/?name=Get&background=10b981&color=fff&size=128', 'Getafe', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Gimnástica Medinense', 'https://ui-avatars.com/api/?name=Gim&background=10b981&color=fff&size=128', 'Medina del Campo', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Gimnástica Segoviana, CF', 'https://ui-avatars.com/api/?name=Gim&background=10b981&color=fff&size=128', 'Segovia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Girona, FC SAD', 'https://ui-avatars.com/api/?name=Gir&background=10b981&color=fff&size=128', 'Girona', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Las Rozas, CF SAD', 'https://ui-avatars.com/api/?name=Las&background=10b981&color=fff&size=128', 'Madrid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Moralzarzal, CF', 'https://ui-avatars.com/api/?name=Mor&background=10b981&color=fff&size=128', 'Moralzarzal', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Pabellón, CF', 'https://ui-avatars.com/api/?name=Pab&background=10b981&color=fff&size=128', 'Ourense', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Palencia, CF SAD', 'https://ui-avatars.com/api/?name=Pal&background=10b981&color=fff&size=128', 'Palencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('PSG', 'https://ui-avatars.com/api/?name=PSG&background=10b981&color=fff&size=128', 'Paris', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Puente Castro, FC', 'https://ui-avatars.com/api/?name=Pue&background=10b981&color=fff&size=128', 'León', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Racing Lermeño, CF', 'https://ui-avatars.com/api/?name=Rac&background=10b981&color=fff&size=128', 'Lerma', 'Burgos');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Racing Valdestillas', 'https://ui-avatars.com/api/?name=Rac&background=10b981&color=fff&size=128', 'Valdestillas', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Rayo Vallecano, SAD', 'https://ui-avatars.com/api/?name=Ray&background=10b981&color=fff&size=128', 'Madrid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('RC Alcobendas', 'https://ui-avatars.com/api/?name=RC%20&background=10b981&color=fff&size=128', 'Alcobendas', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('RC Celta de Vigo, SAD', 'https://ui-avatars.com/api/?name=RC%20&background=10b981&color=fff&size=128', 'Vigo', 'Pontevedra');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('RC Deportivo, SAD', 'https://ui-avatars.com/api/?name=RC%20&background=10b981&color=fff&size=128', 'A Coruña', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('RCD Espanyol, SAD', 'https://ui-avatars.com/api/?name=RCD&background=10b981&color=fff&size=128', 'Barcelona', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('RCD Navarrés', 'https://ui-avatars.com/api/?name=RCD&background=10b981&color=fff&size=128', 'Nava del Rey', 'Valladolid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Real Ávila, CF SAD', 'https://ui-avatars.com/api/?name=Rea&background=10b981&color=fff&size=128', 'Ávila', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Real Oviedo, SAD', 'https://ui-avatars.com/api/?name=Rea&background=10b981&color=fff&size=128', 'Oviedo', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Real Racing Club, SAD', 'https://ui-avatars.com/api/?name=Rea&background=10b981&color=fff&size=128', 'Santander', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Real Sociedad, SAD', 'https://ui-avatars.com/api/?name=Rea&background=10b981&color=fff&size=128', 'San Sebastián', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Real Valladolid, CF SAD', 'https://ui-avatars.com/api/?name=Rea&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Roma, FC', 'https://ui-avatars.com/api/?name=Rom&background=10b981&color=fff&size=128', 'Roma', 'Vizcaya');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Ronda Oeste, CF', 'https://ui-avatars.com/api/?name=Ron&background=10b981&color=fff&size=128', 'Salamanca', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('RS Gimnástica Torrelavega', 'https://ui-avatars.com/api/?name=RS%20&background=10b981&color=fff&size=128', 'Torrelavega', 'Santander');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('RSD Alcalá, SAD', 'https://ui-avatars.com/api/?name=RSD&background=10b981&color=fff&size=128', 'Alcalá de Henares', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Salamanca, CF UDS', 'https://ui-avatars.com/api/?name=Sal&background=10b981&color=fff&size=128', 'Salamanca', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Santutxu, FC', 'https://ui-avatars.com/api/?name=San&background=10b981&color=fff&size=128', 'Bilbao', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SC Braga', 'https://ui-avatars.com/api/?name=SC%20&background=10b981&color=fff&size=128', 'Braga', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SD Eibar, SAD', 'https://ui-avatars.com/api/?name=SD%20&background=10b981&color=fff&size=128', 'Eibar', 'Guipúzcoa');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SD Indautxu', 'https://ui-avatars.com/api/?name=SD%20&background=10b981&color=fff&size=128', 'Bilbao', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SD Logroñés', 'https://ui-avatars.com/api/?name=SD%20&background=10b981&color=fff&size=128', 'Logroño', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SD Leioa', 'https://ui-avatars.com/api/?name=SD%20&background=10b981&color=fff&size=128', 'Leioa', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SD Nardin O Freixo', 'https://ui-avatars.com/api/?name=SD%20&background=10b981&color=fff&size=128', 'Nardin', 'A Coruña');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SD Ponferradina, SAD', 'https://ui-avatars.com/api/?name=SD%20&background=10b981&color=fff&size=128', 'Ponferrada', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SD Beheko Sport', 'https://ui-avatars.com/api/?name=SD%20&background=10b981&color=fff&size=128', 'Barakaldo', 'Vizcaya');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SD Ribaodeo', 'https://ui-avatars.com/api/?name=SD%20&background=10b981&color=fff&size=128', 'Ribaodeo', 'Lugo');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Sevilla, FC SAD', 'https://ui-avatars.com/api/?name=Sev&background=10b981&color=fff&size=128', 'Sevilla', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('SL Benfica', 'https://ui-avatars.com/api/?name=SL%20&background=10b981&color=fff&size=128', 'Lisboa', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Tecnificación JA', 'https://ui-avatars.com/api/?name=Tec&background=10b981&color=fff&size=128', 'Carral', 'A Coruña');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('TSK Roces', 'https://ui-avatars.com/api/?name=TSK&background=10b981&color=fff&size=128', 'Gijón', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Belén', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD El Espinar', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Segovia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Fuente de Cantos', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Fuente de Cantos', 'Badajoz');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Roteña de Duero', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Zamora', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD San Lorenzo', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Zamora', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Santa Marta', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Santa Marta de Tormes', 'Salamanca');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Sur', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Valladolid', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Talamanca', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Talamanca', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Talamanca A', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Talamanca', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Talamanca B', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Talamanca', 'Madrid');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('UD Toresana', 'https://ui-avatars.com/api/?name=UD%20&background=10b981&color=fff&size=128', 'Toro', 'Zamora');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Unami, CP', 'https://ui-avatars.com/api/?name=Una&background=10b981&color=fff&size=128', 'Segovia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Unionistas, CF', 'https://ui-avatars.com/api/?name=Uni&background=10b981&color=fff&size=128', 'Salamanca', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Ural, CF', 'https://ui-avatars.com/api/?name=Ura&background=10b981&color=fff&size=128', 'A Coruña', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Urduliz, FT', 'https://ui-avatars.com/api/?name=Urd&background=10b981&color=fff&size=128', 'Urduliz', 'Vizcaya');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Vadillos, CF', 'https://ui-avatars.com/api/?name=Vad&background=10b981&color=fff&size=128', 'Burgos', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Valencia, CF SAD', 'https://ui-avatars.com/api/?name=Val&background=10b981&color=fff&size=128', 'Valencia', NULL);
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Villarreal, CF SAD', 'https://ui-avatars.com/api/?name=Vil&background=10b981&color=fff&size=128', 'Villarreal', 'Castellón');
INSERT INTO public.teams (name, logo_url, localidad, provincia) VALUES ('Zamora, CF', 'https://ui-avatars.com/api/?name=Zam&background=10b981&color=fff&size=128', 'Zamora', NULL);

-- PASO 3: HABILITAR ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- PASO 4: LIMPIAR POLÍTICAS ANTIGUAS (BUENA PRÁCTICA)
DROP POLICY IF EXISTS "Public can view all" ON public.posts;
DROP POLICY IF EXISTS "Authenticated can manage all" ON public.posts;
DROP POLICY IF EXISTS "Public can view all" ON public.events;
DROP POLICY IF EXISTS "Authenticated can manage all" ON public.events;
DROP POLICY IF EXISTS "Public can view all" ON public.teams;
DROP POLICY IF EXISTS "Authenticated can manage all" ON public.teams;
DROP POLICY IF EXISTS "Public can view all" ON public.participants;
DROP POLICY IF EXISTS "Authenticated can manage all" ON public.participants;
DROP POLICY IF EXISTS "Public can view all" ON public.sponsors;
DROP POLICY IF EXISTS "Authenticated can manage all" ON public.sponsors;

-- PASO 5: CREAR POLÍTICAS DE ACCESO EXPLÍCITAS Y SEGURAS
CREATE POLICY "Public can view all" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage all" ON public.posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view all" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage all" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view all" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage all" ON public.teams FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view all" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage all" ON public.participants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view all" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage all" ON public.sponsors FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =================================================================
-- PASO 6: POLÍTICAS DE ACCESO PARA ALMACENAMIENTO (STORAGE)
-- =================================================================
-- Asegúrate de haber CREADO los buckets ('imagenes-web', 'imagenes-torneos', 'carteles') y que sean PÚBLICOS.

DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated write access to buckets" ON storage.objects;

CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access to buckets" ON storage.objects FOR ALL TO authenticated USING (true) WITH CHECK (true);`;
                setSetupError(instructions);
            } else {
                setSetupError(`Error al cargar los datos del panel: ${error.message}`);
            }
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Handlers for Events
    const handleEventSave = () => {
        refreshData();
        setEditingEvent(null);
    };
    const handleDeleteEvent = async (eventId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            await eventService.deleteEvent(eventId);
            refreshData();
        }
    };

    // Handlers for Posts
    const handlePostSave = () => {
        refreshData();
        setEditingPost(null);
    };
    
    const handleDeletePost = async (postId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            await postService.deletePost(postId);
            refreshData();
        }
    };


    // Handlers for Teams
    const handleTeamSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTeam) {
            await teamService.updateTeam(editingTeam);
        } else {
            await teamService.addTeam(newTeamData);
        }
        setNewTeamData(initialNewTeamState);
        setEditingTeam(null);
        setIsTeamFormVisible(false);
        refreshData();
    };

    const handleNewTeamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTeamData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditingTeamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingTeam) return;
        const { name, value } = e.target;
        setEditingTeam(prev => ({ ...prev!, [name]: value }));
    };


    const handleDeleteTeam = async (teamId: number) => {
        if (window.confirm('¿Estás seguro? Esto eliminará también a todos los participantes de este equipo.')) {
            await teamService.deleteTeam(teamId);
            refreshData();
        }
    };

    // Handlers for Participants
    const handleParticipantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingParticipant) {
            await participantService.updateParticipant(editingParticipant);
        } else {
            if (!newParticipantTeam) {
                alert('Por favor, selecciona un equipo.');
                return;
            }
            await participantService.addParticipant({ name: newParticipantName, team_id: newParticipantTeam });
        }
        setNewParticipantName('');
        setNewParticipantTeam('');
        setEditingParticipant(null);
        setIsParticipantFormVisible(false);
        refreshData();
    };

    const handleDeleteParticipant = async (participantId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este participante?')) {
            await participantService.deleteParticipant(participantId);
            refreshData();
        }
    };

    // Handlers for Sponsors
    const handleSponsorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSponsor) {
            await sponsorService.updateSponsor(editingSponsor);
        } else {
            await sponsorService.addSponsor(newSponsorData);
        }
        setNewSponsorData(initialNewSponsorState);
        setEditingSponsor(null);
        setIsSponsorFormVisible(false);
        refreshData();
    };
    
    const handleNewSponsorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSponsorData(prev => ({...prev, [name]: value}));
    };

    const handleEditingSponsorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingSponsor) return;
        const { name, value } = e.target;
        setEditingSponsor(prev => ({...prev!, [name]: value}));
    };

    const handleDeleteSponsor = async (sponsorId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este patrocinador?')) {
            await sponsorService.deleteSponsor(sponsorId);
            refreshData();
        }
    };


    // Handlers for AI tools
    const handleGenerateImage = async () => {
        if (!imagePrompt) return;
        setIsGeneratingImage(true);
        setGeneratedImageUrl('');
        try {
            const url = await geminiService.generateImage(imagePrompt, aspectRatio);
            setGeneratedImageUrl(url);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsGeneratingImage(false);
        }
    };
    
    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        setSearchResult(null);
        try {
            const result = await geminiService.fetchWithSearch(searchQuery);
            setSearchResult(result);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsSearching(false);
        }
    };

    const handleMapsSearch = () => {
        if (!mapsQuery) return;
        setIsSearchingMaps(true);
        setMapsResult(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const result = await geminiService.fetchWithMaps(mapsQuery, position.coords.latitude, position.coords.longitude);
                    setMapsResult(result);
                } catch (error) {
                    alert((error as Error).message);
                } finally {
                    setIsSearchingMaps(false);
                }
            },
            (error) => {
                alert("La geolocalización es necesaria para esta función. Por favor, actívala en tu navegador.");
                setIsSearchingMaps(false);
            }
        );
    };
    
    const handleAnalyze = async () => {
        if (!complexQuery) return;
        setIsAnalyzing(true);
        setComplexResult('');
        try {
            const result = await geminiService.analyzeComplexQuery(complexQuery);
            setComplexResult(result);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Tu centro de mando con IA para la gestión de contenido y datos.</p>
            
            {setupError && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-500 text-red-800 dark:text-red-200 p-4 rounded-lg mb-8">
                    <h3 className="font-bold text-lg mb-2">Error de Configuración de Base de Datos Detectado</h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm whitespace-pre-wrap font-mono overflow-x-auto">{setupError}</pre>
                </div>
            )}

            {!setupError && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ToolCard icon={<CalendarIcon className="w-6 h-6" />} title="Gestión de Eventos" description="Crea, edita y elimina eventos del calendario.">
                        <EventEditor eventToEdit={editingEvent} onSave={handleEventSave} onCancel={() => setEditingEvent(null)} allTeams={teams} />
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">Eventos Actuales</h4>
                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map(event => (
                                    <li key={event.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                                        <div>
                                            <p className="font-semibold">{event.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(event.start).toLocaleDateString('es-ES')}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => setEditingEvent(event)} className="p-1 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"><PencilIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteEvent(event.id)} className="p-1 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ToolCard>

                    <div className="lg:col-span-1 space-y-8">
                        <PostEditor postToEdit={editingPost} onSave={handlePostSave} onCancel={() => setEditingPost(null)} generatedImageUrl={generatedImageUrl} />
                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6">
                             <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">Histórico de Publicaciones</h4>
                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {posts.map(post => (
                                    <li key={post.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                                        <div>
                                            <p className="font-semibold">{post.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{post.date}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => setEditingPost(post)} className="p-1 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"><PencilIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeletePost(post.id)} className="p-1 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-6 border-t border-gray-200 dark:border-gray-700 pt-8">Gestor de Archivos</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <StorageBucketManager bucketId="imagenes-torneos" title="Imágenes Torneos" />
                    <StorageBucketManager bucketId="imagenes-web" title="Imágenes Web" />
                    <StorageBucketManager bucketId="carteles" title="Carteles" />
                </div>

                <h2 className="text-3xl font-bold mb-6 border-t border-gray-200 dark:border-gray-700 pt-8">Gestión de la Base de Datos</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ToolCard icon={<UsersIcon className="w-6 h-6" />} title="Gestión de Equipos" description="Añade, edita o elimina equipos.">
                        {!isTeamFormVisible && (
                             <button 
                                onClick={() => { setEditingTeam(null); setNewTeamData(initialNewTeamState); setIsTeamFormVisible(true); }}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105"
                            >
                                <UserAddIcon className="w-5 h-5 mr-2" />
                                Añadir Nuevo Equipo
                            </button>
                        )}
                        {isTeamFormVisible && (
                            <form onSubmit={handleTeamSubmit} className="space-y-3 animate-fade-in-down">
                                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" name="name" placeholder="Nombre del Equipo" required value={editingTeam ? editingTeam.name : newTeamData.name} onChange={editingTeam ? handleEditingTeamChange : handleNewTeamChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="text" name="logo_url" placeholder="URL del Logo" value={editingTeam ? editingTeam.logo_url : newTeamData.logo_url} onChange={editingTeam ? handleEditingTeamChange : handleNewTeamChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="text" name="localidad" placeholder="Localidad" value={editingTeam ? editingTeam.localidad : newTeamData.localidad} onChange={editingTeam ? handleEditingTeamChange : handleNewTeamChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="text" name="provincia" placeholder="Provincia" value={editingTeam ? editingTeam.provincia : newTeamData.provincia} onChange={editingTeam ? handleEditingTeamChange : handleNewTeamChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="date" name="fecha_alta" placeholder="Fecha de Alta" value={editingTeam ? editingTeam.fecha_alta : newTeamData.fecha_alta} onChange={editingTeam ? handleEditingTeamChange : handleNewTeamChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="text" name="telefono" placeholder="Teléfono" value={editingTeam ? editingTeam.telefono : newTeamData.telefono} onChange={editingTeam ? handleEditingTeamChange : handleNewTeamChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="email" name="correo" placeholder="Correo" value={editingTeam ? editingTeam.correo : newTeamData.correo} onChange={editingTeam ? handleEditingTeamChange : handleNewTeamChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 sm:col-span-2" />
                                    <textarea name="uniforme" placeholder="Descripción del Uniforme" value={editingTeam ? editingTeam.uniforme : newTeamData.uniforme} onChange={editingTeam ? handleEditingTeamChange : handleNewTeamChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 sm:col-span-2" rows={2} />
                                </fieldset>

                                <button type="submit" className="w-full bg-emerald-600 p-2 rounded-md font-bold text-white">{editingTeam ? 'Actualizar Equipo' : 'Añadir Equipo'}</button>
                                <button type="button" onClick={() => { setIsTeamFormVisible(false); setEditingTeam(null); }} className="w-full bg-gray-500 dark:bg-gray-600 p-2 rounded-md text-white">Cancelar</button>
                            </form>
                        )}
                        <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                            {teams.map(team => (
                                <li key={team.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                                    <div className="flex items-center">
                                        <img src={team.logo_url} alt={team.name} className="w-6 h-6 rounded-full mr-2 object-cover bg-gray-300" />
                                        <span>{team.name}</span>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => { setEditingTeam(team); setIsTeamFormVisible(true); }} className="p-1 text-blue-500 dark:text-blue-400"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteTeam(team.id)} className="p-1 text-red-500 dark:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ToolCard>
                    <ToolCard icon={<UserAddIcon className="w-6 h-6" />} title="Gestión de Participantes" description="Añade, edita o elimina participantes.">
                         {!isParticipantFormVisible && (
                             <button 
                                onClick={() => { setEditingParticipant(null); setNewParticipantName(''); setNewParticipantTeam(''); setIsParticipantFormVisible(true); }}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105"
                            >
                                <UserAddIcon className="w-5 h-5 mr-2" />
                                Añadir Participante
                            </button>
                        )}
                        {isParticipantFormVisible && (
                            <form onSubmit={handleParticipantSubmit} className="space-y-3 animate-fade-in-down">
                                <input
                                    type="text"
                                    placeholder="Nombre del Participante"
                                    value={editingParticipant ? editingParticipant.name : newParticipantName}
                                    onChange={e => editingParticipant ? setEditingParticipant({...editingParticipant, name: e.target.value}) : setNewParticipantName(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600"
                                />
                                <select
                                    value={editingParticipant ? editingParticipant.team_id : newParticipantTeam}
                                    onChange={e => editingParticipant ? setEditingParticipant({...editingParticipant, team_id: Number(e.target.value)}) : setNewParticipantTeam(Number(e.target.value))}
                                    className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="">Selecciona un equipo</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <button type="submit" className="w-full bg-emerald-600 p-2 rounded-md font-bold text-white">{editingParticipant ? 'Actualizar Participante' : 'Añadir Participante'}</button>
                                <button type="button" onClick={() => { setIsParticipantFormVisible(false); setEditingParticipant(null); }} className="w-full bg-gray-500 dark:bg-gray-600 p-2 rounded-md text-white">Cancelar</button>
                            </form>
                        )}
                        <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                            {participants.map(p => (
                                <li key={p.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                                    <div>
                                        <p>{p.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{teams.find(t => t.id === p.team_id)?.name || 'Sin equipo'}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => { setEditingParticipant(p); setIsParticipantFormVisible(true); }} className="p-1 text-blue-500 dark:text-blue-400"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteParticipant(p.id)} className="p-1 text-red-500 dark:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ToolCard>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ToolCard icon={<StarIcon className="w-6 h-6" />} title="Gestión de Patrocinadores" description="Añade y gestiona los patrocinadores del torneo.">
                         {!isSponsorFormVisible && (
                            <button 
                                onClick={() => { setEditingSponsor(null); setNewSponsorData(initialNewSponsorState); setIsSponsorFormVisible(true); }}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105"
                            >
                                <StarIcon className="w-5 h-5 mr-2" />
                                Añadir Patrocinador
                            </button>
                        )}
                        {isSponsorFormVisible && (
                            <form onSubmit={handleSponsorSubmit} className="space-y-3 animate-fade-in-down">
                                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" name="name" placeholder="Nombre del Patrocinador" required value={editingSponsor ? editingSponsor.name : newSponsorData.name} onChange={editingSponsor ? handleEditingSponsorChange : handleNewSponsorChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="text" name="logo_url" placeholder="URL del Logo" required value={editingSponsor ? editingSponsor.logo_url : newSponsorData.logo_url} onChange={editingSponsor ? handleEditingSponsorChange : handleNewSponsorChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="text" name="website_url" placeholder="URL del Sitio Web (Opcional)" value={editingSponsor ? editingSponsor.website_url : newSponsorData.website_url} onChange={editingSponsor ? handleEditingSponsorChange : handleNewSponsorChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                    <input type="text" name="category" placeholder="Categoría (Ej: Principal)" value={editingSponsor ? editingSponsor.category : newSponsorData.category} onChange={editingSponsor ? handleEditingSponsorChange : handleNewSponsorChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" />
                                </fieldset>
                                <button type="submit" className="w-full bg-emerald-600 p-2 rounded-md font-bold text-white">{editingSponsor ? 'Actualizar Patrocinador' : 'Añadir Patrocinador'}</button>
                                <button type="button" onClick={() => { setIsSponsorFormVisible(false); setEditingSponsor(null); }} className="w-full bg-gray-500 dark:bg-gray-600 p-2 rounded-md text-white">Cancelar</button>
                            </form>
                        )}
                        <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                            {sponsors.map(sponsor => (
                                <li key={sponsor.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                                    <div className="flex items-center">
                                        <img src={sponsor.logo_url} alt={sponsor.name} className="h-6 w-auto mr-2 object-contain bg-gray-300 p-1 rounded" />
                                        <span>{sponsor.name}</span>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => { setEditingSponsor(sponsor); setIsSponsorFormVisible(true); }} className="p-1 text-blue-500 dark:text-blue-400"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteSponsor(sponsor.id)} className="p-1 text-red-500 dark:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ToolCard>
                </div>
              </>
            )}

            <h2 className="text-3xl font-bold mb-6 border-t border-gray-200 dark:border-gray-700 pt-8">Herramientas de Contenido IA</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ToolCard icon={<ImageIcon className="w-6 h-6" />} title="Generador de Imágenes IA" description="Crea imágenes espectaculares para tus publicaciones.">
                    <textarea
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="Ej: Un disparo dinámico de un futbolista marcando un gol, con iluminación cinematográfica"
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        rows={3}
                    />
                    <div className="flex items-center justify-between">
                        <select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="16:9">16:9 (Horizontal)</option>
                            <option value="9:16">9:16 (Vertical)</option>
                            <option value="1:1">1:1 (Cuadrado)</option>
                            <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                        </select>
                        <button onClick={handleGenerateImage} disabled={isGeneratingImage} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg flex items-center disabled:bg-gray-500">
                           <SparklesIcon className="w-5 h-5 mr-2" /> {isGeneratingImage ? 'Generando...' : 'Generar'}
                        </button>
                    </div>
                    {isGeneratingImage && <div className="text-center mt-4">Generando imagen... Esto puede tardar un momento.</div>}
                    {generatedImageUrl && <img src={generatedImageUrl} alt="Generated" className="mt-4 rounded-lg w-full" />}
                </ToolCard>
                
                <ToolCard icon={<BrainIcon className="w-6 h-6" />} title="Analizador de Consultas Complejas" description="Usa Gemini Pro con Modo Pensamiento para obtener análisis profundos.">
                     <textarea
                        value={complexQuery}
                        onChange={(e) => setComplexQuery(e.target.value)}
                        placeholder="Introduce una consulta compleja..."
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        rows={4}
                    />
                    <button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center disabled:bg-gray-500">
                        <BrainIcon className="w-5 h-5 mr-2" /> {isAnalyzing ? 'Analizando...' : 'Analizar con Pro'}
                    </button>
                    {isAnalyzing && <div className="text-center mt-4">Analizando tu consulta compleja... Esto puede llevar algo de tiempo.</div>}
                    {complexResult && <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md whitespace-pre-wrap">{complexResult}</div>}
                </ToolCard>

                <ToolCard icon={<SearchIcon className="w-6 h-6" />} title="Búsqueda Web en Directo" description="Obtén información actualizada para tus artículos usando la Búsqueda de Google.">
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Introduce un término de búsqueda"
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button onClick={handleSearch} disabled={isSearching} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center disabled:bg-gray-500">
                        <SearchIcon className="w-5 h-5 mr-2" /> {isSearching ? 'Buscando...' : 'Buscar'}
                    </button>
                    {searchResult && <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <p className="whitespace-pre-wrap">{searchResult.text}</p>
                        {searchResult.sources.length > 0 && <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <h4 className="font-bold">Fuentes:</h4>
                            <ul className="list-disc list-inside text-sm">
                                {searchResult.sources.map((s, i) => s.web && <li key={i}><a href={s.web.uri} target="_blank" rel="noopener noreferrer" className="text-emerald-500 dark:text-emerald-400 hover:underline">{s.web.title}</a></li>)}
                            </ul>
                        </div>}
                    </div>}
                </ToolCard>

                <ToolCard icon={<MapPinIcon className="w-6 h-6" />} title="Buscador de Sedes y Ubicaciones" description="Encuentra ubicaciones usando la conexión con Google Maps.">
                     <input
                        type="text"
                        value={mapsQuery}
                        onChange={(e) => setMapsQuery(e.target.value)}
                        placeholder="Ej: 'campos con iluminación para partidos nocturnos'"
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button onClick={handleMapsSearch} disabled={isSearchingMaps} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center disabled:bg-gray-500">
                        <MapPinIcon className="w-5 h-5 mr-2" /> {isSearchingMaps ? 'Buscando...' : 'Buscar en el Mapa'}
                    </button>
                    {mapsResult && <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <p className="whitespace-pre-wrap">{mapsResult.text}</p>
                        {mapsResult.sources.length > 0 && <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <h4 className="font-bold">Ubicaciones:</h4>
                            <ul className="list-disc list-inside text-sm">
                                {mapsResult.sources.map((s, i) => s.maps && <li key={i}><a href={s.maps.uri} target="_blank" rel="noopener noreferrer" className="text-emerald-500 dark:text-emerald-400 hover:underline">{s.maps.title}</a></li>)}
                            </ul>
                        </div>}
                    </div>}
                </ToolCard>
            </div>
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;