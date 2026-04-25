import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Briefcase, Heart, Download, BarChart3, Clock } from 'lucide-react';

interface AnalyticsViewProps {
  userRole: 'alumni' | 'admin';
}

interface AnalyticsData {
  total_registrants: number;
  paid_users: number;
  pending_payments: number;
  total_funds_raised: number;
  active_projects: number;
  active_programs: number;
  monthly_reports: { month: string; registrations: number; verified_total: number }[];
}

interface ProjectAnalytics {
  project: {
    id: number;
    title: string;
    description: string;
    collaboration?: string | null;
    target_amount: number;
    start_date: string;
    end_date: string;
    status: string;
    image_url?: string | null;
    is_archived: boolean;
  };
  total_events: number;
  upcoming_events: number;
  ongoing_events: number;
  completed_events: number;
}

interface ProjectOption {
  id: number;
  title: string;
}

export function AnalyticsView({ userRole }: AnalyticsViewProps) {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics | null>(null);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAnalytics();
      fetchProjects();
    }
  }, [userRole]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/giveback/analytics/overview');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/giveback/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.map((project: any) => ({ id: project.id, title: project.title })));
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchProjectAnalytics = async (projectId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/analytics/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProjectAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching project analytics:', error);
    }
  };

  const COLORS = ['#003087', '#0052CC', '#0066FF', '#3399FF', '#66B2FF', '#99CCFF'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  if (userRole !== 'admin') {
    return <div className="p-8 text-center text-gray-500">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      {/* ADDU Decorative Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#003087]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GiveBack Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights on engagement activities and payments</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 border-2 border-[#003087] text-[#003087] rounded-lg hover:bg-[#003087] hover:text-white transition-colors font-medium"
        >
          <BarChart3 className="w-5 h-5" /> Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-semibold">Loading analytics...</p>
        </div>
      ) : analyticsData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#003087] to-[#0055cc] text-white rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl mb-1">{analyticsData.total_registrants}</div>
              <div className="text-sm text-white/80">Total Registrants</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl mb-1">{analyticsData.paid_users}</div>
              <div className="text-sm text-white/80">Paid Users</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl mb-1">{analyticsData.pending_payments}</div>
              <div className="text-sm text-white/80">Pending Payments</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl mb-1">{formatCurrency(analyticsData.total_funds_raised)}</div>
              <div className="text-sm text-white/80">Total Funds Raised</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Per-Project Analytics</h2>
              <p className="text-gray-500">Select a GiveBack project to inspect event-level activity.</p>
            </div>
            <div className="w-full md:w-96">
              <label className="text-sm font-semibold text-gray-700">Project</label>
              <select
                value={selectedProjectId ?? ''}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedProjectId(id);
                  if (id) fetchProjectAnalytics(id);
                  else setProjectAnalytics(null);
                }}
                className="w-full mt-2 p-3 border border-gray-200 rounded-xl bg-gray-50"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedProjectId && projectAnalytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-3xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">{projectAnalytics.project.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{projectAnalytics.project.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="rounded-2xl bg-white p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900">Status</p>
                    <p className="mt-2">{projectAnalytics.project.status}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900">Target Amount</p>
                    <p className="mt-2">{formatCurrency(projectAnalytics.project.target_amount)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900">Event Count</p>
                    <p className="mt-2">{projectAnalytics.total_events}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900">Timeline</p>
                    <p className="mt-2">{projectAnalytics.project.start_date} - {projectAnalytics.project.end_date}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 border border-gray-100">
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-2xl bg-white p-4 border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Upcoming Events</p>
                    <p className="mt-2 text-2xl font-bold text-[#003087]">{projectAnalytics.upcoming_events}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Ongoing Events</p>
                    <p className="mt-2 text-2xl font-bold text-green-700">{projectAnalytics.ongoing_events}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Completed Events</p>
                    <p className="mt-2 text-2xl font-bold text-gray-600">{projectAnalytics.completed_events}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedProjectId ? (
            <div className="text-center py-12 text-gray-500">Loading project analytics...</div>
          ) : (
            <div className="text-sm text-gray-500">Choose a project to view its analytics.</div>
          )}
        </div>
          </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 font-semibold">No analytics data available</p>
        </div>
      )}

      {/* Monthly Registrations Chart */}
      {analyticsData && analyticsData.monthly_reports.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Registration Trend</h2>
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6 shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.monthly_reports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="registrations" fill="#003087" name="Registrations" />
                <Bar yAxisId="right" dataKey="verified_total" fill="#10b981" name="Verified Amount (PHP)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
