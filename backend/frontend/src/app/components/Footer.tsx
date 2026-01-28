import { MapPin, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#001D4A] text-white py-16 px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">ADDU Alumni Association</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Connecting Ateneans worldwide and fostering lifelong relationships with our alma mater.
          </p>
          <div className="flex gap-4">
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Facebook className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Twitter className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Linkedin className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Instagram className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b border-white/10 pb-2">Quick Links</h3>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Events Calendar</li>
            <li className="hover:text-white cursor-pointer">Alumni Directory</li>
            <li className="hover:text-white cursor-pointer">Career Services</li>
            <li className="hover:text-white cursor-pointer">Mentorship Program</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b border-white/10 pb-2">Resources</h3>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li className="hover:text-white cursor-pointer">Alumni Benefits</li>
            <li className="hover:text-white cursor-pointer">Publications</li>
            <li className="hover:text-white cursor-pointer">Chapter Network</li>
            <li className="hover:text-white cursor-pointer">Volunteer</li>
            <li className="hover:text-white cursor-pointer">Support ADDU</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b border-white/10 pb-2">Contact Us</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 shrink-0 text-blue-400" />
              <span>E. Jacinto St, Davao City, 8000 Davao del Sur</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="w-5 h-5 flex items-center justify-center shrink-0 text-blue-400">📞</span>
              <span>(082) 221-2411</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-5 h-5 shrink-0 text-blue-400" />
              <span>alumni@addu.edu.ph</span>
            </li>
            <li className="pt-2">
              <button className="text-white bg-[#003087] px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors">
                Contact Us
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-gray-500 text-xs gap-4">
        <span>© 2026 Ateneo de Davao University Alumni Association. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}