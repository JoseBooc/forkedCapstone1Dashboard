import { useNavigate } from 'react-router-dom';
import {
  Users, Globe, Heart, MapPin, Clock, Calendar,
  Briefcase, BookOpen, Award, UserCheck, Phone, Mail,
  Facebook, Twitter, Instagram, Linkedin, ArrowRight, ChevronDown,
  LucideIcon,
} from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';
import communityPhoto from '../../assets/_MG_1823.jpg';

/* ─── Design tokens ─────────────────────────────────────── */
const C = {
  navy:   '#001F5B',
  navyDk: '#00153D',
  blue:   '#003087',
  blueMd: '#1A4A9A',
  gold:   '#C5A96A',
  goldLt: '#D4BC86',
  cream:  '#F7F3EC',
  slate:  '#2C3E50',
  muted:  '#6B7280',
  white:  '#FFFFFF',
} as const;

/* ─── Types ──────────────────────────────────────────────── */
interface TagProps {
  children: React.ReactNode;
  color?: string;
}

interface StatItem {
  icon: React.ReactElement;
  n: string;
  l: string;
}

interface BenefitItem {
  icon: React.ReactElement;
  title: string;
  desc: string;
}

interface EventItem {
  date: string;
  tag: string;
  tagColor: string;
  accent: string;
  title: string;
  loc: string;
  time: string;
  desc: string;
}

interface ContactItem {
  icon: React.ReactElement;
  text: string;
}

/* ─── Reusable components ────────────────────────────────── */
const Tag: React.FC<TagProps> = ({ children, color = C.gold }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '3px 12px',
      borderRadius: 100,
      border: `1px solid ${color}`,
      color,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </span>
);

const GoldLine: React.FC = () => (
  <div
    style={{
      width: 40,
      height: 2,
      background: C.gold,
      borderRadius: 2,
      margin: '12px 0 20px',
    }}
  />
);

/* ─── Main component ─────────────────────────────────────── */
export function LandingPage(): React.ReactElement {
  const navigate = useNavigate();

  const scrollTo = (id: string): void => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stats: StatItem[] = [
    { icon: <Users size={22} />,     n: '25,000+', l: 'Active Alumni' },
    { icon: <MapPin size={22} />,    n: '50+',     l: 'Countries Worldwide' },
    { icon: <Briefcase size={22} />, n: '500+',    l: 'Partner Companies' },
    { icon: <Heart size={22} />,     n: '₱10M+',  l: 'Scholarships Given' },
  ];

  const benefits: BenefitItem[] = [
    { icon: <Users size={22} />,     title: 'Professional Network',  desc: 'Connect with fellow Ateneans across industries and continents. Relationships that last a lifetime.' },
    { icon: <Calendar size={22} />,  title: 'Exclusive Events',      desc: 'Alumni reunions, networking sessions, and professional development workshops throughout the year.' },
    { icon: <BookOpen size={22} />,  title: 'Lifelong Learning',     desc: 'Special courses, webinars, and continued access to university resources after graduation.' },
    { icon: <Award size={22} />,     title: 'Career Advancement',    desc: 'Job board, mentorship programs, and career coaching exclusively built for alumni.' },
    { icon: <UserCheck size={22} />, title: 'Mentorship Programs',   desc: 'Guide current students or receive guidance from experienced alumni in your field.' },
    { icon: <Globe size={22} />,     title: 'Global Community',      desc: 'Join chapters worldwide and stay connected wherever your journey takes you.' },
  ];

  const events: EventItem[] = [
    {
      date: 'FEB 15', tag: 'Featured',   tagColor: C.gold,
      accent: 'linear-gradient(135deg,#3B1FA8,#6B4FD8)',
      title: 'Annual Alumni Homecoming',
      loc: 'ADDU Campus, Davao City', time: '9:00 AM – 5:00 PM',
      desc: 'Reunite with batchmates and celebrate the Atenean spirit.',
    },
    {
      date: 'MAR 08', tag: 'Online',     tagColor: '#60BFFF',
      accent: 'linear-gradient(135deg,#B5294A,#E0587A)',
      title: 'Professional Development Workshop',
      loc: 'Virtual Event', time: '2:00 PM – 4:00 PM',
      desc: 'Leadership skills for the modern workplace.',
    },
    {
      date: 'MAR 22', tag: 'Networking', tagColor: '#4AD97A',
      accent: 'linear-gradient(135deg,#0E7D8F,#1ABDD4)',
      title: 'Alumni Networking Night',
      loc: 'The Podium, Davao', time: '6:00 PM – 9:00 PM',
      desc: 'Connect with fellow alumni over food and drinks.',
    },
  ];

  const quickLinks: string[] = ['About Us', 'Alumni Directory', 'Benefits', 'Donate'];
  const resources: string[] = ['Career Services', 'Mentorship', 'News & Stories', 'Contact Us'];

  const contactItems: ContactItem[] = [
    { icon: <MapPin size={14} />, text: 'E. Jacinto St., Davao City, Philippines' },
    { icon: <Phone size={14} />,  text: '+63 82 221 2411' },
    { icon: <Mail size={14} />,   text: 'alumni@addu.edu.ph' },
  ];

  const socialIcons: React.ReactElement[] = [
    <Facebook size={16} />,
    <Twitter size={16} />,
    <Instagram size={16} />,
    <Linkedin size={16} />,
  ];

  const heroStatItems = [
    { n: '25,000+', l: 'Active Alumni' },
    { n: '50+',     l: 'Countries' },
    { n: '₱10M+',  l: 'Scholarships' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: C.slate, background: C.white, overflowX: 'hidden' }}>

      {/* ── Global styles ─────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-link {
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.04em;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .nav-link:hover { color: #fff; }

        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: ${C.gold};
          color: ${C.navyDk};
          border: none;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-gold:hover { background: ${C.goldLt}; transform: translateY(-1px); }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 100px;
          font-size: 14px;
          font-weight: 400;
          font-family: inherit;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .btn-outline:hover {
          border-color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.08);
          transform: translateY(-1px);
        }

        .btn-navy {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: ${C.blue};
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-navy:hover { background: ${C.navyDk}; transform: translateY(-1px); }

        .benefit-card {
          padding: 36px 32px;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          background: #fff;
          transition: box-shadow 0.25s, transform 0.2s;
        }
        .benefit-card:hover {
          box-shadow: 0 12px 40px rgba(0,48,135,0.1);
          transform: translateY(-3px);
        }

        .event-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.07);
          transition: box-shadow 0.25s, transform 0.2s;
        }
        .event-card:hover {
          box-shadow: 0 16px 48px rgba(0,0,0,0.12);
          transform: translateY(-3px);
        }

        .stat-item {
          padding: 2rem 1.5rem;
          border-right: 1px solid rgba(255,255,255,0.12);
          text-align: center;
        }
        .stat-item:last-child { border-right: none; }

        .social-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .social-btn:hover {
          background: ${C.gold};
          color: ${C.navyDk};
          border-color: ${C.gold};
        }

        .footer-link {
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
          display: block;
          margin-bottom: 12px;
        }
        .footer-link:hover { color: ${C.gold}; }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50%       { transform: translateY(7px) translateX(-50%); }
        }

        .hero-content { animation: heroFade 0.9s ease both; }
        .hero-stats   { animation: heroFade 1.1s ease 0.18s both; }
        .scroll-cue   { animation: scrollBounce 2s ease-in-out infinite; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: C.blue,
          boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
        }}
      >
        <div
          style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 2rem',
            height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44, height: 44, borderRadius: '50%', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
              }}
            >
              <img
                src={ADDULogo}
                alt="ADDU Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 500, fontSize: 15, lineHeight: 1.2 }}>ADDU Alumni</div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.55)', fontSize: 11,
                  letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 300,
                }}
              >
                Ateneo de Davao University
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#about" className="nav-link">About</a>
            <button onClick={() => scrollTo('events')} className="nav-link">Events</button>
            <a href="#connect" className="nav-link">Connect</a>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '8px 22px',
                border: '1px solid rgba(255,255,255,0.5)',
                borderRadius: 100,
                background: 'transparent',
                color: '#fff',
                fontSize: 13,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative', height: '100vh', minHeight: 620,
          display: 'flex', alignItems: 'center', overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url('https://upload.wikimedia.org/wikipedia/en/3/3e/Ateneo_De_Davao_University_%28Roxas_Avenue%2C_Davao_City%3B_08-21-2023%29.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(120deg, rgba(0,21,61,0.88) 0%, rgba(0,48,135,0.6) 55%, rgba(0,21,61,0.75) 100%)',
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
            background: `linear-gradient(to top, ${C.navyDk}, transparent)`,
          }}
        />

        {/* Hero content */}
        <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: 680, padding: '0 3rem' }}>
          <Tag>Ad Majorem Dei Gloriam</Tag>
          <div style={{ marginTop: 24 }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
                fontWeight: 500,
                color: '#fff',
                lineHeight: 1.12,
              }}
            >
              Welcome Back,<br />
              <span style={{ fontStyle: 'italic', color: C.goldLt }}>Fellow Ateneans.</span>
            </h1>
          </div>
          <p
            style={{
              marginTop: 20, fontSize: 16, fontWeight: 300,
              color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 480,
            }}
          >
            Join thousands of ADDU graduates staying connected, giving back, and continuing the legacy of excellence and service.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={() => navigate('/login')}>
              Join the Network <ArrowRight size={16} />
            </button>
            <button className="btn-outline" onClick={() => scrollTo('benefits')}>
              Explore Benefits
            </button>
          </div>
        </div>

        {/* Hero stats – bottom right */}
        <div
          className="hero-stats"
          style={{
            position: 'absolute', bottom: '3rem', right: '3rem',
            zIndex: 2, display: 'flex', gap: '2rem', alignItems: 'flex-end',
          }}
        >
          {heroStatItems.map(({ n, l }) => (
            <div key={l} style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2.1rem', fontWeight: 600, color: C.gold, lineHeight: 1,
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: 11, fontWeight: 300,
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div
          className="scroll-cue"
          style={{
            position: 'absolute', bottom: '2rem', left: '50%', zIndex: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}
        >
          <div
            style={{
              width: 1, height: 36,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
            }}
          />
          <ChevronDown size={14} color="rgba(255,255,255,0.3)" />
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section
        style={{
          background: C.navyDk,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
      >
        {stats.map(({ icon, n, l }) => (
          <div key={l} className="stat-item">
            <div style={{ color: C.gold, display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              {icon}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem', fontWeight: 600, color: '#fff', lineHeight: 1,
              }}
            >
              {n}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6, letterSpacing: '0.05em' }}>
              {l}
            </div>
          </div>
        ))}
      </section>

      {/* ── BENEFITS ────────────────────────────────────────── */}
      <section id="benefits" style={{ padding: '6rem 2rem', background: C.cream }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: '4rem' }}>
            <Tag color={C.blue}>Alumni Benefits</Tag>
            <GoldLine />
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 500, color: C.navy,
              }}
            >
              Your Lifetime of Opportunities
            </h2>
            <p style={{ marginTop: 12, fontSize: 16, color: C.muted, maxWidth: 520, lineHeight: 1.75 }}>
              Being part of the ADDU family means access to a world of connections, growth, and service.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {benefits.map(({ icon, title, desc }) => (
              <div key={title} className="benefit-card">
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(0,48,135,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.blue, marginBottom: 20,
                  }}
                >
                  {icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: C.navy, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRONGER TOGETHER ───────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: '#fff' }}>
        <div
          style={{
            maxWidth: 1280, margin: '0 auto',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '5rem', alignItems: 'center',
          }}
        >
          {/* Image */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', height: 480 }}>
              <img
                src={communityPhoto}
                alt="Alumni Community"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                position: 'absolute', bottom: -20, left: -20,
                width: 80, height: 80, background: C.gold, borderRadius: 16, zIndex: -1,
              }}
            />
            <div
              style={{
                position: 'absolute', top: -16, right: -16,
                width: 48, height: 48,
                border: `2px solid ${C.blue}`, borderRadius: 12, zIndex: -1,
              }}
            />
          </div>

          {/* Text */}
          <div>
            <Tag color={C.blue}>Our Community</Tag>
            <GoldLine />
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 500, color: C.navy, lineHeight: 1.2,
              }}
            >
              Stronger<br /><em>Together</em>
            </h2>
            <p style={{ marginTop: 20, fontSize: 15, color: C.muted, lineHeight: 1.85 }}>
              The ADDU Alumni Network is more than a directory — it's a thriving community of professionals, entrepreneurs, and leaders who share the same values of excellence and service.
            </p>
            <p style={{ marginTop: 16, fontSize: 15, color: C.muted, lineHeight: 1.85 }}>
              Whether advancing your career, giving back to the university, or simply reconnecting with old friends, we're here every step of the way.
            </p>
            <div style={{ marginTop: 36 }}>
              <button className="btn-navy" onClick={() => navigate('/login')}>
                Update Your Profile <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENTS ──────────────────────────────────────────── */}
      <section id="events" style={{ padding: '6rem 2rem', background: C.navy }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: '4rem' }}>
            <Tag>Upcoming Events</Tag>
            <GoldLine />
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 500, color: '#fff',
              }}
            >
              Stay Connected &amp; Engaged
            </h2>
            <p style={{ marginTop: 12, fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 480, lineHeight: 1.75 }}>
              Exclusive alumni events, reunions, and professional activities throughout the year.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {events.map(({ date, tag, tagColor, accent, title, loc, time, desc }) => (
              <div key={title} className="event-card">
                {/* Card header */}
                <div style={{ position: 'relative', height: 140, background: accent }}>
                  <div
                    style={{
                      position: 'absolute', top: 16, left: 16,
                      background: 'rgba(0,0,0,0.35)', color: '#fff',
                      padding: '6px 14px', borderRadius: 8,
                      fontWeight: 600, fontSize: 13, backdropFilter: 'blur(4px)',
                    }}
                  >
                    {date}
                  </div>
                  <span
                    style={{
                      position: 'absolute', top: 16, right: 16,
                      background: 'rgba(0,0,0,0.3)', color: tagColor,
                      border: `1px solid ${tagColor}`,
                      padding: '4px 12px', borderRadius: 100,
                      fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
                    }}
                  >
                    {tag}
                  </span>
                </div>

                {/* Card body */}
                <div style={{ padding: '24px 24px 28px' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: C.navy, marginBottom: 14, lineHeight: 1.3 }}>
                    {title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.muted, fontSize: 13, marginBottom: 6 }}>
                    <MapPin size={14} /> <span>{loc}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.muted, fontSize: 13, marginBottom: 16 }}>
                    <Clock size={14} /> <span>{time}</span>
                  </div>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>{desc}</p>
                  <button
                    style={{
                      width: '100%', padding: '11px 0',
                      background: 'rgba(0,48,135,0.06)',
                      color: C.blue,
                      border: `1px solid rgba(0,48,135,0.15)`,
                      borderRadius: 100, fontSize: 13, fontWeight: 500,
                      fontFamily: 'inherit', cursor: 'pointer', transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,48,135,0.12)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0,48,135,0.06)')}
                  >
                    Register Now →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button
              style={{
                padding: '13px 32px', background: 'transparent',
                border: `1px solid ${C.gold}`, color: C.gold,
                borderRadius: 100, fontSize: 14, fontWeight: 400,
                fontFamily: 'inherit', cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = C.gold;
                e.currentTarget.style.color = C.navyDk;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = C.gold;
              }}
            >
              View All Events
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ background: '#0F1623', color: 'rgba(255,255,255,0.5)', padding: '5rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
              gap: '3rem', marginBottom: '3rem',
            }}
          >
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: '50%', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', flexShrink: 0,
                  }}
                >
                  <img src={ADDULogo} alt="ADDU" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>ADDU Alumni</div>
                  <div style={{ fontSize: 11, color: C.gold, letterSpacing: '0.06em', fontStyle: 'italic' }}>
                    Lux in Domino
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8 }}>
                Connecting Ateneans worldwide and fostering a lifetime of excellence and service.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div
                style={{
                  color: '#fff', fontWeight: 500, fontSize: 13,
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20,
                }}
              >
                Quick Links
              </div>
              {quickLinks.map((label) => (
                <a key={label} href="#" className="footer-link">{label}</a>
              ))}
            </div>

            {/* Resources */}
            <div>
              <div
                style={{
                  color: '#fff', fontWeight: 500, fontSize: 13,
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20,
                }}
              >
                Resources
              </div>
              {resources.map((label) => (
                <a key={label} href="#" className="footer-link">{label}</a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div
                style={{
                  color: '#fff', fontWeight: 500, fontSize: 13,
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20,
                }}
              >
                Get in Touch
              </div>
              {contactItems.map(({ icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: 'flex', alignItems: 'flex-start',
                    gap: 10, marginBottom: 14, fontSize: 13,
                  }}
                >
                  <span style={{ color: C.gold, marginTop: 1, flexShrink: 0 }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <p style={{ fontSize: 12 }}>
              © 2026 Ateneo de Davao University Alumni Association. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socialIcons.map((icon, i) => (
                <button key={i} className="social-btn">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}