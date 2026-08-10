import { useEffect, useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  ArrowRight,
  Bookmark,
  Building2,
  GraduationCap,
  Laptop,
  X,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Footer } from '../Footer';

const API_BASE_URL = 'http://localhost:8000';

interface Opportunity {
  id: number;
  type: 'Job' | 'Internship';
  title: string;
  company: string;
  location: string;
  work_type: string;
  modality: 'Remote' | 'Hybrid' | 'On-site';
  salary_range: string | null;
  description: string;
  application_email: string;
  is_priority: boolean;
  status: string;
  posted_by_name: string | null;
  created_at: string;
}

interface HiringRequestItem {
  id: number;
  type: 'Job' | 'Internship';
  title: string;
  company: string;
  location: string;
  work_type: string;
  modality: string;
  salary_range: string | null;
  description: string;
  application_email: string;
  submitted_by_name: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

function formatPosted(dateString: string) {
  const posted = new Date(dateString);
  const diffMs = Date.now() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
}

export function CareersView({ userRole }: { userRole: string }) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'published' | 'draft'>('idle');
  const [opportunityType, setOpportunityType] = useState<'Job' | 'Internship'>('Job');

  const [activeTab, setActiveTab] = useState('All Opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedModality, setSelectedModality] = useState<string>('All');

  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [pendingRequests, setPendingRequests] = useState<HiringRequestItem[]>([]);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formWorkType, setFormWorkType] = useState('');
  const [formModality, setFormModality] = useState<'Remote' | 'Hybrid' | 'On-site'>('On-site');
  const [formSalary, setFormSalary] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isAdmin = userRole === 'admin';
  const tabs = isAdmin
    ? ['All Opportunities', 'Jobs only', 'Internship only', 'Pending Requests']
    : ['All Opportunities', 'Jobs only', 'Internship only'];

  const fetchOpportunities = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/career-opportunities`);
      if (!response.ok) throw new Error('Failed to load opportunities');
      const data = await response.json();
      setOpportunities(data);
    } catch (err) {
      setLoadError('Unable to load career opportunities. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/hiring-requests?status=pending`);
      if (!response.ok) throw new Error('Failed to load hiring requests');
      const data = await response.json();
      setPendingRequests(data);
    } catch (err) {
      // Silently ignore; the pending tab will just show empty state
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchPendingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleOpportunity = (type: 'Job' | 'Internship') => {
    setOpportunityType(type);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCompany('');
    setFormLocation('');
    setFormWorkType('');
    setFormModality('On-site');
    setFormSalary('');
    setFormDescription('');
    setFormEmail('');
    setOpportunityType('Job');
    setSubmitError('');
  };

  const handleCloseForm = () => {
    setShowPostForm(false);
    setSubmissionStatus('idle');
    resetForm();
  };

  const handleSubmitOpportunity = async () => {
    if (!formTitle || !formCompany || !formLocation || !formWorkType || !formDescription || !formEmail) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/hiring-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: opportunityType,
          title: formTitle,
          company: formCompany,
          location: formLocation,
          work_type: formWorkType,
          modality: formModality,
          salary_range: formSalary || null,
          description: formDescription,
          application_email: formEmail,
          submitted_by_name: localStorage.getItem('userName') || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit opportunity');

      setSubmissionStatus('published');
      if (isAdmin) fetchPendingRequests();
    } catch (err) {
      setSubmitError('Something went wrong submitting your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (id: number, action: 'approve' | 'reject') => {
    setReviewingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/hiring-requests/${id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewed_by_name: localStorage.getItem('userName') || null }),
      });
      if (!response.ok) throw new Error('Review action failed');
      await Promise.all([fetchPendingRequests(), fetchOpportunities()]);
    } catch (err) {
      // no-op; the item stays in the pending list so the admin can retry
    } finally {
      setReviewingId(null);
    }
  };

  const filteredOpportunities = opportunities.filter((item) => {
    const matchesTab =
      activeTab === 'All Opportunities' ||
      (activeTab === 'Jobs only' && item.type === 'Job') ||
      (activeTab === 'Internship only' && item.type === 'Internship');

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModality = selectedModality === 'All' || item.modality === selectedModality;

    return matchesTab && matchesSearch && matchesModality;
  });

  const fullTimeCount = opportunities.filter((o) => o.work_type === 'Full-time').length;
  const internshipCount = opportunities.filter((o) => o.type === 'Internship').length;
  const postedThisWeekCount = opportunities.filter((o) => {
    const diffDays = Math.floor((Date.now() - new Date(o.created_at).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  if (selectedOpportunity) {
    return (
      <div className="addu-brand flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto text-left">
            <button
              onClick={() => setSelectedOpportunity(null)}
              className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-ateneo-blue-main transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Career Opportunities
            </button>

            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-ateneo-blue-main p-12 text-white">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-md">
                      {selectedOpportunity.type}
                    </span>
                    <h1 className="text-4xl font-bold">{selectedOpportunity.title}</h1>
                    <div className="flex flex-wrap gap-6 text-blue-100">
                      <div className="flex items-center gap-2 font-bold"><Building2 className="w-5 h-5" /> {selectedOpportunity.company}</div>
                      <div className="flex items-center gap-2 font-bold"><MapPin className="w-5 h-5" /> {selectedOpportunity.location}</div>
                      <div className="flex items-center gap-2 font-bold"><Clock className="w-5 h-5" /> {selectedOpportunity.work_type}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-10">
                    <section className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">Description</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{selectedOpportunity.description}</p>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-6">
                      {selectedOpportunity.salary_range && (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Salary Range</p>
                          <p className="text-xl font-bold text-ateneo-blue-main">{selectedOpportunity.salary_range}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Date Posted</p>
                        <p className="text-xl font-bold text-gray-900">{formatPosted(selectedOpportunity.created_at)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Modality</p>
                        <p className="text-xl font-bold text-gray-900">{selectedOpportunity.modality}</p>
                      </div>
                      <a
                        href={`mailto:${selectedOpportunity.application_email}`}
                        className="block text-center w-full py-4 bg-ateneo-blue-main text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-ateneo-blue-dark transition-all"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showPostForm) {
    return (
      <div className="addu-brand flex flex-col min-h-screen bg-white">
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto border border-gray-200 rounded-[32px] shadow-sm p-10">
            {submissionStatus === 'idle' ? (
              <>
                <div className="flex justify-between items-center mb-10">
                  <h1 className="text-2xl font-bold text-gray-900 text-left">Post a New Opportunity</h1>
                  <button onClick={handleCloseForm} className="text-gray-500 font-bold hover:text-gray-700 flex items-center gap-1 transition-colors">
                    Cancel
                  </button>
                </div>
                <div className="space-y-8 text-left">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Opportunity Type *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleToggleOpportunity('Job')}
                        className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all ${opportunityType === 'Job' ? 'border-ateneo-blue-main bg-blue-50/50 text-ateneo-blue-main' : 'border-gray-100 bg-gray-50/50 text-gray-400'}`}
                      >
                        <Briefcase className="w-8 h-8 mb-3" />
                        <span className="font-bold text-lg">Full-time Job</span>
                      </button>
                      <button
                        onClick={() => handleToggleOpportunity('Internship')}
                        className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all ${opportunityType === 'Internship' ? 'border-ateneo-blue-main bg-blue-50/50 text-ateneo-blue-main' : 'border-gray-100 bg-gray-50/50 text-gray-400'}`}
                      >
                        <GraduationCap className="w-8 h-8 mb-3 text-ateneo-yellow-3" />
                        <span className="font-bold text-lg">Internship</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Job Title *</label>
                      <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., Senior Software Engineer" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-ateneo-blue-main/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Company Name *</label>
                      <input type="text" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="Your company name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-ateneo-blue-main/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Location *</label>
                      <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="City, Country or Remote" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-ateneo-blue-main/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Employment Type *</label>
                      <select value={formWorkType} onChange={(e) => setFormWorkType(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none appearance-none text-gray-700">
                        <option value="">Select type</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Work Modality *</label>
                      <select value={formModality} onChange={(e) => setFormModality(e.target.value as 'Remote' | 'Hybrid' | 'On-site')} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none appearance-none text-gray-700">
                        <option>On-site</option>
                        <option>Hybrid</option>
                        <option>Remote</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Salary Range (optional)</label>
                      <input type="text" value={formSalary} onChange={(e) => setFormSalary(e.target.value)} placeholder="e.g., Php 40,000 - 60,000" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-ateneo-blue-main/10 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Description *</label>
                    <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe the role, responsibilities, and requirements..." rows={6} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none resize-none focus:bg-white focus:ring-2 focus:ring-ateneo-blue-main/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Application Email *</label>
                    <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="careers@company.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-ateneo-blue-main/10" />
                  </div>
                  {submitError && <p className="text-ateneo-red text-sm font-semibold">{submitError}</p>}
                  <div className="pt-6 flex gap-4">
                    <button
                      onClick={handleSubmitOpportunity}
                      disabled={submitting}
                      className="px-10 py-4 bg-ateneo-blue-main text-white rounded-xl font-bold hover:bg-ateneo-blue-dark transition-all shadow-lg shadow-blue-900/10 disabled:opacity-60 flex items-center gap-2"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Post Opportunity
                    </button>
                    <button onClick={() => setSubmissionStatus('draft')} className="px-10 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                      Save as Draft
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 flex flex-col items-center text-center space-y-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${submissionStatus === 'published' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <CheckCircle2 className={`w-10 h-10 ${submissionStatus === 'published' ? 'text-ateneo-green' : 'text-ateneo-blue-main'}`} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">{submissionStatus === 'published' ? 'Opportunity Submitted!' : 'Draft Saved!'}</h2>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {submissionStatus === 'published'
                      ? "Your listing has been submitted and is now pending review by the Alumni Office."
                      : "Your progress has been saved. You can find this listing in your drafts later."}
                  </p>
                </div>
                <button onClick={handleCloseForm} className="mt-4 px-8 py-3 bg-ateneo-blue-main text-white rounded-xl font-bold hover:bg-ateneo-blue-dark transition-all">
                  Return to Directory
                </button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="addu-brand flex flex-col min-h-screen bg-white">
      <main className="flex-1 p-8 space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
            <p className="text-gray-500 text-sm mt-1">Explore jobs and internships from the ADDU community</p>
          </div>
          <button onClick={() => setShowPostForm(true)} className="bg-ateneo-blue-main text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-ateneo-blue-dark transition-all flex items-center gap-2">
            Post a Job Opening <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 text-left flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ateneo-blue-main/10 text-ateneo-blue-main flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Full-time Jobs</p>
              <p className="text-3xl font-bold text-ateneo-blue-main">{fullTimeCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 text-left flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ateneo-yellow-main/25 text-ateneo-blue-dark flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Internships</p>
              <p className="text-3xl font-bold text-ateneo-blue-dark">{internshipCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 text-left flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ateneo-cyan/10 text-ateneo-cyan flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Posted This Week</p>
              <p className="text-3xl font-bold text-ateneo-blue-main">{postedThisWeekCount}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-header pb-4 text-[13px] font-bold whitespace-nowrap transition-all relative flex items-center gap-2 ${activeTab === tab ? 'text-ateneo-blue-main' : 'text-gray-400'}`}
            >
              {tab === 'Pending Requests' && <ShieldCheck className="w-3.5 h-3.5" />}
              {tab}
              {tab === 'Pending Requests' && pendingRequests.length > 0 && (
                <span className="bg-ateneo-yellow-main text-ateneo-blue-dark text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
              )}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-ateneo-blue-main" />}
            </button>
          ))}
        </div>

        {activeTab === 'Pending Requests' ? (
          <div className="space-y-6 text-left pb-10">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((req) => (
                <div key={req.id} className="rounded-[32px] p-8 bg-white border border-gray-100 flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-ateneo-cyan/10 text-ateneo-cyan text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{req.type}</span>
                      <span className="text-gray-400 text-[12px] font-medium">Submitted {formatPosted(req.created_at)}{req.submitted_by_name ? ` by ${req.submitted_by_name}` : ''}</span>
                    </div>
                    <h3 className="card-title text-xl font-bold text-gray-900">{req.title}</h3>
                    <p className="text-ateneo-blue-main font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 opacity-70" /> {req.company}</p>
                    <div className="flex flex-wrap gap-6 text-[14px] text-gray-500">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 opacity-70" /> {req.location}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 opacity-70" /> {req.work_type} ({req.modality})</div>
                    </div>
                    <p className="text-gray-600 text-sm">{req.description}</p>
                  </div>
                  <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[160px]">
                    <button
                      onClick={() => handleReview(req.id, 'approve')}
                      disabled={reviewingId === req.id}
                      className="px-6 py-3 rounded-2xl font-bold text-sm bg-ateneo-green text-white hover:bg-emerald-700 transition-all disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(req.id, 'reject')}
                      disabled={reviewingId === req.id}
                      className="px-6 py-3 rounded-2xl font-bold text-sm bg-white border border-ateneo-red/30 text-ateneo-red hover:bg-red-50 transition-all disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium italic">No pending hiring requests to review.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="relative flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title or company..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-ateneo-blue-main/20 outline-none text-sm transition-all"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-8 py-4 border rounded-2xl font-bold text-sm transition-all h-full ${showFilters || selectedModality !== 'All' ? 'bg-ateneo-blue-main text-white border-ateneo-blue-main' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                  <Filter className="w-4 h-4" />
                  {selectedModality === 'All' ? 'Filter' : `Modality: ${selectedModality}`}
                </button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-2 text-left">
                    <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Work Modality</span>
                      <button onClick={() => setShowFilters(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    {['All', 'On-site', 'Hybrid', 'Remote'].map((modality) => (
                      <button
                        key={modality}
                        onClick={() => {
                          setSelectedModality(modality);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-colors ${selectedModality === modality ? 'bg-blue-50 text-ateneo-blue-main font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {modality}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 text-left pb-10">
              {loading ? (
                <div className="py-24 flex items-center justify-center gap-3 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading opportunities...
                </div>
              ) : loadError ? (
                <div className="py-24 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                  <p className="text-ateneo-red font-medium">{loadError}</p>
                </div>
              ) : filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-[32px] p-8 flex flex-col md:flex-row justify-between gap-8 transition-all ${item.is_priority ? 'bg-ateneo-blue-main text-white shadow-2xl shadow-blue-900/20' : 'bg-white text-gray-900 border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40'}`}
                  >
                    <div className="flex-1 space-y-5">
                      <div className="flex items-center gap-3">
                        {item.is_priority && <span className="bg-ateneo-yellow-main text-ateneo-blue-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured Opportunity</span>}
                        <div className="flex items-center gap-1.5">
                          <Calendar className={`w-3.5 h-3.5 ${item.is_priority ? 'text-blue-300' : 'text-gray-400'}`} />
                          <span className={`${item.is_priority ? 'text-blue-300' : 'text-gray-400'} text-[12px] font-medium`}>{item.type} • Posted {formatPosted(item.created_at)}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="card-title text-2xl font-bold leading-tight">{item.title}</h3>
                        <p className={`${item.is_priority ? 'text-blue-100' : 'text-ateneo-blue-main'} font-semibold text-lg mt-1 flex items-center gap-2`}><Building2 className="w-4 h-4 opacity-70" /> {item.company}</p>
                      </div>
                      <div className="flex flex-wrap gap-6 text-[14px]">
                        <div className={`flex items-center gap-2 ${item.is_priority ? 'text-blue-100' : 'text-gray-500'}`}><MapPin className="w-4 h-4 opacity-70" /> {item.location}</div>
                        <div className={`flex items-center gap-2 ${item.is_priority ? 'text-blue-100' : 'text-gray-500'}`}>{item.type === 'Internship' ? <GraduationCap className="w-4 h-4 opacity-70" /> : <Laptop className="w-4 h-4 opacity-70" />} {item.work_type} ({item.modality})</div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[180px]">
                      <button
                        onClick={() => setSelectedOpportunity(item)}
                        className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all flex-1 md:flex-none shadow-sm ${item.is_priority ? 'bg-white text-ateneo-blue-main hover:bg-blue-50' : 'bg-ateneo-blue-main text-white hover:bg-ateneo-blue-dark'}`}
                      >
                        {item.is_priority ? 'Apply Now' : 'View Details'}
                      </button>
                      <button className={`p-4 rounded-2xl transition-all border flex justify-center ${item.is_priority ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}><Bookmark className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-ateneo-blue-main/10 text-ateneo-blue-main flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <p className="text-gray-500 font-semibold">No opportunities posted yet</p>
                  <p className="text-gray-400 text-sm max-w-xs">Try a different search, or check back soon for new listings.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
