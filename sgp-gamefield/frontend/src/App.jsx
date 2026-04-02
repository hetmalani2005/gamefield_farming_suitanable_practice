import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './pages/Navbar';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import MissionDetail from './pages/MissionDetail';
import Schemes from './pages/Schemes';
import Auth from './pages/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('agriquest_user');
    const token = localStorage.getItem('agriquest_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('agriquest_user');
        localStorage.removeItem('agriquest_token');
      }
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = async (userData) => {
    const token = localStorage.getItem('agriquest_token');
    if (token) {
      try {
        const res = await fetch('http://localhost:5001/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ farmData: userData })
        });
        const updated = await res.json();
        if (res.ok) {
          localStorage.setItem('agriquest_user', JSON.stringify(updated));
          setUser(updated);
          return;
        }
      } catch (err) {
        console.error('Failed to save profile on backend', err);
      }
    }
    const updatedUser = { ...user, farmData: userData };
    localStorage.setItem('agriquest_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🌱</div>
          </div>
          <div className="text-center">
            <p className="font-black text-green-800 text-lg">Vasudhaara</p>
            <p className="text-green-600 font-medium text-sm">Loading your farm dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasFarmData = user?.farmData?.cropType || user?.farmData?.farmSize > 0;

  return (
    <Router>
      <div className="min-h-screen bg-[#f8fcf9] text-[#1b4332] font-outfit">
        {user && hasFarmData && <Navbar user={user} setUser={setUser} />}

        <main className={`transition-all duration-300 ${user && hasFarmData ? 'pt-6 px-4 pb-24 xl:pb-10' : ''}`}>
          <Routes>
            <Route path="/auth" element={!user ? <Auth setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/onboarding" element={!user ? <Navigate to="/auth" /> : hasFarmData ? <Navigate to="/" /> : <Onboarding onComplete={handleOnboardingComplete} />} />
            <Route path="/" element={!user ? <Navigate to="/auth" /> : !hasFarmData ? <Navigate to="/onboarding" /> : <Dashboard user={user} setUser={setUser} />} />
            <Route path="/missions" element={!user ? <Navigate to="/auth" /> : !hasFarmData ? <Navigate to="/onboarding" /> : <Missions user={user} />} />
            <Route path="/missions/:id" element={!user ? <Navigate to="/auth" /> : !hasFarmData ? <Navigate to="/onboarding" /> : <MissionDetail user={user} />} />
            <Route path="/leaderboard" element={!user ? <Navigate to="/auth" /> : !hasFarmData ? <Navigate to="/onboarding" /> : <Leaderboard user={user} />} />
            <Route path="/profile" element={!user ? <Navigate to="/auth" /> : !hasFarmData ? <Navigate to="/onboarding" /> : <Profile user={user} setUser={setUser} />} />
            <Route path="/schemes" element={!user ? <Navigate to="/auth" /> : !hasFarmData ? <Navigate to="/onboarding" /> : <Schemes user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
