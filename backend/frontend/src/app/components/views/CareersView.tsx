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
  Download,
  CheckCircle,
  XCircle,
  ChevronLeft // Added for back button
} from 'lucide-react';
import { Footer } from '../Footer';

interface Opportunity {
  id: number;
  type: 'Job' | 'Internship';
  title: string;
  company: string;
  location: string;
  workType: string;
  posted: string;
  dateFrom?: string;
  dateTo?: string;
  dateOfPosting?: string;
  quantity?: number;
  salary?: string;
  salaryFrom?: string;
  salaryTo?: string;
  description: string;
  isPriority?: boolean;
  modality: 'Remote' | 'Hybrid' | 'On-site';
  applicantsCount?: number;
  status?: 'Pending' | 'Approved' | 'Declined' | 'Expired';
}

interface PostOpportunityForm {
  job_title: string;
  company_name: string;
  location: string;
  work_type: string;
  modality: 'Remote' | 'Hybrid' | 'On-site';
  date_from: string;
  date_to: string;
  posting_date: string;
  quantity: string;
  salary_range_from: string;
  salary_range_to: string;
  description: string;
  application_email: string;
}

export function CareersView({ userRole }: { userRole: string }) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'published' | 'draft'>('idle');
  const [opportunityType, setOpportunityType] = useState<'job' | 'internship' | null>('job');
  
  const [activeTab, setActiveTab] = useState('All Opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedModality, setSelectedModality] = useState<string>('All');
  
  // Added state to track selected opportunity for details view
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [postForm, setPostForm] = useState<PostOpportunityForm>({
    job_title: '',
    company_name: '',
    location: '',
    work_type: '',
    modality: 'On-site',
    date_from: '',
    date_to: '',
    posting_date: '',
    quantity: '',
    salary_range_from: '',
    salary_range_to: '',
    description: '',
    application_email: '',
  });

  const apiBaseUrl = 'http://localhost:8000/api';

  const downloadCareerReport = (path: string) => {
    window.open(`${apiBaseUrl}${path}`, '_blank', 'noopener,noreferrer');
  };

  const tabs = ['All Opportunities', 'Jobs only', 'Internship only'];

  const seedOpportunities: Opportunity[] = [
    {
      id: 1,
      type: 'Job',
      title: "Senior Software Engineer",
      company: "Ateneo de Davao University • ICT Division",
      location: "Jacinto Campus, Davao City",
      workType: "Full-time",
      modality: "On-site",
      posted: "1 day ago",
      dateFrom: '2026-04-15',
      dateTo: '2026-05-15',
      dateOfPosting: '2026-04-24',
      quantity: 3,
      salary: "Php 60,000 - 85,000",
      salaryFrom: '60000',
      salaryTo: '85000',
      applicantsCount: 12,
      description: "We are looking for a highly skilled developer to lead our digital transformation projects. Experience in React, Node.js, and cloud infrastructure is preferred.",
      isPriority: true
    },
    {
      id: 2,
      type: 'Job',
      title: "Project Communications Lead",
      company: "Blue Knight Media Group",
      location: "Matina, Davao City",
      workType: "Part-time",
      modality: "Hybrid",
      posted: "3 days ago",
      description: "Manage internal and external communications for university-led community projects.",
      isPriority: false
    },
    {
      id: 3,
      type: 'Internship',
      title: "Junior UI/UX Designer",
      company: "ADDU Tech Hub",
      location: "Remote",
      workType: "Internship",
      modality: "Remote",
      posted: "5 days ago",
      dateFrom: '2026-05-01',
      dateTo: '2026-06-30',
      dateOfPosting: '2026-04-20',
      quantity: 2,
      salaryFrom: '12000',
      salaryTo: '18000',
      applicantsCount: 8,
      description: "Perfect for recent graduates looking to build their portfolio in user-centered design and university systems.",
      isPriority: false
    },
    {
      id: 4,
      type: 'Job',
      title: "Associate Professor in Computer Science",
      company: "ADDU - School of Engineering & Architecture",
      location: "Davao City",
      workType: "Full-time",
      modality: "On-site",
      posted: "2 days ago",
      description: "Join our faculty to shape the next generation of engineers. Master's degree required.",
      isPriority: true
    },
    {
      id: 5,
      type: 'Internship',
      title: "Data Science Intern",
      company: "FinTech Solutions Davao",
      location: "Lanang, Davao City",
      workType: "Internship",
      modality: "Hybrid",
      posted: "1 week ago",
      description: "Apply machine learning models to real-world financial data sets under mentorship.",
      isPriority: false
    },
    {
      id: 6,
      type: 'Job',
      title: "Human Resources Specialist",
      company: "San Pedro Hospital",
      location: "Davao City",
      workType: "Full-time",
      modality: "On-site",
      posted: "4 days ago",
      description: "Managing recruitment and employee relations for a leading healthcare provider.",
      isPriority: false
    },
    {
      id: 7,
      type: 'Internship',
      title: "Social Media & Marketing Intern",
      company: "Ateneo Alumni Association",
      location: "Davao City",
      workType: "Internship",
      modality: "Remote",
      posted: "Today",
      description: "Help us reach the global alumni network through creative content and strategy.",
      isPriority: false
    },
    {
      id: 8,
      type: 'Job',
      title: "Mobile App Developer (Flutter)",
      company: "Innovate Davao Inc.",
      location: "Remote",
      workType: "Contract",
      modality: "Remote",
      posted: "6 days ago",
      dateFrom: '2026-04-28',
      dateTo: '2026-05-28',
      dateOfPosting: '2026-04-18',
      quantity: 1,
      applicantsCount: 4,
      description: "Build cross-platform applications for regional startups. Competitive project-based pay.",
      isPriority: false
    }
  ];

  const [opportunities, setOpportunities] = useState<Opportunity[]>(seedOpportunities);

  const mapPostingToOpportunity = (posting: any): Opportunity => {
    const salaryFrom = posting.salary_range_from ?? posting.salary_from;
    const salaryTo = posting.salary_range_to ?? posting.salary_to;
    const postingDate = posting.posting_date ?? posting.date_of_posting;
    const hasSalaryFrom = salaryFrom !== null && salaryFrom !== undefined && `${salaryFrom}` !== '';
    const hasSalaryTo = salaryTo !== null && salaryTo !== undefined && `${salaryTo}` !== '';

    return {
      id: posting.id,
      type: posting.type,
      title: posting.title,
      company: posting.company_name,
      location: posting.location || 'Unspecified location',
      workType: posting.work_type || 'Unspecified',
      posted: postingDate || posting.created_at || 'Recently posted',
      dateFrom: posting.date_from || undefined,
      dateTo: posting.date_to || undefined,
      dateOfPosting: postingDate || undefined,
      quantity: typeof posting.quantity === 'number' ? posting.quantity : undefined,
      salaryFrom: salaryFrom?.toString(),
      salaryTo: salaryTo?.toString(),
      salary: hasSalaryFrom && hasSalaryTo ? `Php ${salaryFrom} - ${salaryTo}` : undefined,
      description: posting.description,
      isPriority: posting.status === 'Approved',
      modality: posting.modality || 'On-site',
      applicantsCount: posting.applicants_count ?? posting.applications_count ?? 0,
      status: posting.status,
    };
  };

  const fetchOpportunities = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/career-postings?role=${encodeURIComponent(userRole)}`);
      if (!response.ok) return;

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(mapPostingToOpportunity);
        const visibleOpportunities = normalized.filter((posting) => {
          if (userRole === 'admin') {
            return true;
          }

          return `${posting.status || ''}`.toLowerCase() === 'approved';
        });

        setOpportunities(visibleOpportunities);
      }
    } catch {
      // Keep seeded UI data if backend is unavailable.
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [userRole]);

  const handleToggleOpportunity = (type: 'job' | 'internship') => {
    setOpportunityType(opportunityType === type ? null : type);
  };

  const handleCloseForm = () => {
    setShowPostForm(false);
    setSubmissionStatus('idle');
    setFormErrors({});
    setPostForm({
      job_title: '',
      company_name: '',
      location: '',
      work_type: '',
      modality: 'On-site',
      date_from: '',
      date_to: '',
      posting_date: '',
      quantity: '',
      salary_range_from: '',
      salary_range_to: '',
      description: '',
      application_email: '',
    });
  };

  const setField = (field: keyof PostOpportunityForm, value: string) => {
    setPostForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handlePostOpportunity = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const response = await fetch(`${apiBaseUrl}/career-postings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_role: userRole,
          job_title: postForm.job_title,
          title: postForm.job_title,
          company_name: postForm.company_name,
          type: opportunityType === 'internship' ? 'Internship' : 'Job',
          location: postForm.location,
          work_type: postForm.work_type,
          modality: postForm.modality,
          date_from: postForm.date_from,
          date_to: postForm.date_to,
          posting_date: postForm.posting_date,
          quantity: Number(postForm.quantity),
          salary_range_from: postForm.salary_range_from === '' ? null : Number(postForm.salary_range_from),
          salary_range_to: postForm.salary_range_to === '' ? null : Number(postForm.salary_range_to),
          description: postForm.description,
        }),
      });

      if (response.status === 422) {
        const payload = await response.json();
        const errors = payload?.errors || {};
        const normalized: Record<string, string> = {};

        Object.keys(errors).forEach((key) => {
          normalized[key] = Array.isArray(errors[key]) ? errors[key][0] : String(errors[key]);
        });

        setFormErrors(normalized);
        return;
      }

      if (!response.ok) {
        setFormErrors({ form: 'Failed to post opportunity. Please try again.' });
        return;
      }

      const payload = await response.json();
      if (payload?.posting) {
        setOpportunities((prev) => [mapPostingToOpportunity(payload.posting), ...prev]);
      } else {
        await fetchOpportunities();
      }

      setSubmissionStatus('published');
    } catch {
      setFormErrors({ form: 'Unable to reach the server. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCareerAction = (action: 'approve' | 'decline') => {
    if (!selectedOpportunity) return;
    const endpoint = action === 'approve'
      ? `${apiBaseUrl}/career-postings/${selectedOpportunity.id}/approve`
      : `${apiBaseUrl}/career-postings/${selectedOpportunity.id}/decline`;

    fetch(endpoint, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(() => fetchOpportunities())
      .catch(() => {
        // Keep local fallback if backend is unavailable.
      });

    setSelectedOpportunity((prev) => prev ? {
      ...prev,
      status: action === 'approve' ? 'Approved' : 'Declined',
    } : null);
  };

  const handleDeleteExpired = () => {
    if (userRole !== 'admin') return;

    if (!window.confirm('Delete all expired job and internship posts?')) {
      return;
    }

    fetch(`${apiBaseUrl}/career-postings/expired`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(() => fetchOpportunities())
      .catch(() => {
        alert('Unable to delete expired posts right now.');
      });
  };

  const filteredOpportunities = opportunities.filter(item => {
    const matchesTab = 
      activeTab === 'All Opportunities' || 
      (activeTab === 'Jobs only' && item.type === 'Job') || 
      (activeTab === 'Internship only' && item.type === 'Internship');

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModality = 
      selectedModality === 'All' || item.modality === selectedModality;

    return matchesTab && matchesSearch && matchesModality;
  });

  if (selectedOpportunity) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto text-left">
            <button 
              onClick={() => setSelectedOpportunity(null)} 
              className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Career Opportunities
            </button>
            
            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-[#003087] p-12 text-white">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-md">
                      {selectedOpportunity.type}
                    </span>
                    <h1 className="text-4xl font-bold">{selectedOpportunity.title}</h1>
                    <div className="flex flex-wrap gap-6 text-blue-100">
                      <div className="flex items-center gap-2 font-bold"><Building2 className="w-5 h-5" /> {selectedOpportunity.company}</div>
                      <div className="flex items-center gap-2 font-bold"><MapPin className="w-5 h-5" /> {selectedOpportunity.location}</div>
                      <div className="flex items-center gap-2 font-bold"><Clock className="w-5 h-5" /> {selectedOpportunity.workType}</div>
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
                      {selectedOpportunity.status && (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Status</p>
                          <p className={`text-xl font-bold ${selectedOpportunity.status === 'Approved' ? 'text-green-600' : selectedOpportunity.status === 'Declined' ? 'text-red-600' : 'text-amber-600'}`}>
                            {selectedOpportunity.status}
                          </p>
                        </div>
                      )}
                      {selectedOpportunity.dateFrom && selectedOpportunity.dateTo && (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Date Range</p>
                          <p className="text-lg font-bold text-gray-900">{selectedOpportunity.dateFrom} to {selectedOpportunity.dateTo}</p>
                        </div>
                      )}
                      {selectedOpportunity.salary && (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Salary Range</p>
                          <p className="text-xl font-bold text-[#003087]">{selectedOpportunity.salary}</p>
                        </div>
                      )}
                      {typeof selectedOpportunity.quantity === 'number' && (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Slots</p>
                          <p className="text-xl font-bold text-gray-900">{selectedOpportunity.quantity}</p>
                        </div>
                      )}
                      {typeof selectedOpportunity.applicantsCount === 'number' && (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Number of Applicants</p>
                          <p className="text-xl font-bold text-gray-900">{selectedOpportunity.applicantsCount}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Date Posted</p>
                        <p className="text-xl font-bold text-gray-900">{selectedOpportunity.posted}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Modality</p>
                        <p className="text-xl font-bold text-gray-900">{selectedOpportunity.modality}</p>
                      </div>
                      {userRole === 'admin' && (
                        <div className="grid grid-cols-1 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => downloadCareerReport(`/career-postings/${selectedOpportunity.id}/reports/applicants?download=1`)}
                            className="w-full py-4 border border-[#003087] text-[#003087] rounded-2xl font-bold hover:bg-[#003087]/5 transition-all flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" /> Generate Applicant Report
                          </button>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleCareerAction('approve')}
                              className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCareerAction('decline')}
                              className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                            >
                              <XCircle className="w-4 h-4" /> Decline
                            </button>
                          </div>
                        </div>
                      )}
                      <button className="w-full py-4 bg-[#003087] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-[#002566] transition-all">
                        Apply Now
                      </button>
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
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto border border-gray-200 rounded-4xl shadow-sm p-10">
            {submissionStatus === 'idle' ? (
              <>
                <div className="flex justify-between items-center mb-10">
                  <h1 className="text-2xl font-bold text-gray-900 text-left">Post a New Opportunity</h1>
                  <button onClick={handleCloseForm} className="text-gray-500 font-bold hover:text-gray-700 flex items-center gap-1 transition-colors">
                    Cancel
                  </button>
                </div>
                <form onSubmit={handlePostOpportunity} className="space-y-8 text-left">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Opportunity Type *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleToggleOpportunity('job')}
                        className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all ${opportunityType === 'job' ? 'border-[#003087] bg-blue-50/50 text-[#003087]' : 'border-gray-100 bg-gray-50/50 text-gray-400'}`}
                      >
                        <Briefcase className="w-8 h-8 mb-3" />
                        <span className="font-bold text-lg">Full-time Job</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleOpportunity('internship')}
                        className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all ${opportunityType === 'internship' ? 'border-[#003087] bg-blue-50/50 text-[#003087]' : 'border-gray-100 bg-gray-50/50 text-gray-400'}`}
                      >
                        <GraduationCap className="w-8 h-8 mb-3 text-orange-500" />
                        <span className="font-bold text-lg">Internship</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Job Title *</label>
                      <input type="text" required value={postForm.job_title} onChange={(e) => setField('job_title', e.target.value)} placeholder="e.g., Senior Software Engineer" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {(formErrors.job_title || formErrors.title) && <p className="text-sm text-red-600">{formErrors.job_title || formErrors.title}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Company Name *</label>
                      <input type="text" required value={postForm.company_name} onChange={(e) => setField('company_name', e.target.value)} placeholder="Your company name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {formErrors.company_name && <p className="text-sm text-red-600">{formErrors.company_name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Location *</label>
                      <input type="text" required value={postForm.location} onChange={(e) => setField('location', e.target.value)} placeholder="City, Country or Remote" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {formErrors.location && <p className="text-sm text-red-600">{formErrors.location}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Employment Type *</label>
                      <select required value={postForm.work_type} onChange={(e) => setField('work_type', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none appearance-none text-gray-500">
                        <option value="">Select type</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                      {formErrors.work_type && <p className="text-sm text-red-600">{formErrors.work_type}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Date Range From *</label>
                      <input type="date" required value={postForm.date_from} onChange={(e) => setField('date_from', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {formErrors.date_from && <p className="text-sm text-red-600">{formErrors.date_from}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Date Range To *</label>
                      <input type="date" required value={postForm.date_to} onChange={(e) => setField('date_to', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {formErrors.date_to && <p className="text-sm text-red-600">{formErrors.date_to}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Date of Posting *</label>
                      <input type="date" required value={postForm.posting_date} onChange={(e) => setField('posting_date', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {(formErrors.posting_date || formErrors.date_of_posting) && <p className="text-sm text-red-600">{formErrors.posting_date || formErrors.date_of_posting}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Quantity / Slots *</label>
                      <input type="number" required value={postForm.quantity} onChange={(e) => setField('quantity', e.target.value)} min="1" placeholder="e.g., 5" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {formErrors.quantity && <p className="text-sm text-red-600">{formErrors.quantity}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Salary From *</label>
                      <input type="number" required value={postForm.salary_range_from} onChange={(e) => setField('salary_range_from', e.target.value)} min="0" placeholder="e.g., 60000" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {(formErrors.salary_range_from || formErrors.salary_from) && <p className="text-sm text-red-600">{formErrors.salary_range_from || formErrors.salary_from}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Salary To *</label>
                      <input type="number" required value={postForm.salary_range_to} onChange={(e) => setField('salary_range_to', e.target.value)} min="0" placeholder="e.g., 85000" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                      {(formErrors.salary_range_to || formErrors.salary_to) && <p className="text-sm text-red-600">{formErrors.salary_range_to || formErrors.salary_to}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Description *</label>
                    <textarea required value={postForm.description} onChange={(e) => setField('description', e.target.value)} placeholder="Describe the role, responsibilities, and requirements..." rows={6} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none resize-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10" />
                    {formErrors.description && <p className="text-sm text-red-600">{formErrors.description}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Application Email *</label>
                    <input type="email" required value={postForm.application_email} onChange={(e) => setField('application_email', e.target.value)} placeholder="careers@company.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10" />
                    {formErrors.application_email && <p className="text-sm text-red-600">{formErrors.application_email}</p>}
                  </div>
                  {formErrors.form && <p className="text-sm text-red-600">{formErrors.form}</p>}
                  <div className="pt-6 flex gap-4">
                    <button type="submit" disabled={isSubmitting} className="px-10 py-4 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-60 disabled:cursor-not-allowed">
                      {isSubmitting ? 'Posting...' : 'Post Opportunity'}
                    </button>
                    <button type="button" onClick={() => setSubmissionStatus('draft')} className="px-10 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                      Save as Draft
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-20 flex flex-col items-center text-center space-y-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${submissionStatus === 'published' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <CheckCircle2 className={`w-10 h-10 ${submissionStatus === 'published' ? 'text-green-600' : 'text-[#003087]'}`} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">{submissionStatus === 'published' ? 'Opportunity Posted!' : 'Draft Saved!'}</h2>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {submissionStatus === 'published' 
                      ? "Your listing has been submitted and is now pending review by the Alumni Office."
                      : "Your progress has been saved. You can find this listing in your drafts later."}
                  </p>
                </div>
                <button onClick={handleCloseForm} className="mt-4 px-8 py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all">
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
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 p-8 space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
            <p className="text-gray-500 text-sm mt-1">Explore jobs and internships from the ADDU community</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setShowPostForm(true)} className="bg-[#003087] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#002566] transition-all flex items-center gap-2">
              {userRole === 'admin' ? 'Post a Job Opening' : 'Post a Job Request'} <ArrowRight className="w-4 h-4" />
            </button>
            {userRole === 'admin' && (
              <button onClick={handleDeleteExpired} className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">
                Delete Expired Posts
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#003087] p-6 rounded-3xl shadow-sm border border-blue-100/10 text-left">
            <p className="text-blue-200 text-[11px] font-bold uppercase tracking-wider mb-2">Full-time Jobs</p>
            <p className="text-4xl font-bold text-white">31</p>
          </div>
          <div className="bg-orange-600 p-6 rounded-3xl shadow-sm border border-orange-100/10 text-left">
            <p className="text-orange-100 text-[11px] font-bold uppercase tracking-wider mb-2">Internships</p>
            <p className="text-4xl font-bold text-white">14</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-left">
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-2">Posted This Week</p>
            <p className="text-4xl font-bold text-[#003087]">12</p>
          </div>
        </div>

        <div className="flex gap-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[13px] font-bold whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-[#003087]' : 'text-gray-400'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#003087]" />}
            </button>
          ))}
        </div>

        <div className="relative flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or company..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#003087]/20 outline-none text-sm transition-all"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-8 py-4 border rounded-2xl font-bold text-sm transition-all h-full ${showFilters || selectedModality !== 'All' ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
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
                    className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-colors ${selectedModality === modality ? 'bg-blue-50 text-[#003087] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {modality}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 text-left pb-10">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((item) => (
              <div 
                key={item.id} 
                className={`rounded-4xl p-8 flex flex-col md:flex-row justify-between gap-8 transition-all ${item.isPriority ? 'bg-[#003087] text-white shadow-2xl shadow-blue-900/20' : 'bg-white text-gray-900 border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40'}`}
              >
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-3">
                    {item.isPriority && <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured Opportunity</span>}
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`w-3.5 h-3.5 ${item.isPriority ? 'text-blue-300' : 'text-gray-400'}`} />
                      <span className={`${item.isPriority ? 'text-blue-300' : 'text-gray-400'} text-[12px] font-medium`}>{item.type} • Posted {item.posted}</span>
                    </div>
                  </div>
                  {(item.dateFrom || item.quantity || item.applicantsCount) && (
                    <div className="flex flex-wrap gap-4 text-[12px] font-medium">
                      {item.dateFrom && item.dateTo && <span className={`${item.isPriority ? 'text-blue-100' : 'text-gray-500'}`}>Date range: {item.dateFrom} to {item.dateTo}</span>}
                      {typeof item.quantity === 'number' && <span className={`${item.isPriority ? 'text-blue-100' : 'text-gray-500'}`}>{item.quantity} slots</span>}
                      {typeof item.applicantsCount === 'number' && <span className={`${item.isPriority ? 'text-blue-100' : 'text-gray-500'}`}>{item.applicantsCount} applicants</span>}
                      {item.salary && <span className={`${item.isPriority ? 'text-blue-100' : 'text-gray-500'}`}>{item.salary}</span>}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold leading-tight">{item.title}</h3>
                    <p className={`${item.isPriority ? 'text-blue-100' : 'text-[#003087]'} font-semibold text-lg mt-1 flex items-center gap-2`}><Building2 className="w-4 h-4 opacity-70" /> {item.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-6 text-[14px]">
                    <div className={`flex items-center gap-2 ${item.isPriority ? 'text-blue-100' : 'text-gray-500'}`}><MapPin className="w-4 h-4 opacity-70" /> {item.location}</div>
                    <div className={`flex items-center gap-2 ${item.isPriority ? 'text-blue-100' : 'text-gray-500'}`}>{item.type === 'Internship' ? <GraduationCap className="w-4 h-4 opacity-70" /> : <Laptop className="w-4 h-4 opacity-70" />} {item.workType} ({item.modality})</div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col justify-end gap-3 min-w-45">
                  <button 
                    onClick={() => setSelectedOpportunity(item)}
                    className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all flex-1 md:flex-none shadow-sm ${item.isPriority ? 'bg-white text-[#003087] hover:bg-blue-50' : 'bg-[#003087] text-white hover:bg-[#002566]'}`}
                  >
                    {item.isPriority ? 'Apply Now' : 'View Details'}
                  </button>
                  <button className={`p-4 rounded-2xl transition-all border flex justify-center ${item.isPriority ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}><Bookmark className="w-5 h-5" /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium italic">No matches found for your current search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}