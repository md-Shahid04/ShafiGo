import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { AppRoutes } from './routes/AppRoutes';

export const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isPublicPage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/driver/register';

  const showSidebar = user && !isPublicPage;

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content Area */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 pb-24 md:pb-8 ${
            showSidebar ? 'lg:pl-72' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <AppRoutes />
          </div>
        </main>
      </div>

      {/* Mobile Touch Bottom Nav */}
      <BottomNav />

      {/* Global Toast Container */}
      <Toast />
    </div>
  );
};

export default App;
