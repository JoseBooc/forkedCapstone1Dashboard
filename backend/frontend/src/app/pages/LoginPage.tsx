import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';
import campusNight from '../../assets/Roxas-Colored.jpg';

/* ─── Design tokens (shared with LandingPage) ────────────── */
const C = {
  navy:   '#001F5B',
  navyDk: '#00153D',
  blue:   '#003087',
  gold:   '#C5A96A',
  goldLt: '#D4BC86',
  slate:  '#2C3E50',
  muted:  '#6B7280',
  white:  '#FFFFFF',
} as const;

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data     = await response.json();
        const userData = data.user;
        localStorage.setItem('userRole',  userData.role);
        localStorage.setItem('userName',  userData.name);
        localStorage.setItem('userEmail', userData.email);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes panelFade {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes leftFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-panel { animation: panelFade 0.7s ease both; }
        .left-content { animation: leftFade 0.9s ease 0.15s both; }

        .input-field {
          width: 100%;
          padding: 13px 16px 13px 46px;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: ${C.slate};
          background: #FAFAFA;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .input-field::placeholder { color: #9CA3AF; }
        .input-field:focus {
          border-color: ${C.blue};
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,48,135,0.08);
        }

        .sign-in-btn {
          width: 100%;
          padding: 14px;
          background: ${C.blue};
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.15s;
        }
        .sign-in-btn:hover:not(:disabled) { background: ${C.navyDk}; transform: translateY(-1px); }
        .sign-in-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.03em;
          transition: opacity 0.2s;
          padding: 0;
        }
        .back-btn:hover { opacity: 0.7; }

        .forgot-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s;
          padding: 0;
        }

        .toggle-pwd {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          padding: 0;
        }
        .toggle-pwd:hover { color: ${C.slate}; }
      `}</style>

      {/* ── LEFT PANEL — campus photo + branding ─────────── */}
      <div
        style={{
          display: 'none',
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="lg-left"
      >
        {/* We use a style tag trick below for the responsive show */}
        <style>{`
          @media (min-width: 1024px) {
            .lg-left { display: block !important; }
            .mobile-back { display: none !important; }
          }
        `}</style>

        {/* Background image */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${campusNight})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Deep overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, rgba(0,21,61,0.92) 0%, rgba(0,48,135,0.75) 60%, rgba(0,21,61,0.88) 100%)',
          }}
        />
        {/* Subtle gold line accent */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
            background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
            opacity: 0.6,
          }}
        />

        {/* Back button */}
        <button
          className="back-btn"
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: 36, left: 36, zIndex: 10,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Centered content */}
        <div
          className="left-content"
          style={{
            position: 'relative', zIndex: 2,
            height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 4rem', textAlign: 'center',
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: 88, height: 88, borderRadius: '50%',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', marginBottom: 28,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <img
              src={ADDULogo}
              alt="ADDU Logo"
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
            />
          </div>

          {/* Eyebrow */}
          <span
            style={{
              display: 'inline-block',
              padding: '3px 14px',
              borderRadius: 100,
              border: `1px solid ${C.gold}`,
              color: C.gold,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            Ad Majorem Dei Gloriam
          </span>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 3.5vw, 3.2rem)',
              fontWeight: 500,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Welcome Home,<br />
            <em style={{ color: C.goldLt, fontStyle: 'italic' }}>Ateneans.</em>
          </h1>

          <p
            style={{
              fontSize: 14, fontWeight: 300,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.8, maxWidth: 340,
              marginBottom: 40,
            }}
          >
            Connecting generations of excellence. Join our thriving community of over 50,000 alumni making a difference worldwide.
          </p>

          {/* Mini stats row */}
          <div
            style={{
              display: 'flex', gap: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 32,
            }}
          >
            {[
              { n: '50K+', l: 'Alumni' },
              { n: '50+',  l: 'Countries' },
              { n: '60+',  l: 'Years' },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.7rem', fontWeight: 600,
                    color: C.gold, lineHeight: 1,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontSize: 10, fontWeight: 300,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — login form ──────────────────────── */}
      <div
        style={{
          flex: 1,
          background: C.white,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
        }}
      >
        {/* Subtle background texture */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 80% 20%, rgba(0,48,135,0.04) 0%, transparent 60%),
                         radial-gradient(ellipse at 20% 80%, rgba(197,169,106,0.05) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Mobile back button */}
        <button
          className="back-btn mobile-back"
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: 28, left: 28,
            color: C.blue,
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Mobile logo */}
        <div
          style={{
            marginBottom: 32,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}
          className="mobile-logo"
        >
          <style>{`
            @media (min-width: 1024px) { .mobile-logo { display: none !important; } }
          `}</style>
          <div
            style={{
              width: 64, height: 64, borderRadius: '50%', background: '#fff',
              border: `2px solid rgba(0,48,135,0.15)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}
          >
            <img src={ADDULogo} alt="ADDU" style={{ width: '80%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: 12, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            ADDU Alumni Portal
          </span>
        </div>

        {/* Form card */}
        <div
          className="login-panel"
          style={{
            width: '100%', maxWidth: 420,
            position: 'relative', zIndex: 1,
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ width: 36, height: 2, background: C.gold, borderRadius: 2, marginBottom: 16 }} />
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.4rem', fontWeight: 500,
                color: C.navy, lineHeight: 1.1, marginBottom: 8,
              }}
            >
              Sign In
            </h2>
            <p style={{ fontSize: 14, color: C.muted, fontWeight: 300 }}>
              Access your alumni account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: 24, padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 10,
                fontSize: 13, color: '#DC2626',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.slate, marginBottom: 8 }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#9CA3AF',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.slate, marginBottom: 8 }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#9CA3AF',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field"
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  className="toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: 28 }}>
              <button
                type="button"
                className="forgot-btn"
                style={{ color: C.blue }}
                onMouseOver={(e) => (e.currentTarget.style.color = C.navyDk)}
                onMouseOut={(e) => (e.currentTarget.style.color = C.blue)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="sign-in-btn">
              {loading ? 'Signing In…' : 'Sign In'}
            </button>

            {/* Divider */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                margin: '24px 0',
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
              <span style={{ fontSize: 12, color: '#9CA3AF', letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
            </div>

            {/* Register */}
            <p style={{ textAlign: 'center', fontSize: 14, color: C.muted }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                  color: C.blue, padding: 0, transition: 'color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseOut={(e) => (e.currentTarget.style.color = C.blue)}
              >
                Sign up
              </button>
            </p>
          </form>

          {/* Footer note */}
          <p
            style={{
              marginTop: 40, textAlign: 'center', fontSize: 11,
              color: 'rgba(0,0,0,0.25)', letterSpacing: '0.04em',
            }}
          >
            © 2026 Ateneo de Davao University Alumni Association
          </p>
        </div>
      </div>
    </div>
  );
}
