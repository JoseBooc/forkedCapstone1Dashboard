import { Users, Calendar, Heart, Globe, MapPin, Clock, GraduationCap, TrendingUp } from 'lucide-react';
import { Footer } from '../Footer';

// FIXED PATHS: Moving up 3 levels to reach src/assets
import adduBackground from '../../../assets/_MG_9330.jpg';
import admissionsFairImage from '../../../assets/AdmissionsBG.jpg';
import webDevEventImage from '../../../assets/WebDevBG.jpg';
import careerDevImage from '../../../assets/CareerDevBG.jpg';

import profile1 from '../../../assets/1stProfileHome.jpg';
import profile2 from '../../../assets/2ndProfileHome.jpg';
import profile3 from '../../../assets/3rdProfileHome.jpg';
import profile4 from '../../../assets/4thProfileHome.jpg';
import profile5 from '../../../assets/5thProfileHome.jpg';
import profile6 from '../../../assets/6thProfileHome.jpg';

interface HomeViewProps {
  userRole: 'alumni' | 'admin';
  onNavigate: (view: any) => void;
}

function EventCard({ title, date, time, location, type, image }: any) {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full group">
      <div className="relative h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 right-4">
          <span className="px-4 py-1 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-wider">{type}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow text-left">
        <h3 className="text-lg font-bold mb-4 text-[#003087] leading-tight whitespace-pre-line line-clamp-2">{title}</h3>
        <div className="space-y-2.5 mb-6 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-[#003087]" /><span>{date}</span></div>
          <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-[#003087]" /><span>{time}</span></div>
          <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#003087]" /><span>{location}</span></div>
        </div>
        <button className="mt-auto w-full py-3 border-2 border-[#003087] text-[#003087] rounded-xl hover:bg-[#003087] hover:text-white transition-all font-bold text-sm">
          Learn More
        </button>
      </div>
    </div>
  );
}

function SpotlightCard({ name, classYear, title, excerpt, image, category }: any) {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row h-full text-left">
      <div className="md:w-[38%] h-52 md:h-auto overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="md:w-[62%] p-8 flex flex-col">
        <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-[#003087] text-[10px] rounded-full font-bold w-fit mb-4 uppercase tracking-wider">{category}</div>
        <h3 className="text-2xl font-bold text-[#003087] mb-1">{name}</h3>
        <p className="text-sm text-gray-400 mb-1 font-medium">Class of {classYear}</p>
        <p className="text-sm text-[#1919FF] mb-4 font-semibold uppercase tracking-wide leading-tight">{title}</p>
        <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">{excerpt}</p>
        <button className="mt-auto text-[#003087] font-bold text-sm flex items-center gap-1 hover:translate-x-1 transition-transform">Read Full Story →</button>
      </div>
    </div>
  );
}

export function HomeView({ userRole, onNavigate }: HomeViewProps) {
  const spotlights = [
    { name: "Maria Santos", classYear: "2015", title: "CEO, Tech Innovations Inc.", category: "Entrepreneurship", image: profile1, excerpt: "Maria shares her journey of innovation and how her Ateneo education shaped her entrepreneurial mindset." },
    { name: "Dr. Roberto Cruz", classYear: "2008", title: "Medical Director, Hope Medical Center", category: "Healthcare", image: profile2, excerpt: "Dr. Cruz discusses his commitment to serving underserved communities." },
    { name: "Atty. Angela Reyes", classYear: "2012", title: "Human Rights Lawyer & Advocate", category: "Social Justice", image: profile3, excerpt: "Angela uses her legal expertise to defend marginalized communities across Mindanao." },
    { name: "Engineer Carlos Mendoza", classYear: "2010", title: "Senior Project Manager", category: "Engineering", image: profile4, excerpt: "Carlos credits ADDU's engineering program for his problem-solving approach." },
    { name: "Prof. Isabel Ferrer", classYear: "2005", title: "Dean of Education", category: "Education", image: profile5, excerpt: "Prof. Ferrer shares how ADDU inspired her career in transforming Philippine education." },
    { name: "Marcus Lim", classYear: "2018", title: "Social Entrepreneur", category: "Sustainability", image: profile6, excerpt: "Marcus founded an organization focused on sustainable agriculture." }
  ];

  const events = [
    { title: "Future Atenean unlocked 🔓💙\nYour journey starts here!", date: "Jan 23, 2026", time: "Mall hours", location: "SM Lanang", type: "Admissions", image: admissionsFairImage },
    { title: "Web Development\nFor Beginners", date: "Jan 26, 2026", time: "6:00 PM", location: "Online", type: "Tech", image: webDevEventImage },
    { title: "Career Development\nWorkshop", date: "Feb 20, 2026", time: "2:00 PM", location: "Virtual", type: "Professional", image: careerDevImage }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-8 space-y-16 flex-1">
        {/* Hero Section */}
        <section className="relative h-[520px] flex items-center justify-center rounded-[40px] overflow-hidden text-center text-white shadow-2xl">
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${adduBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 max-w-3xl px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Welcome Home, Ateneans</h1>
            <p className="text-xl text-white/90 mb-10 max-w-xl mx-auto leading-relaxed">Connecting generations of excellence. Join our community of 50,000+ alumni making a difference worldwide.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <button onClick={() => onNavigate('profile')} className="px-10 py-4 bg-[#003087] text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg">Update Profile</button>
              <button onClick={() => onNavigate('events')} className="px-10 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm">Explore Events</button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white rounded-[32px] py-16 px-8 border border-gray-100 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[{ icon: Users, label: "Active Alumni", value: "50,000+" }, { icon: Globe, label: "Countries", value: "75+" }, { icon: GraduationCap, label: "Scholars Supported", value: "500+" }, { icon: Heart, label: "Volunteer Hours", value: "25,000+" }].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6"><stat.icon className="w-8 h-8 text-[#003087]" /></div>
              <div className="text-3xl font-extrabold text-[#003087] mb-1">{stat.value}</div>
              <div className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Events Section */}
        <section>
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 className="text-4xl font-bold text-[#003087] tracking-tight">Upcoming Events</h2>
            <button onClick={() => onNavigate('events')} className="text-[#003087] font-bold text-sm hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, i) => <EventCard key={i} {...event} />)}
          </div>
        </section>

        {/* Spotlights Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#003087] tracking-tight">Alumni Spotlights</h2>
            <p className="text-gray-500 mt-3 text-base font-medium">Inspiring stories of Ateneans making an impact</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {spotlights.map((s, i) => <SpotlightCard key={i} {...s} />)}
          </div>
        </section>

        {/* Global Network CTA */}
        <section className="bg-[#0051C3] rounded-[32px] p-12 text-white relative overflow-hidden shadow-xl text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <div>
              <h2 className="text-3xl font-bold mb-6">Join Our Global Network</h2>
              <p className="text-blue-50 mb-8 max-w-md">Connect with 50,000+ Ateneans worldwide. Access exclusive benefits and opportunities.</p>
              <ul className="space-y-4 mb-10 text-white/90">
                <li className="flex items-center gap-3 text-sm font-medium"><TrendingUp className="w-5 h-5 text-white" /> Career development and job board</li>
                <li className="flex items-center gap-3 text-sm font-medium"><Users className="w-5 h-5 text-white" /> Networking events and chapters</li>
                <li className="flex items-center gap-3 text-sm font-medium"><Calendar className="w-5 h-5 text-white" /> Exclusive alumni programs</li>
              </ul>
              <button onClick={() => onNavigate('profile')} className="px-8 py-3 bg-white text-[#003087] rounded-xl font-bold hover:bg-blue-50 transition-all shadow-md">Update Your Profile</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ icon: Globe, val: "75+", lbl: "Countries" }, { icon: Users, val: "15", lbl: "Chapters" }, { icon: Calendar, val: "100+", lbl: "Events/Year" }, { icon: Heart, val: "₱10M", lbl: "Scholarships" }].map((box, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                  <box.icon className="w-6 h-6 mx-auto mb-3 opacity-80" />
                  <div className="text-2xl font-bold mb-1">{box.val}</div>
                  <div className="text-[10px] font-bold uppercase opacity-70 tracking-tighter">{box.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}