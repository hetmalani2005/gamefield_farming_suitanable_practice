import { motion, AnimatePresence } from 'framer-motion';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Medal from 'lucide-react/dist/esm/icons/medal';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Search from 'lucide-react/dist/esm/icons/search';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Award from 'lucide-react/dist/esm/icons/award';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Filter from 'lucide-react/dist/esm/icons/filter';
import Gift from 'lucide-react/dist/esm/icons/gift';
import Star from 'lucide-react/dist/esm/icons/star';
import api from '../utils/api';
import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const RANK_REWARDS = {
  1: {
    title: 'Champion Farmer 🏆',
    color: 'from-amber-400 to-yellow-500',
    border: 'border-amber-300',
    ring: 'ring-amber-300',
    bg: 'bg-amber-50',
    textColor: 'text-amber-800',
    rewards: [
      { icon: '📜', label: 'Champion Certificate', desc: 'Official recognition certificate' },
      { icon: '🧰', label: 'Premium Farming Toolkit', desc: 'Professional grade tools' },
      { icon: '🌱', label: '20% Seed Discount', desc: 'On certified organic seeds' },
      { icon: '💰', label: '₹5,000 Cash Reward', desc: 'Direct bank transfer' },
    ]
  },
  2: {
    title: 'Excellence Farmer 🥈',
    color: 'from-slate-300 to-slate-400',
    border: 'border-slate-300',
    ring: 'ring-slate-300',
    bg: 'bg-slate-50',
    textColor: 'text-slate-800',
    rewards: [
      { icon: '📜', label: 'Excellence Certificate', desc: 'Second place recognition' },
      { icon: '💰', label: '₹2,500 Cash Reward', desc: 'Direct bank transfer' },
    ]
  },
  3: {
    title: 'Merit Farmer 🥉',
    color: 'from-orange-300 to-amber-400',
    border: 'border-orange-300',
    ring: 'ring-orange-300',
    bg: 'bg-orange-50',
    textColor: 'text-orange-800',
    rewards: [
      { icon: '📜', label: 'Merit Certificate', desc: 'Third place recognition' },
      { icon: '💰', label: '₹1,000 Cash Reward', desc: 'Direct bank transfer' },
    ]
  }
};

const RewardCard = ({ rank, farmer }) => {
  const config = RANK_REWARDS[rank];
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: rank * 0.1 }}
      className={`bg-white rounded-[2rem] border-2 ${config.border} shadow-lg overflow-hidden`}
    >
      <div className={`bg-gradient-to-r ${config.color} p-5 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black text-2xl">
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
            </div>
            <div>
              <p className="font-black text-lg">{farmer?.name || 'TBD'}</p>
              <p className="text-white/80 text-xs font-bold">{config.title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-2xl">{(farmer?.xp || 0).toLocaleString()}</p>
            <p className="text-white/70 text-xs font-bold">XP Points</p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <button onClick={() => setOpen(o => !o)} className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl ${config.bg} ${config.textColor} font-black text-sm transition-colors hover:opacity-80`}>
          <span className="flex items-center gap-2"><Gift size={16} /> View Rewards ({config.rewards.length})</span>
          <ChevronRight size={16} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 space-y-2.5">
                {config.rewards.map((r, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border}`}>
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <p className={`font-black text-sm ${config.textColor}`}>{r.label}</p>
                      <p className="text-gray-500 text-xs font-medium">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Leaderboard = ({ user }) => {
  const [viewType, setViewType] = useState('Farmers'); // 'Farmers' or 'Regions'
  const [filter, setFilter] = useState('Global');
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (viewType === 'Regions') {
        const groupBy = filter === 'Global' ? 'village' : filter.toLowerCase();
        params.append('groupBy', groupBy);
      } else {
        if (filter !== 'Global') {
          params.append('filter', filter.toLowerCase());
          const userFarm = user?.farmData?.location;
          if (filter === 'Village' && userFarm?.village) params.append('value', userFarm.village);
          else if (filter === 'District' && userFarm?.district) params.append('value', userFarm.district);
          else if (filter === 'State' && userFarm?.state) params.append('value', userFarm.state);
        }
      }
      if (cropFilter) params.append('crop', cropFilter);

      const res = await api.get(`/leaderboard?${params}`);
      setFarmers(res.data);
    } catch (err) {
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [viewType, filter, cropFilter, user?.farmData?.location]);

  useEffect(() => {
    fetchLeaderboard();
    const socket = io('http://localhost:5001');
    socket.on('leaderboardUpdate', () => fetchLeaderboard());
    return () => socket.disconnect();
  }, [fetchLeaderboard]);

  const filteredFarmers = farmers.filter(f =>
    !search || 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.farmData?.location?.village?.toLowerCase().includes(search.toLowerCase()) ||
    f.farmData?.location?.district?.toLowerCase().includes(search.toLowerCase()) ||
    f.farmData?.location?.state?.toLowerCase().includes(search.toLowerCase()) ||
    (f.isRegion && f.name.toLowerCase().includes(search.toLowerCase()))
  );

  const top3 = filteredFarmers.slice(0, 3);
  const FILTER_OPTIONS = ['Global', 'State', 'District', 'Village'];
  const CROPS = ['', 'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Tomato', 'Soybean', 'Maize'];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 mt-6 font-outfit">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#1b2d4f] via-[#1a3a5c] to-[#1b4332] rounded-[2.5rem] overflow-hidden p-10 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <motion.div className="absolute right-0 top-0 bottom-0 flex items-center pr-12 opacity-10" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity }}>
          <Trophy size={200} />
        </motion.div>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 px-5 py-2 rounded-full text-amber-300 font-black text-sm mb-6">
            <Trophy size={16} /> Farmers' Hall of Fame
          </div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-3">
            Champion <span className="text-emerald-400">Green Warriors</span>
          </h1>
          <p className="text-white/60 font-medium text-lg max-w-xl mx-auto">
            Top performing farmers leading India's sustainable farming revolution
          </p>
        </div>
      </section>

      {/* Top 3 Rewards Cards - Only for Farmers */}
      {viewType === 'Farmers' && top3.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-2">
            <Trophy size={24} className="text-amber-500" /> Prize Winners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(rank => (
              <RewardCard key={rank} rank={rank} farmer={top3[rank - 1]} />
            ))}
          </div>
        </div>
      )}

      {/* Podium Visual - Only for Farmers */}
      {viewType === 'Farmers' && top3.length > 0 && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-400" />
          <h2 className="text-center text-xl font-black text-gray-800 mb-10 uppercase tracking-widest">Top Performers Podium</h2>
          <div className="grid grid-cols-3 gap-6 items-end max-w-2xl mx-auto">
            {/* 2nd */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
              {top3[1] && (
                <>
                  <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-2xl font-black text-slate-500 mb-4 uppercase relative">
                    {top3[1].name.substring(0, 2)}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white border-2 border-white text-xs font-black">2</div>
                  </div>
                  <p className="font-black text-gray-800 text-sm text-center mb-1">{top3[1].name}</p>
                  <p className="text-xs font-bold text-slate-500">{top3[1].xp?.toLocaleString()} XP</p>
                  <div className="h-32 w-full bg-slate-50 rounded-t-3xl mt-4 flex justify-center items-center border-t border-x border-slate-100">
                    <Medal size={32} className="text-slate-300" />
                  </div>
                </>
              )}
            </motion.div>

            {/* 1st */}
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex flex-col items-center relative z-10">
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="text-4xl mb-2">👑</motion.div>
              <div className="w-28 h-28 rounded-full bg-amber-100 border-8 border-white shadow-2xl ring-4 ring-amber-200 flex items-center justify-center text-3xl font-black text-amber-600 mb-4 uppercase relative">
                {top3[0]?.name.substring(0, 2)}
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white border-2 border-white text-sm font-black">1</div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40 -m-4" />
              </div>
              <p className="font-black text-gray-900 text-base text-center mb-1">{top3[0]?.name}</p>
              <p className="text-amber-600 font-black text-sm flex items-center gap-1"><Medal size={14} />{top3[0]?.xp?.toLocaleString()} XP</p>
              <div className="h-48 w-full bg-amber-50 rounded-t-3xl mt-4 flex flex-col justify-center items-center border-t border-x border-amber-100 shadow-lg">
                <Trophy size={56} className="text-amber-400 drop-shadow-lg" />
              </div>
            </motion.div>

            {/* 3rd */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
              {top3[2] && (
                <>
                  <div className="w-16 h-16 rounded-full bg-orange-50 border-4 border-white shadow-lg flex items-center justify-center text-xl font-black text-orange-600 mb-4 uppercase relative">
                    {top3[2].name.substring(0, 2)}
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white border-2 border-white text-[10px] font-black">3</div>
                  </div>
                  <p className="font-black text-gray-800 text-sm text-center mb-1">{top3[2].name}</p>
                  <p className="text-xs font-bold text-orange-500">{top3[2].xp?.toLocaleString()} XP</p>
                  <div className="h-24 w-full bg-orange-50/50 rounded-t-3xl mt-4 flex justify-center items-center border-t border-x border-orange-100">
                    <Medal size={24} className="text-orange-200" />
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Filters & Rankings */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Toggle & Filter Bar */}
        <div className="p-6 border-b border-gray-50 flex flex-col space-y-6 bg-gray-50/30">
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 self-center md:self-start w-fit">
            <button
              onClick={() => { setViewType('Farmers'); setFilter('Global'); }}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${viewType === 'Farmers' ? 'bg-[#1b4332] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              👩‍🌾 Farmer Rankings
            </button>
            <button
              onClick={() => { setViewType('Regions'); setFilter('State'); }}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${viewType === 'Regions' ? 'bg-[#1b4332] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              🏘 Region Rankings
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map(f => {
                if (viewType === 'Regions' && f === 'Global') return null;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === f ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100 hover:text-green-600 hover:border-green-200'}`}
                  >
                    {f === 'Global' ? '🌍' : f === 'State' ? '🏛' : f === 'District' ? '📍' : '🏘'} 
                    {viewType === 'Regions' ? ` Top ${f}s` : f === 'Global' ? ' Global' : ` My ${f}`}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={cropFilter}
                onChange={e => setCropFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-green-500 outline-none text-sm font-bold text-gray-600 shadow-sm"
              >
                <option value="">All Crops</option>
                {CROPS.filter(Boolean).map(c => <option key={c} value={c}>🌾 {c}</option>)}
              </select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-green-500 outline-none text-sm font-medium shadow-sm w-44 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rankings List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="text-center py-20">
            <Globe size={48} className="mx-auto text-gray-200 mb-4 animate-pulse" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              {filter !== 'Global' ? `No data found for your ${filter.toLowerCase()} yet.` : 'No data yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredFarmers.map((farmer, i) => {
              const isCurrentUser = farmer._id === (user?._id || user?.id);
              const rankReward = RANK_REWARDS[i + 1];

              return (
                <motion.div
                  key={farmer._id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`px-8 py-5 flex items-center gap-4 group transition-all cursor-pointer ${isCurrentUser ? 'bg-green-50/60 border-l-4 border-l-green-500' : 'hover:bg-gray-50/70'}`}
                >
                  {/* Rank */}
                  <div className={`w-14 text-center font-black text-2xl flex-shrink-0 ${i < 3 ? 'text-amber-400' : 'text-gray-200 group-hover:text-gray-300'}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border-2 border-white shadow-sm flex-shrink-0 uppercase ${
                    i === 0 ? 'bg-amber-100 text-amber-600' :
                    i === 1 ? 'bg-slate-100 text-slate-500' :
                    i === 2 ? 'bg-orange-100 text-orange-600' :
                    isCurrentUser ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {farmer.name.substring(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-gray-800 truncate">{farmer.name}</span>
                      {isCurrentUser && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black">You</span>}
                      {i < 3 && <TrendingUp size={14} className="text-emerald-500" />}
                      {farmer.isRegion && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">{farmer.regionType}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {farmer.isRegion ? (
                        <>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 flex items-center gap-1">
                            👥 {farmer.farmerCount} Farmers
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500 flex items-center gap-1">
                            ⭐ {farmer.avgXP.toLocaleString()} Avg XP
                          </span>
                        </>
                      ) : (
                        <>
                          {farmer.farmData?.location?.village && (
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1">
                              <MapPin size={9} /> {farmer.farmData.location.village}
                              {farmer.farmData.location.district && `, ${farmer.farmData.location.district}`}
                              {farmer.farmData.location.state && `, ${farmer.farmData.location.state}`}
                            </span>
                          )}
                          {farmer.farmData?.cropType && (
                            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 flex items-center gap-1">
                              🌾 {farmer.farmData.cropType}
                            </span>
                          )}
                          {farmer.currentBadge?.title && (
                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                              {farmer.currentBadge.icon} {farmer.currentBadge.title}
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500 flex items-center gap-1">
                            <Leaf size={9} />{farmer.missionsCompleted || 0} missions
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {rankReward && !farmer.isRegion && (
                    <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                      {rankReward.rewards.slice(0, 3).map((r, j) => (
                        <span key={j} className="text-lg" title={r.label}>{r.icon}</span>
                      ))}
                    </div>
                  )}

                  {/* XP */}
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-black ${isCurrentUser ? 'text-green-700' : 'text-gray-800'} group-hover:text-green-700 transition-colors`}>
                      {(farmer.xp || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">XP</div>
                  </div>

                  <div className="ml-2 text-gray-200 group-hover:text-green-400 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredFarmers.length > 0 && (
          <div className="p-8 text-center bg-gray-50/30 border-t border-gray-50">
            <p className="text-gray-400 font-bold text-sm">
              Showing <span className="font-black text-gray-700">{filteredFarmers.length}</span> {viewType === 'Farmers' ? 'farmers' : 'regions'}
              {filter !== 'Global' && viewType === 'Farmers' && ` in your ${filter.toLowerCase()}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
