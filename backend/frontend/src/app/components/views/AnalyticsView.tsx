import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Briefcase, Heart, Download, BarChart3 } from 'lucide-react';

const PROGRAM_OPTIONS = [
  'BS Computer Science',
  'BS Information Systems',
  'BS Information Technology',
  'BS Data Science',
  'BS Information Management',
  'AB Communication',
  'AB English Language',
  'AB Interdisciplinary Studies Minor In Language and Literature',
  'AB Interdisciplinary Studies Minor In Media and Business',
  'AB Interdisciplinary Studies Minor In Media and Technology',
  'AB Interdisciplinary Studies Minor In Philosophy and Theology',
  'AB Philosophy',
  'AB Anthropology',
  'AB Development Studies',
  'AB Economics',
  'AB International Studies Major in American Studies',
  'AB International Studies Major in Asian Studies',
  'AB Islamic Studies',
  'AB Political Science',
  'AB Psychology',
  'AB Sociology',
  'BS Social Work',
  'BS Biology Major in General Biology',
  'BS Biology Major in Medical Biology',
  'BS Chemistry',
  'BS Environmental Science',
  'BS Mathematics',
  'BS Accountancy',
  'BS Management Accounting',
  'BS Business Management',
  'BS Entrepreneurship',
  'BS Entrepreneurship Major in Agri-Business',
  'BS Finance',
  'BS Human Resource Development and Management',
  'BS Marketing',
  'Bachelor of Public Administration',
  'BS Architecture',
  'BS Aerospace Engineering',
  'BS Civil Engineering',
  'BS Chemical Engineering',
  'BS Computer Engineering',
  'BS Electrical Engineering',
  'BS Electronics Engineering',
  'BS Industrial Engineering',
  'BS Mechanical Engineering',
  'BS Robotics Engineering',
  'Bachelor of Early Childhood Education',
  'Bachelor of Elementary Education',
  'Bachelor of Secondary Education Major In English',
  'Bachelor of Secondary Education Major In Mathematics',
  'Bachelor of Secondary Education Major In Social Studies',
  'Bachelor of Secondary Education Major In Science',
  'BS Nursing',
];

interface CourseAnalyticsApiItem {
  course: string;
  registered_count: number | string;
  approved_count: number | string;
}

interface CourseAnalyticsPoint {
  course: string;
  registered: number;
  approved: number;
}

interface AnalyticsViewProps {
  userRole: 'alumni' | 'admin';
}

export function AnalyticsView({ userRole }: AnalyticsViewProps) {
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalyticsPoint[]>([]);
  const [courseAnalyticsLoading, setCourseAnalyticsLoading] = useState(false);
  const [courseAnalyticsError, setCourseAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    if (userRole !== 'admin') {
      return;
    }

    const fetchCourseAnalytics = async () => {
      setCourseAnalyticsLoading(true);
      setCourseAnalyticsError(null);

      try {
        const response = await fetch('http://localhost:8000/api/users/analytics/course-approvals');
        if (!response.ok) {
          throw new Error('Failed to fetch course analytics');
        }

        const payload = await response.json();
        const data: CourseAnalyticsApiItem[] = Array.isArray(payload?.data) ? payload.data : [];

        const byCourse = new Map<string, CourseAnalyticsPoint>();

        data.forEach((item) => {
          const courseName = (item.course || 'Unspecified').trim() || 'Unspecified';
          byCourse.set(courseName, {
            course: courseName,
            registered: Number(item.registered_count) || 0,
            approved: Number(item.approved_count) || 0,
          });
        });

        const normalized = PROGRAM_OPTIONS.map((course) => {
          const found = byCourse.get(course);
          return {
            course,
            registered: found?.registered ?? 0,
            approved: found?.approved ?? 0,
          };
        }).filter((item) => item.registered > 0 || item.approved > 0);

        const extraCourses = Array.from(byCourse.values())
          .filter((item) => !PROGRAM_OPTIONS.includes(item.course));

        setCourseAnalytics([...normalized, ...extraCourses]);
      } catch {
        setCourseAnalyticsError('Could not load alumni course analytics right now.');
      } finally {
        setCourseAnalyticsLoading(false);
      }
    };

    fetchCourseAnalytics();
  }, [userRole]);

  const courseTotals = useMemo(() => {
    return courseAnalytics.reduce(
      (acc, item) => {
        acc.registered += item.registered;
        acc.approved += item.approved;
        return acc;
      },
      { registered: 0, approved: 0 }
    );
  }, [courseAnalytics]);

  // Job/Internship Postings Data
  const careerPostingsData = [
    { month: 'Jan', jobs: 12, internships: 8 },
    { month: 'Feb', jobs: 15, internships: 10 },
    { month: 'Mar', jobs: 18, internships: 12 },
    { month: 'Apr', jobs: 14, internships: 9 },
    { month: 'May', jobs: 20, internships: 15 },
    { month: 'Jun', jobs: 22, internships: 18 }
  ];

  // Job Applications by Category
  const jobCategoryData = [
    { name: 'Software Dev', value: 145, percentage: 35 },
    { name: 'Data Science', value: 82, percentage: 20 },
    { name: 'Web Dev', value: 70, percentage: 17 },
    { name: 'Mobile Dev', value: 58, percentage: 14 },
    { name: 'Cybersecurity', value: 41, percentage: 10 },
    { name: 'Others', value: 16, percentage: 4 }
  ];

  // Donation by Quarter
  const donationData = [
    { quarter: 'Q1 2025', amount: 1.8 },
    { quarter: 'Q2 2025', amount: 2.2 },
    { quarter: 'Q3 2025', amount: 2.8 },
    { quarter: 'Q4 2025', amount: 3.2 }
  ];

  // Donation by Purpose
  const donationPurposeData = [
    { name: 'Scholarships', value: 4.5, percentage: 45 },
    { name: 'Infrastructure', value: 2.5, percentage: 25 },
    { name: 'Research', value: 1.5, percentage: 15 },
    { name: 'Student Programs', value: 1.0, percentage: 10 },
    { name: 'Others', value: 0.5, percentage: 5 }
  ];

  // Career Success Rate
  const careerSuccessData = [
    { month: 'Jan', rate: 78 },
    { month: 'Feb', rate: 82 },
    { month: 'Mar', rate: 85 },
    { month: 'Apr', rate: 83 },
    { month: 'May', rate: 88 },
    { month: 'Jun', rate: 90 }
  ];

  const COLORS = ['#003087', '#0052CC', '#0066FF', '#3399FF', '#66B2FF', '#99CCFF'];

  return (
    <div className="p-8 relative">
      {/* ADDU Decorative Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#003087]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Analytics & Reporting</h1>
          <p className="text-gray-600">Career opportunities and donations insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#003087] text-[#003087] rounded-lg hover:bg-[#003087] hover:text-white transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-[#003087] to-[#0055cc] text-white rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-3xl mb-1">127</div>
            <div className="text-sm text-white/80">Total Job Postings</div>
            <div className="text-xs mt-2">+18% from last period</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-3xl mb-1">72</div>
            <div className="text-sm text-white/80">Internship Postings</div>
            <div className="text-xs mt-2">+25% from last period</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl text-gray-900 mb-1">412</div>
          <div className="text-sm text-gray-600">Total Applications</div>
          <div className="text-xs text-green-600 mt-2">+32% from last period</div>
        </div>

        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl text-gray-900 mb-1">₱10M</div>
          <div className="text-sm text-gray-600">Total Donations (2025)</div>
          <div className="text-xs text-green-600 mt-2">+22% from last year</div>
        </div>
      </div>

      {userRole === 'admin' && (
        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Alumni Accounts by Degree Program</h2>
              <p className="text-gray-600">Registered and approved alumni accounts per course</p>
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Registered:</span> {courseTotals.registered} |{' '}
              <span className="font-semibold">Approved:</span> {courseTotals.approved}
            </div>
          </div>

          {courseAnalyticsLoading && (
            <p className="text-gray-600">Loading alumni course analytics...</p>
          )}

          {!courseAnalyticsLoading && courseAnalyticsError && (
            <p className="text-red-600">{courseAnalyticsError}</p>
          )}

          {!courseAnalyticsLoading && !courseAnalyticsError && courseAnalytics.length === 0 && (
            <p className="text-gray-600">No alumni course data yet.</p>
          )}

          {!courseAnalyticsLoading && !courseAnalyticsError && courseAnalytics.length > 0 && (
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={courseAnalytics} margin={{ top: 10, right: 20, left: 0, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="course"
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={110}
                  tick={{ fontSize: 11 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="registered" fill="#003087" name="Registered" />
                <Bar dataKey="approved" fill="#ff8c42" name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Opportunities Analytics</h2>
        <p className="text-gray-600">Track job and internship postings performance</p>
      </div>

      {/* Career Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Job/Internship Postings */}
        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Postings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={careerPostingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jobs" fill="#003087" name="Job Postings" />
              <Bar dataKey="internships" fill="#ff8c42" name="Internship Postings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applications by Category */}
        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Applications by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {jobCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Career Success Rate */}
        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Application Success Rate (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={careerSuccessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#003087" 
                strokeWidth={3} 
                name="Success Rate %" 
                dot={{ fill: '#003087', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-6 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Donations Analytics</h2>
        <p className="text-gray-600">Track giving and fundraising performance</p>
      </div>

      {/* Donations Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quarterly Donations */}
        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quarterly Donations (Millions ₱)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8b5cf6" name="Donation Amount (M)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donations by Purpose */}
        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Donations by Purpose</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donationPurposeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {donationPurposeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₱${value}M`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Donation</p>
              <p className="text-2xl font-bold text-gray-900">₱2,850</p>
            </div>
          </div>
          <p className="text-xs text-green-600">+15% from last year</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900">3,508</p>
            </div>
          </div>
          <p className="text-xs text-green-600">+28% from last year</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scholarships Funded</p>
              <p className="text-2xl font-bold text-gray-900">125</p>
            </div>
          </div>
          <p className="text-xs text-green-600">+10% from last year</p>
        </div>
      </div>
    </div>
  );
}
