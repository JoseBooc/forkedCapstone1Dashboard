import { 
  Home, 
  Newspaper, 
  User, 
  Users, 
  Calendar, 
  FileText, 
  Briefcase, 
  Heart, 
  CreditCard,
  Settings, 
  LogOut,
  ClipboardList,
  UserCog
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ADDULogo from '../../assets/ADDULogo.jpg';

const C = {
  navy:   '#001F5B',
  navyDk: '#00153D',
  blue:   '#003087',
  gold:   '#C5A96A',
} as const;

interface SidebarProps {
  activeView: string;
  onNavigate: (view: any) => void;
  userRole: 'alumni' | 'admin';
}

export function Sidebar({ activeView, onNavigate, userRole }: SidebarProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  const [profileImageUrl, setProfileImageUrl] = useState(localStorage.getItem('userProfileImage') || '');
  
  const fetchUserName = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const userData = await response.json();
        const fullName = `${userData.first_name || ''}${userData.middle_name ? ' ' + userData.middle_name : ''} ${userData.last_name || ''}`.trim();
        if (fullName) {
          localStorage.setItem('userName', fullName);
          setUserName(fullName);
        }
        
        if (userData.profile_image_path) {
          const imageUrl = `http://localhost:8000/storage/${userData.profile_image_path}`;
          localStorage.setItem('userProfileImage', imageUrl);
          setProfileImageUrl(imageUrl);
        } else {
          localStorage.removeItem('userProfileImage');
          setProfileImageUrl('');
        }
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };
  
  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('userName') || 'User');
      setProfileImageUrl(localStorage.getItem('userProfileImage') || '');
    };
    
    const handleProfileUpdate = () => {
      setUserName(localStorage.getItem('userName') || 'User');
      setProfileImageUrl(localStorage.getItem('userProfileImage') || '');
      fetchUserName();
    };
    
    fetchUserName();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const baseMenuItems = [
    { id: 'home',        label: 'Home' },
    { id: 'news',        label: 'News & Updates' },
    { id: 'directory',   label: 'Alumni Directory' },
    { id: 'events',      label: 'Engagement' },
    { id: 'surveys',     label: 'Tracer & Surveys' },
    { id: 'careers',     label: 'Career Opportunities' },
    { id: 'internships', label: 'Hiring Requests' },
    { id: 'give',        label: 'Give Back' },
  ];

  const adminMenuItems = [
    { id: 'users',         label: 'Users' },
    { id: 'payments',      label: 'Payment Verification' },
    { id: 'registrations', label: 'Registrations' },
    { id: 'analytics',     label: 'Analytics' },
  ];

  const menuItems = userRole === 'admin'
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  const initials = (() => {
    const parts = userName.split(' ').filter((n) => n.length > 0);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0];
    return parts[0][0] + parts[parts.length - 1][0];
  })();

  const roleLabel = userRole === 'admin' ? 'Admin' : 'Alumni';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap');
        body { margin-top: 64px; }
      `}</style>

      <aside
        style={{
          width: '100%',
          height: 64,
          position: 'fixed',
          top: 0,
          left: 0,
          background: C.navyDk,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 50,
          fontFamily: "'DM Sans', sans-serif",
          padding: '0 24px',
        }}
      >
        {/* ── LEFT: Logo + Title (fixed width) ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
          width: 210,
        }}>
          <img
            src={ADDULogo}
            alt="ADDU Logo"
            style={{ width: 38, height: 38, objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              whiteSpace: 'nowrap',
            }}>
              ADDU Alumni
            </span>
            <span style={{
              fontSize: 8.5,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              Ateneo de Davao University
            </span>
          </div>
        </div>

        {/* ── CENTER: Nav items (fills remaining space) ── */}
        <nav style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          overflow: 'hidden',
        }}>
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  whiteSpace: 'nowrap',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  paddingBottom: 2,
                  paddingLeft: 0,
                  paddingRight: 0,
                  transition: 'color 0.2s, border-color 0.2s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseOut={(e) => (e.currentTarget.style.color = isActive ? '#fff' : 'rgba(255,255,255,0.7)')}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── RIGHT: Avatar + Role + Sign Out (fixed width) ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
          width: 210,
          justifyContent: 'flex-end',
        }}>
          {/* Avatar + role label — clickable to go to profile */}
          <button
            onClick={() => onNavigate('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            title="View my profile"
          >
            <div style={{
              width: 34, height: 34,
              borderRadius: '50%',
              background: activeView === 'profile' ? 'rgba(197,169,106,0.3)' : 'rgba(59,130,246,0.25)',
              border: activeView === 'profile' ? `1px solid ${C.gold}` : '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700,
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initials
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25, textAlign: 'left' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                {userName.split(' ')[0]}
              </span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {roleLabel}
              </span>
            </div>
          </button>

          {/* Sign Out */}
          <button
            onClick={() => {
              localStorage.removeItem('userRole');
              localStorage.removeItem('userName');
              localStorage.removeItem('userEmail');
              navigate('/');
            }}
            style={{
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 100,
              padding: '5px 14px',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}