import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import LayoutGrid from 'lucide-react/dist/esm/icons/layout-grid';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Search from 'lucide-react/dist/esm/icons/search';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';

const Navbar = ({ user }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutGrid },
    { name: 'Missions', path: '/missions', icon: Sprout },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Schemes', path: '/schemes', icon: ShieldCheck },
  ];

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-2xl border-b border-green-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                 <Sprout size={28} className="text-white" />
              </div>
              <span className="text-2xl font-black text-[#1b4332] tracking-tighter">Vasud<span className="text-green-500">haara</span></span>
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`relative px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-2 group ${
                    isActive ? 'text-green-700' : 'text-gray-400 hover:text-green-600'
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="nav-bg" className="absolute inset-0 bg-white shadow-sm border border-green-50 rounded-xl" />
                  )}
                  <item.icon size={17} className={`relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-green-600' : 'text-gray-300'}`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
              <TrendingUp size={15} className="text-amber-500" />
              <div>
                <p className="text-[9px] font-black uppercase text-amber-400 tracking-widest leading-none">XP</p>
                <p className="text-sm font-black text-amber-800 leading-none">{(user?.xp || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
               <Leaf size={15} className="text-emerald-500" />
               <div>
                  <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest leading-none">Eco</p>
                  <p className="text-sm font-black text-emerald-800 leading-none">{user?.sustainabilityScore || 0}</p>
               </div>
            </div>

            <button className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors rounded-xl hover:bg-green-50">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
            </button>

            <Link to="/profile" className="flex items-center gap-3 group">
               <div className="text-right hidden md:block">
                  <p className="text-xs font-black text-gray-800 leading-none mb-0.5">{user?.firstName || user?.name?.split(' ')[0] || 'Farmer'}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Lvl {user?.level || 1}</p>
               </div>
               <div className="w-10 h-10 bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-lg group-hover:scale-110 transition-all duration-300">
                  {user?.name?.charAt(0)?.toUpperCase() || <UserIcon size={18} />}
               </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
        <div className="flex items-center justify-around py-3 px-4 max-w-lg mx-auto">
          {[...navItems, { name: 'Profile', path: '/profile', icon: UserIcon }].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${isActive ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}
              >
                <item.icon size={20} />
                <span className="text-[9px] font-black uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
