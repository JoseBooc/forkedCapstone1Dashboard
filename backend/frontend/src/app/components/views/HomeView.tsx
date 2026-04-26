import React from 'react';
import { Users, Calendar, Globe, MapPin, Clock, GraduationCap, Heart, BookOpen, Award, Leaf, Scale, Stethoscope, Cpu } from 'lucide-react';
import { Footer } from '../Footer';
import campusNight from '../../../assets/Roxas-Colored.jpg';
import admissionsFairImage from '../../../assets/AdmissionsBG.jpg';
import webDevEventImage from '../../../assets/WebDevBG.jpg';
import careerDevImage from '../../../assets/CareerDevBG.jpg';

const C = {
  navy:   '#001F5B',
  navyDk: '#00153D',
  blue:   '#003087',
  gold:   '#C5A96A',
  goldLt: '#D4BC86',
  slate:  '#2C3E50',
  muted:  '#6B7280',
} as const;

interface HomeViewProps {
  userRole: 'alumni' | 'admin';
  onNavigate: (view: any) => void;
  onLogout?: () => void;
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

const categoryIcons: Record<string, any> = {
  Entrepreneurship: Cpu,
  Healthcare: Stethoscope,
  'Social Justice': Scale,
  Engineering: Cpu,
  Education: BookOpen,
  Sustainability: Leaf,
};

function SpotlightCard({ name, classYear, title, excerpt, category }: any) {
  const Icon = categoryIcons[category] || Award;
  return (
    <div style={{
      background: '#fff',
      borderRadius: 32,
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,48,135,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={18} color={C.blue} />
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: C.blue,
          background: 'rgba(0,48,135,0.07)',
          padding: '3px 12px', borderRadius: 100,
        }}>
          {category}
        </span>
      </div>

      <div style={{ width: 32, height: 2, background: C.gold, borderRadius: 2 }} />

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.6rem', fontWeight: 600,
        color: C.navy, lineHeight: 1.2, margin: 0,
      }}>
        {name}
      </h3>

      <p style={{ fontSize: 12, color: C.muted, fontWeight: 400, margin: 0 }}>
        Class of {classYear}
      </p>

      <p style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: C.blue, margin: 0,
      }}>
        {title}
      </p>

      <p style={{
        fontSize: 13, color: '#6B7280', lineHeight: 1.7,
        margin: 0, flexGrow: 1,
      }}>
        {excerpt}
      </p>

      <button
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 700, color: C.blue,
          padding: 0, display: 'flex', alignItems: 'center', gap: 4,
          transition: 'transform 0.2s',
          alignSelf: 'flex-start',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
      >
        Read Full Story
      </button>
    </div>
  );
}

export function HomeView({ userRole, onNavigate, onLogout }: HomeViewProps) {
  const spotlights = [
    { name: "Maria Santos",            classYear: "2015", title: "CEO, Tech Innovations Inc.",           category: "Entrepreneurship", excerpt: "Maria shares her journey of innovation and how her Ateneo education shaped her entrepreneurial mindset." },
    { name: "Dr. Roberto Cruz",        classYear: "2008", title: "Medical Director, Hope Medical Center", category: "Healthcare",       excerpt: "Dr. Cruz discusses his commitment to serving underserved communities." },
    { name: "Atty. Angela Reyes",      classYear: "2012", title: "Human Rights Lawyer & Advocate",        category: "Social Justice",   excerpt: "Angela uses her legal expertise to defend marginalized communities across Mindanao." },
    { name: "Engineer Carlos Mendoza", classYear: "2010", title: "Senior Project Manager",                category: "Engineering",      excerpt: "Carlos credits ADDU's engineering program for his problem-solving approach." },
    { name: "Prof. Isabel Ferrer",     classYear: "2005", title: "Dean of Education",                    category: "Education",        excerpt: "Prof. Ferrer shares how ADDU inspired her career in transforming Philippine education." },
    { name: "Marcus Lim",              classYear: "2018", title: "Social Entrepreneur",                  category: "Sustainability",   excerpt: "Marcus founded an organization focused on sustainable agriculture." },
  ];

  const events = [
    { title: "Alumni Homecoming\nGala Night",  date: "Coming Soon", time: "TBA", location: "Ateneo de Davao University", type: "Community",   image: admissionsFairImage },
    { title: "Tech & Innovation\nSummit 2026", date: "Coming Soon", time: "TBA", location: "Online",                    type: "Tech",         image: webDevEventImage },
    { title: "Career Development\nWorkshop",   date: "Coming Soon", time: "TBA", location: "Virtual",                   type: "Professional", image: careerDevImage },
  ];

  const contactEmail = "mailto:alumni@addu.edu.ph";

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;700&display=swap');
      `}</style>

      <div className="p-8 space-y-24 flex-1">

        {/* Hero */}
        <section style={{
          position: 'relative', height: 520,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 40, overflow: 'hidden',
          textAlign: 'center', color: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${campusNight})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, rgba(0,21,61,0.92) 0%, rgba(0,48,135,0.75) 60%, rgba(0,21,61,0.88) 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
            background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
            opacity: 0.7,
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 680, padding: '0 2rem' }}>
            <span style={{
              display: 'inline-block', marginBottom: 20,
              padding: '3px 16px', borderRadius: 100,
              border: `1px solid ${C.gold}`, color: C.gold,
              fontSize: 10, fontWeight: 500, letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}>
              Ad Majorem Dei Gloriam
            </span>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              fontWeight: 500, lineHeight: 1.1,
              marginBottom: 20, color: '#fff',
            }}>
              Welcome Home,{' '}
              <em style={{ color: C.goldLt, fontStyle: 'italic' }}>Ateneans.</em>
            </h1>

            <p style={{
              fontSize: 15, fontWeight: 300,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.8, maxWidth: 480, margin: '0 auto 40px',
            }}>
              Connecting generations of excellence. Join our community of 50,000+ alumni making a difference worldwide.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('profile')}
                style={{
                  padding: '14px 32px', background: C.blue,
                  color: '#fff', border: 'none', borderRadius: 100,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.15s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = C.navyDk; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Update Profile
              </button>
              <button
                onClick={() => onNavigate('events')}
                style={{
                  padding: '14px 32px',
                  background: 'transparent',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.6)',
                  borderRadius: 100,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Explore Events
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white rounded-[32px] py-16 px-8 border border-gray-100 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Users,         label: 'Alumni',    value: '50K+' },
            { icon: Globe,         label: 'Countries', value: '50+'  },
            { icon: GraduationCap, label: 'Years',     value: '60+'  },
            { icon: Heart,         label: 'Give Back', value: '1k+' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <stat.icon className="w-8 h-8 text-[#003087]" />
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem', fontWeight: 600,
                color: C.gold, lineHeight: 1, marginBottom: 6,
              }}>
                {stat.value}
              </div>
              <div className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Events */}
        <section>
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.4rem', fontWeight: 500, color: C.navy,
            }}>
              Upcoming Events
            </h2>
            <button
              onClick={() => onNavigate('events')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 500, color: C.blue,
              }}
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <EventCard key={i} {...event} />
            ))}
          </div>
        </section>

        {/* Alumni Spotlights */}
        <section className="pb-4">
          <div className="text-center mb-12">
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.4rem', fontWeight: 500, color: C.navy,
            }}>
              Alumni Spotlights
            </h2>
            <div style={{ width: 48, height: 2, background: C.gold, borderRadius: 2, margin: '12px auto 12px' }} />
            <p style={{ fontSize: 14, color: C.muted, fontWeight: 300 }}>
              Inspiring stories of Ateneans making an impact
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {spotlights.map((s, i) => (
              <SpotlightCard key={i} {...s} />
            ))}
          </div>
        </section>

      </div>

      {/* Help/Support Strip */}
      <div style={{
        background: 'rgba(0,48,135,0.04)',
        borderTop: '1px solid rgba(0,48,135,0.08)',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.navy, margin: 0 }}>Need help or have questions?</p>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            Reach us at{' '}
            <a href={contactEmail} style={{ color: C.blue, fontWeight: 500 }}>alumni@addu.edu.ph</a>
            {' '}&middot; (082) 221-2411
          </p>
        </div>
        <a
          href={contactEmail}
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: C.blue,
            color: '#fff',
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = C.navyDk)}
          onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = C.blue)}
        >
          Contact Us
        </a>
      </div>

      <Footer />
    </div>
  );
}
