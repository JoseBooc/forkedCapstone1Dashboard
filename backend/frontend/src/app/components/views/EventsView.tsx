import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Award, User, FileText, Plus, X, CheckCircle, XCircle, Trash2, Edit } from 'lucide-react';
import { Footer } from '../Footer';
import { EventRegistrationModal, MyRegistrations, type MyRegistration } from '../EventRegistrationModal';

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

interface GivebackActivity {
  id: number;
  title: string;
  description: string;
  venue: string;
  schedule_start: string;
  schedule_end: string;
  registration_open: boolean;
  participant_limit: number | null;
  fee_amount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  image_url?: string | null;
  created_by_name?: string | null;
  is_archived: boolean;
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

function EventCard({ event, userRole, onApprove, onReject, onView, onRemove, onEdit, onRegister, activeTab }: any) {
  const isPast = event.tab === 'Past Events';
  const isTeaching = event.tab === 'Teaching Opportunities';
  const isProposalTab = event.tab === 'Alumni Proposals';
  const isMySubmissions = activeTab === 'My Submissions';
  const isAdmin = userRole === 'admin';

  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left">
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
                onClick={() => onRegister(event)}
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

function ActivityCard({ activity, userRole, onEdit, onRemove, onToggleRegistration, onRegister }: any) {
  const isAdmin = userRole === 'admin';
  const schedule = `${new Date(activity.schedule_start).toLocaleDateString()} • ${new Date(activity.schedule_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(activity.schedule_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left">
      <div className="relative h-56 overflow-hidden">
        <img src={activity.image_url || CareerFairBG} alt={activity.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(activity)}
                className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(activity.id)}
                className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <span className="px-4 py-1.5 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg">
            {activity.status}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{activity.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" /> {schedule}
          </div>
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> {activity.venue}
          </div>
          <div className="flex items-start gap-2 text-[#003087] text-[13px] font-semibold">
            <Users className="w-4 h-4 mt-0.5" />
            {activity.participant_limit ? `${activity.participant_limit} slots` : 'Open slots'}
          </div>
          <div className="flex items-start gap-2 text-emerald-600 text-[13px] font-semibold">
            <Award className="w-4 h-4 mt-0.5" />
            {activity.fee_amount > 0 ? `₱${activity.fee_amount.toLocaleString()} fee` : 'Free'}
          </div>
        </div>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-6 flex-1">
          {activity.description}
        </p>

        <div className="flex gap-2 mt-auto">
          {isAdmin ? (
            <button
              onClick={() => onToggleRegistration(activity.id)}
              className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {activity.registration_open ? 'Close Registration' : 'Open Registration'}
            </button>
          ) : (
            <button
              onClick={() => onRegister(activity)}
              disabled={!activity.registration_open}
              className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-[#003087] text-white hover:bg-[#002566] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activity.registration_open ? 'Register' : 'Registration Closed'}
            </button>
          )}
          <button
            onClick={() => onRegister(activity)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
          >
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
  const [registrationEvent, setRegistrationEvent] = useState<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    feeAmount: number;
  } | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [activities, setActivities] = useState<GivebackActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [editingActivity, setEditingActivity] = useState<GivebackActivity | null>(null);
  const [activityImage, setActivityImage] = useState<File | null>(null);
  const [activityImagePreview, setActivityImagePreview] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    participantLimit: '',
    feeAmount: '',
    status: 'upcoming',
    registrationOpen: true
  });

  // ── My Registrations state ──────────────────────────────
  const [myRegistrations, setMyRegistrations] = useState<MyRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('addu_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

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

  useEffect(() => {
    localStorage.setItem('addu_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    fetchActivities();
    if (userRole !== 'admin') fetchMyRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  useEffect(() => {
    const handleRegisterEvent = (event: any) => {
      const selected = event.detail.event;
      setRegistrationEvent({
        id: Number(selected.id) || 0,
        title: selected.title,
        date: selected.date,
        time: selected.time,
        location: selected.location,
        image: selected.image,
        feeAmount: 1000
      });
    };
    window.addEventListener('registerEvent', handleRegisterEvent as EventListener);
    return () => window.removeEventListener('registerEvent', handleRegisterEvent as EventListener);
  }, []);

  const triggerToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const includeArchived = userRole === 'admin' ? '?include_archived=true' : '';
      const response = await fetch(`http://localhost:8000/api/giveback/activities${includeArchived}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  // ── Fetch registrations for the logged-in alumni ────────
  const fetchMyRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/giveback/registrations?email=${encodeURIComponent(userName)}`
      );
      if (response.ok) {
        const data = await response.json();
        setMyRegistrations(
          data.map((r: any) => ({
            id: r.id,
            eventId: r.activity_id,
            title: r.activity?.title ?? 'Event',
            date: new Date(r.activity?.schedule_start).toLocaleDateString(),
            time: `${new Date(r.activity?.schedule_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(r.activity?.schedule_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            location: r.activity?.venue ?? '',
            image: r.activity?.image_url || CareerFairBG,
            feeAmount: Number(r.activity?.fee_amount ?? 0),
            paymentStatus: r.payment_method === 'cash' ? 'cash' : (r.payment_status ?? 'pending'),
            attendees: 1 + (r.guests_count ?? 0),
            receiptUrl: r.id
              ? `http://localhost:8000/api/giveback/registrations/${r.id}/receipt`
              : undefined,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const resetActivityForm = () => {
    setActivityForm({
      title: '',
      description: '',
      venue: '',
      date: '',
      startTime: '',
      endTime: '',
      participantLimit: '',
      feeAmount: '',
      status: 'upcoming',
      registrationOpen: true
    });
    setActivityImage(null);
    setActivityImagePreview(null);
    setEditingActivity(null);
  };

  const handleCreateActivity = async () => {
    if (!activityForm.title || !activityForm.description || !activityForm.venue || !activityForm.date || !activityForm.startTime || !activityForm.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', activityForm.title);
    formData.append('description', activityForm.description);
    formData.append('venue', activityForm.venue);
    formData.append('schedule_start', `${activityForm.date}T${activityForm.startTime}`);
    formData.append('schedule_end', `${activityForm.date}T${activityForm.endTime}`);
    formData.append('participant_limit', activityForm.participantLimit || '');
    formData.append('fee_amount', activityForm.feeAmount || '0');
    formData.append('status', activityForm.status);
    formData.append('registration_open', String(activityForm.registrationOpen));
    formData.append('created_by_name', userRole === 'admin' ? 'Admin' : userName);
    if (activityImage) formData.append('image', activityImage);

    try {
      const response = await fetch('http://localhost:8000/api/giveback/activities', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        await fetchActivities();
        resetActivityForm();
        setActiveTab('GiveBack Activities');
        triggerToast();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to create activity');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Failed to create activity');
    }
  };

  const handleEditActivity = (activity: GivebackActivity) => {
    setEditingActivity(activity);
    const start = new Date(activity.schedule_start);
    const end = new Date(activity.schedule_end);
    setActivityForm({
      title: activity.title,
      description: activity.description,
      venue: activity.venue,
      date: start.toISOString().split('T')[0],
      startTime: start.toTimeString().slice(0, 5),
      endTime: end.toTimeString().slice(0, 5),
      participantLimit: activity.participant_limit ? String(activity.participant_limit) : '',
      feeAmount: String(activity.fee_amount || 0),
      status: activity.status,
      registrationOpen: activity.registration_open
    });
    setActivityImagePreview(activity.image_url || null);
    setActiveTab('Edit GiveBack Activity');
  };

  const handleUpdateActivity = async () => {
    if (!editingActivity) return;
    if (!activityForm.title || !activityForm.description || !activityForm.venue || !activityForm.date || !activityForm.startTime || !activityForm.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', activityForm.title);
    formData.append('description', activityForm.description);
    formData.append('venue', activityForm.venue);
    formData.append('schedule_start', `${activityForm.date}T${activityForm.startTime}`);
    formData.append('schedule_end', `${activityForm.date}T${activityForm.endTime}`);
    formData.append('participant_limit', activityForm.participantLimit || '');
    formData.append('fee_amount', activityForm.feeAmount || '0');
    formData.append('status', activityForm.status);
    formData.append('registration_open', String(activityForm.registrationOpen));
    formData.append('created_by_name', editingActivity.created_by_name || userName);
    if (activityImage) formData.append('image', activityImage);

    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${editingActivity.id}`, {
        method: 'PUT',
        body: formData
      });
      if (response.ok) {
        await fetchActivities();
        resetActivityForm();
        setActiveTab('GiveBack Activities');
        triggerToast();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update activity');
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to update activity');
    }
  };

  const handleRemoveActivity = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to delete activity');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  const handleToggleActivityRegistration = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}/toggle-registration`, { method: 'PATCH' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to update registration status');
      }
    } catch (error) {
      console.error('Error toggling registration:', error);
      alert('Failed to update registration status');
    }
  };

  const handleApprove = (id: string) => {
    setEvents(prev => prev.map(ev =>
      ev.id === id ? { ...ev, status: 'Approved' as const, tab: 'Upcoming Events' as const } : ev
    ));
    triggerToast();
  };

  const handleReject = (id: string) => {
    setEvents(prev => prev.map(ev =>
      ev.id === id ? { ...ev, status: 'Rejected' as const } : ev
    ));
    triggerToast();
  };

  const handleRemove = (id: string) => {
    if (window.confirm("Are you sure you want to permanently remove this event?")) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
      triggerToast();
    }
  };

  const openRegistrationModalFromActivity = (activity: GivebackActivity, fallbackImage?: string) => {
    setRegistrationEvent({
      id: activity.id,
      title: activity.title,
      date: new Date(activity.schedule_start).toLocaleDateString(),
      time: `${new Date(activity.schedule_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(activity.schedule_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      location: activity.venue,
      image: activity.image_url || fallbackImage || CareerFairBG,
      feeAmount: Number(activity.fee_amount || 0)
    });
  };

  const handleLegacyEventRegister = async (event: Event) => {
    const existingActivity = activities.find(
      (activity) =>
        !activity.is_archived &&
        activity.title.trim().toLowerCase() === event.title.trim().toLowerCase() &&
        activity.venue.trim().toLowerCase() === event.location.trim().toLowerCase()
    );

    if (existingActivity) {
      if (!existingActivity.registration_open) {
        alert('Registration is currently closed for this activity.');
        return;
      }
      openRegistrationModalFromActivity(existingActivity, event.image);
      return;
    }

    const parsedDate = new Date(event.date);
    const startDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    startDate.setHours(9, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2);

    try {
      const response = await fetch('http://localhost:8000/api/giveback/activities', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          venue: event.location || 'TBA',
          schedule_start: startDate.toISOString(),
          schedule_end: endDate.toISOString(),
          registration_open: true,
          participant_limit: event.participants > 0 ? event.participants : null,
          fee_amount: 1000,
          status: 'upcoming',
          created_by_name: userName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Unable to prepare this activity for registration.');
        return;
      }

      const createdActivity: GivebackActivity = await response.json();
      setActivities((prev) => [createdActivity, ...prev]);
      openRegistrationModalFromActivity(createdActivity, event.image);
    } catch (error) {
      console.error('Error preparing legacy event registration:', error);
      alert('Unable to prepare registration at the moment. Please try again.');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    const timeParts = event.time.split(' - ');
    setEditEvent({
      title: event.title,
      category: event.category,
      date: event.date,
      startTime: timeParts[0] || '',
      endTime: timeParts[1] || '',
      location: event.location,
      description: event.description,
      capacity: event.participants.toString(),
      image: event.image
    });
    setActiveTab('Edit Event');
  };

  const handleUpdateEvent = () => {
    if (!editEvent.title || !editEvent.category || !editEvent.date || !editEvent.startTime || !editEvent.endTime || !editEvent.location || !editEvent.description) {
      alert('Please fill in all required fields');
      return;
    }
    if (!editingEvent) return;

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
    setEditingEvent(null);
    setEditEvent({ title: '', category: '', date: '', startTime: '', endTime: '', location: '', description: '', capacity: '', image: '' });
    setActiveTab('Upcoming Events');
    triggerToast();
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEditEvent({ title: '', category: '', date: '', startTime: '', endTime: '', location: '', description: '', capacity: '', image: '' });
    setActiveTab('Upcoming Events');
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.category || !newEvent.date || !newEvent.startTime || !newEvent.endTime || !newEvent.location || !newEvent.description) {
      alert('Please fill in all required fields');
      return;
    }

    const createdEvent: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      category: newEvent.category,
      date: newEvent.date,
      time: `${newEvent.startTime} - ${newEvent.endTime}`,
      location: newEvent.location,
      participants: parseInt(newEvent.capacity) || 0,
      description: newEvent.description,
      image: newEvent.image || CareerFairBG,
      tab: 'Upcoming Events',
    };

    setEvents(prev => [createdEvent, ...prev]);
    setNewEvent({ title: '', category: '', date: '', startTime: '', endTime: '', location: '', description: '', capacity: '', image: '' });
    setActiveTab('Upcoming Events');
    triggerToast();
  };

  const baseTabs = ['GiveBack Activities', 'Upcoming Events', 'Past Events', 'Teaching Opportunities', 'Seminars & Workshops'];
  let tabs = userRole === 'admin'
    ? [...baseTabs, 'Alumni Proposals', 'Create Event', 'Create GiveBack Activity']
    : [...baseTabs, 'My Submissions', 'My Registrations']; // ← My Registrations added here

  if (editingEvent && activeTab === 'Edit Event') tabs = [...tabs, 'Edit Event'];
  if (editingActivity && activeTab === 'Edit GiveBack Activity') tabs = [...tabs, 'Edit GiveBack Activity'];

  const filteredEvents = events.filter(event => {
    if (activeTab === 'My Submissions') return event.status !== undefined && event.submittedBy === userName;
    if (
      activeTab === 'Create Event' ||
      activeTab === 'Submit Proposal' ||
      activeTab === 'Edit Event' ||
      activeTab === 'GiveBack Activities' ||
      activeTab === 'Create GiveBack Activity' ||
      activeTab === 'Edit GiveBack Activity' ||
      activeTab === 'My Registrations'
    ) return false;
    return event.tab === activeTab;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {showSuccessToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">Action successful!</span>
        </div>
      )}

      <main className="flex-1 p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Engagement</h1>
            <p className="text-gray-500 text-sm mt-1">Manage events and alumni contributions</p>
          </div>
          {userRole === 'admin' ? (
            <button
              onClick={() => setActiveTab(activeTab === 'GiveBack Activities' ? 'Create GiveBack Activity' : 'Create Event')}
              className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              {activeTab === 'GiveBack Activities' ? 'Create GiveBack Activity' : 'Create Event'}
            </button>
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

        {/* Tab Navigation */}
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
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#003087]" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Teaching Opportunities' && (
          <div className="bg-[#003087] rounded-[24px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-left">
            <div>
              <h2 className="text-2xl font-bold mb-2">Share Your Expertise with Future Ateneans</h2>
              <p className="text-blue-100 text-sm max-w-2xl">Give back to your alma mater by teaching or mentoring. Help shape the next generation.</p>
            </div>
            <button className="whitespace-nowrap bg-white text-[#003087] px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">Express Interest</button>
          </div>
        )}

        {activeTab === 'Seminars & Workshops' && (
          <div className="bg-orange-600 rounded-[24px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-left shadow-lg">
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

        {/* GiveBack Activities grid */}
        {activeTab === 'GiveBack Activities' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading GiveBack activities...</div>
            ) : activities.filter(activity => !activity.is_archived).length === 0 ? (
              <div className="text-center py-10 text-gray-500">No GiveBack activities available yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.filter(activity => !activity.is_archived).map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    onEdit={handleEditActivity}
                    onRemove={handleRemoveActivity}
                    onToggleRegistration={handleToggleActivityRegistration}
                    onRegister={(selected: GivebackActivity) =>
                      setRegistrationEvent({
                        id: selected.id,
                        title: selected.title,
                        date: new Date(selected.schedule_start).toLocaleDateString(),
                        time: `${new Date(selected.schedule_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(selected.schedule_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        location: selected.venue,
                        image: selected.image_url || CareerFairBG,
                        feeAmount: Number(selected.fee_amount || 0)
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── My Registrations tab ───────────────────────────── */}
        {activeTab === 'My Registrations' && userRole !== 'admin' && (
          <MyRegistrations
            registrations={myRegistrations}
            isLoading={loadingRegistrations}
          />
        )}

        {/* All other event grids */}
        {activeTab !== 'Create Event' &&
          activeTab !== 'Submit Proposal' &&
          activeTab !== 'Edit Event' &&
          activeTab !== 'GiveBack Activities' &&
          activeTab !== 'Create GiveBack Activity' &&
          activeTab !== 'Edit GiveBack Activity' &&
          activeTab !== 'My Registrations' && (
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
                onRegister={handleLegacyEventRegister}
                activeTab={activeTab}
              />
            ))}
          </div>
        )}

        {/* Create GiveBack Activity form */}
        {activeTab === 'Create GiveBack Activity' && userRole === 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create GiveBack Activity</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Title *</label>
                <input type="text" placeholder="Enter activity title" value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                  <input type="date" value={activityForm.date} onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select value={activityForm.status} onChange={(e) => setActivityForm({ ...activityForm, status: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                  <input type="time" value={activityForm.startTime} onChange={(e) => setActivityForm({ ...activityForm, startTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input type="time" value={activityForm.endTime} onChange={(e) => setActivityForm({ ...activityForm, endTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Venue *</label>
                <input type="text" placeholder="Enter venue or location" value={activityForm.venue} onChange={(e) => setActivityForm({ ...activityForm, venue: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea rows={6} placeholder="Describe the activity details..." value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Participant Limit</label>
                  <input type="number" placeholder="Maximum number of participants" value={activityForm.participantLimit} onChange={(e) => setActivityForm({ ...activityForm, participantLimit: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fee Amount (PHP)</label>
                  <input type="number" placeholder="0 for free" value={activityForm.feeAmount} onChange={(e) => setActivityForm({ ...activityForm, feeAmount: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={activityForm.registrationOpen} onChange={(e) => setActivityForm({ ...activityForm, registrationOpen: e.target.checked })} className="w-4 h-4 accent-[#003087]" />
                <span className="text-sm font-semibold text-gray-700">Open registration</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Poster / Image</label>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setActivityImage(file); setActivityImagePreview(URL.createObjectURL(file)); } }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                {activityImagePreview && <img src={activityImagePreview} alt="Preview" className="mt-3 h-32 rounded-lg object-cover" />}
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button onClick={handleCreateActivity} className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold">Create Activity</button>
                <button onClick={() => { resetActivityForm(); setActiveTab('GiveBack Activities'); }} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit GiveBack Activity form */}
        {activeTab === 'Edit GiveBack Activity' && userRole === 'admin' && editingActivity && (
          <div className="bg-white rounded-xl border-2 border-blue-200 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit GiveBack Activity</h3>
            <p className="text-gray-600 text-sm mb-6">Update the activity details below.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Title *</label>
                <input type="text" placeholder="Enter activity title" value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                  <input type="date" value={activityForm.date} onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select value={activityForm.status} onChange={(e) => setActivityForm({ ...activityForm, status: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                  <input type="time" value={activityForm.startTime} onChange={(e) => setActivityForm({ ...activityForm, startTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input type="time" value={activityForm.endTime} onChange={(e) => setActivityForm({ ...activityForm, endTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Venue *</label>
                <input type="text" placeholder="Enter venue or location" value={activityForm.venue} onChange={(e) => setActivityForm({ ...activityForm, venue: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea rows={6} placeholder="Describe the activity details..." value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Participant Limit</label>
                  <input type="number" placeholder="Maximum number of participants" value={activityForm.participantLimit} onChange={(e) => setActivityForm({ ...activityForm, participantLimit: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fee Amount (PHP)</label>
                  <input type="number" placeholder="0 for free" value={activityForm.feeAmount} onChange={(e) => setActivityForm({ ...activityForm, feeAmount: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={activityForm.registrationOpen} onChange={(e) => setActivityForm({ ...activityForm, registrationOpen: e.target.checked })} className="w-4 h-4 accent-[#003087]" />
                <span className="text-sm font-semibold text-gray-700">Open registration</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Poster / Image</label>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setActivityImage(file); setActivityImagePreview(URL.createObjectURL(file)); } }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                {activityImagePreview && <img src={activityImagePreview} alt="Preview" className="mt-3 h-32 rounded-lg object-cover" />}
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button onClick={handleUpdateActivity} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">Update Activity</button>
                <button onClick={() => { resetActivityForm(); setActiveTab('GiveBack Activities'); }} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Create Event form */}
        {activeTab === 'Create Event' && userRole === 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input type="text" placeholder="Enter event title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent">
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
                  <input type="time" value={newEvent.startTime} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input type="time" value={newEvent.endTime} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input type="text" placeholder="e.g., ADDU Campus or Virtual Event" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea rows={6} placeholder="Describe the event details..." value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input type="number" placeholder="Maximum number of attendees" value={newEvent.capacity} onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const imageUrl = URL.createObjectURL(file); setNewEvent({ ...newEvent, image: imageUrl }); } }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button onClick={handleCreateEvent} className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold">Create Event</button>
                <button onClick={() => { setNewEvent({ title: '', category: '', date: '', startTime: '', endTime: '', location: '', description: '', capacity: '', image: '' }); setActiveTab('Upcoming Events'); }} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Event form */}
        {activeTab === 'Edit Event' && userRole === 'admin' && editingEvent && (
          <div className="bg-white rounded-xl border-2 border-blue-200 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h3>
            <p className="text-gray-600 text-sm mb-6">Update the event details below. Changes will be saved immediately.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input type="text" placeholder="Enter event title" value={editEvent.title} onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input type="date" value={editEvent.date} onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select value={editEvent.category} onChange={(e) => setEditEvent({ ...editEvent, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent">
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
                  <input type="time" value={editEvent.startTime} onChange={(e) => setEditEvent({ ...editEvent, startTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input type="time" value={editEvent.endTime} onChange={(e) => setEditEvent({ ...editEvent, endTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input type="text" placeholder="e.g., ADDU Campus or Virtual Event" value={editEvent.location} onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea rows={6} placeholder="Describe the event details..." value={editEvent.description} onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input type="number" placeholder="Maximum number of attendees" value={editEvent.capacity} onChange={(e) => setEditEvent({ ...editEvent, capacity: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const imageUrl = URL.createObjectURL(file); setEditEvent({ ...editEvent, image: imageUrl }); } }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button onClick={handleUpdateEvent} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">Update Event</button>
                <button onClick={handleCancelEdit} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Proposal form */}
        {activeTab === 'Submit Proposal' && userRole !== 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Submit Event Proposal</h3>
            <p className="text-gray-600 text-sm mb-6">Submit your event proposal for admin review. Once approved, your event will be published to the Upcoming Events section.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input type="text" placeholder="Enter event title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                  <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent">
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
                  <input type="time" value={newEvent.startTime} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                  <input type="time" value={newEvent.endTime} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input type="text" placeholder="e.g., ADDU Campus or Virtual Event" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea rows={6} placeholder="Describe the event details..." value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                <input type="number" placeholder="Maximum number of attendees" value={newEvent.capacity} onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const imageUrl = URL.createObjectURL(file); setNewEvent({ ...newEvent, image: imageUrl }); } }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (!newEvent.title || !newEvent.category || !newEvent.date || !newEvent.startTime || !newEvent.endTime || !newEvent.location || !newEvent.description) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    const proposedEvent: Event = {
                      id: Date.now().toString(),
                      title: newEvent.title,
                      category: newEvent.category,
                      date: newEvent.date,
                      time: `${newEvent.startTime} - ${newEvent.endTime}`,
                      location: newEvent.location,
                      participants: parseInt(newEvent.capacity) || 0,
                      description: newEvent.description,
                      image: newEvent.image || CareerFairBG,
                      tab: 'Alumni Proposals',
                      status: 'Pending',
                      postedBy: userName,
                      postedDate: 'Just now',
                      submittedBy: userName
                    };
                    setEvents(prev => [proposedEvent, ...prev]);
                    setNewEvent({ title: '', category: '', date: '', startTime: '', endTime: '', location: '', description: '', capacity: '', image: '' });
                    setActiveTab('My Submissions');
                    alert('Event proposal submitted successfully! The admin will review and approve your event before it goes live.');
                    triggerToast();
                  }}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  Submit Proposal
                </button>
                <button onClick={() => { setNewEvent({ title: '', category: '', date: '', startTime: '', endTime: '', location: '', description: '', capacity: '', image: '' }); setActiveTab('Upcoming Events'); }} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Detail View Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl">
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
                  <Calendar className="w-4 h-4 text-[#003087]" />
                  <span>{selectedEvent.date} • {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-[#003087]" />
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
            id: registrationEvent.id,
            title: registrationEvent.title,
            date: registrationEvent.date,
            time: registrationEvent.time,
            location: registrationEvent.location,
            image: registrationEvent.image,
            feeAmount: registrationEvent.feeAmount
          }}
          onClose={() => {
            setRegistrationEvent(null);
            // Refresh registrations after closing modal in case a new one was just submitted
            if (userRole !== 'admin') fetchMyRegistrations();
          }}
        />
      )}

      <Footer />
    </div>
  );
}