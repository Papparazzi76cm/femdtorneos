
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CloseIcon, MailIcon, LockIcon } from './icons';

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const result = isLogin ? await login(email, password) : await register(email, password);
            if (result.user) {
                // Tanto para el inicio de sesión como para el registro exitoso, simplemente cierra el modal.
                // El listener onAuthStateChange detectará la nueva sesión y actualizará la UI automáticamente.
                onClose();
            } else {
                setError(result.error || (isLogin ? 'Credenciales inválidas.' : 'El usuario ya existe o ha fallado el registro.'));
            }
        } catch (err) {
            setError('Ha ocurrido un error inesperado.');
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <CloseIcon className="h-6 w-6" />
                </button>
                <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-lg font-semibold ${isLogin ? 'text-emerald-500 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        Acceder
                    </button>
                    <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-lg font-semibold ${!isLogin ? 'text-emerald-500 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        Registrarse
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">{isLogin ? 'Bienvenido de Nuevo' : 'Crear Cuenta'}</h2>
                {error && <p className="bg-red-500/20 text-red-500 dark:text-red-400 text-center p-2 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 relative">
                        <MailIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute top-3.5 left-3" />
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="mb-6 relative">
                        <LockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute top-3.5 left-3" />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105">
                        {isLogin ? 'Acceder' : 'Registrarse'}
                    </button>
                </form>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
                    Para el acceso de Admin, primero regístrate con: mariscalimagen@gmail.com y una contraseña segura. Luego, inicia sesión.
                </p>
            </div>
            {/* FIX: Removed the 'jsx' prop from the <style> tag as it is not supported in this React setup and was causing a TypeScript error. The animation styles will now be applied globally. */}
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

export default AuthModal;