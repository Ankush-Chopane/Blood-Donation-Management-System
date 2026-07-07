import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { SectionSkeleton } from '../components/PageSkeleton';

const Hero = lazy(() => import('../components/Hero'));
const Stats = lazy(() => import('../components/Stats'));
const Timeline = lazy(() => import('../components/Timeline'));
const Compatibility = lazy(() => import('../components/Compatibility'));
const Features = lazy(() => import('../components/Features'));
const EmergencyCTA = lazy(() => import('../components/EmergencyCTA'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const FAQ = lazy(() => import('../components/FAQ'));

const Home = () => {
  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-darkBg text-lightGray"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <Suspense fallback={<SectionSkeleton />}>
        <Hero />
        <Stats />
        <Timeline />
        <Compatibility />
        <Features />
        <EmergencyCTA />
        <Testimonials />
        <FAQ />
      </Suspense>
    </motion.div>
  );
};

export default Home;
