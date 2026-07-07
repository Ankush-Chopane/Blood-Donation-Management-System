import React, { useState, useEffect } from 'react';
import { FaHeart, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';

const FAB = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleClose = () => setActive(false);
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    setActive(!active);
  };

  return (
    <div className="fixed bottom-8 right-[98px] z-[999] md:bottom-6 md:right-20">
      <button 
        onClick={handleToggle}
        className="w-12 h-12 rounded-full border-none bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,35,60,0.5)] hover:scale-110 hover:rotate-[15deg] hover:shadow-[0_0_20px_#EF233C] transition-all duration-300 outline-none"
        aria-label="Emergency options menu"
        aria-expanded={active}
      >
        <span className="text-xl"><FaHeart /></span>
      </button>
      
      <div className={`absolute bottom-[60px] left-1/2 -translate-x-1/2 flex flex-col gap-3 transition-all duration-300 pointer-events-none opacity-0 translate-y-5 ${
        active ? 'opacity-100 translate-y-0 pointer-events-auto' : ''
      }`}>
        <a 
          href="#emergency-cta" 
          onClick={(e) => {
            const target = document.getElementById('emergency-cta');
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-10 h-10 rounded-full bg-darkGray/80 border border-glass-border backdrop-blur-[10px] text-white flex items-center justify-center shadow-glass transition-all hover:bg-primary hover:border-secondary hover:scale-110 hover:shadow-[0_0_25px_rgba(217,4,41,0.35)] relative group"
          data-tooltip="Request Blood"
          aria-label="Request Blood Now"
        >
          <FaExclamationTriangle size={18} />
          <span className="absolute right-[50px] top-1/2 -translate-y-1/2 bg-[#0b0c10]/90 border border-glass-border text-white py-1.5 px-3 rounded-lg text-[0.8rem] font-body whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
            Request Blood
          </span>
        </a>
        <a 
          href="#faq" 
          onClick={(e) => {
            const target = document.getElementById('faq');
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-10 h-10 rounded-full bg-darkGray/80 border border-glass-border backdrop-blur-[10px] text-white flex items-center justify-center shadow-glass transition-all hover:bg-primary hover:border-secondary hover:scale-110 hover:shadow-[0_0_25px_rgba(217,4,41,0.35)] relative group"
          data-tooltip="FAQ Support"
          aria-label="View FAQ Support"
        >
          <FaQuestionCircle size={18} />
          <span className="absolute right-[50px] top-1/2 -translate-y-1/2 bg-[#0b0c10]/90 border border-glass-border text-white py-1.5 px-3 rounded-lg text-[0.8rem] font-body whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
            FAQ Support
          </span>
        </a>
      </div>
    </div>
  );
};

export default FAB;
