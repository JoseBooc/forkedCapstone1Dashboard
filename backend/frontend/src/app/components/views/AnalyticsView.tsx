import { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Users, Briefcase,
  Heart, Download, BarChart3,
  GraduationCap, Calendar, Globe, Clock
} from 'lucide-react';

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

type ReportTab = 'website' | 'tracer' | 'giveback' | 'events' | 'jobs';

// ── Reusable helpers ──────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

function MetricCard({ label, value, sub, gradient, icon }: {
  label: string;
  value: string;
  sub: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl p-6 text-white bg-gradient-to-br ${gradient} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8" />
      <div className="relative">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm font-semibold text-white/90 mb-1">{label}</div>
        <div className="text-xs text-white/70">{sub}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AnalyticsView({ userRole }: AnalyticsViewProps) {
  const [activeReport, setActiveReport] = useState<ReportTab>('website');

  // ── API state (GiveBack tab) ────────────────────────────────────────────────
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
        setProjects(data.map((p: any) => ({ id: p.id, title: p.title })));
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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

  // ── Static chart data ─────────────────────────────────────────────────────

  // Website & News
  const visitsData = [
    { month: 'Jan', alumni: 120, guests: 80 },
    { month: 'Feb', alumni: 150, guests: 95 },
    { month: 'Mar', alumni: 180, guests: 110 },
    { month: 'Apr', alumni: 170, guests: 105 },
    { month: 'May', alumni: 200, guests: 130 },
    { month: 'Jun', alumni: 230, guests: 150 }
  ];

  const newsClicksData = [
    { title: 'Alumni Homecoming', clicks: 320 },
    { title: 'Scholarship Launch', clicks: 280 },
    { title: 'New Campus Opening', clicks: 210 },
    { title: 'Tech Conference', clicks: 260 },
    { title: 'Sports Fest Recap', clicks: 190 }
  ];

  // Graduate Tracer Study
  const jobMatchData = [
    { program: 'CS', matched: 88, unmatched: 12 },
    { program: 'Engineering', matched: 75, unmatched: 25 },
    { program: 'Business', matched: 70, unmatched: 30 },
    { program: 'Education', matched: 65, unmatched: 35 },
    { program: 'Nursing', matched: 92, unmatched: 8 },
    { program: 'Law', matched: 80, unmatched: 20 }
  ];

  const respondentsVsActualData = [
    { batch: '2019', respondents: 68, actual: 120 },
    { batch: '2020', respondents: 82, actual: 135 },
    { batch: '2021', respondents: 75, actual: 110 },
    { batch: '2022', respondents: 90, actual: 140 },
    { batch: '2023', respondents: 60, actual: 125 },
    { batch: '2024', respondents: 45, actual: 100 }
  ];

  // Events & Engagement
  const attendanceData = [
    { event: 'Homecoming', registered: 320, attended: 275 },
    { event: 'Job Fair', registered: 210, attended: 190 },
    { event: 'Alumni Night', registered: 180, attended: 155 },
    { event: 'Seminar', registered: 150, attended: 120 },
    { event: 'Sports Fest', registered: 260, attended: 240 }
  ];

  const incomeData = [
    { event: 'Homecoming', income: 85000 },
    { event: 'Job Fair', income: 42000 },
    { event: 'Alumni Night', income: 63000 },
    { event: 'Seminar', income: 18000 },
    { event: 'Sports Fest', income: 37000 }
  ];

  // Jobs & Internships
  const applicantsData = [
    { title: 'Frontend Dev', applicants: 48 },
    { title: 'Data Analyst', applicants: 35 },
    { title: 'HR Intern', applicants: 27 },
    { title: 'Marketing', applicants: 42 },
    { title: 'Backend Dev', applicants: 56 },
    { title: 'Accounting', applicants: 31 }
  ];

  const applicantsTrendData = [
    { month: 'Jan', jobs: 65, internships: 40 },
    { month: 'Feb', jobs: 78, internships: 52 },
    { month: 'Mar', jobs: 90, internships: 61 },
    { month: 'Apr', jobs: 72, internships: 48 },
    { month: 'May', jobs: 105, internships: 70 },
    { month: 'Jun', jobs: 118, internships: 83 }
  ];

  // ── Tab config ────────────────────────────────────────────────────────────

  const reportTabs: { id: ReportTab; label: string; icon: React.ReactNode }[] = [
    { id: 'website',  label: 'Website & News',        icon: <Globe className="w-4 h-4" /> },
    { id: 'tracer',   label: 'Graduate Tracer Study', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'giveback', label: 'Give Back',              icon: <Heart className="w-4 h-4" /> },
    { id: 'events',   label: 'Events & Engagement',   icon: <Calendar className="w-4 h-4" /> },
    { id: 'jobs',     label: 'Job & Internship',      icon: <Briefcase className="w-4 h-4" /> }
  ];

  if (userRole !== 'admin') {
    return <div className="p-8 text-center text-gray-500">Access denied. Admin only.</div>;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Data Analytics & Reporting</h1>
            <p className="text-gray-500">Select a report category to view detailed insights</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#003087] text-[#003087] rounded-lg hover:bg-[#003087] hover:text-white transition-colors font-medium"
            >
              <BarChart3 className="w-5 h-5" /> Refresh Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-medium">
              <Download className="w-5 h-5" /> Export Report
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          {reportTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeReport === tab.id
                  ? 'bg-[#003087] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#003087] hover:text-[#003087]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Website & News ── */}
        {activeReport === 'website' && (
          <div>
            <SectionHeader
              title="Website & News Report"
              subtitle="Track web visits and news article engagement"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                label="Total Visits (Jun)"
                value="380"
                sub="Alumni + Guests combined"
                gradient="from-[#003087] to-[#0055cc]"
                icon={<Globe className="w-6 h-6" />}
              />
              <MetricCard
                label="Alumni Visits"
                value="230"
                sub="+15% vs last month"
                gradient="from-[#003087] to-[#0055cc]"
                icon={<Users className="w-6 h-6" />}
              />
              <MetricCard
                label="Most Clicked Article"
                value="320"
                sub="Alumni Homecoming 2025"
                gradient="from-orange-400 to-orange-600"
                icon={<TrendingUp className="w-6 h-6" />}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Monthly Website Visits">
                <LineChart data={visitsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="alumni" stroke="#003087" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="guests" stroke="#ff8c42" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartCard>
              <ChartCard title="News Article Click Count">
                <BarChart data={newsClicksData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="title" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#0052CC" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>
            </div>
          </div>
        )}

        {/* ── Graduate Tracer Study ── */}
        {activeReport === 'tracer' && (
          <div>
            <SectionHeader
              title="Graduate Tracer Study"
              subtitle="Job matching analytics and respondent coverage by program and batch"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                label="Overall Job Match Rate"
                value="78%"
                sub="Across all programs"
                gradient="from-[#003087] to-[#0055cc]"
                icon={<BarChart3 className="w-6 h-6" />}
              />
              <MetricCard
                label="Total Respondents"
                value="420"
                sub="Out of 730 graduates"
                gradient="from-[#003087] to-[#0055cc]"
                icon={<Users className="w-6 h-6" />}
              />
              <MetricCard
                label="Response Rate"
                value="57.5%"
                sub="+8% from last batch"
                gradient="from-orange-400 to-orange-600"
                icon={<TrendingUp className="w-6 h-6" />}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Job Matching by Program (%)">
                <BarChart data={jobMatchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="program" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="matched" name="Matched (%)" fill="#003087" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="unmatched" name="Unmatched (%)" fill="#ff8c42" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>
              <ChartCard title="Respondents vs Actual Alumni by Batch">
                <BarChart data={respondentsVsActualData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="batch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="respondents" name="Respondents" fill="#0052CC" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual Alumni" fill="#3399FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>
            </div>
          </div>
        )}

        {/* ── Give Back (API-driven) ── */}
        {activeReport === 'giveback' && (
          <div>
            <SectionHeader
              title="Give Back — Donations Report"
              subtitle="Live donation totals, campaign breakdown, and per-project event analytics"
            />

            {loading ? (
              <div className="text-center py-12 text-gray-500 font-semibold">Loading analytics...</div>
            ) : analyticsData ? (
              <>
                {/* Key metrics from API */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <MetricCard
                    label="Total Registrants"
                    value={String(analyticsData.total_registrants)}
                    sub="All-time registrations"
                    gradient="from-[#003087] to-[#0055cc]"
                    icon={<Users className="w-6 h-6" />}
                  />
                  <MetricCard
                    label="Paid Users"
                    value={String(analyticsData.paid_users)}
                    sub="Verified contributors"
                    gradient="from-green-500 to-green-600"
                    icon={<Heart className="w-6 h-6" />}
                  />
                  <MetricCard
                    label="Pending Payments"
                    value={String(analyticsData.pending_payments)}
                    sub="Awaiting verification"
                    gradient="from-yellow-400 to-yellow-600"
                    icon={<Clock className="w-6 h-6" />}
                  />
                  <MetricCard
                    label="Total Funds Raised"
                    value={formatCurrency(analyticsData.total_funds_raised)}
                    sub="Across all campaigns"
                    gradient="from-purple-500 to-purple-600"
                    icon={<BarChart3 className="w-6 h-6" />}
                  />
                </div>

                {/* Monthly Registration Trend */}
                {analyticsData.monthly_reports.length > 0 && (
                  <div className="mb-8">
                    <ChartCard title="Monthly Registration Trend">
                      <BarChart data={analyticsData.monthly_reports}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="registrations" fill="#003087" name="Registrations" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="verified_total" fill="#10b981" name="Verified Amount (PHP)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartCard>
                  </div>
                )}

                {/* Per-Project Analytics */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Per-Project Analytics</h3>
                      <p className="text-gray-500 text-sm">Select a GiveBack project to inspect event-level activity.</p>
                    </div>
                    <div className="w-full md:w-80">
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Project</label>
                      <select
                        value={selectedProjectId ?? ''}
                        onChange={(e) => {
                          const id = Number(e.target.value);
                          setSelectedProjectId(id || null);
                          if (id) fetchProjectAnalytics(id);
                          else setProjectAnalytics(null);
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
                      >
                        <option value="">Select a project</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedProjectId && projectAnalytics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 rounded-3xl p-6 border border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900">{projectAnalytics.project.title}</h4>
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
                            <p className="font-semibold text-gray-900">Total Events</p>
                            <p className="mt-2">{projectAnalytics.total_events}</p>
                          </div>
                          <div className="rounded-2xl bg-white p-4 border border-gray-100">
                            <p className="font-semibold text-gray-900">Timeline</p>
                            <p className="mt-2">{projectAnalytics.project.start_date} – {projectAnalytics.project.end_date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-3xl p-6 border border-gray-100 flex flex-col gap-4">
                        <div className="rounded-2xl bg-white p-4 border border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">Upcoming Events</p>
                          <p className="mt-1 text-2xl font-bold text-[#003087]">{projectAnalytics.upcoming_events}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 border border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">Ongoing Events</p>
                          <p className="mt-1 text-2xl font-bold text-green-700">{projectAnalytics.ongoing_events}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 border border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">Completed Events</p>
                          <p className="mt-1 text-2xl font-bold text-gray-600">{projectAnalytics.completed_events}</p>
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
                <p className="text-gray-500 font-semibold">No analytics data available.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Events & Engagement ── */}
        {activeReport === 'events' && (
          <div>
            <SectionHeader
              title="Events & Engagement Report"
              subtitle="Attendance and income breakdown per event"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                label="Total Events (2025)"
                value="5"
                sub="Across all campuses"
                gradient="from-[#003087] to-[#0055cc]"
                icon={<Calendar className="w-6 h-6" />}
              />
              <MetricCard
                label="Total Attendees"
                value="980"
                sub="Out of 1,120 registered"
                gradient="from-[#003087] to-[#0055cc]"
                icon={<Users className="w-6 h-6" />}
              />
              <MetricCard
                label="Total Event Income"
                value="₱245K"
                sub="Across all events"
                gradient="from-orange-400 to-orange-600"
                icon={<TrendingUp className="w-6 h-6" />}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Attendance Report (Registered vs Attended)">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="event" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="registered" name="Registered" fill="#003087" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attended" name="Attended" fill="#3399FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>
              <ChartCard title="Income Report per Event (₱)">
                <BarChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="event" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" name="Income (₱)" fill="#0066FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>
            </div>
          </div>
        )}

        {/* ── Job & Internship ── */}
        {activeReport === 'jobs' && (
          <div>
            <SectionHeader
              title="Job & Internship Report"
              subtitle="Number of applicants per posting and monthly trends"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                label="Total Applicants (Jun)"
                value="201"
                sub="Jobs + Internships"
                gradient="from-[#003087] to-[#0055cc]"
                icon={<Briefcase className="w-6 h-6" />}
              />
              <MetricCard
                label="Most Applied Role"
                value="Backend Dev"
                sub="56 applicants"
                gradient="from-[#003087] to-[#0055cc]"
                icon={<BarChart3 className="w-6 h-6" />}
              />
              <MetricCard
                label="Avg. Applicants/Post"
                value="38"
                sub="Across all listings"
                gradient="from-orange-400 to-orange-600"
                icon={<TrendingUp className="w-6 h-6" />}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="No. of Applicants per Posting">
                <BarChart data={applicantsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="title" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="#003087" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>
              <ChartCard title="Monthly Applicants Trend">
                <LineChart data={applicantsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="jobs" name="Job Applicants" stroke="#003087" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="internships" name="Internship Applicants" stroke="#ff8c42" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartCard>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}