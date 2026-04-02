import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Award from 'lucide-react/dist/esm/icons/award';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Lock from 'lucide-react/dist/esm/icons/lock';
import Download from 'lucide-react/dist/esm/icons/download';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

const BADGE_LEVELS = [
  { xpThreshold: 1000, title: 'Farming Champion', icon: '👑', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', gradient: 'from-yellow-400 to-amber-600', seal: '👑' },
  { xpThreshold: 600, title: 'Expert Farmer', icon: '🌾', color: 'bg-orange-100 text-orange-700 border-orange-200', gradient: 'from-orange-400 to-red-500', seal: '🌾' },
  { xpThreshold: 300, title: 'Smart Farmer', icon: '🚜', color: 'bg-blue-100 text-blue-700 border-blue-200', gradient: 'from-blue-400 to-indigo-600', seal: '🚜' },
  { xpThreshold: 150, title: 'Growing Farmer', icon: '🌿', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', gradient: 'from-emerald-400 to-green-600', seal: '🌿' },
  { xpThreshold: 50, title: 'Beginner Farmer', icon: '🌱', color: 'bg-green-100 text-green-700 border-green-200', gradient: 'from-green-400 to-emerald-500', seal: '🌱' }
];

const BadgeSystem = ({ user, onDownloadCertificate }) => {
  const currentXP = user?.xp || 0;
  const earnedBadges = user?.badges || [];
  
  const [selectedBadge, setSelectedBadge] = useState(null);

  const getNextBadge = () => {
    return [...BADGE_LEVELS].reverse().find(b => currentXP < b.xpThreshold);
  };

  const nextBadge = getNextBadge();
  const progress = nextBadge 
    ? Math.min(100, (currentXP / nextBadge.xpThreshold) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <Award size={120} />
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-black text-gray-900 text-lg">Badge Progress</h3>
                    <p className="text-xs font-bold text-gray-400">
                        {nextBadge ? `${nextBadge.xpThreshold - currentXP} XP left for ${nextBadge.title}` : 'Maximum level reached!'}
                    </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Award size={24} />
                </div>
            </div>

            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-green-600"
                />
            </div>
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>{currentXP} XP</span>
                <span>{nextBadge ? `${nextBadge.xpThreshold} XP` : 'MAX'}</span>
            </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 gap-3">
        {BADGE_LEVELS.map((badge, i) => {
          const isUnlocked = currentXP >= badge.xpThreshold;
          return (
            <motion.div
              key={badge.title}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between group ${
                isUnlocked 
                  ? 'bg-white border-gray-100 shadow-sm cursor-pointer' 
                  : 'bg-gray-50 border-transparent opacity-60'
              }`}
              onClick={() => isUnlocked && setSelectedBadge(badge)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 ${
                    isUnlocked ? badge.color : 'bg-gray-200 text-gray-400 border-gray-300'
                }`}>
                  {isUnlocked ? badge.icon : <Lock size={20} />}
                </div>
                <div>
                  <h4 className={`font-black text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {badge.xpThreshold} XP REQUIRED
                  </p>
                </div>
              </div>
              
              {isUnlocked ? (
                <div className="flex items-center gap-2">
                    <span className="text-emerald-500 text-xs font-black bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> UNLOCKED
                    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownloadCertificate(badge);
                        }}
                        className="p-2 bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors"
                        title="Download Certificate"
                    >
                        <Download size={18} />
                    </button>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                onClick={() => setSelectedBadge(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${selectedBadge.gradient} opacity-10`} />
                    
                    <div className="relative z-10">
                        <div className={`w-32 h-32 mx-auto mb-6 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-6xl border-4 ${selectedBadge.color.split(' ')[2]}`}>
                            {selectedBadge.icon}
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedBadge.title}</h2>
                        <p className="text-gray-500 font-bold text-sm mb-8">
                            Congratulations! You've reached the {selectedBadge.title} status by earning over {selectedBadge.xpThreshold} XP.
                        </p>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={() => onDownloadCertificate(selectedBadge)}
                                className={`w-full py-4 bg-gradient-to-r ${selectedBadge.gradient} text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all`}
                            >
                                <Download size={18} /> Download Certificate
                            </button>
                            <button 
                                onClick={() => setSelectedBadge(null)}
                                className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgeSystem;
