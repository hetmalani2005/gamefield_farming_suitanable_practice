import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import Layers2 from 'lucide-react/dist/esm/icons/layers-2';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import Mail from 'lucide-react/dist/esm/icons/mail';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Award from 'lucide-react/dist/esm/icons/award';
import Zap from 'lucide-react/dist/esm/icons/zap';
import BarChart from 'lucide-react/dist/esm/icons/bar-chart';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import X from 'lucide-react/dist/esm/icons/x';
import Save from 'lucide-react/dist/esm/icons/save';
import Sun from 'lucide-react/dist/esm/icons/sun';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import BadgeSystem from '../components/BadgeSystem';
import { generateBadgeCertificate } from '../utils/certificateGenerator';

const CROPS = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Tomato', 'Soybean', 'Maize', 'Potato', 'Onion', 'Pulses'];
const SOILS = ['Black/Clay', 'Red/Sandy', 'Loamy', 'Laterite'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

const BADGE_ICONS = {
  'beginner': '🌱',
  'smart': '🧠',
  'sustainable': '♻️',
  'water': '💧',
  'organic': '🌿',
  'eco': '🌍',
  'soil': '🪴',
  'rotation': '🔄',
  'default': '🏅'
};

const getBadgeIcon = (badgeId = '') => {
  const key = Object.keys(BADGE_ICONS).find(k => badgeId.toLowerCase().includes(k));
  return BADGE_ICONS[key] || BADGE_ICONS.default;
};

const Profile = ({ user: initialUser, setUser }) => {
  const [user, setLocalUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setLocalUser(res.data);
        if (setUser) setUser(res.data);
        localStorage.setItem('agriquest_user', JSON.stringify(res.data));
        setEditForm({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          cropType: res.data.selectedCrop || res.data.farmData?.cropType || '',
          soilType: res.data.soilType || res.data.farmData?.soilType || '',
          season: res.data.season || res.data.farmData?.season || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        name: `${editForm.firstName} ${editForm.lastName}`.trim() || user.name,
        email: editForm.email,
        selectedCrop: editForm.cropType,
        soilType: editForm.soilType,
        season: editForm.season,
        farmData: {
          cropType: editForm.cropType,
          soilType: editForm.soilType,
          season: editForm.season
        }
      };
      const res = await api.put('/auth/profile', payload);
      setLocalUser(res.data);
      if (setUser) setUser(res.data);
      localStorage.setItem('agriquest_user', JSON.stringify(res.data));
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agriquest_token');
    localStorage.removeItem('agriquest_user');
    setUser(null);
    navigate('/auth');
  };

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
        <p className="text-green-700 font-bold text-sm">Loading your profile...</p>
      </div>
    </div>
  );

  const stats = [
    { label: 'Total XP', value: (user?.xp || 0).toLocaleString(), icon: TrendingUp, color: 'from-amber-400 to-orange-500', text: 'text-amber-600' },
    { label: 'Level', value: user?.level || 1, icon: BarChart, color: 'from-blue-400 to-indigo-500', text: 'text-blue-600' },
    { label: 'Sustainability', value: `${user?.sustainabilityScore || 0}`, icon: Leaf, color: 'from-green-400 to-emerald-500', text: 'text-green-600' },
  ];

  const xpToNext = 1000 - ((user?.xp || 0) % 1000);
  const xpProgress = (((user?.xp || 0) % 1000) / 1000) * 100;

  return (
    <div className="max-w-6xl mx-auto pb-20 mt-4 px-4 space-y-8">
      {/* Success Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3"
          >
            <CheckCircle size={20} /> Profile saved!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Banner */}
      <div className="relative">
        <div className="h-52 rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] relative shadow-2xl">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, white 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }} />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 right-8 text-white/10"
          ><Sprout size={160} /></motion.div>
        </div>

        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-2xl flex items-center justify-center text-5xl font-black text-green-700 relative overflow-hidden group cursor-pointer">
            {user?.name?.charAt(0)?.toUpperCase() || 'F'}
          </div>
        </div>

        <div className="absolute bottom-4 right-6 flex gap-3">
          {!editing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl font-bold text-sm border border-white/30 hover:bg-white/30 transition-all"
              >
                <Edit3 size={16} /> Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/80 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl font-bold text-sm border border-red-400/30 hover:bg-red-600 transition-all"
              >
                <LogOut size={16} /> Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl font-bold text-sm border border-white/30 hover:bg-white/30 transition-all"
              >
                <X size={16} /> Cancel
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Name & basic info */}
      <div className="mt-20 px-2">
        <div className="flex items-start gap-4 flex-wrap">
          <div>
            {!editing ? (
              <>
                <h1 className="text-3xl font-black text-gray-900">{user?.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-500 font-semibold text-sm">
                  {user?.phone && <span className="flex items-center gap-1"><Phone size={14} /> {user.phone}</span>}
                  {user?.email && <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                <input className="px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold text-sm" placeholder="First Name" value={editForm.firstName} onChange={e => setEditForm(p => ({...p, firstName: e.target.value}))} />
                <input className="px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold text-sm" placeholder="Last Name" value={editForm.lastName} onChange={e => setEditForm(p => ({...p, lastName: e.target.value}))} />
                <input className="px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold text-sm" placeholder="Email" type="email" value={editForm.email} onChange={e => setEditForm(p => ({...p, email: e.target.value}))} />
              </div>
            )}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-black text-gray-700">XP Progress → Level {(user?.level || 1) + 1}</span>
            <span className="text-xs font-bold text-green-600">{xpToNext} XP needed</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-5 rounded-2xl border border-gray-50 shadow-sm text-center group hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xl font-black text-gray-800">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Details */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-5 border-b border-green-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                <Sprout size={20} />
              </div>
              <h2 className="font-black text-green-900">Farm Profile</h2>
            </div>
          </div>
          <div className="p-8">
            {!editing ? (
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Sprout, label: 'Crop Type', value: user?.selectedCrop || user?.farmData?.cropType || 'Not set', color: 'text-green-600 bg-green-50' },
                  { icon: Sun, label: 'Season', value: user?.season || user?.farmData?.season || 'Not set', color: 'text-amber-600 bg-amber-50' },
                  { icon: Layers2, label: 'Soil Type', value: user?.soilType || user?.farmData?.soilType || 'Not set', color: 'text-orange-600 bg-orange-50' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                      <p className="font-bold text-gray-800 text-sm mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Crop Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold text-sm bg-white" value={editForm.cropType} onChange={e => setEditForm(p => ({...p, cropType: e.target.value}))}>
                    <option value="">Select crop</option>
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Season</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold text-sm bg-white" value={editForm.season} onChange={e => setEditForm(p => ({...p, season: e.target.value}))}>
                    <option value="">Select season</option>
                    {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Soil Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold text-sm bg-white" value={editForm.soilType} onChange={e => setEditForm(p => ({...p, soilType: e.target.value}))}>
                    <option value="">Select soil</option>
                    {SOILS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Badges Section */}
      <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <Award size={28} className="text-amber-500" /> Badge Achievements
        </h2>
        <BadgeSystem user={user} onDownloadCertificate={(badge) => generateBadgeCertificate(user, badge)} />
      </section>
      </div>
    </div>
  );
};

export default Profile;
