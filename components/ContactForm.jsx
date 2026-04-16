"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone, User } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    query: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!formData.name || !formData.phone || !formData.email || !formData.query) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Phone validation (basic - allows 10+ digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      // Send to your backend endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', query: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-fg">
            Send Us a Message
          </h2>
          <p className="text-fg-muted text-lg">
            We'd love to hear from you. Get in touch with us for any inquiries.
          </p>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-accent-500/5 to-transparent rounded-2xl border border-surface-border/40" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 p-8 space-y-6">
            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold"
              >
                ✓ Thank you! We've received your message and will get back to you soon.
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold"
              >
                ✗ {error}
              </motion.div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2 flex items-center gap-2">
                <User size={16} className="text-primary-500" />
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                disabled={loading || submitted}
                className="w-full px-4 py-3 rounded-lg bg-surface-card border border-surface-border/40 text-fg placeholder-fg-muted focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all disabled:opacity-50"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2 flex items-center gap-2">
                <Mail size={16} className="text-primary-500" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                disabled={loading || submitted}
                className="w-full px-4 py-3 rounded-lg bg-surface-card border border-surface-border/40 text-fg placeholder-fg-muted focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all disabled:opacity-50"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2 flex items-center gap-2">
                <Phone size={16} className="text-primary-500" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
                disabled={loading || submitted}
                className="w-full px-4 py-3 rounded-lg bg-surface-card border border-surface-border/40 text-fg placeholder-fg-muted focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all disabled:opacity-50"
              />
            </div>

            {/* Query/Message Field */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2 flex items-center gap-2">
                <MessageCircle size={16} className="text-primary-500" />
                Your Message
              </label>
              <textarea
                name="query"
                value={formData.query}
                onChange={handleInputChange}
                placeholder="Tell us what's on your mind..."
                disabled={loading || submitted}
                rows="5"
                className="w-full px-4 py-3 rounded-lg bg-surface-card border border-surface-border/40 text-fg placeholder-fg-muted focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all resize-none disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || submitted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 hover:opacity-100 transition-opacity" />
              <span className="relative z-10">
                {loading ? 'Sending...' : submitted ? 'Message Sent!' : 'Send Message'}
              </span>
            </motion.button>

            {/* Info Text */}
            <p className="text-xs text-fg-muted text-center">
              We typically respond within 24 hours. Thank you for reaching out!
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}