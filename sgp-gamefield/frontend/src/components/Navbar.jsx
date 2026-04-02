import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Trophy, User as UserIcon, LogOut, Sprout } from 'lucide-react';
import { io } from 'socket.io-client';

const Navbar = ({ user, setUser }) => {
  const location = useLocation();

  useEffect(() => {
    if (!user?._id && !user?.id) return;

    const socket = io('http://localhost:5001');
    const userId = user._id || user.id;

    socket.emit('join', userId);

    socket.on('xpUpdated', (data) => {
      console.log('🚀 Real-time XP Update:', data);
      
      setUser(prev => {
        const updated = {
          ...prev,
          xp: data.xp,
          level: data.level,
          sustainabilityScore: data.sustainabilityScore,
          badges: data.badges
        };
        localStorage.setItem('agriquest_user', JSON.stringify(updated));
        return updated;
      });

      // Simple toast notification replacement for demo
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black z-[9999] animate-bounce';
      notification.innerText = `🎉 +XP Earned! New XP: ${data.xp}`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    });

    return () => socket.disconnect();
  }, [user?._id, user?.id, setUser]);

  const handleLogout = () => {
    localStorage.removeItem('agriquest_user');
    localStorage.removeItem('agriquest_token');
    setUser(null);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Missions', path: '/missions', icon: ClipboardList },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Schemes', path: '/schemes', icon: Sprout },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-green-100 z-50 flex items-center px-6 justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
          <Sprout size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-green-800">Vasudhaara</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 transition-all font-medium ${
              location.pathname === link.path
                ? 'text-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
          >
            <link.icon size={20} />
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-gray-800">{user?.name}</span>
          <span className="text-xs text-green-600 font-semibold">LVL {user?.level || 1} Farmer</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
