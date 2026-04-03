import { motion, AnimatePresence } from 'framer-motion';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Award from 'lucide-react/dist/esm/icons/award';
import Droplets from 'lucide-react/dist/esm/icons/droplets';
import Cloudy from 'lucide-react/dist/esm/icons/cloudy';
import Sun from 'lucide-react/dist/esm/icons/sun';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Wind from 'lucide-react/dist/esm/icons/wind';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Star from 'lucide-react/dist/esm/icons/star';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Medal from 'lucide-react/dist/esm/icons/medal';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import BadgeSystem from '../components/BadgeSystem';
import { generateBadgeCertificate } from '../utils/certificateGenerator';
import confetti from 'canvas-confetti';

const categoryColors = {
  Organic: { bg: 'bg-emerald-100', text: 'text-emerald-700', badge: 'from-emerald-500 to-teal-600' },
  Irrigation: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'from-blue-500 to-cyan-600' },
  Rotation: { bg: 'bg-amber-100', text: 'text-amber-700', badge: 'from-amber-500 to-orange-600' },
  Soil: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'from-orange-500 to-red-600' },
  Eco: { bg: 'bg-teal-100', text: 'text-teal-700', badge: 'from-teal-500 to-green-600' }
};

const MissionCard = ({ mission, onStart, onUploadProof }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[mission.category] || categoryColors.Eco;

  return (
    <div
      className="bg-white rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
      onClick={() => setExpanded(e => !e)}
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${colors.badge} rounded-l-[2rem]`} />
      <div className="p-6 pl-8">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`${colors.bg} ${colors.text} text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider`}>{mission.category}</span>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${mission.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                mission.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{mission.difficulty || 'Medium'}</span>
          </div>
          <span className="text-green-600 font-black text-sm bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
            <Zap size={12} />{mission.xpReward} XP
          </span>
        </div>

        <h3 className="text-lg font-black text-gray-800 mb-1 leading-snug">{mission.title}</h3>
        <p className="text-gray-500 font-medium text-sm line-clamp-2 mb-3">{mission.goal || mission.description}</p>

        {mission.estimatedTime && (
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            <span>⏱ {mission.estimatedTime}</span>
            {mission.badgeReward?.name && <span>🏅 {mission.badgeReward.name}</span>}
          </div>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-5">
                {/* Steps */}
                {(mission.steps?.length > 0) && (
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                    <h4 className="flex items-center gap-2 font-black text-emerald-900 text-[10px] uppercase tracking-widest mb-4">
                      <CheckCircle2 size={12} /> Step-by-Step Guide
                    </h4>
                    <div className="space-y-3">
                      {mission.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-emerald-800 text-sm font-semibold leading-relaxed">
                            {typeof step === 'string' ? step : step.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials & Benefits */}
                {(mission.requiredMaterials?.length > 0 || mission.toolsRequired?.length > 0) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-2">🧰 Tools Required</h4>
                      <ul className="text-xs font-semibold text-gray-700 space-y-1">
                        {(mission.requiredMaterials || mission.toolsRequired || []).map((m, i) => <li key={i}>• {m}</li>)}
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-black text-blue-900 text-[10px] uppercase tracking-widest mb-2">🧠 Why It Matters</h4>
                      <p className="text-xs font-semibold text-blue-800 leading-relaxed">
                        {mission.whyImportant || (mission.benefits && mission.benefits[0]) || "Improves sustainability"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onStart}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-95"
                  >
                    🚀 Start Mission
                  </button>
                  <button
                    onClick={onUploadProof}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest transition-colors border border-gray-200"
                  >
                    📸 Upload Proof
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!expanded && (
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-green-600 group-hover:gap-2 transition-all">
            View Details <ChevronRight size={14} />
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ user: initialUser, setUser }) => {
  const [user, setLocalUser] = useState(initialUser);
  const [activeMissions, setActiveMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastXPGain, setLastXPGain] = useState(null);
  const [newBadge, setNewBadge] = useState(null); // Mission badge state
  const [proofModal, setProofModal] = useState(null); // missionId
  const [proofFile, setProofFile] = useState(null);
  const prevXPRef = useRef(initialUser?.xp || 0);
  const prevBadgesRef = useRef(initialUser?.badges || []);

  const [weather, setWeather] = useState({
    temp: '--',
    location: 'Searching...',
    humidity: '--',
    windSpeed: '--',
    condition: 'Sunny'
  });
  const [villageLeaderboard, setVillageLeaderboard] = useState([]);
  const [villageRank, setVillageRank] = useState(null);


  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setLocalUser(res.data);
      if (setUser) setUser(res.data);
      localStorage.setItem('agriquest_user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    setLocalUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    const fetchVillageLeaderboard = async (profileData) => {
      try {
        const village = profileData?.farmData?.location?.village?.trim();
        const crop = (profileData?.farmData?.cropType || profileData?.selectedCrop || '').trim();
        const userId = profileData?._id || profileData?.id;

        if (village && userId) {
          const res = await api.get(`/leaderboard?village=${encodeURIComponent(village)}&crop=${encodeURIComponent(crop)}`);
          
          if (res.data && Array.isArray(res.data)) {
            setVillageLeaderboard(res.data.slice(0, 3));
            // Robust ID matching
            const foundUser = res.data.find(f => 
              f._id?.toString() === userId.toString() || 
              (f.id && f.id.toString() === userId.toString())
            );
            
            if (foundUser) {
              setVillageRank(foundUser.rank);
            } else {
              setVillageRank('10+'); // Default if not in top 50 but in village
            }
          }
        }
      } catch (err) {
        console.error('Error fetching village leaderboard:', err);
      }
    };


    const init = async () => {
      const profile = await fetchUserProfile();
      fetchVillageLeaderboard(profile);
      try {
        const res = await api.get('/missions');
        setActiveMissions(res.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching missions:', err);
      } finally {
        setLoading(false);
      }
    };
    init();


    // Weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const apiKey = '9055d84d149e8c8a63eeb4fd612b8a7f';
          const [weatherRes, geoRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, { headers: { 'User-Agent': 'Vasudhaara/1.0' } })
          ]);
          const [wd, geo] = await Promise.all([weatherRes.json(), geoRes.json()]);
          const addr = geo.address || {};
          const city = addr.village || addr.town || addr.city || wd.name || 'My Farm';
          setWeather({
            temp: Math.round(wd.main.temp),
            location: city,
            humidity: wd.main.humidity,
            windSpeed: Math.round(wd.wind.speed * 3.6),
            condition: wd.weather[0].main === 'Clear' ? 'Sunny' : 'Cloudy'
          });
        } catch (e) { /* ignore */ }
      });
    }

    // Socket.io
    const socket = io('http://localhost:5001');
    const userId = initialUser?._id || initialUser?.id;
    if (userId) {
      socket.emit('join', userId);
      socket.on('xpUpdated', (data) => {
        if (data.xp > prevXPRef.current) {
          setLastXPGain(data.xp - prevXPRef.current);
          setTimeout(() => setLastXPGain(null), 4000);
        }
        if (data.badges?.length > (prevBadgesRef.current?.length || 0)) {
          console.log('🎉 New Badge Unlocked!');
          setNewBadge(data.badges[data.badges.length - 1]);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#059669', '#F59E0B']
          });
          setTimeout(() => setNewBadge(null), 6000);
        }
        prevXPRef.current = data.xp;
        prevBadgesRef.current = data.badges;
        setLocalUser(prev => ({ ...prev, xp: data.xp, level: data.level, sustainabilityScore: data.sustainabilityScore, badges: data.badges, currentBadge: data.currentBadge }));
      });
    }
    return () => socket.disconnect();
  }, [initialUser?._id, initialUser?.id]);

  const handleDownloadCertificate = (badge) => {
    generateBadgeCertificate(user, badge);
  };


  const handleStartMission = async (missionId) => {
    try {
      await api.post('/missions/start', { missionId });
      alert('Mission started! 🚀 Check your profile for active missions.');
      fetchUserProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Error starting mission');
    }
  };

  const handleCompleteMission = async (missionId, file) => {
    try {
      if (!file) {
        alert("Please attach a proof");
        return;
      }
      const formData = new FormData();
      formData.append('proof', file);
      formData.append('missionId', missionId);
      
      await api.post('/missions/complete', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Mission Completed! XP and Badge awarded! 🎉');
      fetchUserProfile();
      const res = await api.get('/missions');
      setActiveMissions(res.data.slice(0, 3));
    } catch (err) {
      alert(err.response?.data?.message || 'Error completing mission');
    }
  };

  const stats = [
    { label: 'Total XP', value: (user?.xp || 0).toLocaleString(), icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Village Rank', value: villageRank !== null ? `#${villageRank}` : '--', icon: Medal, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Badges', value: user?.badges?.length || 0, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Level', value: user?.level || 1, icon: Star, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  ];



  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 relative">
      {/* Real-time Notifications */}
      <AnimatePresence>
        {lastXPGain && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-emerald-600 to-green-600 text-white px-10 py-5 rounded-3xl shadow-2xl font-black flex items-center gap-4 border-2 border-emerald-400"
          >
            <TrendingUp size={28} />
            <span className="text-xl">+{lastXPGain} XP EARNED! 🎉</span>
          </motion.div>
        )}
        {newBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white p-12 rounded-[4rem] text-center shadow-2xl border-8 border-amber-400 max-w-sm w-full mx-4">
              <div className="text-8xl mb-6">🏅</div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Badge Unlocked!</h2>
              <p className="text-2xl font-black text-amber-600 mb-8">{newBadge.name}</p>
              <button onClick={() => setNewBadge(null)} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform">
                Awesome! 🎊
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Banner */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] p-8 lg:p-12 text-white shadow-2xl shadow-green-200">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <motion.div className="absolute right-0 top-0 bottom-0 flex items-center pr-12 opacity-10 text-white" animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0] }} transition={{ duration: 8, repeat: Infinity }}>
          <Sprout size={200} />
        </motion.div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold border border-white/30 mb-5">
              <Sun size={14} className="text-yellow-300" /> {user?.farmData?.season || 'Kharif'} Season 2026
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl lg:text-4xl font-black mb-3 leading-tight">
              Namaste, {user?.firstName || user?.name?.split(' ')[0]}! 🙏
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/80 font-medium max-w-xl leading-relaxed">
              Your <strong className="text-white">{user?.farmData?.cropType || 'farm'}</strong> is ready for action. Complete today's missions and grow your XP!
            </motion.p>
          </div>

          <div className="flex-shrink-0">
            <div className="bg-white/15 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center min-w-[180px]">
              <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Current Level</p>
              <p className="text-5xl font-black mb-2">{user?.level || 1}</p>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <p className="text-xs font-bold opacity-70 mt-1.5">{(user?.xp || 0) % 1000}/1000 XP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className={`bg-white p-6 rounded-[2rem] border ${stat.border} shadow-sm flex items-center gap-4 group hover:shadow-lg transition-all hover:-translate-y-1`}
          >
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Missions */}
        <section className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Current Missions</h2>
            <Link to="/missions" className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-100 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : activeMissions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-gray-100">
              <Sprout size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold">No missions available. Refresh to load!</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors">
                Refresh
              </button>
            </div>
          ) : (
            activeMissions.map((mission) => (
              <MissionCard
                key={mission._id}
                mission={mission}
                onStart={(e) => { e?.stopPropagation(); handleStartMission(mission._id); }}
                onUploadProof={(e) => { e?.stopPropagation(); setProofModal(mission._id); }}
              />
            ))
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Weather Widget */}
          <div className={`p-7 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden ${weather.condition === 'Sunny' ? 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500' : 'bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600'}`}>
            <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-15">
              {weather.condition === 'Sunny' ? <Sun size={180} /> : <Cloudy size={180} />}
            </div>
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Live Weather</p>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h3 className="text-5xl font-black">{weather.temp}°C</h3>
                  <p className="font-bold opacity-80 mt-1">{weather.location}</p>
                </div>
                {weather.condition === 'Sunny' ? <Sun size={56} className="text-white/80 animate-pulse" /> : <Cloudy size={56} className="text-white/80" />}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur p-3 rounded-2xl flex items-center gap-2">
                  <Droplets size={18} className="opacity-80" />
                  <span className="text-sm font-bold">{weather.humidity}% Humid</span>
                </div>
                <div className="bg-white/20 backdrop-blur p-3 rounded-2xl flex items-center gap-2">
                  <Wind size={18} className="opacity-80" />
                  <span className="text-sm font-bold">{weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges System */}
          <BadgeSystem user={user} onDownloadCertificate={handleDownloadCertificate} />

          {/* Village Leaderboard Widget */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
              <Trophy size={80} className="text-amber-500" />
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className="font-black text-gray-800 text-sm">Village Top Growers</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.farmData?.location?.village || 'Local'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {villageLeaderboard.map((f, i) => (
                <div key={f._id} className={`flex items-center justify-between p-3 rounded-2xl border ${f._id === (user?._id || user?.id) ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black w-5 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : 'text-orange-400'}`}>
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-gray-500 shadow-sm uppercase">
                      {f.name.substring(0, 2)}
                    </div>
                    <span className="text-xs font-bold text-gray-700 truncate max-w-[80px]">{f.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-gray-800">{f.xp.toLocaleString()} XP</span>
                </div>
              ))}
              {villageLeaderboard.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs font-bold text-gray-400 italic">No rankings yet...</p>
                </div>
              )}
            </div>
            
            <Link to="/leaderboard" className="mt-5 w-full py-3 text-xs font-black text-amber-600 border border-amber-200 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors">
              Full Leaderboard <ChevronRight size={14} />
            </Link>
          </div>

          {/* Govt Schemes Quick */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-black text-gray-800 text-sm">Govt. Schemes</h3>
            </div>
            <div className="space-y-3">
              {[
                { scheme: 'PM-Kisan Samman Nidhi', type: 'Central', amount: '₹6,000/year' },
                { scheme: 'Soil Health Card', type: 'State', amount: 'Free Testing' },
                { scheme: 'PDMC Drip Subsidy', type: 'Central', amount: 'Up to 70%' }
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-gray-700">{s.scheme}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.type}</p>
                    </div>
                    <span className="text-emerald-600 font-black text-xs">{s.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/schemes" className="mt-5 w-full py-3 text-xs font-black text-green-600 border border-green-200 rounded-xl flex items-center justify-center gap-2 hover:bg-green-50 transition-colors">
              View All Schemes <ChevronRight size={14} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Proof Upload Modal */}
      <AnimatePresence>
        {proofModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setProofModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-black text-gray-900 mb-2">Upload Proof 📸</h3>
              <p className="text-gray-500 font-medium text-sm mb-6">Upload an image or video to complete this mission and earn XP!</p>
              <label className="block border-2 border-dashed border-green-200 rounded-2xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                <input type="file" accept="image/*,video/*" className="hidden" onChange={e => setProofFile(e.target.files[0])} />
                {proofFile ? (
                  <div>
                    <div className="text-4xl mb-2">✅</div>
                    <p className="font-bold text-green-700 text-sm">{proofFile.name}</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="font-bold text-gray-500 text-sm">Click to select photo/video</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG, MP4 supported</p>
                  </div>
                )}
              </label>
              <div className="flex gap-3 mt-5">
                <button
                  disabled={!proofFile}
                  onClick={() => {
                    if(proofFile) {
                      handleCompleteMission(proofModal, proofFile);
                      setProofModal(null);
                      setProofFile(null);
                    }
                  }}
                  className={`flex-1 py-3 ${proofFile ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-xl font-black text-sm uppercase tracking-wide transition-colors`}
                >
                  Submit & Complete
                </button>
                <button onClick={() => { setProofModal(null); setProofFile(null); }} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
