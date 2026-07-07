import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTint } from 'react-icons/fa';

// Ambient drifting particles helper inside Hero
const HeroParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 4,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: Math.random() * 12 + 10,
      scale: Math.random() * 0.5 + 0.8,
      wobble: Math.random() * 40 - 20
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="drift-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'var(--color-secondary)',
            '--delay': `${p.delay}s`,
            '--duration': `${p.duration}s`,
            '--left': `${p.left}%`,
            '--scale': p.scale,
            '--wobble': `${p.wobble}px`
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * 0.015;
    const y = (clientY - window.innerHeight / 2) * 0.015;
    setParallaxOffset({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden bg-darkBg">
      
      {/* Background drifting particles */}
      <HeroParticles />

      {/* Decorative Gradient Orbs */}
      <div className="absolute w-[400px] h-[400px] bg-primary/10 rounded-full filter blur-[100px] -top-36 -left-36 pointer-events-none z-0" />
      <div className="absolute w-[450px] h-[450px] bg-secondary/8 rounded-full filter blur-[120px] bottom-10 right-10 pointer-events-none z-0" />

      {/* Heartbeat ECG background path */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 z-0">
        <svg className="w-full h-[300px]" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path 
            d="M0,10 L35,10 L38,6 L42,14 L46,2 L50,18 L54,8 L58,12 L61,10 L100,10" 
            fill="none" 
            stroke="var(--color-secondary)" 
            strokeWidth="0.3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 max-w-max bg-secondary/10 border border-secondary/20 py-2 px-4 rounded-full text-secondary font-semibold text-sm tracking-wider">
            <FaTint className="animate-pulse" /> EVERY DROP SAVES LIVES
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
            Every Drop Counts.<br />
            <span className="text-secondary bg-clip-text bg-gradient-to-r from-primary to-secondary">Every Donation</span> Saves a Life.
          </h1>
          <p className="text-lightGray/60 text-lg leading-relaxed max-w-[480px]">
            Connect blood donors with people in need through one smart platform. Save lives with instant matching and modern tracking.
          </p>
          <div className="flex gap-4 flex-wrap mt-2">
            <Link to="/register" className="font-body font-semibold text-white py-3.5 px-8 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_25px_var(--color-secondary)] rounded-xl transition-all duration-300">
              Donate Blood
            </Link>
            <Link to="/login" className="font-body font-semibold text-white py-3.5 px-8 border border-glass-border bg-darkGray/30 rounded-xl hover:border-glass-border-hover hover:bg-darkGray/50 transition-all duration-300 backdrop-blur">
              Request Blood
            </Link>
          </div>
        </motion.div>

        {/* Right Column Illustration with mouse parallax */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={{ x: parallaxOffset.x * -0.6, y: parallaxOffset.y * -0.6 }}
          className="relative flex justify-center items-center"
        >
          <div className="absolute w-[350px] h-[350px] bg-secondary/10 rounded-full filter blur-3xl animate-[logo-morph_8s_ease-in-out_infinite]" />
          <div className="relative border border-glass-border bg-darkGray/30 backdrop-blur p-4 rounded-3xl shadow-premium max-w-[420px] sm:max-w-full overflow-hidden transition-all">
            <img 
              src="/hero_donation_illustration.png" 
              alt="BloodConnect digital coordination network" 
              className="w-full h-auto object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </motion.div>
      </div>

      {/* Mouse Scroll Indicator */}
      <a 
        href="#statistics" 
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById('statistics');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group z-25 text-xs text-lightGray/40 font-semibold tracking-widest text-shadow"
      >
        <div className="w-[22px] h-[35px] rounded-[15px] border-2 border-lightGray/25 p-1 flex justify-center transition-colors group-hover:border-secondary">
          <div className="w-[3px] h-[6px] rounded-full bg-secondary animate-[mouse-wheel-bounce_1.5s_infinite_ease-in-out]" />
        </div>
        <span className="group-hover:text-white transition-colors">SCROLL DOWN</span>
      </a>

      {/* Bottom transition wave divider */}
      <div className="absolute bottom-0 left-0 w-full h-[60px] pointer-events-none z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,60 C150,100 350,120 600,80 C850,40 1050,90 1200,60 L1200,120 L0,120 Z" fill="var(--color-dark-bg)"></path>
        </svg>
      </div>

      <style>{`
        @keyframes logo-morph {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          33% { border-radius: 50% 50% 30% 70% / 50% 60% 40% 50%; }
          66% { border-radius: 60% 40% 60% 40% / 40% 50% 50% 60%; }
          100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }
        @keyframes mouse-wheel-bounce {
          0% { transform: translateY(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
