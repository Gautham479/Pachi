import React from 'react';
import { UploadCloud, CheckCircle, Package } from 'lucide-react';

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
    <section id="how-it-works" className="w-full py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-fg mb-4">How It Works</h2>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            From digital file to physical object in just three simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-6 shadow-xl relative">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-fg mb-3">{step.title}</h3>
              <p className="text-fg-muted leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
