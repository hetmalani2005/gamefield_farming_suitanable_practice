import { motion, AnimatePresence } from 'framer-motion';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import Award from 'lucide-react/dist/esm/icons/award';
import Droplets from 'lucide-react/dist/esm/icons/droplets';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Zap from 'lucide-react/dist/esm/icons/zap';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Upload from 'lucide-react/dist/esm/icons/upload';
import Play from 'lucide-react/dist/esm/icons/play';
import Filter from 'lucide-react/dist/esm/icons/filter';
import Search from 'lucide-react/dist/esm/icons/search';
import X from 'lucide-react/dist/esm/icons/x';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Irrigation', 'Soil', 'Organic', 'Rotation', 'Eco'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const categoryStyle = {
  Organic: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '🌿', gradient: 'from-emerald-400 to-teal-500' },
  Irrigation: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '💧', gradient: 'from-blue-400 to-cyan-500' },
  Rotation: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '🔄', gradient: 'from-amber-400 to-orange-500' },
  Soil: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '🪴', gradient: 'from-orange-400 to-red-500' },
  Eco: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: '🌍', gradient: 'from-teal-400 to-green-500' },
};

const difficultyColor = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700'
};

// Proof Upload Modal
const ProofModal = ({ mission, onClose, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(mission._id, file);
    setSubmitting(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-gray-900">Upload Proof 📸</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <p className="text-gray-400 font-medium text-sm mb-6">
          Mission: <span className="font-black text-gray-700">{mission.title}</span>
        </p>

        <label className="block border-2 border-dashed border-green-200 rounded-2xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all">
          <input type="file" accept="image/*,video/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
          {file ? (
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <p className="font-bold text-green-700 text-sm">{file.name}</p>
              <p className="text-gray-400 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Upload size={24} className="text-gray-400" />
              </div>
              <p className="font-bold text-gray-500 text-sm">Tap to select photo/video</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG, MP4 • Max 50MB</p>
            </div>
          )}
        </label>

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black text-sm uppercase tracking-wide shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={16} />}
            {submitting ? 'Submitting...' : 'Complete Mission'}
          </button>
          <button onClick={onClose} className="px-5 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-black text-sm hover:bg-gray-200 transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Mission Card
const MissionCard = ({ mission, index, completedIds, activeIds, onStart, onUploadProof }) => {
  const [expanded, setExpanded] = useState(false);
  const style = categoryStyle[mission.category] || categoryStyle.Eco;
  const isCompleted = completedIds.includes(mission._id);
  const isActive = activeIds.includes(mission._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`group bg-white rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${isCompleted ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-gray-100'}`}
    >
      {/* Card Header */}
      <div className={`relative h-36 flex items-center justify-center overflow-hidden bg-gradient-to-br ${style.gradient} bg-opacity-10`}
        style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-10`} />
        <div className="relative z-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {style.icon}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider bg-white/80 backdrop-blur ${difficultyColor[mission.difficulty] || 'bg-gray-100 text-gray-600'}`}>
            {mission.difficulty || 'Medium'}
          </span>
        </div>
        {isCompleted && (
          <div className="absolute top-4 left-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle2 size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
            {mission.category}
          </span>
          <div className="flex items-center gap-1 text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full">
            <Zap size={12} />{mission.xpReward} XP
          </div>
        </div>

        <h3 className="text-lg font-black text-gray-800 mb-2 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">{mission.title}</h3>
        <p className="text-gray-400 font-medium text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{mission.description || mission.goal}</p>

        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4">
          {mission.estimatedTime && <span className="flex items-center gap-1"><Clock size={12} />{mission.estimatedTime}</span>}
          {mission.badgeReward?.name && <span className="flex items-center gap-1"><Award size={12} />{mission.badgeReward.name}</span>}
        </div>

        {/* Expandable Steps */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full py-2 text-xs font-black text-green-600 border border-green-100 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 mb-4"
        >
          {expanded ? 'Hide Steps' : 'View Step-by-Step Guide'}
          <ChevronRight size={14} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {expanded && (mission.steps?.length > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 space-y-3">
                <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 size={10} /> Steps
                </h4>
                {mission.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-emerald-800 text-xs font-semibold leading-relaxed">
                      {typeof step === 'string' ? step : step.content}
                    </p>
                  </div>
                ))}
              </div>
              {/* Tools & Why */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {(mission.requiredMaterials?.length > 0 || mission.toolsRequired?.length > 0) && (
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">🧰 Tools</p>
                    {(mission.requiredMaterials || mission.toolsRequired || []).slice(0, 3).map((m, i) => (
                      <p key={i} className="text-xs font-semibold text-gray-600">• {m}</p>
                    ))}
                  </div>
                )}
                {(mission.whyImportant || (mission.benefits && mission.benefits[0])) && (
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-[9px] font-black text-blue-900 uppercase tracking-widest mb-1.5">🧠 Why</p>
                    <p className="text-xs font-semibold text-blue-800 line-clamp-3">
                      {mission.whyImportant || (mission.benefits && mission.benefits[0]) || "Improves sustainability"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {isCompleted ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700 font-black text-sm">
            <CheckCircle2 size={16} /> Mission Completed!
          </div>
        ) : (
          <div className="flex gap-2 mt-auto">
            {!isActive ? (
              <button
                onClick={() => onStart(mission._id)}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wide shadow-lg shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Play size={14} /> Start
              </button>
            ) : (
              <div className="flex-shrink-0 px-3 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100 flex items-center gap-1">
                <Zap size={12} /> Active
              </div>
            )}
            <button
              onClick={() => onUploadProof(mission)}
              className="flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl font-black text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={14} /> Proof
            </button>
            <Link
              to={`/missions/${mission._id}`}
              className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-black text-xs transition-colors flex items-center"
            >
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Missions = ({ user }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [proofMission, setProofMission] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [missionsRes, profileRes] = await Promise.all([
          api.get('/missions'),
          api.get('/auth/profile')
        ]);
        setMissions(missionsRes.data);
        setUserProfile(profileRes.data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const completedIds = userProfile?.completedMissions?.map(m => m.missionId?._id || m.missionId) || [];
  const activeIds = userProfile?.activeMissions?.map(m => m.missionId?._id || m.missionId) || [];

  const handleStart = async (missionId) => {
    try {
      await api.post('/missions/start', { missionId });
      const res = await api.get('/auth/profile');
      setUserProfile(res.data);
      showToast('Mission started! Good luck 🚀');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error starting mission', 'error');
    }
  };

  const handleComplete = async (missionId, file) => {
    try {
      let proofUrl = 'proof_uploaded';
      if (file) {
        const formData = new FormData();
        formData.append('proof', file);
        formData.append('missionId', missionId);
        try {
          const uploadRes = await api.post('/missions/complete', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          proofUrl = uploadRes.data?.proofUrl || 'uploaded';
        } catch {
          await api.post('/missions/complete', { missionId, proofUrl: 'proof_submitted' });
        }
      } else {
        await api.post('/missions/complete', { missionId, proofUrl: 'proof_submitted' });
      }
      const res = await api.get('/auth/profile');
      setUserProfile(res.data);
      showToast('Mission completed! XP & Badge awarded 🎉');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error completing mission', 'error');
    }
  };

  const filtered = missions.filter(m => {
    if (activeCategory !== 'All' && m.category !== activeCategory) return false;
    if (activeDifficulty !== 'All' && m.difficulty !== activeDifficulty) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
        <p className="text-green-700 font-bold text-sm">Loading missions...</p>
      </div>
    </div>
  );

  const totalXP = filtered.reduce((acc, m) => acc + (m.xpReward || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 mt-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'} text-white`}
          >
            {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proof Modal */}
      <AnimatePresence>
        {proofMission && (
          <ProofModal
            mission={proofMission}
            onClose={() => setProofMission(null)}
            onSubmit={handleComplete}
          />
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <section className="relative bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] rounded-[2.5rem] overflow-hidden p-10 text-white shadow-2xl shadow-green-100">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-16 opacity-10">
          <Sprout size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold border border-white/20 mb-5">
              🌾 Farmer Missions
            </span>
            <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-3">
              Your Sustainable<br /><span className="text-emerald-300">Growth Path</span>
            </h1>
            <p className="text-white/70 font-medium max-w-lg">
              Complete missions to earn XP, unlock badges, and qualify for government subsidies while improving your farm.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center border border-white/20">
              <p className="text-3xl font-black">{missions.length}</p>
              <p className="text-xs font-bold opacity-70 uppercase tracking-wider">Missions</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center border border-white/20">
              <p className="text-3xl font-black">{completedIds.length}</p>
              <p className="text-xs font-bold opacity-70 uppercase tracking-wider">Completed</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center border border-white/20">
              <p className="text-3xl font-black">{userProfile?.xp || 0}</p>
              <p className="text-xs font-bold opacity-70 uppercase tracking-wider">Total XP</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center border border-white/20">
              <p className="text-3xl font-black">{userProfile?.badges?.length || 0}</p>
              <p className="text-xs font-bold opacity-70 uppercase tracking-wider">Badges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Missions Grid Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-black text-gray-900">Your Missions</h2>
        <p className="text-sm font-bold text-emerald-600">
          <Zap size={14} className="inline mr-1" />{totalXP.toLocaleString()} XP Available
        </p>
      </div>

      {/* Missions Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-black text-gray-700 mb-2">No missions found</h3>
          <p className="text-gray-400 font-medium">Try adjusting your filters or search terms</p>
          <button onClick={() => { setActiveCategory('All'); setActiveDifficulty('All'); setSearch(''); }} className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-black text-sm hover:bg-green-700 transition-colors">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mission, i) => (
            <MissionCard
              key={mission._id || i}
              mission={mission}
              index={i}
              completedIds={completedIds}
              activeIds={activeIds}
              onStart={handleStart}
              onUploadProof={setProofMission}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Missions;
