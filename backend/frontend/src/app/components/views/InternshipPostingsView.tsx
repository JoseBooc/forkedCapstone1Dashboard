import { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Info,
  ChevronRight,
  ArrowLeft,
  PartyPopper
} from 'lucide-react';

const MOCK_REQUESTS = [
  { id: 1, company: "TechFlow Davao", position: "UI/UX Intern", date: "Oct 22, 2026", status: "Approved" },
  { id: 2, company: "Blue Horizon Media", position: "Social Media Intern", date: "Oct 24, 2026", status: "Pending" },
  { id: 3, company: "MegaCorp Logistics", position: "Data Analyst", date: "Oct 15, 2026", status: "Rejected" },
];

export function InternshipPostingsView() {
  const [viewState, setViewState] = useState<'list' | 'form' | 'success'>('list');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewState('success');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Internship Hiring Requests</h1>
            <p className="text-gray-500 text-lg">Submit and track internship opportunities for the ADDU community.</p>
          </div>
          {viewState === 'list' && (
            <button 
              onClick={() => setViewState('form')}
              className="flex items-center justify-center gap-2 bg-[#003087] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95"
            >
              <PlusCircle className="w-5 h-5" /> New Posting Request
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            
            {/* SUCCESS STATE */}
            {viewState === 'success' && (
              <div className="bg-white border-2 border-green-500 rounded-[40px] p-16 text-center shadow-xl animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PartyPopper className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your internship posting has been sent to the Admin for review. You will be notified via email once it is live.</p>
                <button 
                  onClick={() => setViewState('list')}
                  className="flex items-center justify-center gap-2 mx-auto font-bold text-[#003087] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to My Requests
                </button>
              </div>
            )}

            {/* FORM STATE */}
            {viewState === 'form' && (
              <div className="bg-white border-2 border-blue-500 rounded-[32px] p-10 shadow-xl shadow-blue-100/50 animate-in fade-in slide-in-from-bottom-4">
                <button onClick={() => setViewState('list')} className="text-gray-400 hover:text-gray-600 font-bold flex items-center gap-2 mb-6">
                  <ArrowLeft className="w-4 h-4" /> Cancel Request
                </button>
                <h2 className="text-2xl font-bold mb-8 text-gray-900">Position Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Company Name</label>
                      <input required type="text" placeholder="e.g. Google Philippines" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Position Title</label>
                      <input required type="text" placeholder="e.g. Software Engineer Intern" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Job Description</label>
                    <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-[#003087] text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-800 transition-all">
                    Submit for Approval
                  </button>
                </form>
              </div>
            )}

            {/* LIST STATE */}
            {viewState === 'list' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total Posts</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-orange-500">1</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Pending</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-green-500">8</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Approved</p>
                  </div>
                </div>

                {MOCK_REQUESTS.map((req) => (
                  <div key={req.id} className="bg-white border border-gray-100 p-6 rounded-[24px] hover:border-blue-200 transition-all flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        req.status === 'Approved' ? 'bg-green-50 text-green-600' : 
                        req.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {req.status === 'Approved' ? <CheckCircle2 /> : req.status === 'Pending' ? <Clock /> : <XCircle />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-700">{req.company}</h4>
                        <p className="text-sm text-gray-500">{req.position} • {req.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        req.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                      <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-[#003087] p-8 rounded-[32px] text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-300" /> Submission Rules
              </h3>
              <ul className="space-y-4 text-sm text-blue-100">
                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" /> Review takes 24-48 hours.</li>
                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" /> Include a clear application link.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}