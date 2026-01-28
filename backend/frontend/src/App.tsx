import { useState } from 'react';
import { HomeView } from './app/components/views/HomeView';
import { ProfileView } from './app/components/views/ProfileView';
import { DirectoryView } from './app/components/views/DirectoryView';
import { EventsView } from './app/components/views/EventsView';
import { SurveysView } from './app/components/views/SurveysView';
import { CareersView } from './app/components/views/CareersView';
import { NewsView } from './app/components/views/NewsView';
import { DonationsView } from './app/components/views/DonationView';
import { AnalyticsView } from './app/components/views/AnalyticsView';
import { Sidebar } from './app/components/Sidebar';

// 1. Import the new view
import { InternshipPostingsView } from './app/components/views/InternshipPostingsView';

export default function App() {
  // 2. Add 'internships' to the activeView type union
  const [activeView, setActiveView] = useState<'home'|'profile'|'directory'|'events'|'surveys'|'careers'|'news'|'give'|'analytics'|'internships'>('home');
  const userRole: 'alumni' | 'admin' = 'alumni';

  const renderView = () => {
    switch (activeView) {
      case 'home': 
        return <HomeView userRole={userRole} onNavigate={setActiveView} />;
      case 'profile': 
        return <ProfileView userRole={userRole} />;
      case 'directory': 
        return <DirectoryView userRole={userRole} />;
      case 'events': 
        return <EventsView userRole={userRole} />;
      case 'surveys': 
        return <SurveysView userRole={userRole} />;
      case 'careers': 
        return <CareersView userRole={userRole} />;
      case 'news': 
        return <NewsView userRole={userRole} />;
      case 'give': 
        return <DonationsView />; 
      case 'analytics': 
        return <AnalyticsView userRole={userRole} />;
      
      // 3. Add the case for the new view
      case 'internships':
        return <InternshipPostingsView />;

      default: 
        return <HomeView userRole={userRole} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 ml-64 min-w-0">
        {renderView()}
      </main>
    </div>
  );
}