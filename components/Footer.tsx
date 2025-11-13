
import React from 'react';
import { View } from '../types';

interface FooterProps {
    onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">FEMD <span className="text-emerald-500 dark:text-emerald-400">TORNEOS</span></h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Organizando el futuro del fútbol.</p>
                    </div>
                     <div className="flex space-x-6 my-4 md:my-0">
                        <a onClick={() => onNavigate('sponsors')} className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer">Patrocinadores</a>
                        <a onClick={() => onNavigate('contact')} className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer">Contacto</a>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} FEMD TORNEOS. Todos los derechos reservados.</p>
                        <div className="flex justify-center md:justify-start space-x-4 mt-4">
                            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Twitter</a>
                            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Instagram</a>
                            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Facebook</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;