import React, { useState, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      onClick={handleScrollTop}
      className={`fixed bottom-8 right-8 w-[46px] h-[46px] rounded-full bg-darkGray/60 border border-glass-border backdrop-blur-[10px] text-white flex items-center justify-center z-[999] opacity-0 invisible translate-y-[15px] transition-all duration-500 shadow-glass outline-none hover:bg-primary hover:border-secondary hover:shadow-[0_0_25px_rgba(217,4,41,0.35)] hover:-translate-y-1 md:bottom-6 md:right-5 md:w-10 md:h-10 ${
        visible ? 'opacity-100 !visible translate-y-0' : ''
      }`}
      aria-label="Back to top"
    >
      <FaChevronUp size={16} />
    </button>
  );
};

export default BackToTop;
