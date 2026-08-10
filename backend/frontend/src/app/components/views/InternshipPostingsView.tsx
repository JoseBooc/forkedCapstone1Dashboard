import { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Info,
  ArrowLeft,
  PartyPopper,
  AlertCircle,
  Users,
  Eye,
  Search,
  LayoutGrid,
  Table as TableIcon,
  User,
  Filter,
  Edit3,
  EyeOff,
  RefreshCcw
} from 'lucide-react';

interface Application {
  id: number;
  name: string;
  email: string;
  date: string;
}

interface InternshipPosting {
  id: number;
  company: string;
  position: string;
  type: string;
  email: string;
  startDate: string;
  endDate: string;
  description: string;
  date: string;
  status: string;
  applicantsCount: number;
  applications: Application[];
  remarks?: string;
  hidden?: boolean;
}

const INITIAL_POSTINGS: InternshipPosting[] = [
  { 
    id: 1, 
    company: "TechFlow Davao", 
    position: "UI/UX Intern", 
    type: "Internship",
    email: "hr@techflow.davao",
    startDate: "2026-11-01",
    endDate: "2029-11-01",
    description: "Looking for a creative intern to assist in mobile app prototyping.",
    date: "Oct 22, 2026", 
    status: "Approved",
    applicantsCount: 3,
    applications: [
      { id: 101, name: "Juan Dela Cruz", email: "juan@example.com", date: "Oct 23, 2026" },
      { id: 102, name: "Maria Clara", email: "clara@example.com", date: "Oct 24, 2026" },
      { id: 103, name: "Jose Rizal", email: "pepe@example.com", date: "Oct 25, 2026" }
    ],
    hidden: false
  }
];

interface InternshipPostingsProps {
  role: 'alumni' | 'admin';
}

export function InternshipPostingsView({ role }: InternshipPostingsProps) {
  const [postings, setPostings] = useState<InternshipPosting[]>(() => {
    const saved = localStorage.getItem('job_postings_data');
    return saved ? JSON.parse(saved) : INITIAL_POSTINGS;
  });

  useEffect(() => {
    localStorage.setItem('job_postings_data', JSON.stringify(postings));
  }, [postings]);
  
  const [viewState, setViewState] = useState<'list' | 'form' | 'success' | 'applicants' | 'detail'>('list');
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid');
  const [selectedRequest, setSelectedRequest] = useState<InternshipPosting | null>(null);
  const [isDenying, setIsDenying] = useState(false);
  const [denyRemarks, setDenyRemarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Job' | 'Internship'>('All');
  
  // Explicitly defined type to allow 'Hidden'
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Denied' | 'Hidden'>('All');

  const now = new Date();
  const threeYearsLater = new Date();
  threeYearsLater.setFullYear(now.getFullYear() + 3);

  const defaultStartDate = now.toISOString().split('T')[0];
  const defaultEndDate = threeYearsLater.toISOString().split('T')[0];
  const todayFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (selectedRequest && viewState === 'form') {
      setPostings(prev => prev.map(p => 
        p.id === selectedRequest.id ? {
          ...p,
          company: formData.get('company') as string,
          position: formData.get('position') as string,
          type: formData.get('type') as string,
          email: formData.get('email') as string,
          startDate: formData.get('startDate') as string,
          endDate: formData.get('endDate') as string,
          description: formData.get('description') as string,
          status: role === 'admin' ? p.status : "Pending", 
          remarks: role === 'admin' ? p.remarks : undefined,
          hidden: role === 'admin' ? p.hidden : false 
        } : p
      ));
    } else {
      const newEntry: InternshipPosting = {
        id: Date.now(),
        company: formData.get('company') as string,
        position: formData.get('position') as string,
        type: formData.get('type') as string,
        email: formData.get('email') as string,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        description: formData.get('description') as string,
        date: todayFormatted,
        status: "Pending",
        applicantsCount: 0,
        applications: [],
        hidden: false
      };
      setPostings([newEntry, ...postings]);
    }
    setViewState('success');
  };

  const updateStatus = (id: number, newStatus: 'Approved' | 'Denied') => {
    setPostings(prev => prev.map(p => 
      p.id === id ? { ...p, status: newStatus, remarks: newStatus === 'Denied' ? denyRemarks : undefined } : p
    ));
    setViewState('list');
    setIsDenying(false);
    setDenyRemarks('');
  };

  const handleToggleHide = (id: number) => {
    setPostings(prev => prev.map(p => 
      p.id === id ? { ...p, hidden: !p.hidden } : p
    ));
    if (selectedRequest?.id === id) handleBackToList();
  };

  const filteredRequests = postings.filter(req => {
    const matchesSearch = req.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || req.type === filterType;
    
    if (role === 'admin') {
      if (filterStatus === 'Hidden') return matchesSearch && matchesType && req.hidden === true;
      if (req.hidden) return false;
    } else {
      if (req.hidden) return false;
    }

    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleBackToList = () => {
    setSelectedRequest(null);
    setViewState('list');
    setIsDenying(false);
  };

  const handleEdit = (req: InternshipPosting) => {
    setSelectedRequest(req);
    setViewState('form');
  };

  return (
    <div className="addu-brand min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Career Opportunities
            </h1>
            <p className="text-gray-500 text-lg">
              Explore jobs and internships from the ADDU community
            </p>
          </div>
          {viewState === 'list' && role === 'alumni' && (
            <button 
              onClick={() => { setSelectedRequest(null); setViewState('form'); }}
              className="flex items-center justify-center gap-2 bg-ateneo-blue-main text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-ateneo-blue-dark transition-all active:scale-95"
            >
              <PlusCircle className="w-5 h-5" /> New Posting Request
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            
            {viewState === 'success' && (
              <div className="bg-white border-2 border-green-500 rounded-[40px] p-16 text-center shadow-xl">
                <div className="w-20 h-20 bg-ateneo-green/15 text-ateneo-green rounded-full flex items-center justify-center mx-auto mb-6"><PartyPopper className="w-10 h-10" /></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{role === 'admin' ? "Update Successful!" : "Request Submitted!"}</h2>
                <button onClick={() => setViewState('list')} className="font-bold text-ateneo-blue-main hover:underline flex items-center justify-center gap-2 mx-auto mt-4"><ArrowLeft className="w-4 h-4" /> Back to List</button>
              </div>
            )}

            {viewState === 'form' && (
              <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-xl">
                <button onClick={() => setViewState('list')} className="text-gray-400 font-bold flex items-center gap-2 mb-6 transition-colors hover:text-gray-600">
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </button>
                <h2 className="text-2xl font-bold mb-8 text-gray-900">
                  {selectedRequest ? (role === 'admin' ? "Edit Details (Admin)" : "Edit Posting Request") : "Position Details"}
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Company Name</label>
                    <input name="company" defaultValue={selectedRequest?.company} required type="text" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-ateneo-blue-main" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Position Title</label>
                    <input name="position" defaultValue={selectedRequest?.position} required type="text" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-ateneo-blue-main" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Type</label>
                    <select name="type" defaultValue={selectedRequest?.type || "Internship"} required className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-ateneo-blue-main font-medium">
                      <option value="Internship">Internship</option>
                      <option value="Job">Job</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Contact Email</label>
                    <input name="email" defaultValue={selectedRequest?.email} required type="email" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-ateneo-blue-main" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Start Date</label>
                      <input name="startDate" defaultValue={selectedRequest?.startDate || defaultStartDate} required type="date" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-ateneo-blue-main" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">End Date</label>
                      <input name="endDate" defaultValue={selectedRequest?.endDate || defaultEndDate} required type="date" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-ateneo-blue-main" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Job Description</label>
                    <textarea name="description" defaultValue={selectedRequest?.description} required rows={4} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-ateneo-blue-main" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-ateneo-blue-main text-white rounded-2xl font-bold text-xl hover:bg-ateneo-blue-dark shadow-lg transition-all active:scale-95">
                    {selectedRequest ? (role === 'admin' ? "Save Changes" : "Update & Resubmit") : "Submit for Approval"}
                  </button>
                </form>
              </div>
            )}

            {viewState === 'applicants' && selectedRequest && (
              <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-xl">
                <button onClick={handleBackToList} className="text-gray-400 font-bold flex items-center gap-2 mb-8"><ArrowLeft size={16}/> Back</button>
                <div className="mb-8 border-b pb-6">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedRequest.position}</h2>
                  <p className="text-gray-500 font-medium">{selectedRequest.company}</p>
                </div>
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                  <Users className="text-ateneo-blue-main" /> List of Applications ({selectedRequest.applicantsCount})
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {selectedRequest.applications.map(app => (
                    <div key={app.id} className="p-5 bg-gray-50 rounded-2xl flex items-center justify-between border hover:border-ateneo-blue-main/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-ateneo-blue-main shadow-sm"><User size={18} /></div>
                        <div><p className="font-bold text-gray-900">{app.name}</p><p className="text-sm text-gray-500">{app.email}</p></div>
                      </div>
                      <p className="text-xs font-bold text-gray-400">{app.date}</p>
                    </div>
                  ))}
                  {selectedRequest.applications.length === 0 && <p className="text-gray-400 italic text-center py-8">No applications yet.</p>}
                </div>
              </div>
            )}

            {viewState === 'detail' && selectedRequest && (
              <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-xl">
                <button onClick={handleBackToList} className="text-gray-400 font-bold flex items-center gap-2 mb-8"><ArrowLeft size={16}/> Back to List</button>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedRequest.company}</h2>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                      selectedRequest.status === 'Approved' ? 'bg-ateneo-green/15 text-ateneo-green' : 
                      selectedRequest.status === 'Pending' ? 'bg-ateneo-yellow-main/25 text-ateneo-blue-dark' : 'bg-ateneo-red/15 text-ateneo-red'
                    }`}>{selectedRequest.status}</span>
                  </div>
                  <div className="flex gap-3">
                    {role === 'admin' && selectedRequest.status === 'Denied' && (
                       <button onClick={() => handleEdit(selectedRequest)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 flex items-center gap-2">
                        <Edit3 size={18}/> Edit Details
                       </button>
                    )}
                    {role === 'alumni' && (selectedRequest.status === 'Pending' || selectedRequest.status === 'Denied') && (
                       <button onClick={() => handleEdit(selectedRequest)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 flex items-center gap-2">
                        <Edit3 size={18}/> Edit
                       </button>
                    )}
                    {role === 'admin' && selectedRequest.status === 'Pending' && !isDenying && (
                      <>
                        <button onClick={() => updateStatus(selectedRequest.id, 'Approved')} className="bg-ateneo-green text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700">Approve</button>
                        <button onClick={() => setIsDenying(true)} className="bg-red-50 text-ateneo-red px-6 py-3 rounded-xl font-bold hover:bg-red-100">Deny</button>
                      </>
                    )}
                    {role === 'admin' && selectedRequest.status === 'Denied' && (
                      <button onClick={() => handleToggleHide(selectedRequest.id)} className="bg-gray-50 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 flex items-center gap-2 border">
                        {selectedRequest.hidden ? <><RefreshCcw size={18} /> Restore</> : <><EyeOff size={18} /> Hide from List</>}
                      </button>
                    )}
                  </div>
                </div>

                {isDenying ? (
                  <div className="bg-red-50 p-6 rounded-2xl border border-ateneo-red/20">
                    <h4 className="text-ateneo-red font-bold mb-3 flex items-center gap-2"><AlertCircle size={18}/> Reason for Denial</h4>
                    <textarea
                      value={denyRemarks}
                      onChange={(e) => setDenyRemarks(e.target.value)}
                      placeholder="Please provide a reason so the alumni can correct it..."
                      className="w-full p-4 bg-white border border-ateneo-red/30 rounded-xl mb-4 outline-none focus:border-ateneo-red"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => updateStatus(selectedRequest.id, 'Denied')} className="bg-ateneo-red text-white px-6 py-2 rounded-lg font-bold">Confirm Denial</button>
                      <button onClick={() => setIsDenying(false)} className="text-gray-500 font-bold px-4">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedRequest.description}</p>
                    </div>
                    {selectedRequest.status === 'Denied' && selectedRequest.remarks && (
                      <div className="p-6 bg-red-50 rounded-2xl border border-ateneo-red/20 shadow-inner">
                        <h4 className="font-bold text-ateneo-red mb-1 flex items-center gap-2"><XCircle size={16}/> Rejection Remarks:</h4>
                        <p className="text-ateneo-red italic font-medium">"{selectedRequest.remarks}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {viewState === 'list' && (
              <>
                <div className="space-y-6 mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {role === 'admin' && (
                      <div className="bg-white p-1.5 rounded-2xl border flex gap-1 shadow-sm">
                        <button onClick={() => setFilterType('All')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${filterType === 'All' ? 'bg-ateneo-blue-main text-white' : 'text-gray-500 hover:bg-gray-50'}`}>All Opportunities</button>
                        <button onClick={() => setFilterType('Job')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${filterType === 'Job' ? 'bg-ateneo-blue-main text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Jobs only</button>
                        <button onClick={() => setFilterType('Internship')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${filterType === 'Internship' ? 'bg-ateneo-blue-main text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Internship only</button>
                      </div>
                    )}
                    <div className="flex items-center gap-3 ml-auto">
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Pending' | 'Approved' | 'Denied' | 'Hidden')} className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 outline-none appearance-none cursor-pointer">
                          <option value="All">All Status</option>
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Denied">Denied</option>
                          {role === 'admin' && <option value="Hidden">Hidden/Archived</option>}
                        </select>
                      </div>
                      {role === 'admin' && (
                        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                          <button onClick={() => setDisplayMode('grid')} className={`p-2 rounded-lg ${displayMode === 'grid' ? 'bg-white text-ateneo-blue-main shadow-sm' : 'text-gray-400'}`}><LayoutGrid size={18} /></button>
                          <button onClick={() => setDisplayMode('table')} title="All Posts/Application List" className={`p-2 rounded-lg ${displayMode === 'table' ? 'bg-white text-ateneo-blue-main shadow-sm' : 'text-gray-400'}`}><TableIcon size={18} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search company or position..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl outline-none focus:border-ateneo-blue-main shadow-sm" />
                  </div>
                </div>

                {displayMode === 'table' && role === 'admin' ? (
                  <div className="bg-white border rounded-[24px] overflow-hidden shadow-sm">
                    <div className="p-4 bg-gray-50 border-b font-bold text-gray-700">All Posts/Application List</div>
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest border-b">
                        <tr><th className="p-5">Company</th><th className="p-5">Position</th><th className="p-5">Type</th><th className="p-5">Status</th><th className="p-5 text-center">Applicants</th><th className="p-5 text-right">Action</th></tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map(req => (
                          <tr key={req.id} className="border-b last:border-0 hover:bg-ateneo-blue-main/5 transition-colors">
                            <td className="p-5 font-bold flex items-center gap-2">
                              {req.company}
                              {req.hidden && <EyeOff size={14} className="text-gray-400" />}
                            </td>
                            <td className="p-5 font-medium text-gray-600">{req.position}</td>
                            <td className="p-5 text-xs font-bold text-gray-400">{req.type}</td>
                            <td className="p-5"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${req.status === 'Approved' ? 'bg-ateneo-green/15 text-ateneo-green' : req.status === 'Pending' ? 'bg-ateneo-yellow-main/25 text-ateneo-blue-dark' : 'bg-ateneo-red/15 text-ateneo-red'}`}>{req.status}</span></td>
                            <td className="p-5 text-center">{req.status === 'Approved' ? <button onClick={() => { setSelectedRequest(req); setViewState('applicants'); }} className="text-ateneo-blue-main font-bold underline">{req.applicantsCount}</button> : "-"}</td>
                            <td className="p-5 text-right">
                              <div className="flex justify-end gap-2">
                                {req.status === 'Denied' && (
                                  <button onClick={() => handleToggleHide(req.id)} className="p-2 text-gray-400 hover:text-gray-600" title={req.hidden ? "Unhide" : "Hide"}>
                                    {req.hidden ? <RefreshCcw size={18} /> : <EyeOff size={18} />}
                                  </button>
                                )}
                                {req.status === 'Denied' && <button onClick={() => handleEdit(req)} className="p-2 text-gray-400 hover:text-ateneo-blue-main"><Edit3 size={18} /></button>}
                                <button onClick={() => { setSelectedRequest(req); setViewState('detail'); }} className="p-2 text-gray-400 hover:text-ateneo-blue-main"><Eye size={18} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredRequests.map((req) => (
                      <div key={req.id} className={`bg-white border border-gray-100 p-6 rounded-[24px] hover:border-ateneo-blue-main/30 transition-all flex items-center justify-between group shadow-sm ${req.hidden ? 'opacity-60 bg-gray-50' : ''}`}>
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${req.status === 'Approved' ? 'bg-ateneo-green/10 text-ateneo-green' : req.status === 'Pending' ? 'bg-ateneo-yellow-main/20 text-ateneo-blue-dark' : 'bg-ateneo-red/10 text-ateneo-red'}`}>
                            {req.status === 'Approved' ? <CheckCircle2 /> : req.status === 'Pending' ? <Clock /> : <XCircle />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                              {req.company} 
                              {req.hidden && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md uppercase tracking-tighter">Hidden</span>}
                            </h4>
                            <p className="text-sm text-gray-500">{req.position} • {req.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {req.status === 'Approved' && <button onClick={() => { setSelectedRequest(req); setViewState('applicants'); }} className="flex items-center gap-2 bg-ateneo-cyan/10 text-ateneo-cyan px-4 py-2 rounded-xl text-xs font-bold hover:bg-ateneo-cyan/20"><Users size={16} /> {req.applicantsCount} Applicants</button>}
                          {role === 'admin' && req.status === 'Denied' && (
                             <button onClick={() => handleToggleHide(req.id)} className="p-2 text-gray-400 hover:text-gray-600 transition-all" title={req.hidden ? "Restore Posting" : "Hide Posting"}>
                               {req.hidden ? <RefreshCcw size={20}/> : <EyeOff size={20}/>}
                             </button>
                          )}
                          {(role === 'alumni' && (req.status === 'Pending' || req.status === 'Denied')) || (role === 'admin' && req.status === 'Denied') ? (
                            <button onClick={() => handleEdit(req)} className="p-2 text-gray-400 hover:text-ateneo-blue-main transition-all" title="Edit Posting"><Edit3 size={20}/></button>
                          ) : null}
                          <button onClick={() => { setSelectedRequest(req); setViewState('detail'); }} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-ateneo-blue-main hover:text-white transition-all"><Eye size={20} /></button>
                        </div>
                      </div>
                    ))}
                    {filteredRequests.length === 0 && (
                      <div className="text-center py-20 bg-white border border-dashed rounded-[32px]">
                        <p className="text-gray-400 font-medium">No postings found.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className={`${role === 'admin' ? 'bg-ateneo-blue-dark' : 'bg-ateneo-blue-main'} p-8 rounded-[32px] text-white shadow-xl`}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Info size={20} /> Guidelines</h3>
              <ul className="space-y-4 text-sm text-blue-100 font-medium opacity-90">
                {role === 'admin' ? (
                  <>
                    <li>New posts appear at the top of the list instantly.</li>
                    <li>Use Table View for "All Posts/Application List".</li>
                    <li>Admins can <strong>hide denied requests</strong> to archive them.</li>
                    <li>Toggle the <strong>Hidden/Archived</strong> status filter to see hidden items.</li>
                  </>
                ) : (
                  <>
                    <li>Track your own posting requests here.</li>
                    <li>You can <strong>edit and resubmit</strong> any pending or denied posts.</li>
                    <li>Dates are auto-filled but can be adjusted if needed.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}