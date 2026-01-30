import { useState } from 'react';
import { HomeView } from '../components/views/HomeView';
import { ProfileView } from '../components/views/ProfileView';
import { DirectoryView } from '../components/views/DirectoryView';
import { EventsView } from '../components/views/EventsView';
import { SurveysView } from '../components/views/SurveysView';
import { CareersView } from '../components/views/CareersView';
import { NewsView } from '../components/views/NewsView';
import { DonationsView } from '../components/views/DonationView';
import { AnalyticsView } from '../components/views/AnalyticsView';
import { InternshipPostingsView } from '../components/views/InternshipPostingsView';
import { Sidebar } from '../components/Sidebar';

export function Dashboard() {
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
