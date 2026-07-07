import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHospital, FaHeartbeat, FaClipboardList } from 'react-icons/fa';

const StatCard = ({ icon: Icon, value, label, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalDuration = 2000;
    let incrementTime = Math.abs(Math.floor(totalDuration / end));
    if (incrementTime < 10) incrementTime = 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-darkGray/45 border border-glass-border p-8 hover:border-glass-border-hover hover:-translate-y-1.5 transition-all duration-300 shadow-glass group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full filter blur-xl group-hover:scale-150 transition-transform pointer-events-none" />
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/25 border border-secondary/15 flex items-center justify-center text-secondary text-xl mb-5 group-hover:shadow-[0_0_15px_rgba(239,35,60,0.3)] transition-all">
        <Icon />
      </div>
      <div className="font-heading text-3xl font-bold text-white mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-lightGray/60 font-body text-xs font-semibold tracking-widest uppercase">
        {label}
      </div>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <section id="statistics" className="py-20 relative z-10 bg-darkBg">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard icon={FaUsers} value="25480" label="Registered Donors" delay={0.1} />
          <StatCard icon={FaHospital} value="450" label="Blood Banks" delay={0.2} />
          <StatCard icon={FaHeartbeat} value="12850" label="Lives Saved" delay={0.3} />
          <StatCard icon={FaClipboardList} value="840" label="Emergency Requests" delay={0.4} />
        </div>
      </div>
    </section>
  );
};

export default Stats;
