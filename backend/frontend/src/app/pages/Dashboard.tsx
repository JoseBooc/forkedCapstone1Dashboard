import { useState } from 'react';
import { HomeView } from '../components/views/HomeView';
import { ProfileView } from '../components/views/ProfileView';
import { DirectoryView } from '../components/views/DirectoryView';
import { EventsView } from '../components/views/EventsView';
import { SurveysView } from '../components/views/SurveysView';
import { CareersView } from '../components/views/CareersView';
import { NewsView } from '../components/views/NewsView';
import { DonationsView } from '../components/views/DonationView';
import { ProjectsView } from '../components/views/ProjectsView';
import { AlumniCommunityView } from '../components/views/AlumniCommunityView';
import { AnalyticsView } from '../components/views/AnalyticsView';
import { InternshipPostingsView } from '../components/views/InternshipPostingsView';
import { UserManagementView } from '../components/views/UserManagementView';
import { PaymentVerificationPanel } from '../components/PaymentVerificationPanel';
import { RegistrationManagement } from '../components/RegistrationManagement';
import { Sidebar } from '../components/Sidebar';

export function Dashboard() {
  const [activeView, setActiveView] = useState<
    'home'|'profile'|'directory'|'events'|'surveys'|'careers'|'news'|
    'give'|'projects'|'alumni'|'payments'|'registrations'|'analytics'|
    'internships'|'users'
  >('home');
  
  const userRole = (localStorage.getItem('userRole') as 'alumni' | 'admin') || 'alumni';

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
        return <DonationsView userRole={userRole} onNavigate={(view) => setActiveView(view as any)} />;
      case 'projects':
        return <ProjectsView userRole={userRole} onNavigate={(view) => setActiveView(view as any)} />;
      case 'alumni':
        return <AlumniCommunityView userRole={userRole} onNavigate={(view) => setActiveView(view as any)} />;
      case 'payments':
        return <PaymentVerificationPanel userRole={userRole} />;
      case 'registrations':
        return <RegistrationManagement userRole={userRole} />;
      case 'analytics': 
        return <AnalyticsView userRole={userRole} />;
      case 'internships':
        return <InternshipPostingsView role={userRole} />;
      case 'users':
        return <UserManagementView userRole={userRole} />;
      default: 
        return <HomeView userRole={userRole} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activeView={activeView} onNavigate={setActiveView} userRole={userRole} />
      <main className="flex-1 min-w-0">
        {renderView()}
      </main>
    </div>
  );
}