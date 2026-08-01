import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Award, User, FileText, Plus, X, CheckCircle, XCircle, Trash2, Edit, Download } from 'lucide-react';
import { Footer } from '../Footer';
import { EventRegistrationModal } from '../EventRegistrationModal';

// Image imports
import EngageWebDevBG from '../../../assets/EngageWebDevBG.jpg';
import StocksBG from '../../../assets/StocksBG.jpg';
import Swim101 from '../../../assets/Swim101.jpg';
import DigitalMarket from '../../../assets/DigitalMarket.jpg';
import DesignThinkBG from '../../../assets/DesignThinkBG.jpg';
import LeadershipBG from '../../../assets/LeadershipBG.jpg';
import ChristmasReunion from '../../../assets/ChristmasReunion.jpg';
import DataSciBG from '../../../assets/DataSciBG.jpg';
import CareerFairBG from '../../../assets/CareerFairBG.jpg';
import GolfTournaBG from '../../../assets/GolfTournaBG.jpg';
import LeaderSummitBG from '../../../assets/LeaderSummitBG.jpg';
import GuestLectureBG from '../../../assets/GuestLectureBG.jpg';
import WorkshopBG from '../../../assets/WorkshopBG.jpg';
import MentorCapBG from '../../../assets/MentorCapBG.jpg';
import FinancialManageBG from '../../../assets/FinancialManageBG.jpg';
import HealthCareBG from '../../../assets/HealthCareBG.jpg';
import WorkshopLeadBG from '../../../assets/WorkshopLeadBG.jpg';
import CareerAdviceBG from '../../../assets/CareerAdviceBG.jpg';
import LabInstructBG from '../../../assets/LabInstructBG.jpg';
import SkillWorkshopBG from '../../../assets/SkillWorkshopBG.jpg';
import AccountingBG from '../../../assets/AccountingBG.jpg';
import LeaderDigitalBG from '../../../assets/LeaderDigitalBG.jpg';
import AdvFinanceBG from '../../../assets/AdvFinanceBG.jpg';
import AIandMachineBG from '../../../assets/AIandMachineBG.jpg';
import ProjectManagementBG from '../../../assets/ProjectManagementBG.jpg';
import LegalLawBG from '../../../assets/LegalLawBG.jpg';
import EntrepBG from '../../../assets/EntrepBG.jpg';
import MentalHealthBG from '../../../assets/MentalHealthBG.jpg';
import MarketingBG from '../../../assets/MarketingBG.jpg';
import CybersecBG from '../../../assets/CybersecBG.jpg';
import SustainBG from '../../../assets/SustainBG.jpg';
import ExcelBG from '../../../assets/ExcelBG.jpg';
import PharmaBG from '../../../assets/PharmaBG.jpg';

interface Event {
  id: string;
  apiId?: number;
  rawEventDate?: string;
  rawStartTime?: string;
  rawEndTime?: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  description: string;
  image: string;
  tab: 'Upcoming Events' | 'Past Events' | 'Teaching Opportunities' | 'Seminars & Workshops' | 'Alumni Proposals';
  postedBy?: string;
  postedDate?: string;
  compensation?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  submittedBy?: string;
}

const INITIAL_EVENTS: Event[] = [
  { id: '1', title: "Web Development For Beginners", category: "Computer Science", date: "January 26, 2026", time: "6:00 PM - 8:00 PM", location: "Online", participants: 245, description: "Learn the fundamentals of web development in this beginner-friendly workshop.", image: EngageWebDevBG, tab: 'Upcoming Events' },
  { id: '2', title: "Stocks, Funds & Investment", category: "Finance", date: "January 20, 2026", time: "Tue, Thu & Fri, 6:00 PM - 7:00 PM", location: "Online", participants: 178, description: "10 sessions comprehensive course on stocks, funds, and investment strategies.", image: StocksBG, tab: 'Upcoming Events' },
  { id: '3', title: "Swimming 101 for Adults", category: "Sports & Wellness", date: "January 20, 2026", time: "Tue & Thu 5:00 PM, Sat 1:30 PM", location: "ADDU Aquatic Center", participants: 89, description: "10 sessions comprehensive swimming program for adults. Learn basic techniques.", image: Swim101, tab: 'Upcoming Events' },
  { id: '4', title: "Fundamentals of Digital Marketing", category: "Marketing", date: "January 21, 2026", time: "Mon, Wed & Fri, 6:00 PM - 8:00 PM", location: "Online", participants: 156, description: "4 sessions course covering the fundamentals of digital marketing.", image: DigitalMarket, tab: 'Upcoming Events' },
  { id: '5', title: "Design Thinking Workshop", category: "Innovation & Design", date: "January 24, 2026", time: "Saturday, 9:00 AM - 11:00 AM", location: "Online", participants: 198, description: "8 sessions workshop on design thinking - human-centered innovation.", image: DesignThinkBG, tab: 'Upcoming Events' },
  { id: '6', title: "Executive Leadership Training", category: "Leadership", date: "January 26, 2026", time: "Mon, Wed & Thu, 6:00 PM - 8:00 PM", location: "Online", participants: 132, description: "12 sessions comprehensive leadership training program.", image: LeadershipBG, tab: 'Upcoming Events' },
  { id: '7', title: "Christmas Alumni Reunion 2025", category: "Social Event", date: "December 20, 2025", time: "6:00 PM - 10:00 PM", location: "ADDU Gymnasium", participants: 423, description: "A festive celebration bringing together alumni for fellowship, dinner, and holiday cheer.", image: ChristmasReunion, tab: 'Past Events' },
  { id: '8', title: "Data Science & Analytics Workshop", category: "Professional Dev", date: "November 15, 2025", time: "1:00 PM - 6:00 PM", location: "ADDU Computer Lab", participants: 87, description: "Hands-on workshop covering Python, data visualization, and machine learning basics.", image: DataSciBG, tab: 'Past Events' },
  { id: '9', title: "Alumni Career Fair 2025", category: "Career", date: "October 28, 2025", time: "9:00 AM - 5:00 PM", location: "ADDU Covered Court", participants: 542, description: "Major job fair featuring 50+ companies actively recruiting ADDU alumni across all levels.", image: CareerFairBG, tab: 'Past Events' },
  { id: '10', title: "Alumni Golf Tournament", category: "Sports", date: "September 22, 2025", time: "6:00 AM - 2:00 PM", location: "Apo Golf & Country Club", participants: 76, description: "Annual charity golf tournament with proceeds supporting ADDU scholarship programs", image: GolfTournaBG, tab: 'Past Events' },
  { id: '11', title: "Leadership Summit: Future of Work", category: "Professional Dev", date: "July 20, 2025", time: "2:00 PM - 7:00 PM", location: "Virtual Event", participants: 234, description: "Panel discussions on remote work, digital transformation, and emerging career trends.", image: LeaderSummitBG, tab: 'Past Events' },
  { id: '12', title: "Guest Lecturer - Digital Marketing", category: "Business", date: "1 Semester", time: "Tue & Thu preferred", location: "School of Business and Governance", participants: 8, compensation: "Honorarium provided", description: "Share your expertise in digital marketing with our business students.", image: GuestLectureBG, tab: 'Teaching Opportunities', postedBy: "Dr. Antonio Reyes", postedDate: "5 days ago" },
  { id: '13', title: "Workshop Facilitator - Python", category: "Computer Science", date: "2 Days", time: "March 8-9, 2026", location: "Department of Computer Science", participants: 15, compensation: "Php 15,000", description: "Conduct hands-on Python workshop for intermediate students.", image: WorkshopBG, tab: 'Teaching Opportunities', postedBy: "Prof. Maria Santos", postedDate: "2 weeks ago" },
  { id: '14', title: "Mentor - Engineering Capstone", category: "Engineering", date: "1 Academic Year", time: "4 hours/month", location: "College of Engineering", participants: 12, compensation: "Certificate + Recognition", description: "Guide senior engineering students through their capstone projects.", image: MentorCapBG, tab: 'Teaching Opportunities', postedBy: "Engr. Robert Tan", postedDate: "1 week ago" },
  { id: '15', title: "Adjunct Professor - Finance", category: "Finance", date: "1 Semester", time: "MWF 2:00 PM - 3:30 PM", location: "School of Business and Governance", participants: 6, compensation: "Competitive academic rate", description: "Teach undergraduate financial management course.", image: FinancialManageBG, tab: 'Teaching Opportunities', postedBy: "Dean Patricia Cruz", postedDate: "3 days ago" },
  { id: '16', title: "Guest Speaker - Nursing", category: "Nursing", date: "2-hour Session", time: "Feb 25, 2026 at 3:00 PM", location: "School of Nursing", participants: 4, compensation: "Honorarium + Travel", description: "Share insights on healthcare administration with nursing students.", image: HealthCareBG, tab: 'Teaching Opportunities', postedBy: "Dr. Elizabeth Gomez", postedDate: "1 week ago" },
  { id: '17', title: "Workshop Leader - UX/UI", category: "IT", date: "5 Days Intensive", time: "April 14-18, 9:00 AM", location: "Dept. of Information Technology", participants: 11, compensation: "Php 50,000", description: "Lead intensive UX/UI bootcamp covering research and prototyping.", image: WorkshopLeadBG, tab: 'Teaching Opportunities', postedBy: "Prof. Jennifer Lim", postedDate: "4 days ago" },
  { id: '18', title: "Career Advisor - Law", category: "Law", date: "Ongoing", time: "2 hours/week", location: "College of Law", participants: 7, compensation: "Volunteer (Recognition)", description: "Provide career guidance to law students preparing for bar exams.", image: CareerAdviceBG, tab: 'Teaching Opportunities', postedBy: "Atty. Marco Gonzales", postedDate: "2 weeks ago" },
  { id: '19', title: "Lab Instructor - Data Science", category: "Mathematics", date: "1 Semester", time: "Saturdays 10:00 AM", location: "Department of Mathematics", participants: 9, compensation: "Standard adjunct rate", description: "Supervise data science lab sessions using R and Python.", image: LabInstructBG, tab: 'Teaching Opportunities', postedBy: "Dr. Thomas Valdez", postedDate: "6 days ago" },
  { id: '20', title: "Skills Workshop - Speaking", category: "Communication", date: "3-hour Workshop", time: "March 12, 2026", location: "Department of Communication", participants: 13, compensation: "Php 8,000", description: "Teach students effective public speaking and presentation techniques.", image: SkillWorkshopBG, tab: 'Teaching Opportunities', postedBy: "Prof. Amanda Reyes", postedDate: "1 week ago" },
  { id: '21', title: "Practicum Supervisor", category: "Accounting", date: "6 months", time: "Monthly check-ins", location: "School of Business", participants: 5, compensation: "Certificate + Recognition", description: "Supervise accounting students during their industry practicum.", image: AccountingBG, tab: 'Teaching Opportunities', postedBy: "CPA Catherine Velasco", postedDate: "3 days ago" },
  { id: '22', title: "Leadership in the Digital Age", category: "Professional Dev", date: "March 15, 2026", time: "9:00 AM - 4:00 PM", location: "ADDU Finster Hall", participants: 120, description: "Leading teams in a digital-first environment with focus on remote management.", image: LeaderDigitalBG, tab: 'Seminars & Workshops' },
  { id: '23', title: "Advanced Financial Analytics", category: "Finance", date: "April 05, 2026", time: "1:00 PM - 5:00 PM", location: "Virtual / Zoom", participants: 85, description: "Master financial modeling and data analytics for modern investment strategies.", image: AdvFinanceBG, tab: 'Seminars & Workshops' },
  { id: '24', title: "AI and Machine Learning", category: "Technology", date: "April 12, 2026", time: "10:00 AM - 12:00 PM", location: "ADDU Community Center", participants: 45, description: "Strategic overview of AI capabilities for business implementations.", image: AIandMachineBG, tab: 'Seminars & Workshops' },
  { id: '25', title: "Agile Project Management", category: "Management", date: "May 20, 2026", time: "9:00 AM - 3:00 PM", location: "Online", participants: 200, description: "Certification-ready workshop for Agile and Scrum methodologies.", image: ProjectManagementBG, tab: 'Seminars & Workshops' },
  { id: '26', title: "Legal Issues in E-Commerce", category: "Law", date: "June 10, 2026", time: "2:00 PM - 5:00 PM", location: "ADDU College of Law", participants: 60, description: "Deep dive into digital trade, consumer rights, and data privacy frameworks.", image: LegalLawBG, tab: 'Seminars & Workshops' },
  { id: '27', title: "Entrepreneurship Mastery", category: "Business", date: "June 15, 2026", time: "9:00 AM - 5:00 PM", location: "Online", participants: 110, description: "Scale your startup with expert insights on operations and funding.", image: EntrepBG, tab: 'Seminars & Workshops' },
  { id: '28', title: "Workplace Mental Health", category: "Wellness", date: "July 02, 2026", time: "1:30 PM - 4:30 PM", location: "Virtual", participants: 150, description: "Promoting psychological safety and mental well-being in corporate settings.", image: MentalHealthBG, tab: 'Seminars & Workshops' },
  { id: '29', title: "Modern Content Marketing", category: "Marketing", date: "July 20, 2026", time: "10:00 AM - 3:00 PM", location: "ADDU Arrupe Hall", participants: 95, description: "Storytelling and content strategies for the social media era.", image: MarketingBG, tab: 'Seminars & Workshops' },
  { id: '30', title: "Cybersecurity Essentials", category: "IT Security", date: "August 05, 2026", time: "9:00 AM - 12:00 PM", location: "Online", participants: 180, description: "Protecting business data from modern threats and social engineering.", image: CybersecBG, tab: 'Seminars & Workshops' },
  { id: '31', title: "Sustainable Business", category: "Innovation", date: "August 18, 2026", time: "1:00 PM - 4:00 PM", location: "ADDU Community Center", participants: 70, description: "Integrating ESG principles into your business strategy and operations.", image: SustainBG, tab: 'Seminars & Workshops' },
  { id: '32', title: "Excel for Business Pros", category: "Data", date: "September 03, 2026", time: "9:00 AM - 12:00 PM", location: "Online", participants: 300, description: "Advanced functions, pivot tables, and data visualization techniques.", image: ExcelBG, tab: 'Seminars & Workshops' },
  { id: '33', title: "Pharmacy Trends 2026", category: "Healthcare", date: "September 15, 2026", time: "2:00 PM - 5:00 PM", location: "ADDU School of Nursing", participants: 55, description: "Updating clinical knowledge on emerging pharmaceuticals and patient care.", image: PharmaBG, tab: 'Seminars & Workshops' },
];

function EventCard({ event, userRole, onApprove, onReject, onView, onRemove, onEdit, activeTab }: any) {
  const isPast = event.tab === 'Past Events';
  const isTeaching = event.tab === 'Teaching Opportunities';
  const isProposalTab = event.tab === 'Alumni Proposals';
  const isMySubmissions = activeTab === 'My Submissions';
  const isAdmin = userRole === 'admin';

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left">
      <div className="relative h-56 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {isAdmin && (
            <>
              <button 
                onClick={() => onEdit(event)}
                className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onRemove(event.id)}
                className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <span className="px-4 py-1.5 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg">
            {event.category}
          </span>
          {event.status && (
            <span className={`px-4 py-1.5 text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg ${
              event.status === 'Pending' ? 'bg-amber-500' : event.status === 'Approved' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {event.status}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" /> {event.date}
          </div>
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5" /> {event.time || 'TBD'}
          </div>
          {!isTeaching && !isProposalTab && (
            <div className="flex items-start gap-2 text-gray-500 text-[13px]">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> {event.location}
            </div>
          )}
          {isTeaching && event.compensation && (
            <div className="flex items-start gap-2 text-[#22C55E] text-[13px] font-semibold">
              <Award className="w-4 h-4 mt-0.5" /> {event.compensation}
            </div>
          )}
          <div className="flex items-start gap-2 text-[#003087] text-[13px] font-semibold">
            <Users className="w-4 h-4 mt-0.5" /> 
            {event.participants} {isPast ? 'attended' : isTeaching ? 'applications' : 'participants'}
          </div>
        </div>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-6 flex-1">
          {event.description}
        </p>

        {(isTeaching || isProposalTab || isMySubmissions) && event.postedBy && (
          <div className="pt-4 border-t border-gray-100 mb-6 flex items-center gap-2 text-gray-400 text-[11px]">
            <User className="w-3 h-3" />
            <span>Posted by <span className="text-gray-600 font-medium">{event.postedBy}</span> • {event.postedDate}</span>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {isProposalTab && isAdmin && event.status === 'Pending' ? (
            <>
              <button onClick={() => onApprove(event.id)} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => onReject(event.id)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </>
          ) : (event.tab === 'Upcoming Events' || event.tab === 'Seminars & Workshops') ? (
            <>
              <button 
                onClick={() => onView(event)}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                View Details
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('registerEvent', { detail: { event } }))}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-[#003087] text-white hover:bg-[#002566]"
              >
                Register
              </button>
            </>
          ) : (
            <button 
              onClick={() => onView(event)}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                isPast ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : isTeaching ? 'bg-[#003087] text-white hover:bg-[#002566]' : 'bg-[#003087] text-white hover:bg-[#002566]'
              }`}
            >
              {isPast ? 'View Gallery' : isTeaching ? 'Apply Now' : 'View Details'}
            </button>
          )}
          <button onClick={() => onView(event)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function EventsView({ userRole, userName = 'Alumni User' }: { userRole: string; userName?: string }) {
  const [activeTab, setActiveTab] = useState('Upcoming Events');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationEvent, setRegistrationEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);

  const [newEvent, setNewEvent] = useState({
    title: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    capacity: '',
    image: ''
  });

  const [editEvent, setEditEvent] = useState({
    title: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    capacity: '',
    image: ''
  });

  const apiBaseUrl = 'http://localhost:8000/api';

  const formatDateLabel = (value?: string) => {
    if (!value) return 'TBD';
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return value;
    return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTimeLabel = (start?: string, end?: string) => {
    const to12Hour = (input?: string) => {
      if (!input) return '';
      const [h, m] = input.split(':').map((v) => Number(v));
      if (Number.isNaN(h) || Number.isNaN(m)) return input;
      const date = new Date();
      date.setHours(h, m, 0, 0);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const startLabel = to12Hour(start);
    const endLabel = to12Hour(end);

    if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
    return startLabel || endLabel || 'TBD';
  };

  const mapApiEventToCard = useCallback((item: any): Event => {
    const eventDate = item.event_date;
    const now = new Date();
    const parsedDate = eventDate ? new Date(eventDate) : null;

    let tab: Event['tab'] = 'Upcoming Events';

    if (item.status === 'Pending' || item.status === 'Rejected' || item.status === 'Draft') {
      tab = 'Alumni Proposals';
    } else if (parsedDate && !Number.isNaN(parsedDate.getTime()) && parsedDate < now) {
      tab = 'Past Events';
    }

    return {
      id: `api-${item.id}`,
      apiId: Number(item.id),
      rawEventDate: item.event_date || undefined,
      rawStartTime: item.start_time || undefined,
      rawEndTime: item.end_time || undefined,
      title: item.title,
      category: item.category,
      date: formatDateLabel(item.event_date),
      time: formatTimeLabel(item.start_time, item.end_time),
      location: item.location || 'TBD',
      participants: Number(item.participants_count ?? 0),
      description: item.description || '',
      image: item.image_url || CareerFairBG,
      tab,
      postedBy: item.posted_by || undefined,
      postedDate: item.created_at ? 'Recently posted' : undefined,
      status: item.status,
      submittedBy: item.posted_by || undefined,
    };
  }, []);

  const parseApiEventId = (id: string): number | null => {
    if (!id.startsWith('api-')) return null;
    const numericId = Number(id.replace('api-', ''));
    return Number.isFinite(numericId) ? numericId : null;
  };

  const fetchEngagementEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams({ role: userRole });
      if (userRole !== 'admin' && userName) {
        params.set('posted_by', userName);
      }

      const response = await fetch(`${apiBaseUrl}/engagement/events?${params.toString()}`);
      if (!response.ok) return;

      const payload = await response.json();
      if (!Array.isArray(payload)) return;

      const apiEvents = payload.map(mapApiEventToCard);

      setEvents((prev) => {
        const localOnly = prev.filter((ev) => !ev.id.startsWith('api-'));
        return [...apiEvents, ...localOnly];
      });
    } catch {
      // Keep local fallback data when API is unavailable.
    }
  }, [userRole, mapApiEventToCard, userName]);

  const downloadEngagementReport = (path: string) => {
    window.open(`${apiBaseUrl}${path}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    fetchEngagementEvents();
  }, [fetchEngagementEvents]);

  useEffect(() => {
    const handleRegisterEvent = (event: any) => {
      setRegistrationEvent(event.detail.event);
    };
    window.addEventListener('registerEvent', handleRegisterEvent as EventListener);
    return () => window.removeEventListener('registerEvent', handleRegisterEvent as EventListener);
  }, []);

  const triggerToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleRegistrationSubmit = async (payload: {
    eventApiId?: number;
    eventId?: string;
    firstName: string;
    lastName: string;
    email: string;
    guestCount: number;
    totalAmount: number;
    paymentMethod: 'gcash' | 'maya' | 'card';
  }): Promise<{ success: boolean; message?: string }> => {
    const { eventApiId, eventId, firstName, lastName, email, guestCount, totalAmount, paymentMethod } = payload;
    const resolvedApiId = eventApiId ?? (eventId ? parseApiEventId(eventId) : null);

    if (resolvedApiId == null) {
      if (eventId) {
        setEvents((prev) => prev.map((ev) => (
          ev.id === eventId
            ? { ...ev, participants: ev.participants + 1 + guestCount }
            : ev
        )));
      }

      triggerToast();

      return {
        success: true,
        message: 'Demo payment successful! Registration completed for this event.',
      };
    }

    try {
      const response = await fetch(`${apiBaseUrl}/engagement/events/${resolvedApiId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          is_guest: false,
          guest_count: guestCount,
          fee_amount: totalAmount,
          payment_status: 'Paid',
          payment_method: paymentMethod,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to register for this event. Please try again.';

        try {
          const body = await response.json();
          if (body?.message) {
            errorMessage = body.message;
          }
        } catch {
          // Keep default message when response body is not JSON.
        }

        return { success: false, message: errorMessage };
      }

      let registeredEvent: any = null;
      try {
        const body = await response.json();
        registeredEvent = body?.event ?? null;
      } catch {
        // Ignore non-JSON responses; fallback update handles UI feedback.
      }

      const incrementBy = 1 + Math.max(0, guestCount);
      setEvents((prev) => prev.map((ev) => {
        const currentApiId = ev.apiId ?? parseApiEventId(ev.id);
        const isMatchedByApiId = currentApiId === resolvedApiId;
        const isMatchedById = eventId ? ev.id === eventId : false;
        if (!isMatchedByApiId && !isMatchedById) return ev;

        if (registeredEvent) {
          const mapped = mapApiEventToCard(registeredEvent);
          return {
            ...ev,
            ...mapped,
            id: ev.id,
          };
        }

        return {
          ...ev,
          participants: ev.participants + incrementBy,
        };
      }));

      await fetchEngagementEvents();
      triggerToast();

      return {
        success: true,
        message: 'Demo payment successful! You are now registered for this event.',
      };
    } catch {
      return {
        success: false,
        message: 'Unable to complete registration right now. Please try again.',
      };
    }
  };

  const handleApprove = async (id: string) => {
    const apiId = parseApiEventId(id);

    if (apiId !== null) {
      try {
        const response = await fetch(`${apiBaseUrl}/engagement/events/${apiId}/approve`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          alert('Failed to approve event. Please try again.');
          return;
        }

        await fetchEngagementEvents();
        triggerToast();
        return;
      } catch {
        alert('Unable to approve event right now.');
        return;
      }
    }

    setEvents(prev => prev.map(ev =>
      ev.id === id ? { ...ev, status: 'Approved' as const, tab: 'Upcoming Events' as const } : ev
    ));
    triggerToast();
  };

  const handleReject = async (id: string) => {
    const apiId = parseApiEventId(id);

    if (apiId !== null) {
      try {
        const response = await fetch(`${apiBaseUrl}/engagement/events/${apiId}/decline`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          alert('Failed to reject event. Please try again.');
          return;
        }

        await fetchEngagementEvents();
        triggerToast();
        return;
      } catch {
        alert('Unable to reject event right now.');
        return;
      }
    }

    setEvents(prev => prev.map(ev =>
      ev.id === id ? { ...ev, status: 'Rejected' as const } : ev
    ));
    triggerToast();
  };

  const handleRemove = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently remove this event?")) {
      const apiId = parseApiEventId(id);

      if (apiId !== null) {
        try {
          const response = await fetch(`${apiBaseUrl}/engagement/events/${apiId}`, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
            },
          });

          if (!response.ok) {
            alert('Failed to delete event. Please try again.');
            return;
          }

          await fetchEngagementEvents();
          triggerToast();
          return;
        } catch {
          alert('Unable to delete event right now.');
          return;
        }
      }

      setEvents(prev => prev.filter(ev => ev.id !== id));
      triggerToast();
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    const toDateInput = (value: string) => {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return '';
      return parsed.toISOString().slice(0, 10);
    };

    const dateValue = event.rawEventDate
      ? event.rawEventDate.slice(0, 10)
      : toDateInput(event.date);

    const startValue = event.rawStartTime ?? '';
    const endValue = event.rawEndTime ?? '';

    setEditEvent({
      title: event.title,
      category: event.category,
      date: dateValue,
      startTime: startValue,
      endTime: endValue,
      location: event.location,
      description: event.description,
      capacity: event.participants.toString(),
      image: event.image
    });
    setActiveTab('Edit Event');
  };

  const handleUpdateEvent = async () => {
    if (!editEvent.title || !editEvent.category || !editEvent.date || !editEvent.startTime || !editEvent.endTime || !editEvent.location || !editEvent.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingEvent) return;

    const apiId = editingEvent.apiId ?? parseApiEventId(editingEvent.id);

    if (apiId !== null) {
      try {
        const response = await fetch(`${apiBaseUrl}/engagement/events/${apiId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            title: editEvent.title,
            category: editEvent.category,
            event_date: editEvent.date,
            start_time: editEvent.startTime,
            end_time: editEvent.endTime,
            location: editEvent.location,
            description: editEvent.description,
            image_url: editEvent.image || null,
            capacity: parseInt(editEvent.capacity) || 0,
            status: editingEvent.status || 'Approved',
            posted_by: editingEvent.postedBy || userName,
          }),
        });

        if (!response.ok) {
          alert('Failed to update event. Please try again.');
          return;
        }

        await fetchEngagementEvents();
      } catch {
        alert('Unable to update event right now.');
        return;
      }
    } else {
      const updatedEvent: Event = {
        ...editingEvent,
        title: editEvent.title,
        category: editEvent.category,
        date: editEvent.date,
        time: `${editEvent.startTime} - ${editEvent.endTime}`,
        location: editEvent.location,
        participants: parseInt(editEvent.capacity) || editingEvent.participants,
        description: editEvent.description,
        image: editEvent.image || editingEvent.image,
      };

      setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updatedEvent : ev));
    }

    setEditingEvent(null);
    setEditEvent({
      title: '',
      category: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      capacity: '',
      image: ''
    });
    setActiveTab('Upcoming Events');
    triggerToast();
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEditEvent({
      title: '',
      category: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      capacity: '',
      image: ''
    });
    setActiveTab('Upcoming Events');
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.category || !newEvent.date || !newEvent.startTime || !newEvent.endTime || !newEvent.location || !newEvent.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/engagement/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          title: newEvent.title,
          category: newEvent.category,
          event_date: newEvent.date,
          start_time: newEvent.startTime,
          end_time: newEvent.endTime,
          location: newEvent.location,
          description: newEvent.description,
          image_url: newEvent.image || null,
          capacity: parseInt(newEvent.capacity) || 0,
          status: 'Approved',
          posted_by: userName,
          user_role: userRole,
        }),
      });

      if (!response.ok) {
        alert('Failed to create event. Please try again.');
        return;
      }

      await fetchEngagementEvents();
    } catch {
      alert('Unable to create event right now. Please try again.');
      return;
    }

    setNewEvent({
      title: '',
      category: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      capacity: '',
      image: ''
    });
    setActiveTab('Upcoming Events');
    triggerToast();
  };

  const baseTabs = ['Upcoming Events', 'Past Events', 'Teaching Opportunities', 'Seminars & Workshops'];
  let tabs = userRole === 'admin' ? [...baseTabs, 'Alumni Proposals', 'Create Event'] : [...baseTabs, 'My Submissions'];
  if (editingEvent && activeTab === 'Edit Event') {
    tabs = [...tabs, 'Edit Event'];
  }

  const filteredEvents = events.filter(event => {
    if (activeTab === 'My Submissions') return event.status !== undefined && event.submittedBy === userName;
    if (activeTab === 'Create Event' || activeTab === 'Submit Proposal' || activeTab === 'Edit Event') return false;
    return event.tab === activeTab;
  });

  const activeEventTabs: Event['tab'][] = ['Upcoming Events', 'Teaching Opportunities', 'Seminars & Workshops'];
  const totalActiveEvents = events.filter((event) => activeEventTabs.includes(event.tab)).length;
  const totalRegistrations = events
    .filter((event) => activeEventTabs.includes(event.tab))
    .reduce((total, event) => total + event.participants, 0);
  const pendingProposals = events.filter((event) => event.tab === 'Alumni Proposals' && event.status === 'Pending').length;

  const summaryCards = [
    {
      label: 'Total Active Events',
      value: totalActiveEvents.toLocaleString(),
      description: 'Live and upcoming engagements currently available.',
      icon: Calendar,
      iconClassName: 'bg-blue-50 text-[#003087]',
    },
    {
      label: 'Total Registrations',
      value: totalRegistrations.toLocaleString(),
      description: 'Combined registrations across active engagement listings.',
      icon: Users,
      iconClassName: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Pending Proposals',
      value: pendingProposals.toLocaleString(),
      description: 'Alumni-submitted proposals waiting for review.',
      icon: FileText,
      iconClassName: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {showSuccessToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-100 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">Action successful!</span>
        </div>
      )}

      <main className="flex-1 p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Engagement</h1>
            <p className="text-gray-500 text-sm mt-1">Manage events and alumni contributions</p>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-start gap-4"
                  >
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${card.iconClassName}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-500">{card.label}</p>
                      <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight">{card.value}</p>
                      <p className="mt-2 text-xs leading-5 text-gray-500">{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {userRole === 'admin' ? (
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => downloadEngagementReport('/reports/engagement/participants?download=1')}
                className="flex items-center gap-2 px-4 py-2 border border-[#003087] text-[#003087] bg-white rounded-lg hover:bg-[#003087]/5 transition-colors font-semibold"
              >
                <Download className="w-5 h-5" /> Participant List
              </button>
              <button
                onClick={() => downloadEngagementReport('/reports/engagement/guests?download=1')}
                className="flex items-center gap-2 px-4 py-2 border border-[#003087] text-[#003087] bg-white rounded-lg hover:bg-[#003087]/5 transition-colors font-semibold"
              >
                <Download className="w-5 h-5" /> Guest List
              </button>
              <button
                onClick={() => downloadEngagementReport('/reports/engagement/attendance?download=1')}
                className="flex items-center gap-2 px-4 py-2 border border-[#003087] text-[#003087] bg-white rounded-lg hover:bg-[#003087]/5 transition-colors font-semibold"
              >
                <Download className="w-5 h-5" /> Attendance Report
              </button>
              <button
                onClick={() => downloadEngagementReport('/reports/engagement/income?download=1')}
                className="flex items-center gap-2 px-4 py-2 border border-[#003087] text-[#003087] bg-white rounded-lg hover:bg-[#003087]/5 transition-colors font-semibold"
              >
                <Download className="w-5 h-5" /> Income Report
              </button>
              <button
                onClick={() => setActiveTab('Create Event')}
                className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('Submit Proposal')}
              className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Submit Proposal
            </button>
          )}
        </div>

        <div className="flex gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[13px] font-bold whitespace-nowrap transition-all relative ${
                activeTab === tab ? 'text-[#003087]' : 'text-gray-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#003087]" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Teaching Opportunities' && (
          <div className="bg-[#003087] rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-left">
            <div>
              <h2 className="text-2xl font-bold mb-2">Share Your Expertise with Future Ateneans</h2>
              <p className="text-blue-100 text-sm max-w-2xl">Give back to your alma mater by teaching or mentoring. Help shape the next generation.</p>
            </div>
            <button className="whitespace-nowrap bg-white text-[#003087] px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">Express Interest</button>
          </div>
        )}

        {/* ORANGE THEMED HEADER FOR SEMINARS */}
        {activeTab === 'Seminars & Workshops' && (
          <div className="bg-orange-600 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-left shadow-lg">
            <div>
              <h2 className="text-2xl font-bold mb-2">Continuous Professional Development</h2>
              <p className="text-orange-50 text-sm max-w-2xl">
                Enhance your skills and stay competitive with professional seminars and workshops. Earn CEU credits while learning from industry experts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button className="whitespace-nowrap bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-lg">
                Browse All Seminars
              </button>
              <button className="whitespace-nowrap bg-transparent border border-white/30 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                My Certificates
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'Create Event' && activeTab !== 'Submit Proposal' && activeTab !== 'Edit Event' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                userRole={userRole} 
                onApprove={handleApprove} 
                onReject={handleReject} 
                onView={setSelectedEvent}
                onRemove={handleRemove}
                onEdit={handleEdit}
                activeTab={activeTab}
              />
            ))}
          </div>
        )}

        {activeTab === 'Create Event' && userRole === 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select 
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Networking">Networking</option>
                    <option value="Professional Dev">Professional Development</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g., ADDU Campus or Virtual Event"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea 
                  rows={6}
                  placeholder="Describe the event details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input 
                  type="number" 
                  placeholder="Maximum number of attendees"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setNewEvent({ ...newEvent, image: imageUrl });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleCreateEvent}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  Create Event
                </button>
                <button 
                  onClick={() => {
                    setNewEvent({
                      title: '',
                      category: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      description: '',
                      capacity: '',
                      image: ''
                    });
                    setActiveTab('Upcoming Events');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Edit Event' && userRole === 'admin' && editingEvent && (
          <div className="bg-white rounded-xl border-2 border-blue-200 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h3>
            <p className="text-gray-600 text-sm mb-6">Update the event details below. Changes will be saved immediately.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter event title"
                  value={editEvent.title}
                  onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input 
                    type="date" 
                    value={editEvent.date}
                    onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select 
                    value={editEvent.category}
                    onChange={(e) => setEditEvent({ ...editEvent, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Networking">Networking</option>
                    <option value="Professional Dev">Professional Development</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    value={editEvent.startTime}
                    onChange={(e) => setEditEvent({ ...editEvent, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={editEvent.endTime}
                    onChange={(e) => setEditEvent({ ...editEvent, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g., ADDU Campus or Virtual Event"
                  value={editEvent.location}
                  onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea 
                  rows={6}
                  placeholder="Describe the event details..."
                  value={editEvent.description}
                  onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input 
                  type="number" 
                  placeholder="Maximum number of attendees"
                  value={editEvent.capacity}
                  onChange={(e) => setEditEvent({ ...editEvent, capacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setEditEvent({ ...editEvent, image: imageUrl });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleUpdateEvent}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Update Event
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Submit Proposal' && userRole !== 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Submit Event Proposal</h3>
            <p className="text-gray-600 text-sm mb-6">Submit your event proposal for admin review. Once approved, your event will be published to the Upcoming Events section.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select 
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Networking">Networking</option>
                    <option value="Professional Dev">Professional Development</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g., ADDU Campus or Virtual Event"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea 
                  rows={6}
                  placeholder="Describe the event details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input 
                  type="number" 
                  placeholder="Maximum number of attendees"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setNewEvent({ ...newEvent, image: imageUrl });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={async () => {
                    if (!newEvent.title || !newEvent.category || !newEvent.date || !newEvent.startTime || !newEvent.endTime || !newEvent.location || !newEvent.description) {
                      alert('Please fill in all required fields');
                      return;
                    }

                    try {
                      const response = await fetch(`${apiBaseUrl}/engagement/events`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Accept: 'application/json',
                        },
                        body: JSON.stringify({
                          title: newEvent.title,
                          category: newEvent.category,
                          event_group: 'proposal',
                          event_date: newEvent.date,
                          start_time: newEvent.startTime,
                          end_time: newEvent.endTime,
                          location: newEvent.location,
                          description: newEvent.description,
                          image_url: newEvent.image || null,
                          capacity: parseInt(newEvent.capacity) || 0,
                          status: 'Pending',
                          posted_by: userName,
                          user_role: userRole,
                        }),
                      });

                      if (!response.ok) {
                        alert('Failed to submit proposal. Please try again.');
                        return;
                      }

                      const payload = await response.json();
                      if (payload?.event) {
                        const mapped = mapApiEventToCard(payload.event);
                        setEvents((prev) => [mapped, ...prev.filter((ev) => ev.id !== mapped.id)]);
                      } else {
                        await fetchEngagementEvents();
                      }
                    } catch {
                      alert('Unable to submit proposal right now.');
                      return;
                    }

                    setNewEvent({
                      title: '',
                      category: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      description: '',
                      capacity: '',
                      image: ''
                    });
                    setActiveTab('My Submissions');
                    alert('Event proposal submitted successfully! The admin will review and approve your event before it goes live.');
                    triggerToast();
                  }}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  Submit Proposal
                </button>
                <button 
                  onClick={() => {
                    setNewEvent({
                      title: '',
                      category: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      description: '',
                      capacity: '',
                      image: ''
                    });
                    setActiveTab('Upcoming Events');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Detail View Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-90 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-4xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="relative h-48">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="p-8 text-left">
              <span className="inline-block px-3 py-1 bg-blue-50 text-[#003087] rounded-full text-[10px] font-bold uppercase mb-3">
                {selectedEvent.category}
              </span>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{selectedEvent.title}</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 text-[#003087]"/> 
                  <span>{selectedEvent.date} • {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-[#003087]"/> 
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl mb-8">
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="w-full py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-colors">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Registration Modal */}
      {registrationEvent && (
        <EventRegistrationModal 
          event={{
            apiId: registrationEvent.apiId,
            id: registrationEvent.id,
            title: registrationEvent.title,
            date: registrationEvent.date,
            time: registrationEvent.time,
            location: registrationEvent.location,
            image: registrationEvent.image
          }}
          onClose={() => setRegistrationEvent(null)}
          pricePerGuest={1000}
          onSubmitRegistration={handleRegistrationSubmit}
        />
      )}

      <Footer />
    </div>
  );
}