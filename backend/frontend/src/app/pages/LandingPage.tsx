import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Users, Globe, Heart, MapPin, Clock, Calendar,
  Briefcase, BookOpen, Award, UserCheck, Phone, Mail, Facebook,
  Twitter, Instagram, Linkedin
} from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';

export function LandingPage() {
  const navigate = useNavigate();

  const scrollToBenefits = () => {
    const benefitsSection = document.getElementById('benefits');
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#003087] shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src={ADDULogo} alt="ADDU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-white">
                <div className="text-xl font-bold">ADDU Alumni</div>
                <div className="text-sm opacity-90">Ateneo de Davao University</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-white hover:text-gray-200 transition font-medium">About</a>
              <button 
                onClick={scrollToEvents}
                className="text-white hover:text-gray-200 transition font-medium"
              >
                Events
              </button>
              <a href="#connect" className="text-white hover:text-gray-200 transition font-medium">Connect</a>
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-white text-[#4A6FA5] rounded-full hover:bg-gray-100 transition font-medium"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/en/3/3e/Ateneo_De_Davao_University_%28Roxas_Avenue%2C_Davao_City%3B_08-21-2023%29.jpg')" }}
      >
        <div className="max-w-5xl mx-auto px-6 z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Welcome Back<br />
            <span className="text-blue-200">Ateneans</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-10 max-w-3xl mx-auto">
            Join thousands of ADDU graduates staying connected, giving back, and continuing the legacy of excellence and service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-[#003087] text-white rounded-lg hover:bg-[#2d4373] transition font-semibold shadow-lg"
            >
              Join the Network →
            </button>
            <button 
              onClick={scrollToBenefits}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-lg hover:bg-white/30 transition font-semibold"
            >
              Explore Benefits
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Active Alumni */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-[#3B5998] mb-2">25,000+</div>
              <div className="text-gray-600">Active Alumni</div>
            </div>

            {/* Countries Worldwide */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                <MapPin className="w-10 h-10 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-[#3B5998] mb-2">50+</div>
              <div className="text-gray-600">Countries Worldwide</div>
            </div>

            {/* Partner Companies */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <Briefcase className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-[#3B5998] mb-2">500+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>

            {/* Scholarships Given */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <Heart className="w-10 h-10 text-red-600" />
              </div>
              <div className="text-4xl font-bold text-[#3B5998] mb-2">₱10M+</div>
              <div className="text-gray-600">Scholarships Given</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3B5998] mb-4">Your Alumni Benefits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Being part of the ADDU family means having access to a lifetime of opportunities and connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Professional Network */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Professional Network</h3>
              <p className="text-gray-600">
                Connect with fellow Ateneans across industries and continents. Build meaningful relationships that last a lifetime.
              </p>
            </div>

            {/* Exclusive Events */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Exclusive Events</h3>
              <p className="text-gray-600">
                Access alumni reunions, networking sessions, and professional development workshops throughout the year.
              </p>
            </div>

            {/* Lifelong Learning */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Lifelong Learning</h3>
              <p className="text-gray-600">
                Continue your education with special courses, webinars, and access to university resources.
              </p>
            </div>

            {/* Career Advancement */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Career Advancement</h3>
              <p className="text-gray-600">
                Leverage our job board, mentorship programs, and career coaching exclusively for alumni.
              </p>
            </div>

            {/* Mentorship Programs */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <UserCheck className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Mentorship Programs</h3>
              <p className="text-gray-600">
                Guide current students or receive guidance from experienced alumni in your field.
              </p>
            </div>

            {/* Global Community */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Global Community</h3>
              <p className="text-gray-600">
                Join chapters worldwide and stay connected no matter where your journey takes you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stronger Together Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[500px] w-full">
              <img 
                src="https://www.addu.edu.ph/shs/wp-content/uploads/sites/5/2016/09/GOOD-VIBES.jpg" 
                alt="Alumni Community" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#003087] mb-6">Stronger Together</h2>
              <p className="text-lg text-gray-600 mb-6">
                The ADDU Alumni Network is more than just a directory—it's a thriving community of professionals, entrepreneurs, and leaders who share the same values of excellence and service.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether you're looking to advance your career, give back to the university, or simply reconnect with old friends, we're here to support you every step of the way.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="inline-block px-8 py-4 bg-[#003087] text-white rounded-lg hover:bg-[#2d4373] transition font-semibold shadow-lg"
              >
                Update Your Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-20 bg-[#003087] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-xl text-blue-100">
              Stay connected and engaged with exclusive alumni events and activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event 1 */}
            <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-xl">
              <div className="relative h-48 bg-gradient-to-br from-purple-500 to-purple-700">
                <div className="absolute top-4 left-4 bg-[#3B5998] text-white px-4 py-2 rounded-lg font-bold">
                  FEB 15
                </div>
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Annual Alumni Homecoming</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>ADDU Campus, Davao City</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Reunite with batchmates and celebrate the Atenean spirit.
                </p>
                <button 
                  onClick={scrollToHero}
                  className="inline-block w-full text-center px-6 py-3 bg-blue-50 text-[#3B5998] rounded-lg hover:bg-blue-100 transition font-semibold"
                >
                  Register Now →
                </button>
              </div>
            </div>

            {/* Event 2 */}
            <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-xl">
              <div className="relative h-48 bg-gradient-to-br from-pink-500 to-red-500">
                <div className="absolute top-4 left-4 bg-[#3B5998] text-white px-4 py-2 rounded-lg font-bold">
                  MAR 08
                </div>
                <div className="absolute top-4 right-4 bg-yellow-200 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Online
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Professional Development Workshop</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Globe className="w-5 h-5 mr-2" />
                  <span>Virtual Event</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>2:00 PM - 4:00 PM</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Leadership skills for the modern workplace.
                </p>
                <button 
                  onClick={scrollToHero}
                  className="inline-block w-full text-center px-6 py-3 bg-blue-50 text-[#3B5998] rounded-lg hover:bg-blue-100 transition font-semibold"
                >
                  Register Now →
                </button>
              </div>
            </div>

            {/* Event 3 */}
            <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-xl">
              <div className="relative h-48 bg-gradient-to-br from-cyan-400 to-blue-500">
                <div className="absolute top-4 left-4 bg-[#3B5998] text-white px-4 py-2 rounded-lg font-bold">
                  MAR 22
                </div>
                <div className="absolute top-4 right-4 bg-green-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Networking
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#3B5998] mb-3">Alumni Networking Night</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>The Podium, Davao</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>6:00 PM - 9:00 PM</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Connect with fellow alumni over food and drinks.
                </p>
                <button 
                  onClick={scrollToHero}
                  className="inline-block w-full text-center px-6 py-3 bg-blue-50 text-[#3B5998] rounded-lg hover:bg-blue-100 transition font-semibold"
                >
                  Register Now →
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="inline-block px-8 py-4 bg-white text-[#3B5998] rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg">
              View All Events
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img src={ADDULogo} alt="ADDU Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">ADDU Alumni</div>
                  <div className="text-sm text-gray-400">Lux in Domino</div>
                </div>
              </div>
              <p className="text-gray-400">
                Connecting Ateneans worldwide and fostering a lifetime of excellence and service.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#directory" className="hover:text-white transition">Alumni Directory</a></li>
                <li><a href="#benefits" className="hover:text-white transition">Benefits</a></li>
                <li><a href="#donate" className="hover:text-white transition">Donate</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#career" className="hover:text-white transition">Career Services</a></li>
                <li><a href="#mentorship" className="hover:text-white transition">Mentorship</a></li>
                <li><a href="#news" className="hover:text-white transition">News & Stories</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>

            {/* Get in Touch */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Get in Touch</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>E. Jacinto St., Davao City, Philippines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>+63 82 221 2411</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>alumni@addu.edu.ph</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-400 text-sm">
                © 2026 Ateneo de Davao University Alumni Association. All rights reserved.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#4A6FA5] transition">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#4A6FA5] transition">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#4A6FA5] transition">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#4A6FA5] transition">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
