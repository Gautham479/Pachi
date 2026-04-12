import React from 'react';
import { ShieldCheck, Truck, Clock, Cpu } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Clock className="w-8 h-8 text-primary-500" />,
      title: "TPU",
      desc: "Flexible and durable thermoplastic urethane. Perfect for flexible parts, rubber-like components, and impact-resistant applications."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary-500" />,
      title: "ABS",
      desc: "Strong and rigid acrylonitrile butadiene styrene. Ideal for mechanical parts, heat-resistant components, and functional prototypes."
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary-500" />,
      title: "PETG",
      desc: "Durable and food-safe polyethylene terephthalate glycol. Excellent for functional parts, containers, and long-term durability applications."
    },
    {
      icon: <Truck className="w-8 h-8 text-primary-500" />,
      title: "PET",
      desc: "Lightweight and recyclable polyethylene terephthalate. Great for prototypes, transparent parts, and environmentally conscious projects."
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
