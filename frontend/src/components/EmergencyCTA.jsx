import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';

const EmergencyCTA = () => {
  return (
    <section id="emergency-cta" className="py-20 relative z-10 bg-gradient-to-b from-darkBg to-[#110002] overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute w-[400px] h-[400px] bg-primary/10 rounded-full filter blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col items-center gap-6 relative z-10">
        <div className="text-primary animate-[cta-heart-pulse_1.5s_infinite_cubic-bezier(0.215,0.61,0.355,1)]">
          <FaHeartbeat size={64} className="filter drop-shadow-[0_0_15px_rgba(217,4,41,0.6)]" />
        </div>
        
        <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
          Need Blood Urgently?
        </h2>
        <p className="text-lightGray/70 text-lg max-w-[500px] leading-relaxed">
          Broadcast an emergency request and notify compatible donors in your city within minutes.
        </p>
        
        <div className="flex gap-4 flex-wrap mt-4 justify-center">
          <Link 
            to="/login" 
            className="font-body font-bold text-white py-4 px-8 bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_var(--color-primary)] hover:shadow-[0_0_25px_var(--color-secondary)] hover:scale-105 rounded-xl transition-all"
          >
            Request Blood Now
          </Link>
          <Link 
            to="/register" 
            className="font-body font-bold text-white py-4 px-8 border border-secondary/35 bg-darkGray/30 hover:bg-darkGray/50 hover:border-secondary/60 rounded-xl transition-all"
          >
            Become a Donor
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes cta-heart-pulse {
          0% { transform: scale(1); }
          15% { transform: scale(1.1); }
          30% { transform: scale(1); }
          45% { transform: scale(1.1); }
          70% { transform: scale(1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default EmergencyCTA;
