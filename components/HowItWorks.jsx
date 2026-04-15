import React from 'react';
import { UploadCloud, CheckCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      icon: <UploadCloud className="w-8 h-8 text-primary-500" />,
      title: "1. Upload Your Design",
      desc: "Drop your STL or OBJ files into our quoter to get an instant, AI-driven price."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary-500" />,
      title: "2. Configure & Order",
      desc: "Select your desired material, color, and strength. Add to cart and check out seamlessly."
    },
    {
      icon: <Package className="w-8 h-8 text-primary-500" />,
      title: "3. Receive Your Parts",
      desc: "We print, perform quality control, and ship your parts directly to your door."
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-fg mb-4">How It Works</h2>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            From digital file to physical object in just three simple steps.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Decorative connector line for desktop */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-surface-border to-transparent z-0 relative overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              whileInView={{ x: "100%" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary-500/50"
            />
          </div>

          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-20 h-20 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-6 shadow-xl"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-fg mb-3">{step.title}</h3>
              <p className="text-fg-muted leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
