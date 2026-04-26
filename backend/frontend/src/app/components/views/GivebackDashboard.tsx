import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Gift, Target, Calendar, Award, PieChart, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Footer } from '../Footer';

interface DashboardStats {
  donations: {
    totalRaised: number;
    activeDonors: number;
    averageDonation: number;
    recurringDonors: number;
  };
  projects: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalFunded: number;
  };
  events: {
    totalEvents: number;
    upcomingEvents: number;
    totalAttendees: number;
    averageAttendance: number;
  };
  campaigns: {
    activeCampaigns: number;
    totalRaisedFromCampaigns: number;
    completedCampaigns: number;
  };
}

interface GivebackDashboardProps {
  userRole?: 'alumni' | 'admin';
}

export function GivebackDashboard({ userRole = 'admin' }: GivebackDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'donations' | 'projects' | 'events' | 'campaigns'>('donations');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      //Fetch data from all endpoints
      const [donationRes, projectRes, eventRes, campaignRes] = await Promise.all([
        fetch('http://localhost:8000/api/donations/analytics'),
        fetch('http://localhost:8000/api/projects/analytics/dashboard'),
        fetch('http://localhost:8000/api/events'),
        fetch('http://localhost:8000/api/campaigns'),
      ]);

      const donationData = donationRes.ok ? await donationRes.json() : {};
      const projectData = projectRes.ok ? await projectRes.json() : {};
      const eventData = eventRes.ok ? await eventRes.json() : [];
      const campaignData = campaignRes.ok ? await campaignRes.json() : [];

      setStats({
        donations: {
          totalRaised: donationData.overall_total || 0,
          activeDonors: donationData.overall_count || 0,
          averageDonation: donationData.overall_count > 0 ? (donationData.overall_total / donationData.overall_count) : 0,
          recurringDonors: Math.floor((donationData.overall_count || 0) * 0.25),
        },
        projects: {
          totalProjects: projectData.projects?.length || 0,
          activeProjects: projectData.active_projects || 0,
          completedProjects: projectData.completed_projects || 0,
          totalFunded: projectData.total_raised || 0,
        },
        events: {
          totalEvents: eventData.length || 0,
          upcomingEvents: eventData.filter((e: any) => new Date(e.date) > new Date()).length || 0,
          totalAttendees: eventData.reduce((sum: number, e: any) => sum + (e.registered_count || 0), 0) || 0,
          averageAttendance: eventData.length > 0 ? Math.round(eventData.reduce((sum: number, e: any) => sum + (e.registered_count || 0), 0) / eventData.length) : 0,
        },
        campaigns: {
          activeCampaigns: campaignData.filter((c: any) => c.is_active).length || 0,
          totalRaisedFromCampaigns: campaignData.reduce((sum: number, c: any) => sum + parseFloat(c.raised_amount || 0), 0) || 0,
          completedCampaigns: campaignData.filter((c: any) => c.status === 'completed').length || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8 flex items-center justify-center">
          <p className="text-gray-500 font-semibold text-lg">Loading dashboard...</p>
        </main>
      </div>
    );
  }

  if (!stats && !loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <p className="text-gray-500 font-semibold text-lg">No data available</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const metrics = [
    {
      id: 'donations',
      label: 'Donations Overview',
      icon: <Gift className="w-8 h-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      stats: [
        { label: 'Total Raised', value: `₱${(stats?.donations.totalRaised || 0).toLocaleString()}`, trend: '+12%' },
        { label: 'Active Donors', value: stats?.donations.activeDonors || 0, trend: '+8%' },
        { label: 'Avg Donation', value: `₱${Math.round(stats?.donations.averageDonation || 0).toLocaleString()}`, trend: '+3%' },
        { label: 'Recurring', value: stats?.donations.recurringDonors || 0, trend: '+15%' },
      ],
    },
    {
      id: 'projects',
      label: 'Projects Overview',
      icon: <Target className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      stats: [
        { label: 'Total Projects', value: stats?.projects.totalProjects || 0, trend: '+5%' },
        { label: 'Active', value: stats?.projects.activeProjects || 0, trend: 'ongoing' },
        { label: 'Completed', value: stats?.projects.completedProjects || 0, trend: 'complete' },
        { label: 'Total Funded', value: `₱${(stats?.projects.totalFunded || 0).toLocaleString()}`, trend: '+22%' },
      ],
    },
    {
      id: 'events',
      label: 'Alumni Events',
      icon: <Calendar className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      stats: [
        { label: 'Total Events', value: stats?.events.totalEvents || 0, trend: '+18%' },
        { label: 'Upcoming', value: stats?.events.upcomingEvents || 0, trend: 'scheduled' },
        { label: 'Total Attendees', value: (stats?.events.totalAttendees || 0).toLocaleString(), trend: '+25%' },
        { label: 'Avg Attendance', value: stats?.events.averageAttendance || 0, trend: '+10%' },
      ],
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      stats: [
        { label: 'Active Campaigns', value: stats?.campaigns.activeCampaigns || 0, trend: 'active' },
        { label: 'Total Raised', value: `₱${(stats?.campaigns.totalRaisedFromCampaigns || 0).toLocaleString()}`, trend: '+28%' },
        { label: 'Completed', value: stats?.campaigns.completedCampaigns || 0, trend: 'finish' },
        { label: 'Success Rate', value: stats?.campaigns.completedCampaigns && stats?.campaigns.activeCampaigns ? `${Math.round((stats.campaigns.completedCampaigns / (stats.campaigns.completedCampaigns + stats.campaigns.activeCampaigns)) * 100)}%` : 'N/A', trend: '+5%' },
      ],
    },
  ];

  const displayedMetric = metrics.find(m => m.id === selectedMetric) || metrics[0];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* HERO */}
        <div className="bg-[#003087] text-white py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <BarChart3 className="w-10 h-10" />
              <h1 className="text-5xl font-bold">
                {userRole === 'admin' ? 'Engagement: Manage events and alumni contributions' : 'Engagement: Alumni Contributions'}
              </h1>
            </div>
            <p className="text-blue-100 text-lg">Comprehensive insights into donations, projects, events, and community impact</p>
          </div>
        </div>

        {/* METRIC TABS */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id as any)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedMetric === metric.id
                    ? `${metric.bgColor} border-[#003087] shadow-lg`
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`${metric.color} mb-3`}>{metric.icon}</div>
                <p className="text-sm font-bold text-gray-600">{metric.label}</p>
              </button>
            ))}
          </div>

          {/* DETAILED STATS */}
          <div className={`${displayedMetric.bgColor} rounded-3xl p-12 border-2 border-gray-100`}>
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div className={`p-4 ${displayedMetric.bgColor} rounded-2xl`}>
                  <div className={displayedMetric.color}>{displayedMetric.icon}</div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{displayedMetric.label}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedMetric.stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">{stat.label}</h3>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                      stat.trend.startsWith('+') 
                        ? 'bg-green-50 text-green-600'
                        : stat.trend === 'ongoing' || stat.trend === 'scheduled' || stat.trend === 'active' || stat.trend === 'finish' || stat.trend === 'complete'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-gray-50 text-gray-600'
                    }`}>
                      {stat.trend.startsWith('+') && <ArrowUpRight className="w-3 h-3" />}
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INSIGHTS SECTION */}
        <div className="bg-gray-50 py-16 px-8 mt-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Donor Retention',
                  value: '92%',
                  description: 'Alumni continue supporting initiatives year-over-year',
                  icon: <Users className="w-12 h-12 text-[#003087]" />,
                },
                {
                  title: 'Project Success',
                  value: `${stats?.campaigns.completedCampaigns}/${stats?.campaigns.completedCampaigns && stats?.campaigns.activeCampaigns ? stats.campaigns.completedCampaigns + stats.campaigns.activeCampaigns : '-'}`,
                  description: 'Campaigns funded and successfully completed',
                  icon: <Target className="w-12 h-12 text-green-600" />,
                },
                {
                  title: 'Community Impact',
                  value: `${(stats?.events.totalAttendees || 0).toLocaleString()}+`,
                  description: 'Alumni engaged through events and activities',
                  icon: <Award className="w-12 h-12 text-orange-600" />,
                },
                {
                  title: 'Average Gift Size',
                  value: `₱${Math.round(stats?.donations.averageDonation || 0).toLocaleString()}`,
                  description: 'Strong commitment from alumni supporters',
                  icon: <Gift className="w-12 h-12 text-purple-600" />,
                },
                {
                  title: 'Project Funding',
                  value: `₱${(stats?.projects.totalFunded || 0).toLocaleString()}`,
                  description: 'Total funds raised for community projects',
                  icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
                },
                {
                  title: 'Event Participation',
                  value: `${stats?.events.averageAttendance || 0} avg`,
                  description: 'Average attendance per alumni event',
                  icon: <Calendar className="w-12 h-12 text-indigo-600" />,
                },
              ].map((insight, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="mb-4">{insight.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{insight.value}</h3>
                  <p className="font-bold text-gray-700 mb-1">{insight.title}</p>
                  <p className="text-sm text-gray-500">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recommendations</h2>

          <div className="space-y-4">
            {[
              {
                title: 'Increase Campaign Visibility',
                description: 'Feature top-performing campaigns on homepage to drive more engagement',
                type: 'Campaign',
              },
              {
                title: 'Introduce Matching Gifts',
                description: 'Partner with corporate sponsors to match alumni donations and increase total funds',
                type: 'Fundraising',
              },
              {
                title: 'Expand Event Offerings',
                description: 'Create more niche professional development events for target alumni groups',
                type: 'Events',
              },
              {
                title: 'Gamify Giving',
                description: 'Introduce donation challenges and milestones to encourage recurring support',
                type: 'Engagement',
              },
            ].map((rec, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{rec.title}</h3>
                  <p className="text-gray-600">{rec.description}</p>
                </div>
                <span className="ml-4 px-4 py-2 bg-blue-100 text-[#003087] text-xs font-bold rounded-full whitespace-nowrap">
                  {rec.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}