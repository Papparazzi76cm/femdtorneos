
import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon, CloseIcon, SendIcon, UserIcon } from './icons';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: "¡Hola! Soy el asistente de FEMD TORNEOS. ¿Cómo puedo ayudarte hoy con nuestros eventos o torneos?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponseText = await geminiService.chatWithBot(messages, input);
            const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'bot', text: "Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo de nuevo." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-emerald-500 text-white rounded-full p-4 shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-110"
                >
                    {isOpen ? <CloseIcon className="h-8 w-8" /> : <ChatIcon className="h-8 w-8" />}
                </button>
            </div>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 animate-slide-in-up">
                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-t-lg flex items-center">
                        <ChatIcon className="h-6 w-6 text-emerald-500 dark:text-emerald-400 mr-3" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Asistente FEMD TORNEOS</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <div className="bg-emerald-500 rounded-full p-2 mr-3"><ChatIcon className="w-5 h-5 text-white"/></div>}
                                <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                                 {msg.sender === 'user' && <div className="bg-gray-500 dark:bg-gray-600 rounded-full p-2 ml-3"><UserIcon className="w-5 h-5 text-white"/></div>}
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-start mb-4 justify-start">
                                <div className="bg-emerald-500 rounded-full p-2 mr-3"><ChatIcon className="w-5 h-5 text-white"/></div>
                                <div className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                                    <div className="flex items-center space-x-1">
                                      <span className="h-2 w-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                      <span className="h-2 w-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                      <span className="h-2 w-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                placeholder="Haz una pregunta..."
                                className="flex-1 bg-transparent p-3 text-gray-900 dark:text-white focus:outline-none"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading} className="p-3 text-emerald-500 dark:text-emerald-400 disabled:text-gray-500">
                                <SendIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
             {/* FIX: Removed the 'jsx' prop from the <style> tag as it is not supported in this React setup and was causing a TypeScript error. The animation styles will now be applied globally. */}
             <style>{`
                @keyframes slide-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-in-up {
                    animation: slide-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default ChatBot;