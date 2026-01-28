import { useState } from 'react';
import { Calendar, ClipboardCheck, ArrowRight, CheckCircle, FileText, BarChart3 } from 'lucide-react';
import { Footer } from '../Footer';

interface Survey {
  title: string;
  status: 'Active' | 'Completed';
  category: string;
  description: string;
  dueDate?: string;
  completedDate?: string;
  responses?: string;
  isPriority?: boolean;
}

export function SurveysView({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState('Available Surveys');
  const tabs = ['Available Surveys', 'Completed'];

  const availableSurveys: Survey[] = [
    {
      title: "2025 CHED Graduate Tracer Study",
      status: "Active",
      category: "Tracer Study",
      description: "Help us track employment outcomes for CHED compliance. Your participation is important.",
      dueDate: "February 28, 2026",
      responses: "245/500",
      isPriority: true
    },
    {
      title: "Alumni Satisfaction Survey",
      status: "Active",
      category: "Satisfaction",
      description: "Share your feedback about your experience at ADDU and how we can improve.",
      dueDate: "March 15, 2026",
      responses: "178/300"
    },
    {
      title: "Career Development Needs Assessment",
      status: "Active",
      category: "Opinion Poll",
      description: "Help us understand what career services would benefit you most.",
      dueDate: "February 20, 2026",
      responses: "89/200"
    }
  ];

  const completedSurveys: Survey[] = [
    {
      title: "Alumni Homecoming 2025 Feedback",
      status: "Completed",
      category: "Event Feedback",
      description: "",
      completedDate: "December 15, 2025"
    },
    {
      title: "2024 Employment Survey",
      status: "Completed",
      category: "Tracer Study",
      description: "",
      completedDate: "November 10, 2025"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 p-8 space-y-8">
        {/* TITLE SECTION */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900">Tracer & Surveys Studies</h1>
          <p className="text-gray-500 text-sm mt-1">Participate in surveys and help us improve</p>
        </div>

        {/* HIGHLIGHTED ORANGE WELCOME BANNER */}
        <div className="bg-orange-600 rounded-[24px] p-8 text-white text-left relative overflow-hidden shadow-lg shadow-orange-900/10">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-xl font-bold mb-3">👋 New to the ADDU Alumni Portal?</h2>
            <p className="text-orange-50 text-sm leading-relaxed mb-6">
              Help us know you better! Complete the Graduate Tracer Survey to share your journey after ADDU. 
              Your insights help improve our programs and support future students.
            </p>
            {/* UPDATED BLUE BUTTON */}
            <button className="bg-[#003087] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#002566] transition-all flex items-center gap-2 shadow-md">
              Take the Tracer Survey <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {/* Subtle background decoration */}
          <ClipboardCheck className="absolute right-[-10px] bottom-[-10px] w-40 h-40 text-white/10 -rotate-12" />
        </div>

        {/* TABS */}
        <div className="flex gap-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[13px] font-bold transition-all relative ${
                activeTab === tab ? 'text-[#003087]' : 'text-gray-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#003087]" />
              )}
            </button>
          ))}
        </div>

        {/* CONTENT LIST */}
        <div className="space-y-4">
          {activeTab === 'Available Surveys' ? (
            availableSurveys.map((survey, index) => (
              <div key={index} className={`rounded-[24px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left border transition-all ${
                survey.isPriority ? 'bg-[#003087] text-white border-transparent shadow-md' : 'bg-white text-gray-900 border-gray-100'
              }`}>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{survey.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      survey.isPriority ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
                    }`}>
                      {survey.status}
                    </span>
                  </div>
                  <p className={`text-sm max-w-2xl ${survey.isPriority ? 'text-blue-100' : 'text-gray-500'}`}>
                    {survey.description}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-[12px] font-medium">
                      <FileText className={`w-4 h-4 ${survey.isPriority ? 'text-blue-300' : 'text-gray-400'}`} />
                      {survey.category}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-medium">
                      <Calendar className={`w-4 h-4 ${survey.isPriority ? 'text-blue-300' : 'text-gray-400'}`} />
                      Due: {survey.dueDate}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-medium">
                      <BarChart3 className={`w-4 h-4 ${survey.isPriority ? 'text-blue-300' : 'text-gray-400'}`} />
                      {survey.responses} responses
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {survey.isPriority && (
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mr-2">Priority</span>
                  )}
                  <button className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    survey.isPriority 
                    ? 'bg-white text-[#003087] hover:bg-blue-50' 
                    : 'bg-[#003087] text-white hover:bg-[#002566]'
                  }`}>
                    {survey.isPriority ? 'Edit Response' : 'Take Survey'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            completedSurveys.map((survey, index) => (
              <div key={index} className="bg-white rounded-[24px] p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left hover:bg-gray-50/50 transition-colors">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">{survey.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{survey.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Completed on {survey.completedDate}
                    </span>
                  </p>
                </div>
                <button className="w-full md:w-auto px-6 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                  View Response
                </button>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}