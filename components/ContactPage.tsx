import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon, MailIcon } from './icons';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitMessage('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitMessage(''), 5000); // Clear message after 5 seconds
        }, 1500);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 py-16 sm:py-24 animate-fade-in">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                        Ponte en <span className="text-emerald-500 dark:text-emerald-400">Contacto</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        ¿Tienes alguna pregunta, sugerencia o quieres colaborar? Nos encantaría saber de ti.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Envíanos un mensaje</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
                                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
                                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                             <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asunto</label>
                                <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje</label>
                                <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"></textarea>
                            </div>
                            <div>
                                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400">
                                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                                </button>
                            </div>
                            {submitMessage && <p className="text-center text-emerald-600 dark:text-emerald-400">{submitMessage}</p>}
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Información de Contacto</h2>
                             <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                <div className="flex items-start">
                                    <MapPinIcon className="h-6 w-6 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mr-4 mt-1"/>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">Dirección</h3>
                                        <p>Calle Ficticia 123, 47001 Valladolid, España</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <PhoneIcon className="h-6 w-6 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mr-4 mt-1"/>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">Teléfono</h3>
                                        <p>+34 983 000 000</p>
                                    </div>
                                </div>
                                 <div className="flex items-start">
                                    <MailIcon className="h-6 w-6 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mr-4 mt-1"/>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">Correo Electrónico</h3>
                                        <p>contacto@femdtorneos.com</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                        <div className="rounded-lg shadow-lg overflow-hidden">
                             <a href="https://www.google.com/maps/place/Valladolid" target="_blank" rel="noopener noreferrer">
                                <img src="https://iqxequahexzheggucfmk.supabase.co/storage/v1/object/public/Imagenes%20web/map-placeholder.png" alt="Mapa de ubicación" className="w-full h-64 object-cover"/>
                            </a>
                        </div>
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

export default ContactPage;
