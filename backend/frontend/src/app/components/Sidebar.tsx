import { 
  Home, 
  Newspaper, 
  User, 
  Users, 
  Calendar, 
  FileText, 
  Briefcase, 
  Heart, 
  Settings, 
  LogOut,
  ClipboardList // Added this icon for the new view
} from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg'; 

interface SidebarProps {
  activeView: string;
  onNavigate: (view: any) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'news', icon: Newspaper, label: 'News & Updates' },
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'directory', icon: Users, label: 'Alumni Directory' },
    { id: 'events', icon: Calendar, label: 'Engagement' },
    { id: 'surveys', icon: FileText, label: 'Tracer & Surveys' },
    { id: 'careers', icon: Briefcase, label: 'Career Opportunities' },
    // 1. Added the new menu item here
    { id: 'internships', icon: ClipboardList, label: 'Hiring Requests' }, 
    { id: 'give', icon: Heart, label: 'Give Back' },
  ];

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-50 text-left">
      <div className="bg-gradient-to-b from-[#0051C3] to-[#003087] p-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
             <img src={ADDULogo} alt="ADDU Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div className="text-white">
            <h1 className="font-bold text-base leading-tight">Alumni Portal</h1>
            <p className="text-[11px] opacity-90 font-medium">Ateneo de Davao</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#FFB800]"></div>
      </div>

      <nav className="flex-grow p-4 space-y-1 mt-2 overflow-y-auto"> {/* Added overflow-y-auto in case list gets long */}
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeView === item.id 
                ? 'bg-[#003087] text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-gray-400'}`} />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 text-left">
          <div className="w-10 h-10 bg-[#003087] rounded-full flex items-center justify-center text-white text-xs font-bold">JD</div>
          <div>
            <p className="text-xs font-bold text-gray-900">Juan Dela Cruz</p>
            <p className="text-[10px] text-gray-500 font-medium">Alumni</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-gray-900 rounded-lg text-sm transition-all text-left">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-600 rounded-lg text-sm transition-all text-left">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}