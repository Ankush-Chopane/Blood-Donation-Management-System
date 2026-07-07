import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaTint, FaHeart } from 'react-icons/fa';

const Timeline = () => {
  const steps = [
    { step: "01", icon: FaUserPlus, title: "Register", desc: "Create a user account, complete the basic eligibility quiz, and join as a donor or coordinate requests." },
    { step: "02", icon: FaSearch, title: "Find Blood", desc: "Instantly scan donor directories or find inventory levels in local registered blood banks." },
    { step: "03", icon: FaTint, title: "Donate", desc: "Receive email notifications when local shortages happen, schedule drive appointments, and donate safely." },
    { step: "04", icon: FaHeart, title: "Save Lives", desc: "Our real-time engine maps blood types, matches requests, and verifies donor eligibility coordinates." }
  ];

  return (
    <section id="timeline" className="py-24 relative z-10 bg-darkBg">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            How BloodConnect Works
          </h2>
          <p className="text-lightGray/50 text-base max-w-[500px] mx-auto">
            Follow four easy steps to match, register, and save a life instantly.
          </p>
        </div>

        <div className="relative">
          {/* Central Track Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[2px] bg-gradient-to-b from-primary via-secondary to-glass-border hidden md:block" />

          <div className="flex flex-col gap-16 relative">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row w-full items-center ${
                  idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Step Card Container */}
                <div className="w-full md:w-5/12 flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -45 : 45 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full rounded-2xl bg-darkGray/45 border border-glass-border p-8 shadow-glass hover:border-glass-border-hover hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full filter blur-xl pointer-events-none" />
                    <span className="absolute top-4 right-4 text-3xl font-extrabold text-secondary/25 font-heading">
                      {item.step}
                    </span>
                    
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <item.icon size={20} />
                    </div>
                    
                    <h3 className="font-heading text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-lightGray/60 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                </div>

                {/* Center Node dot (Desktop) */}
                <div className="w-2/12 flex justify-center items-center relative z-20 hidden md:flex">
                  <div className="w-5 h-5 rounded-full bg-secondary border-4 border-darkBg shadow-[0_0_15px_rgba(239,35,60,0.8)] animate-pulse" />
                </div>

                {/* Empty Spacer */}
                <div className="w-5/12 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Timeline;
