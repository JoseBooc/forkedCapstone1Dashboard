import { useState } from 'react';
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
  salary?: string;
  description: string;
  isPriority?: boolean;
  modality: 'Remote' | 'Hybrid' | 'On-site';
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

  const tabs = ['All Opportunities', 'Jobs only', 'Internship only'];

  const opportunities: Opportunity[] = [
    {
      id: 1,
      type: 'Job',
      title: "Senior Software Engineer",
      company: "Ateneo de Davao University • ICT Division",
      location: "Jacinto Campus, Davao City",
      workType: "Full-time",
      modality: "On-site",
      posted: "1 day ago",
      salary: "Php 60,000 - 85,000",
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
      description: "Build cross-platform applications for regional startups. Competitive project-based pay.",
      isPriority: false
    }
  ];

  const handleToggleOpportunity = (type: 'job' | 'internship') => {
    setOpportunityType(opportunityType === type ? null : type);
  };

  const handleCloseForm = () => {
    setShowPostForm(false);
    setSubmissionStatus('idle');
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
                      {selectedOpportunity.salary && (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Salary Range</p>
                          <p className="text-xl font-bold text-[#003087]">{selectedOpportunity.salary}</p>
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
                        onClick={() => handleToggleOpportunity('job')}
                        className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all ${opportunityType === 'job' ? 'border-[#003087] bg-blue-50/50 text-[#003087]' : 'border-gray-100 bg-gray-50/50 text-gray-400'}`}
                      >
                        <Briefcase className="w-8 h-8 mb-3" />
                        <span className="font-bold text-lg">Full-time Job</span>
                      </button>
                      <button
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
                      <input type="text" placeholder="e.g., Senior Software Engineer" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Company Name *</label>
                      <input type="text" placeholder="Your company name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Location *</label>
                      <input type="text" placeholder="City, Country or Remote" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Employment Type *</label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none appearance-none text-gray-500">
                        <option>Select type</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Description *</label>
                    <textarea placeholder="Describe the role, responsibilities, and requirements..." rows={6} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none resize-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Application Email *</label>
                    <input type="email" placeholder="careers@company.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/10" />
                  </div>
                  <div className="pt-6 flex gap-4">
                    <button onClick={() => setSubmissionStatus('published')} className="px-10 py-4 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all shadow-lg shadow-blue-900/10">
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
          <button onClick={() => setShowPostForm(true)} className="bg-[#003087] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#002566] transition-all flex items-center gap-2">
            Post a Job Opening <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#003087] p-6 rounded-[24px] shadow-sm border border-blue-100/10 text-left">
            <p className="text-blue-200 text-[11px] font-bold uppercase tracking-wider mb-2">Full-time Jobs</p>
            <p className="text-4xl font-bold text-white">31</p>
          </div>
          <div className="bg-orange-600 p-6 rounded-[24px] shadow-sm border border-orange-100/10 text-left">
            <p className="text-orange-100 text-[11px] font-bold uppercase tracking-wider mb-2">Internships</p>
            <p className="text-4xl font-bold text-white">14</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 text-left">
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
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#003087]" />}
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
                className={`rounded-[32px] p-8 flex flex-col md:flex-row justify-between gap-8 transition-all ${item.isPriority ? 'bg-[#003087] text-white shadow-2xl shadow-blue-900/20' : 'bg-white text-gray-900 border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40'}`}
              >
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-3">
                    {item.isPriority && <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured Opportunity</span>}
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`w-3.5 h-3.5 ${item.isPriority ? 'text-blue-300' : 'text-gray-400'}`} />
                      <span className={`${item.isPriority ? 'text-blue-300' : 'text-gray-400'} text-[12px] font-medium`}>{item.type} • Posted {item.posted}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold leading-tight">{item.title}</h3>
                    <p className={`${item.isPriority ? 'text-blue-100' : 'text-[#003087]'} font-semibold text-lg mt-1 flex items-center gap-2`}><Building2 className="w-4 h-4 opacity-70" /> {item.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-6 text-[14px]">
                    <div className={`flex items-center gap-2 ${item.isPriority ? 'text-blue-100' : 'text-gray-500'}`}><MapPin className="w-4 h-4 opacity-70" /> {item.location}</div>
                    <div className={`flex items-center gap-2 ${item.isPriority ? 'text-blue-100' : 'text-gray-500'}`}>{item.type === 'Internship' ? <GraduationCap className="w-4 h-4 opacity-70" /> : <Laptop className="w-4 h-4 opacity-70" />} {item.workType} ({item.modality})</div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[180px]">
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