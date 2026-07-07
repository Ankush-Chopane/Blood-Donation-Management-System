import React, { useState } from 'react';
import { FaRegLightbulb } from 'react-icons/fa';

const Compatibility = () => {
  const [activeBloodGroup, setActiveBloodGroup] = useState(null);

  const compatibilityMap = {
    'O-': { donors: ['O-'], recipients: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] },
    'O+': { donors: ['O-', 'O+'], recipients: ['O+', 'A+', 'B+', 'AB+'] },
    'A-': { donors: ['O-', 'A-'], recipients: ['A-', 'A+', 'AB-', 'AB+'] },
    'A+': { donors: ['O-', 'O+', 'A-', 'A+'], recipients: ['A+', 'AB+'] },
    'B-': { donors: ['O-', 'B-'], recipients: ['B-', 'B+', 'AB-', 'AB+'] },
    'B+': { donors: ['O-', 'O+', 'B-', 'B+'], recipients: ['B+', 'AB+'] },
    'AB-': { donors: ['O-', 'A-', 'B-', 'AB-'], recipients: ['AB-', 'AB+'] },
    'AB+': { donors: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], recipients: ['AB+'] }
  };

  const getCompatClass = (bg) => {
    if (!activeBloodGroup) return 'border-glass-border text-lightGray bg-darkGray/30 hover:border-secondary/50';
    if (activeBloodGroup === bg) return 'border-secondary text-white bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_rgba(239,35,60,0.5)] scale-110';
    
    const isDonor = compatibilityMap[activeBloodGroup].donors.includes(bg);
    const isRecipient = compatibilityMap[activeBloodGroup].recipients.includes(bg);

    if (isDonor && isRecipient) return 'border-[#2ec4b6] text-white bg-[#2ec4b6]/15 shadow-[0_0_15px_rgba(46,196,182,0.3)] scale-105';
    if (isDonor) return 'border-emerald-500 text-white bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105';
    if (isRecipient) return 'border-primary text-white bg-primary/15 shadow-[0_0_15px_rgba(217,4,41,0.3)] scale-105';
    
    return 'opacity-20 border-glass-border text-lightGray bg-darkGray/10 scale-90 pointer-events-none';
  };

  return (
    <section id="compatibility" className="py-24 relative z-10 bg-darkBg">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Interactive Compatibility Board
          </h2>
          <p className="text-lightGray/50 text-base max-w-[500px] mx-auto">
            Select a blood group badge to trace compatible donors and recipient groups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Panel Badges */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-4">
              {Object.keys(compatibilityMap).map((bg) => (
                <button
                  key={bg}
                  onClick={() => setActiveBloodGroup(activeBloodGroup === bg ? null : bg)}
                  className={`font-heading text-lg font-bold aspect-square flex items-center justify-center rounded-2xl border transition-all duration-300 ${getCompatClass(bg)}`}
                >
                  {bg}
                </button>
              ))}
            </div>

            {/* Status explanation */}
            <div className="rounded-2xl border border-glass-border bg-darkGray/45 p-6 shadow-glass text-sm">
              <h4 className="font-heading font-bold text-white mb-3 flex items-center gap-2">
                <FaRegLightbulb className="text-secondary" /> Compatibility Legend
              </h4>
              {activeBloodGroup ? (
                <div className="flex flex-col gap-2.5">
                  <div className="text-white text-base">
                    Selected Blood Group: <span className="text-secondary font-bold">{activeBloodGroup}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2.5 flex flex-col gap-1.5">
                    <div>
                      <span className="font-semibold text-emerald-400">Can Receive From (Donors):</span>{' '}
                      <span className="text-white font-medium">{compatibilityMap[activeBloodGroup].donors.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-primary">Can Give To (Recipients):</span>{' '}
                      <span className="text-white font-medium">{compatibilityMap[activeBloodGroup].recipients.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-lightGray/60 leading-relaxed">
                  Click any circular blood badge above to trace cross-matching groups. Crimson highlights represent compatible recipient groups, green highlights show eligible donor types.
                </p>
              )}
            </div>
          </div>

          {/* Right Panel Chart Graphic */}
          <div className="flex justify-center">
            <div className="border border-glass-border bg-darkGray/30 p-4 rounded-3xl shadow-glass max-w-[450px] transition-all hover:border-glass-border-hover">
              <img 
                src="/blood_compatibility_guide.png" 
                alt="Blood Compatibility Matrix chart" 
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Compatibility;
