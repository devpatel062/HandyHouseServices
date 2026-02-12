import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import SmartRecommendations from '../components/SmartRecommendations';
import Chatbot from '../components/chatbotComponent';

export const HomePage = () => {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const accentGradient = 'linear-gradient(135deg, #e0e7ff 0%, #2563eb 100%)'; // professional blue gradient

  const handleServiceSelect = (serviceName) => {
    // Navigate to repair services page and potentially filter by service
    navigate('/repairServices', { state: { selectedService: serviceName } });
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: accentGradient }}>
      {/* Chatbot FAB */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Chatbot Window */}
        {showChatbot && (
          <motion.div 
            initial={{ opacity:0, y:20, scale: 0.95 }} 
            animate={{ opacity:1, y:0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }} 
            className="mb-2 pointer-events-auto origin-bottom-right"
          >
            <Chatbot onClose={() => setShowChatbot(false)} />
          </motion.div>
        )}

        {/* Floating Button Container */}
        <div className="flex items-center gap-4 pointer-events-auto relative">
          
          {/* Smart Notification - Points to button */}
          {!showChatbot && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="hidden md:flex bg-white text-slate-800 px-4 py-2.5 rounded-xl shadow-xl border border-slate-100 items-center gap-3 mr-2"
            >
              <span className="text-lg">✨</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Smart AI Assistance</span>
                <span className="text-[10px] text-slate-500 font-medium">I can help you find & book services!</span>
              </div>
              {/* Arrow */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white border-t border-r border-slate-100 transform rotate-45"></div>
            </motion.div>
          )}

          {/* Main FAB */}
          <button
            aria-label={showChatbot ? 'Close chatbot' : 'Open chatbot'}
            onClick={() => setShowChatbot(p => !p)}
            className={`
              group relative flex items-center gap-2 pl-4 pr-5 py-3 
              rounded-full shadow-2xl transition-all duration-300
              ${showChatbot 
                ? 'bg-slate-800 text-white hover:bg-slate-900 rotate-0' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-blue-500/30'
              }
            `}
          >
             {/* Pulse Effect Background */}
             {!showChatbot && (
               <span className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping duration-[2000ms]"></span>
             )}

            <div className={`transition-transform duration-300 ${showChatbot ? 'rotate-90 scale-90' : 'scale-100'}`}>
              {showChatbot ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </div>
            
            <span className={`font-semibold tracking-wide text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${showChatbot ? 'w-0 opacity-0 p-0' : 'w-auto opacity-100'}`}>
              AI Assistant
            </span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid gap-12 md:gap-16 md:grid-cols-2 items-center">
          {/* Left Text */}
          <div>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-blue-900"
              style={{}}
              initial={{ opacity:0, y:-25 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8 }}
            >
              Home Services Made Effortless
            </motion.h1>
            <motion.p
              className="mt-6 text-blue-800 text-base md:text-lg max-w-md"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:0.3, duration:0.7 }}
            >
              Book trusted professionals for cleaning, repairs, and custom household help. 
              <span className="block mt-2 font-semibold text-blue-900">
                 ✨ Try our unique AI Assistant (bottom right) for instant booking help—the feature that sets us apart!
              </span>
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.5, duration:0.6 }}
            >
              <button
                onClick={() => navigate('/repairServices')}
                className="px-6 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition focus:outline-none focus:ring-4 focus:ring-blue-300"
                style={{ background: accentGradient }}
              >
                Browse Services
              </button>
              <button
                onClick={() => document.getElementById('recommendations')?.scrollIntoView({ behavior:'smooth' })}
                className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 transition shadow"
              >
                View Recommendations
              </button>
            </motion.div>

            {/* Feature bullets */}
            <ul className="mt-10 space-y-4">
              {[
                'Advanced AI Assistant for instant help',
                'Vetted & trusted professionals',
                'Transparent pricing and seamless booking',
                'Smart location‑based recommendations',
                'Dedicated support & secure platform'
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-blue-700">
                  <span className="mt-1 inline-flex w-5 h-5 rounded-full text-white text-xs items-center justify-center shadow" style={{ background: accentGradient }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Visual Panel */}
          <motion.div
            className="relative"
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.2, duration:0.8 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-100 bg-white/70 backdrop-blur">
              <div className="absolute inset-0 opacity-30" style={{ background: accentGradient }} />
              <div className="relative p-8 grid grid-cols-3 gap-4 text-center">
                {[
                  { icon:'🧹', label:'Cleaning' },
                  { icon:'🔧', label:'Repairs' },
                  { icon:'⚡', label:'Electrical' },
                  { icon:'🚰', label:'Plumbing' },
                  { icon:'🌿', label:'Gardening' },
                  { icon:'🛠️', label:'Custom Jobs' },
                ].map(f => (
                  <div key={f.label} className="rounded-xl bg-white/80 backdrop-blur flex flex-col items-center py-5 text-xs font-medium text-blue-700 shadow border border-blue-100">
                    <div className="text-2xl mb-2 drop-shadow">{f.icon}</div>
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full blur-2xl opacity-40" style={{ background: accentGradient }} />
          </motion.div>
        </div>
      </section>

      {/* Smart Recommendations */}
      <section id="recommendations" className="px-6 pb-32">
        <div className="mx-auto max-w-6xl rounded-3xl border border-blue-100 bg-white/80 backdrop-blur shadow-xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-40" style={{ background: accentGradient }} />
          <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: accentGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Popular Bookings Near You</h2>
          <SmartRecommendations onServiceSelect={handleServiceSelect} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
