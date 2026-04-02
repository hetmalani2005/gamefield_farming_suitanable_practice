import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Lock from 'lucide-react/dist/esm/icons/lock';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import Mail from 'lucide-react/dist/esm/icons/mail';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Eye from 'lucide-react/dist/esm/icons/eye';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import Leaf from 'lucide-react/dist/esm/icons/leaf';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'
];

const InputField = ({ icon: Icon, label, showPassword, onTogglePassword, ...props }) => (
  <div className="group">
    <label className="text-[10px] font-black uppercase tracking-widest text-green-900 mb-2 block opacity-60">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
      <input
        {...props}
        className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white transition-all outline-none font-semibold text-sm shadow-sm placeholder-gray-300"
      />
      {onTogglePassword && (
        <button type="button" onClick={onTogglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  </div>
);

const Auth = ({ setUser }) => {
  const [mode, setMode] = useState('login'); // login | register | step2
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    village: '', district: '', state: ''
  });

  const set = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && !formData.phone && !formData.email) {
      return setError('Please provide phone or email');
    }
    if (mode === 'register') {
      setMode('step2');
      return;
    }

    setLoading(true);
    try {
      const isRegister = mode === 'step2';
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim() || 'Farmer',
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        village: formData.village,
        district: formData.district,
        state: formData.state
      } : {
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      };

      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      localStorage.setItem('agriquest_token', data.token);
      localStorage.setItem('agriquest_user', JSON.stringify(data.user));
      setUser(data.user);

      if (data.user.farmData?.cropType || data.user.farmData?.farmSize > 0) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: { x: 60, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -60, opacity: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] px-4 py-12">
      {/* Background orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[50%] aspect-square bg-green-100 rounded-full blur-[120px] opacity-40 -z-10" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] aspect-square bg-emerald-100 rounded-full blur-[120px] opacity-40 -z-10" />

      {/* Floating leaf accents */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 left-16 text-green-200 hidden lg:block"
      >
        <Leaf size={48} />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 right-16 text-emerald-200 hidden lg:block"
      >
        <Sprout size={64} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-green-100/60 p-8 border border-green-50/80 relative overflow-hidden"
      >
        {/* Card bg accent */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.04] scale-[2] rotate-12">
          <Sprout size={200} />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200 rotate-3">
              <Sprout size={32} />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              {(mode === 'step2') && (
                <button onClick={() => setMode('register')} className="text-gray-400 hover:text-green-600 transition-colors">
                  <ChevronLeft size={20} />
                </button>
              )}
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {mode === 'login' ? 'Welcome Back 🌾' : mode === 'register' ? 'Join Vasudhaara 🌱' : 'Your Farm Location 📍'}
              </h1>
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {mode === 'login' ? 'Sign in to your farmer account' :
               mode === 'register' ? 'Create your sustainable farming account' :
               'Tell us where your farm is located'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center border border-red-100"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'login' && (
                <>
                  <InputField
                    icon={Phone}
                    label="Phone / Email"
                    type="text"
                    placeholder="9876543210 or email@example.com"
                    value={formData.phone || formData.email}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v.includes('@')) setFormData(p => ({ ...p, email: v, phone: '' }));
                      else setFormData(p => ({ ...p, phone: v, email: '' }));
                    }}
                    required
                    id="login-phone-email"
                  />
                  <InputField
                    icon={Lock}
                    label="Password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={set('password')}
                    required
                    showPassword={showPwd}
                    onTogglePassword={() => setShowPwd(p => !p)}
                    id="login-password"
                  />
                </>
              )}

              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField icon={UserIcon} label="First Name" type="text" placeholder="Ramesh" value={formData.firstName} onChange={set('firstName')} required id="reg-firstname" />
                    <InputField icon={UserIcon} label="Last Name" type="text" placeholder="Patil" value={formData.lastName} onChange={set('lastName')} id="reg-lastname" />
                  </div>
                  <InputField icon={Mail} label="Email Address" type="email" placeholder="ramesh@gmail.com" value={formData.email} onChange={set('email')} id="reg-email" />
                  <InputField icon={Phone} label="Mobile Number" type="tel" placeholder="9876543210" value={formData.phone} onChange={set('phone')} required id="reg-phone" />
                  <InputField
                    icon={Lock}
                    label="Password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={set('password')}
                    required
                    minLength={6}
                    showPassword={showPwd}
                    onTogglePassword={() => setShowPwd(p => !p)}
                    id="reg-password"
                  />
                </>
              )}

              {mode === 'step2' && (
                <>
                  <InputField icon={MapPin} label="Village / Town" type="text" placeholder="e.g. Kopargaon" value={formData.village} onChange={set('village')} id="reg-village" />
                  <InputField icon={MapPin} label="District" type="text" placeholder="e.g. Ahmednagar" value={formData.district} onChange={set('district')} id="reg-district" />
                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-green-900 mb-2 block opacity-60">State</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        value={formData.state}
                        onChange={set('state')}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white transition-all outline-none font-semibold text-sm shadow-sm appearance-none"
                        id="reg-state"
                      >
                        <option value="">Select your state</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                type="submit"
                id="auth-submit-btn"
                className="w-full mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-green-200/60 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Continue' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-7 text-center">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className="text-gray-400 font-semibold text-sm hover:text-green-600 transition-colors"
              >
                Don't have an account? <span className="text-green-600 font-black">Sign up free</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="text-gray-400 font-semibold text-sm hover:text-green-600 transition-colors"
              >
                Already a member? <span className="text-green-600 font-black">Sign in</span>
              </button>
            )}
          </div>

          {/* Progress dots for register */}
          {(mode === 'register' || mode === 'step2') && (
            <div className="flex justify-center gap-2 mt-6">
              <div className={`w-8 h-1.5 rounded-full transition-colors ${mode === 'register' ? 'bg-green-600' : 'bg-green-200'}`} />
              <div className={`w-8 h-1.5 rounded-full transition-colors ${mode === 'step2' ? 'bg-green-600' : 'bg-green-200'}`} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
