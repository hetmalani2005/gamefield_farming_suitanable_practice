import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import Layers from 'lucide-react/dist/esm/icons/layers';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import api from '../utils/api';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    soilType: '',
    season: 'Kharif'
  });
  const [crops, setCrops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (step === 2) {
      api.get(`/crops?season=${formData.season}`)
         .then(res => setCrops(res.data))
         .catch(err => console.error(err));
    }
  }, [step, formData.season]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleComplete = () => {
    onComplete({ ...formData, level: 1, xp: 0, sustainabilityScore: 50 });
  };

  const steps = [
    { title: "Season", icon: Calendar, desc: "Select farming season" },
    { title: "Crop", icon: Sprout, desc: "What are you growing?" },
    { title: "Soil", icon: Layers, desc: "What is your soil type?" }
  ];

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-green-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>

      {/* Progress Bar Header */}
      <div className="max-w-4xl w-full mb-12">
        <div className="flex justify-between items-center mb-6">
           {steps.map((s, i) => (
             <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-500 ${step > i + 1 ? 'opacity-100' : step === i + 1 ? 'opacity-100 scale-110' : 'opacity-30'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  step > i + 1 ? 'bg-green-600 border-green-600' : step === i + 1 ? 'border-green-600 text-green-600 shadow-xl shadow-green-100' : 'border-gray-200'
                }`}>
                  {step > i + 1 ? <CheckCircle2 className="text-white" size={24} /> : <s.icon size={24} />}
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#1b4332]">{s.title}</p>
                </div>
             </div>
           ))}
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
           <motion.div initial={{ width: 0 }} animate={{ width: `${(step / 3) * 100}%` }} className="h-full bg-green-600"></motion.div>
        </div>
      </div>

      {/* Form Card */}
      <motion.div 
        key={step}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-2xl shadow-green-100/50 p-12 border border-green-50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
           <Sprout size={180} />
        </div>

        <section className="relative z-10">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Step {step} of 3</h1>
            <p className="text-gray-500 font-bold text-lg">{steps[step-1].desc}</p>
          </div>

          <div className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="group">
                  <label className="text-xs font-black uppercase tracking-widest text-green-900 mb-3 block opacity-60">Season of Cultivation</label>
                  <div className="flex gap-4">
                    {['Kharif', 'Rabi', 'Zaid'].map((s) => (
                      <button 
                         key={s}
                         onClick={() => setFormData({...formData, season: s})}
                         className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase transition-all ${formData.season === s ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-green-50'}`}
                      >
                         {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                   {['All', 'Vegetables', 'Fruits', 'Grains', 'Cash Crops'].map(cat => (
                     <button
                       key={cat}
                       onClick={() => setSelectedCategory(cat)}
                       className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-green-600 text-white shadow-md' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-200">
                   {crops.filter(c => selectedCategory === 'All' || c.category === selectedCategory).map(crop => (
                     <div 
                       key={crop._id || crop.name}
                       onClick={() => setFormData({...formData, cropType: crop.name})}
                       className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${formData.cropType === crop.name ? 'border-green-600 bg-green-50 shadow-md scale-[1.02]' : 'border-gray-100 bg-white hover:border-green-300'}`}
                     >
                        <div className="w-12 h-12 bg-green-100 rounded-xl mb-4 flex items-center justify-center text-green-700 font-black relative overflow-hidden">
                           <span className="absolute z-10">{crop.name[0]}</span>
                        </div>
                        <p className="font-black text-gray-800 text-base mb-2">{crop.name}</p>
                        <div className="text-[10px] text-gray-500 font-bold space-y-1.5 uppercase tracking-wide">
                           <p className="flex items-center gap-1.5"><Layers size={12} className="text-amber-500"/> {crop.idealSoil}</p>
                           <p className="flex items-center gap-1.5"><Calendar size={12} className="text-green-500"/> {crop.seasonDuration}</p>
                        </div>
                     </div>
                   ))}
                   {crops.length === 0 && <div className="col-span-2 text-center text-sm font-bold text-gray-400 py-8">Loading crops...</div>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="group">
                  <label className="text-xs font-black uppercase tracking-widest text-green-900 mb-3 block opacity-60">Soil Composition</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Black/Clay', 'Red/Sandy', 'Loamy', 'Laterite'].map(s => (
                       <button 
                         key={s}
                         onClick={() => setFormData({...formData, soilType: s})}
                         className={`py-6 rounded-[2rem] border-2 font-black text-sm transition-all ${formData.soilType === s ? 'bg-green-600 text-white border-green-600 shadow-xl scale-[1.05]' : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'}`}
                       >
                         {s}
                       </button>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-4">
                   <div className="text-2xl">💡</div>
                   <p className="text-xs font-bold text-amber-900/70 leading-relaxed">
                     Selecting the correct soil type helps our AI generate the most effective sustainable techniques for your farm.
                   </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 flex gap-4">
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="px-10 py-5 rounded-[2rem] bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-all"
              >
                Back
              </button>
            )}
            <button 
              onClick={step === 3 ? handleComplete : nextStep}
              className={`flex-1 px-10 py-5 rounded-[2rem] bg-green-600 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${
                (step === 2 && !formData.cropType) || (step === 3 && !formData.soilType) ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {step === 3 ? 'Complete Journey' : 'Next Step'} <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Onboarding;
