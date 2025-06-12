import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
    </>
  );
};

export default LandingPage;