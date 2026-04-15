import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FAQ() {
  const faqs = [
    {
      q: "What file formats do you accept?",
      a: "We currently accept .STL and .OBJ file formats up to 100MB in size. We recommend exporting your files in millimeters (mm) for the best accuracy."
    },
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 3-5 business days across the country. We also offer expedited shipping options at checkout."
    },
    {
      q: "What materials should I choose?",
      a: "PLA is great for visual prototypes and basic use. PETG provides a balance of strength and durability, ABS offers better temperature resistance, and TPU is best for flexible parts."
    },
    {
      q: "Do you offer post-processing?",
      a: "Currently, we provide standard support removal. Basic sanding and painting options will be introduced in the near future."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="w-full py-24 bg-surface-muted/40 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-fg mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-fg-muted">Everything you need to know about our service.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`border border-surface-border rounded-xl bg-surface-card overflow-hidden transition-all duration-300 ${openIndex === i ? 'shadow-lg border-primary-500/30' : ''}`}
            >
              <button 
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className={`font-bold text-lg ${openIndex === i ? 'text-primary-500' : 'text-fg'}`}>
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-primary-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-fg-subtle" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-fg-muted leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
