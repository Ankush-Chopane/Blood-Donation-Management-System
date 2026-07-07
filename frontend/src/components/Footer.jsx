import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#06070a] border-t border-white/5 pt-20 pb-8 relative overflow-hidden z-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-5 col-span-1 sm:col-span-2 lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-2 group max-w-max">
              <span className="text-[1.6rem] filter drop-shadow-[0_0_10px_rgba(239,35,60,0.5)]">❤️</span>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Blood<span className="text-secondary">Connect</span>
              </span>
            </a>
            <p className="text-lightGray/50 text-[0.92rem] leading-relaxed max-w-[320px]">
              Connecting donors with recipients instantly through a decentralized, real-time matching network. Every drop saves a life.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-glass-border bg-white/2 text-lightGray flex items-center justify-center transition-all duration-300 hover:bg-secondary/10 hover:border-secondary hover:text-white hover:scale-110 hover:shadow-[0_0_10px_rgba(239,35,60,0.2)]" aria-label="Facebook">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-glass-border bg-white/2 text-lightGray flex items-center justify-center transition-all duration-300 hover:bg-secondary/10 hover:border-secondary hover:text-white hover:scale-110 hover:shadow-[0_0_10px_rgba(239,35,60,0.2)]" aria-label="Twitter">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-glass-border bg-white/2 text-lightGray flex items-center justify-center transition-all duration-300 hover:bg-secondary/10 hover:border-secondary hover:text-white hover:scale-110 hover:shadow-[0_0_10px_rgba(239,35,60,0.2)]" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-glass-border bg-white/2 text-lightGray flex items-center justify-center transition-all duration-300 hover:bg-secondary/10 hover:border-secondary hover:text-white hover:scale-110 hover:shadow-[0_0_10px_rgba(239,35,60,0.2)]" aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-heading text-[1.05rem] font-bold text-white uppercase tracking-wider mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-6 after:h-[2px] after:bg-secondary after:rounded">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              <li><a href="#hero" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">Home</a></li>
              <li><a href="#timeline" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">How It Works</a></li>
              <li><a href="#compatibility" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">Compatibility</a></li>
              <li><a href="#features" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">Features</a></li>
              <li><a href="#faq" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">FAQs</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col">
            <h3 className="font-heading text-[1.05rem] font-bold text-white uppercase tracking-wider mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-6 after:h-[2px] after:bg-secondary after:rounded">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              <li><a href="#donate" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">Donor Registry</a></li>
              <li><a href="#request" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">Emergency Requests</a></li>
              <li><a href="#blood-banks" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">Blood Bank Search</a></li>
              <li><a href="#compatibility" className="text-lightGray/50 text-[0.92rem] hover:text-white transition-all duration-300 hover:translate-x-1.5 inline-block">Matching Engine</a></li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div className="flex flex-col">
            <h3 className="font-heading text-[1.05rem] font-bold text-white uppercase tracking-wider mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-6 after:h-[2px] after:bg-primary after:rounded">
              Emergency
            </h3>
            <ul className="flex flex-col gap-4 text-lightGray/60 text-[0.92rem]">
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">Hotline:</span> +1 (800) 555-BLOOD
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary font-bold">Email:</span> urgent@bloodconnect.org
              </li>
              <li className="flex items-center gap-2">
                <span>Medical District, SF</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-5 text-lightGray/40 text-[0.85rem]">
          <div>&copy; 2026 BloodConnect. All Rights Reserved.</div>
          
          {/* ECG heartbeat center */}
          <div className="w-[120px] h-[20px] text-secondary opacity-30 animate-[footer-pulse-line_2.5s_infinite_ease-in-out]">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,10 L35,10 L38,7 L42,13 L45,3 L49,17 L52,8 L56,12 L59,10 L100,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex gap-5">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes footer-pulse-line {
          0% { opacity: 0.15; }
          50% { opacity: 0.45; }
          100% { opacity: 0.15; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
