
import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeMuteIcon } from './icons';

const AudioPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isHovering, setIsHovering] = useState(false);

    const audioUrl = "https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/audios/Kick%20Off%20Dreams.mp3";

    useEffect(() => {
        // Cargar preferencias del usuario desde localStorage
        const savedVolume = localStorage.getItem('audio-volume');
        const savedMuted = localStorage.getItem('audio-muted');

        if (savedVolume) setVolume(parseFloat(savedVolume));
        if (savedMuted) setIsMuted(savedMuted === 'true');

        // Intentar autoplay para nuevos usuarios
        const hasVisited = localStorage.getItem('has-visited');
        if (!hasVisited && audioRef.current) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.log("Autoplay fue prevenido por el navegador.");
                setIsPlaying(false);
            });
            localStorage.setItem('has-visited', 'true');
        }
    }, []);
    
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            localStorage.setItem('audio-volume', volume.toString());
        }
    }, [volume]);

    useEffect(() => {
         if (audioRef.current) {
            audioRef.current.muted = isMuted;
            localStorage.setItem('audio-muted', isMuted.toString());
        }
    }, [isMuted]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if(isMuted && newVolume > 0) {
            setIsMuted(false);
        }
    };
    
    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div 
            className="fixed bottom-6 left-6 z-50 flex items-center space-x-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <audio ref={audioRef} src={audioUrl} loop />

            <button
                onClick={togglePlayPause}
                className="bg-gray-800/80 text-white rounded-full p-3 shadow-lg hover:bg-emerald-600 transition-all duration-300 backdrop-blur-sm"
                aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
            >
                {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </button>
            
            <div className={`flex items-center space-x-2 transition-all duration-300 overflow-hidden ${isHovering ? 'max-w-xs' : 'max-w-0'}`}>
                <button 
                    onClick={toggleMute}
                    className="text-gray-200 hover:text-white"
                    aria-label={isMuted ? 'Quitar silencio' : 'Silenciar'}
                >
                    {isMuted || volume === 0 ? <VolumeMuteIcon className="h-6 w-6" /> : <VolumeUpIcon className="h-6 w-6" />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
