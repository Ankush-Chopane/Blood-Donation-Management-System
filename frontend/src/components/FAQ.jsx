import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqData = [
    {
      q: "Who can donate blood?",
      a: "Most healthy individuals aged 18-65 who weigh over 50kg (110 lbs) and haven't had recent major surgeries, tattoos, or specific medications are eligible to donate. Our dashboard eligibility checker runs these questions automatically!"
    },
    {
      q: "How often can I donate blood?",
      a: "Whole blood donors must wait at least 56 days (8 weeks) between donations. Platelet donors can donate every 7 days up to 24 times a year."
    },
    {
      q: "Is blood donation safe?",
      a: "Yes, blood donation is highly secure. All collection needles and bags are sterile, single-use, and discarded after one session, making disease transmission impossible."
    },
    {
      q: "How is blood stored and kept fresh?",
      a: "Whole blood is separated into red blood cells, platelets, and plasma. Red cells are refrigerated at 2-6°C for up to 35-42 days. Platelets are kept at room temperature with constant agitation for only 5-7 days. Plasma is frozen at -25°C for up to a year."
    }
  ];

  return (
    <section id="faq" className="py-24 relative z-10 bg-darkBg pb-32">
      <div className="max-w-[800px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lightGray/50 text-base max-w-[500px] mx-auto">
            Got questions about donations? Check out the standard medical answers below.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqData.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-glass-border bg-darkGray/45 overflow-hidden transition-all duration-300 shadow-glass"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-heading text-base font-bold text-white hover:text-secondary transition-colors outline-none"
                >
                  <span>{faq.q}</span>
                  <span className={`text-secondary text-sm font-semibold transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : ''
                  }`}>
                    +
                  </span>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-white/5 text-lightGray/65 text-[0.98rem] leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
