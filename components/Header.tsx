
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { View } from '../types';
import ThemeToggleButton from './ThemeToggleButton';
import { useTheme } from '../hooks/useTheme';
import { MenuIcon, CloseIcon } from './icons';

interface HeaderProps {
    onNavigate: (view: View) => void;
    onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onAuthClick }) => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        // Bloquear el scroll del body cuando el menú móvil está abierto
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Cleanup en el desmontaje
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);


    const logoDarkTheme = "https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/Imagenes%20web/logo-web.png";
    const logoLightTheme = "https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/Imagenes%20web/logo-web-negro.png";

    const logoSrc = theme === 'light' ? logoLightTheme : logoDarkTheme;

    const handleMobileNav = (view: View) => {
        onNavigate(view);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="cursor-pointer" onClick={() => onNavigate('home')}>
                       <img src={logoSrc} alt="FEMD TORNEOS Logo" className="h-14" />
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <a onClick={() => onNavigate('home')} className="text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Inicio</a>
                        
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setDropdownOpen(!isDropdownOpen)} 
                                className="text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer flex items-center"
                            >
                                Competiciones
                                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 animate-fade-in-down">
                                    <a onClick={() => { onNavigate('calendar'); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Calendario</a>
                                    <a onClick={() => { onNavigate('tournaments'); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Torneos</a>
                                    <a onClick={() => { onNavigate('teams'); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Equipos</a>
                                </div>
                            )}
                        </div>
                        <a onClick={() => onNavigate('sponsors')} className="text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Patrocinadores</a>
                        <a onClick={() => onNavigate('contact')} className="text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Contacto</a>

                        {user?.role === 'admin' && (
                             <a onClick={() => onNavigate('admin')} className="text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Panel de Admin</a>
                        )}
                    </nav>
                    <div className="flex items-center space-x-2 md:space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-600 dark:text-gray-300 hidden sm:block">Bienvenido, {user.email.split('@')[0]}</span>
                                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <button onClick={onAuthClick} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105">
                                Acceder / Registrarse
                            </button>
                        )}
                        <ThemeToggleButton />
                         {/* Botón de menú móvil */}
                        <div className="md:hidden">
                            <button onClick={() => setMobileMenuOpen(true)} className="text-gray-800 dark:text-gray-200">
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
                 <style>{`
                    @keyframes fade-in-down {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-down {
                        animation: fade-in-down 0.2s ease-out forwards;
                    }
                `}</style>
            </header>
            
            {/* Panel de Menú Móvil */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col items-center justify-center animate-fade-in-down">
                    <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-gray-600 dark:text-gray-400">
                        <CloseIcon className="w-8 h-8" />
                    </button>
                    <nav className="flex flex-col items-center space-y-8 text-center">
                        <a onClick={() => handleMobileNav('home')} className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-emerald-500">Inicio</a>
                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 pt-4">Competiciones</h3>
                        <a onClick={() => handleMobileNav('calendar')} className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-emerald-500">Calendario</a>
                        <a onClick={() => handleMobileNav('tournaments')} className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-emerald-500">Torneos</a>
                        <a onClick={() => handleMobileNav('teams')} className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-emerald-500">Equipos</a>
                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 pt-4">Más</h3>
                        <a onClick={() => handleMobileNav('sponsors')} className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-emerald-500">Patrocinadores</a>
                        <a onClick={() => handleMobileNav('contact')} className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-emerald-500">Contacto</a>

                        {user?.role === 'admin' && (
                             <a onClick={() => handleMobileNav('admin')} className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-emerald-500 pt-4">Panel de Admin</a>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
};

export default Header;