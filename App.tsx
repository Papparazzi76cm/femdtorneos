
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import ChatBot from './components/ChatBot';
import CalendarPage from './components/CalendarPage';
import BlogPostPage from './components/BlogPostPage'; // Import new component
import TournamentsPage from './components/TournamentsPage';
import TeamsPage from './components/TeamsPage';
import TeamDetailPage from './components/TeamDetailPage';
import SponsorsPage from './components/SponsorsPage';
import ContactPage from './components/ContactPage';
import BlogListPage from './components/BlogListPage';
import { View, BlogPost } from './types';
import AudioPlayer from './components/AudioPlayer';

const AppContent: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('home');
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const { user } = useAuth();
    const [blogOrigin, setBlogOrigin] = useState<View>('home');


    const handleNavigate = (view: View) => {
        if (view === 'admin' && user?.role !== 'admin') {
            alert('Acceso denegado. Solo los administradores pueden ver esta página.');
            return;
        }
        setCurrentView(view);
    };

    const handlePostSelect = (post: BlogPost) => {
        setSelectedPost(post);
        setBlogOrigin(currentView); // Remember where we came from
        setCurrentView('blog');
    };
    
    const handleTeamSelect = (teamId: number) => {
        setSelectedTeamId(teamId);
        setCurrentView('teamDetail');
    };

    const handleBackFromPost = () => {
        setSelectedPost(null);
        setCurrentView(blogOrigin);
    };
    
    const handleBackToTeams = () => {
        setSelectedTeamId(null);
        setCurrentView('teams');
    };


    const renderView = () => {
        switch (currentView) {
            case 'admin':
                return user?.role === 'admin' ? <AdminDashboard /> : <HomePage onPostSelect={handlePostSelect} onNavigate={handleNavigate} />;
            case 'calendar':
                return <CalendarPage />;
            case 'tournaments':
                return <TournamentsPage />;
            case 'teams':
                return <TeamsPage onTeamSelect={handleTeamSelect} />;
            case 'teamDetail':
                return selectedTeamId ? <TeamDetailPage teamId={selectedTeamId} onBack={handleBackToTeams} /> : <TeamsPage onTeamSelect={handleTeamSelect} />;
            case 'blog':
                return selectedPost ? <BlogPostPage post={selectedPost} onBack={handleBackFromPost} /> : <BlogListPage onPostSelect={handlePostSelect} />;
            case 'blogList':
                return <BlogListPage onPostSelect={handlePostSelect} />;
            case 'sponsors':
                return <SponsorsPage onNavigate={handleNavigate} />;
            case 'contact':
                return <ContactPage />;
            case 'home':
            default:
                return <HomePage onPostSelect={handlePostSelect} onNavigate={handleNavigate} />;
        }
    };
    
    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-100 flex flex-col font-sans">
            <Header onNavigate={handleNavigate} onAuthClick={() => setAuthModalOpen(true)} />
            <main className="flex-grow">
                {renderView()}
            </main>
            <Footer onNavigate={handleNavigate} />
            <ChatBot />
            <AudioPlayer />
            {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;