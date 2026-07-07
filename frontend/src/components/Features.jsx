import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserPlus, FaBell, FaMapMarkerAlt, 
  FaHeartbeat, FaUserMd, FaShieldAlt 
} from 'react-icons/fa';

const Features = () => {
  const cards = [
    { icon: FaUserPlus, title: "Donor Registration", desc: "Build donor profiles detailing location and type. Log donation intervals automatically." },
    { icon: FaBell, title: "Emergency Alerts", desc: "Broadcast urgent requests to eligible matched donors near hospital parameters." },
    { icon: FaMapMarkerAlt, title: "Nearby Blood Banks", desc: "Find registered repositories and query real-time stock levels in any city." },
    { icon: FaHeartbeat, title: "Real-time Inventory", desc: "Coordinator dashboards record and request transfers during local shortages." },
    { icon: FaUserMd, title: "Notifications", desc: "Nodemailer automated email loops notify matches immediately." },
    { icon: FaShieldAlt, title: "Secure Authentication", desc: "JWT session tokens and hashed passwords protect donor credentials." }
  ];

  return (
    <section id="features" className="py-24 relative z-10 bg-darkBg">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Core Platform Features
          </h2>
          <p className="text-lightGray/50 text-base max-w-[500px] mx-auto">
            Everything required to coordinate emergency blood requests and donation registries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="rounded-2xl bg-darkGray/45 border border-glass-border p-8 hover:border-glass-border-hover transition-all duration-300 shadow-glass group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full filter blur-xl group-hover:scale-150 transition-transform pointer-events-none" />
              
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/15 border border-secondary/10 text-secondary flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform">
                <f.icon size={20} />
              </div>
              
              <h3 className="font-heading text-lg font-bold text-white mb-3 group-hover:text-secondary transition-colors">
                {f.title}
              </h3>
              <p className="text-lightGray/60 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
