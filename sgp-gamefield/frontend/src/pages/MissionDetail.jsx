import { motion, AnimatePresence } from 'framer-motion';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import Award from 'lucide-react/dist/esm/icons/award';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Cloudy from 'lucide-react/dist/esm/icons/cloudy';
import Sun from 'lucide-react/dist/esm/icons/sun';
import Droplets from 'lucide-react/dist/esm/icons/droplets';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Waves from 'lucide-react/dist/esm/icons/waves';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import BarChart from 'lucide-react/dist/esm/icons/bar-chart';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Info from 'lucide-react/dist/esm/icons/info';
import Package from 'lucide-react/dist/esm/icons/package';
import PlayCircle from 'lucide-react/dist/esm/icons/play-circle';
import Camera from 'lucide-react/dist/esm/icons/camera';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import api from '../utils/api';

const MissionDetail = () => {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStart = async () => {
    try {
      await api.post('/missions/start', { missionId: id });
      setIsStarted(true);
      // Simulate progress
      let interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } catch (err) {
      console.error("Error starting mission:", err);
      // Fallback for demo
      setIsStarted(true);
      setProgress(100);
    }
  };

  const handleUpload = async () => {
    try {
      await api.post('/missions/complete', { 
        missionId: id,
        proofUrl: "https://example.com/proof.jpg" 
      });
      setIsCompleted(true);
      setShowUpload(false);
    } catch (err) {
      console.error("Error completing mission:", err);
      // Fallback for demo
      setIsCompleted(true);
      setShowUpload(false);
    }
  };

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await api.get(`/missions/${id}`);
        setMission(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching mission details:", err);
        setLoading(false);
      }
    };
    fetchMission();
  }, [id]);

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );

  if (!mission) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-bold text-gray-500">Mission not found</p>
      <Link to="/missions" className="text-green-600 font-bold underline">Back to Missions</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 mt-6 px-4">
      {/* Hero Section */}
      <div className="relative h-96 rounded-[3.5rem] overflow-hidden group shadow-2xl mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-1000">
           <Sprout size={200} className="text-white" />
        </div>
        
        {/* Top Info Bar */}
        <div className="absolute top-8 left-10 right-10 z-20 flex items-center justify-between">
            <Link to="/missions" className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all">
               <ChevronLeft size={24} />
            </Link>
            <div className="flex gap-3">
               <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                  <TrendingUp size={16} /> +{mission.xpReward} XP
               </div>
               {isStarted && (
                 <div className="bg-emerald-500 px-4 py-2 rounded-full text-white flex items-center gap-2 text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40">
                    Active
                 </div>
               )}
            </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
           <p className="text-emerald-400 font-black uppercase tracking-widest text-sm mb-4 bg-emerald-950/40 w-fit px-3 py-1 rounded-lg border border-emerald-500/30">{mission.category} Mission</p>
           <h1 className="text-6xl font-black tracking-tighter mb-6 max-w-3xl">{mission.title}</h1>
           <div className="flex flex-wrap items-center gap-8 opacity-90">
              <div className="flex items-center gap-2 font-bold"><Clock size={20} /> {mission.estimatedTime || 'Flexible Time'}</div>
              <div className="flex items-center gap-2 font-bold"><Zap size={20} /> {mission.difficulty} Difficulty</div>
              <div className="flex items-center gap-2 font-bold"><MapPin size={20} /> On-Field</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Mission Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Mission Progress Tracker (If started) */}
          {isStarted && (
            <motion.section initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-[3rem] border-4 border-emerald-500 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-gray-800">Mission In-Progress</h2>
                 <span className="text-emerald-600 font-black text-xl">{progress}%</span>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                 <motion.div animate={{ width: `${progress}%` }} className="h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"></motion.div>
              </div>
              <p className="text-gray-500 font-bold italic">"Consistency is the key to sustainable success. Keep moving forward!"</p>
            </motion.section>
          )}

          {/* Educational Content / Steps */}
          <section className="space-y-8">
            <h2 className="text-4xl font-black text-green-900 tracking-tight">Step-by-Step Instructions</h2>
            <div className="space-y-6">
               {(mission.steps || []).map((step, i) => (
                 <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-8 group">
                    <div className="flex flex-col items-center">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-green-800 shadow-lg border border-green-50 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                          {step.number || i + 1}
                       </div>
                       {i < (mission.steps?.length || 0) - 1 && <div className="w-[3px] h-full bg-green-100 my-2 rounded-full"></div>}
                    </div>
                    <div className="pt-2 pb-10">
                       <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors uppercase tracking-tight">Step {step.number || i + 1}</h3>
                       <p className="text-gray-500 font-medium leading-relaxed text-lg">{step.content}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
          </section>

          {/* Interactive Lab / Video Section */}
          <section className="bg-black/90 p-12 rounded-[3.5rem] relative overflow-hidden group">
             <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-full md:w-1/2 aspect-video bg-gray-800 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center shadow-2xl">
                   <div className="absolute inset-0 bg-center bg-cover opacity-60"></div>
                   <PlayCircle size={120} className="text-white opacity-40 group-hover:opacity-100 transition-opacity cursor-pointer group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 space-y-4">
                   <h3 className="text-2xl font-black text-white">Watch Implementation Guide</h3>
                   <p className="text-gray-400 font-medium">Learn from experts on how to set up your irrigation line without any specialized tools. Save time and 40% more water.</p>
                   <button className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors">
                      <PlayCircle size={24} /> Play Lesson
                   </button>
                </div>
             </div>
          </section>
        </div>

        {/* Requirements Sidebar */}
        <aside className="space-y-10">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm">
            <h3 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
               <Package className="text-blue-500" size={28} />
               Required Materials
            </h3>
            <ul className="space-y-4">
               {(mission.requiredMaterials || []).map((item, i) => (
                 <li key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="font-bold text-gray-700">{item}</span>
                 </li>
               ))}
            </ul>
          </div>

          <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 relative overflow-hidden group">
             <div className="absolute -top-4 -right-4 opacity-5">
                <Info size={120} />
             </div>
             <h3 className="text-2xl font-black text-emerald-900 mb-4">Bonus Incentive</h3>
             <p className="text-emerald-800/80 font-bold mb-8">Implementing this method correctly unlocks the <span className="text-emerald-900 font-extrabold uppercase tracking-widest text-xs">"{mission.badgeReward?.name || 'Achievement'}"</span> badge and {mission.xpReward} extra XP.</p>
             <div className="p-4 bg-white rounded-2xl flex items-center gap-4 shadow-sm border border-emerald-100">
                <Award size={40} className="text-amber-500" />
                <div>
                   <p className="font-extrabold text-gray-800 text-sm">{mission.badgeReward?.name || 'Achievement'}</p>
                   <p className="text-[10px] text-gray-400 font-black uppercase">Legendary Badge</p>
                </div>
             </div>
          </div>

          {/* Action Button */}
          {isCompleted ? (
            <div className="w-full py-8 bg-emerald-50 border-2 border-emerald-500 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-emerald-700">
               <CheckCircle2 size={48} className="animate-bounce" />
               <p className="font-black text-xl uppercase tracking-widest">Mission Completed!</p>
               <p className="text-sm font-bold opacity-70">+{mission.xpReward} XP & Badge Awarded</p>
            </div>
          ) : !isStarted ? (
            <button onClick={handleStart} className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-green-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4">
               Start Mission <ArrowRight size={24} />
            </button>
          ) : (
            <button onClick={() => setShowUpload(true)} className="w-full py-6 bg-black text-white rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4">
               Upload Proof <Camera size={24} />
            </button>
          )}
        </aside>
      </div>

      {/* Upload Modal (Simplified) */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative z-10 bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl">
               <h2 className="text-3xl font-black text-gray-900 mb-4">Upload Your Progress</h2>
               <p className="text-gray-500 font-bold mb-10">Please upload a photo or video of your drip system installation for verification.</p>
               <div className="border-4 border-dashed border-gray-100 rounded-[2rem] p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                  <Camera size={64} className="mx-auto text-gray-200 mb-6" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Click to browse media</p>
                  <input id="file-upload" type="file" className="hidden" />
               </div>
               <button onClick={handleUpload} className="w-full mt-10 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Submit Verification</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MissionDetail;
