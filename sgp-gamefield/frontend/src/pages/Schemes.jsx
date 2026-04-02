import { motion, AnimatePresence } from 'framer-motion';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Award from 'lucide-react/dist/esm/icons/award';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Search from 'lucide-react/dist/esm/icons/search';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Filter from 'lucide-react/dist/esm/icons/filter';
import Info from 'lucide-react/dist/esm/icons/info';
import Package from 'lucide-react/dist/esm/icons/package';
import PlayCircle from 'lucide-react/dist/esm/icons/play-circle';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Droplets from 'lucide-react/dist/esm/icons/droplets';
import { useState } from 'react';

const Schemes = ({ user }) => {
  const [filter, setFilter] = useState('All');
  
  const schemes = [
    {
      id: 1,
      title: "PM-Kisan Sustainable Subsidy",
      category: "Government",
      reward: "₹10,000 / Year",
      description: "Direct benefit transfer for farmers adopting organic fertilizers and drip irrigation.",
      requirements: ["Soil Health Card", "Drip System Certified", "Organic Practices Started"],
      progress: 66,
      status: "Likely Eligible",
      color: "emerald"
    },
    {
      id: 2,
      title: "Organic Certification Grant",
      category: "Local",
      reward: "₹25,000 Total",
      description: "Financial assistance for small-scale farmers to obtain official state organic certificates.",
      requirements: ["3-Year Plan", "Field Inspection", "Clean Water Source"],
      progress: 30,
      status: "In Progress",
      color: "blue"
    },
    {
      id: 3,
      title: "Solar Pump Incentive",
      category: "Central",
      reward: "70% Discount",
      description: "Get solar-powered water pumps at a highly subsidized rate through the state green initiative.",
      requirements: ["Electricity Bill", "Aadhaar Linked", "Land Records"],
      progress: 0,
      status: "Not Started",
      color: "amber"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 mt-10 px-4">
      {/* Page Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full border border-emerald-100 font-black text-sm uppercase tracking-widest shadow-sm">
          <ShieldCheck size={18} />
          <span>Incentives & Benefits</span>
        </div>
        <h1 className="text-6xl font-black text-green-900 tracking-tighter leading-[1.1]">Support Your <span className="text-emerald-500 italic">Sustainable Growth</span></h1>
        <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">Discover and apply for financial schemes designed specifically for sustainable farmers like you.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Schemes List */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-gray-800">Your Eligibility Hub</h2>
              <div className="flex gap-4">
                 <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 shadow-sm transition-all"><Filter size={18} /></button>
                 <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 shadow-sm transition-all"><Search size={18} /></button>
              </div>
           </div>

           <div className="space-y-6">
              {schemes.map((scheme) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={scheme.id} 
                  className="bg-white rounded-[2.5rem] p-8 border border-green-50 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-green-100 transition-all duration-500"
                >
                   <div className="flex flex-col md:flex-row gap-8 relative z-10">
                      <div className={`w-24 h-24 rounded-3xl shrink-0 flex items-center justify-center text-3xl font-black shadow-lg ${
                         scheme.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                         scheme.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                         ₹
                      </div>
                      <div className="flex-1 space-y-4">
                         <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                               <span className="text-xs font-black uppercase tracking-widest opacity-40 mb-1 block">{scheme.category}</span>
                               <h3 className="text-2xl font-black text-gray-800 tracking-tight group-hover:text-green-700 transition-colors">{scheme.title}</h3>
                            </div>
                            <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Benefit Value</p>
                               <p className="text-lg font-black text-emerald-600">{scheme.reward}</p>
                            </div>
                         </div>
                         <p className="text-gray-500 font-medium leading-relaxed">{scheme.description}</p>
                         
                         {/* Requirement Pills */}
                         <div className="flex flex-wrap gap-2 pt-2">
                            {scheme.requirements.map(req => (
                              <span key={req} className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-tighter text-gray-400 border border-gray-100 group-hover:bg-white group-hover:text-green-600 transition-all">
                                 <CheckCircle2 size={12} /> {req}
                              </span>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Footer Status & Progress */}
                   <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex-1 w-full space-y-2">
                         <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                            <span className="text-gray-400">Eligibility Progress</span>
                            <span className="text-green-600">{scheme.progress}%</span>
                         </div>
                         <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${scheme.progress}%` }} className={`h-full rounded-full ${scheme.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-200' : scheme.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'} shadow-lg`} />
                         </div>
                      </div>
                      <button className="w-full md:w-auto px-10 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200">
                         View Details
                      </button>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-10">
           {/* Summary Stats */}
           <div className="bg-[#1b4332] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10">
                 <ShieldCheck size={200} />
              </div>
              <p className="text-green-400 font-black uppercase tracking-widest text-xs mb-8 relative z-10">Scheme Wallet</p>
              <div className="space-y-1 relative z-10">
                 <p className="text-4xl font-black tracking-tight">₹35,000</p>
                 <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Potential Rewards</p>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-sm opacity-50 font-bold">Approved</span>
                    <span className="font-black">₹0</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm opacity-50 font-bold">In-Review</span>
                    <span className="font-black text-amber-400">₹25,000</span>
                 </div>
              </div>
           </div>

           {/* Qualification Tips */}
           <section className="bg-white p-10 rounded-[3rem] border border-green-50 shadow-sm">
              <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                 <Zap size={24} className="text-emerald-500" />
                 Quick Tips
              </h3>
              <div className="space-y-6">
                 <div className="flex gap-4 group cursor-pointer">
                    <div className="w-10 h-10 shrink-0 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black">?</div>
                    <div>
                       <p className="text-sm font-black text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">Soil Health Card</p>
                       <p className="text-[11px] text-gray-400 font-bold leading-relaxed">Required for 80% of central government farming subsidies.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 group cursor-pointer">
                    <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">!</div>
                    <div>
                       <p className="text-sm font-black text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Aadhaar Linked</p>
                       <p className="text-[11px] text-gray-400 font-bold leading-relaxed">Ensure your bank account is Aadhaar linked for DBT schemes.</p>
                    </div>
                 </div>
              </div>
              <hr className="my-8 border-gray-50" />
              <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest text-center leading-loose px-4">Updating regularly increases your eligibility verification speed by 3x.</p>
           </section>
        </aside>
      </div>
    </div>
  );
};

export default Schemes;
