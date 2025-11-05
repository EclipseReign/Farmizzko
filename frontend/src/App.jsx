import React, { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './components/Auth/AuthPage';
import GameDashboard from './components/Game/GameDashboardNew';
import { Toaster } from './components/ui/toaster';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

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
