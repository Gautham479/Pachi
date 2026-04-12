import React from 'react';
import { ShieldCheck, Truck, Clock, Cpu } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Clock className="w-8 h-8 text-primary-500" />,
      title: "PET(Polyethylene Terephthalate) Printing",
      desc: "ahh bro."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary-500" />,
      title: "Quality Guaranteed",
      desc: "Every print goes through strict QC. If it fails, we reprint it for free."
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary-500" />,
      title: "Industrial Grade",
      desc: "Printed on high-end machines ensuring precision, dimensional accuracy, and strength."
    },
    {
      icon: <Truck className="w-8 h-8 text-primary-500" />,
      title: "Nationwide Shipping",
      desc: "We deliver across India with reliable logistics partners with tracking."
    }
  ];

  return (
    <section id="features" className="w-full py-24 bg-surface-card/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Why Choose Us?</h2>
          <p className="text-lg text-[#8B8581] max-w-2xl mx-auto">
            We provide top-tier 3D printing services tailored for both rapid prototyping and end-use production.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, i) => (
            <div key={i} className="bg-surface-card border border-surface-border p-8 rounded-2xl shadow-lg hover:border-primary-500/50 transition-colors">
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-[#DCD1CC] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
