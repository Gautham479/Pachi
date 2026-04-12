import React from 'react';
import { Check, X, Zap } from 'lucide-react';

export default function Features() {
  const materials = [
    {
      name: "PET (Basic & Lightweight)",
      emoji: "🔹",
      points: [
        { text: "Best for display parts, prototypes, or light use", type: "normal" },
        { text: "Smooth finish and clean look", type: "normal" },
        { text: "Not ideal for heat or outdoor use", type: "negative" },
        { text: "Good if you just need something simple and cost-effective", type: "tip" }
      ]
    },
    {
      name: "PETG (All-Rounder Choice)",
      emoji: "🔹",
      points: [
        { text: "Strong and durable for everyday use", type: "normal" },
        { text: "Can handle sunlight and outdoor conditions better than PET", type: "positive" },
        { text: "Water-resistant and long-lasting", type: "positive" },
        { text: "Safe for basic electrical enclosures (non-conductive)", type: "positive" },
        { text: "Best choice for most customers", type: "tip" }
      ]
    },
    {
      name: "ABS (High Strength & Heat Resistant)",
      emoji: "🔹",
      points: [
        { text: "Very strong and tough material", type: "normal" },
        { text: "Handles high temperatures and sunlight better", type: "positive" },
        { text: "Good for automotive or outdoor parts", type: "positive" },
        { text: "Suitable for electrical housings (heat resistance helps)", type: "positive" },
        { text: "Choose this if your part will face heat or rough use", type: "tip" }
      ]
    },
    {
      name: "TPU (Flexible & Shock Absorbing)",
      emoji: "🔹",
      points: [
        { text: "Rubber-like and flexible", type: "normal" },
        { text: "Can bend, stretch, and absorb impact", type: "positive" },
        { text: "Not for rigid or structural parts", type: "negative" },
        { text: "Perfect for grips, covers, gaskets, or protective parts", type: "tip" }
      ]
    }
  ];

  const quickGuide = [
    { question: "Outdoor / Sun use?", answer: "PETG or ABS" },
    { question: "High heat?", answer: "ABS" },
    { question: "Electrical use?", answer: "PETG or ABS" },
    { question: "Flexible part?", answer: "TPU" },
    { question: "Budget / basic use?", answer: "PET" }
  ];

  const getIcon = (type) => {
    switch(type) {
      case "positive":
        return <Check className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case "negative":
        return <X className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case "tip":
        return <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <section id="features" className="w-full py-24 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4">Materials – Choose What Fits Your Use</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the right material for your project based on your specific needs
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {materials.map((material, i) => (
            <div key={i} className="bg-white border border-gray-300 p-8 rounded-2xl shadow-lg hover:border-gray-400 transition-colors">
              <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <span className="text-2xl">{material.emoji}</span>
                {material.name}
              </h3>
              <ul className="space-y-3">
                {material.points.map((point, j) => (
                  <li key={j} className="flex gap-3 items-start">
                    {getIcon(point.type)}
                    <span className={`text-gray-700 leading-relaxed ${
                      point.type === "negative" ? "opacity-75" : ""
                    }`}>
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Guide */}
        <div className="bg-white border border-gray-300 p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-black mb-6">💡 Quick Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickGuide.map((item, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">{item.question}</p>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
