import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "BloodConnect completely transformed our coordination workflow. Emergency matching time dropped from hours to mere minutes.",
      author: "Dr. Sarah Jenkins",
      role: "Chief Medical Officer",
      avatar: "/avatar_sarah.png"
    },
    {
      quote: "Registering as a donor was incredibly simple. The compatibility cards and nearby drive map took away all the guesswork.",
      author: "David Miller",
      role: "Volunteer Donor",
      avatar: "/avatar_david.png"
    },
    {
      quote: "The inventory dashboard provides clear metrics. We can request transfers easily and notify donors during critical deficits.",
      author: "Emily Rodriguez",
      role: "Blood Bank Coordinator",
      avatar: "/avatar_emily.png"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [testimonials.length]);

  return (
    <section className="py-24 relative z-10 bg-darkBg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute w-[300px] h-[300px] bg-secondary/5 rounded-full filter blur-3xl top-1/2 left-10 pointer-events-none" />

      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-white">
            What Our Partners Say
          </h2>
        </div>

        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="rounded-2xl border border-glass-border bg-darkGray/45 p-8 sm:p-10 shadow-glass text-center flex flex-col items-center gap-6 w-full"
            >
              <p className="text-white text-lg font-body italic leading-relaxed">
                "{testimonials[currentSlide].quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                <img 
                  src={testimonials[currentSlide].avatar} 
                  alt={testimonials[currentSlide].author} 
                  className="w-12 h-12 rounded-full border border-secondary/40 object-cover"
                />
                <div className="text-left">
                  <h4 className="font-heading font-bold text-white text-sm">{testimonials[currentSlide].author}</h4>
                  <p className="text-lightGray/40 text-[0.8rem] font-semibold">{testimonials[currentSlide].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-[-20px] sm:left-[-50px] w-10 h-10 rounded-full border border-glass-border bg-darkGray/40 text-lightGray flex items-center justify-center hover:bg-secondary/15 hover:border-secondary hover:text-white transition-all shadow-glass outline-none"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft size={14} />
          </button>
          
          {/* Right Arrow */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-[-20px] sm:right-[-50px] w-10 h-10 rounded-full border border-glass-border bg-darkGray/40 text-lightGray flex items-center justify-center hover:bg-secondary/15 hover:border-secondary hover:text-white transition-all shadow-glass outline-none"
            aria-label="Next testimonial"
          >
            <FaChevronRight size={14} />
          </button>
        </div>

        {/* Dots Indicators */}
        <div className="flex justify-center gap-2.5 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-secondary shadow-[0_0_8px_rgba(239,35,60,0.8)]' : 'bg-lightGray/25'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
