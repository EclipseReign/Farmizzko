import React, { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './components/Auth/AuthPage';
import GameDashboard from './components/Game/GameDashboardNew';
import { Toaster } from './components/ui/toaster';
import { auth, player } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadUser = async () => {
      // Check if user is already logged in
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          // Verify token by fetching profile
          const profile = await player.getProfile();
          setUser(profile);
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem('currentUser');
          auth.logout();
        }
      }
      setLoading(false);
    };
      
    loadUser();
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    auth.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 to-yellow-700">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {!user ? (
        <AuthPage onAuth={handleAuth} />
      ) : (
        <GameDashboard user={user} onLogout={handleLogout} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
