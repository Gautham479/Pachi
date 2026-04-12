import React from 'react';
import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-card border-t border-surface-border pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🖨️</span>
              <span className="font-bold text-xl tracking-tight text-fg">
                Pachi <span className="text-fg">3D</span>
              </span>
            </div>
            <p className="text-fg-muted max-w-sm leading-relaxed mb-6">
              Industrial grade 3D printing for everyone. Upload, customize, and order high-quality parts in seconds.
            </p>
          </div>

          <div>
            <h4 className="text-fg font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-fg-subtle hover:text-primary-500 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-fg-subtle hover:text-primary-500 transition-colors text-sm">Contact</a></li>
              <li><a href="#" className="text-fg-subtle hover:text-primary-500 transition-colors text-sm">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-fg font-bold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-fg-subtle hover:text-primary-500 transition-colors text-sm">Terms & Conditions</a></li>
              <li><a href="#" className="text-fg-subtle hover:text-primary-500 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-fg-subtle hover:text-primary-500 transition-colors text-sm">Refund Policy</a></li>
              <li><a href="#" className="text-fg-subtle hover:text-primary-500 transition-colors text-sm">Shipping Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-fg-subtle text-sm">
            © {new Date().getFullYear()} Pachi 3D. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-fg-subtle text-sm">Made with precision in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
