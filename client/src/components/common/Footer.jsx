import { Link } from 'react-router-dom';
import { Bus, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-white mb-3">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg"><Bus size={20} /></div>
              BusBook
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              India's trusted bus ticket booking platform. Travel smarter with real-time seat selection, instant confirmation, and 24/7 support.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"><Facebook size={16} /></a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"><Twitter size={16} /></a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"><Instagram size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['Home', '/'], ['Search Buses', '/search'], ['My Bookings', '/my-bookings'], ['Profile', '/profile']].map(([label, href]) => (
                <li key={href}><Link to={href} className="hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 text-primary-400 flex-shrink-0" /><span>123 Transport Hub, New Delhi — 110001</span></li>
              <li className="flex items-center gap-2"><Phone size={15} className="text-primary-400 flex-shrink-0" /><span>+91 98765 43210</span></li>
              <li className="flex items-center gap-2"><Mail size={15} className="text-primary-400 flex-shrink-0" /><span>support@busbook.in</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BusBook. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
