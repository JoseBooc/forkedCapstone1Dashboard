import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Award, User, FileText, Plus, X, CheckCircle, XCircle, Trash2, Edit } from 'lucide-react';
import { Footer } from '../Footer';
import { EventRegistrationModal, MyRegistrations, type MyRegistration } from '../EventRegistrationModal';

// Image imports
import CareerFairBG from '../../../assets/CareerFairBG.jpg';
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
  tab: 'Teaching Opportunities' | 'Seminars & Workshops';
  postedBy?: string;
  postedDate?: string;
  compensation?: string;
}

interface EventDetailData {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
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
  event_type: 'giveback' | 'event';
  category: string | null;
  registration_start_at: string | null;
  registration_end_at: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_by_email: string | null;
  posted_at: string | null;
  updated_at: string;
}

// All event/registration times in this feature are venue wall-clock time
// (there's one campus, one timezone — no instant-in-time conversion needed).
// The backend stores them naively but serializes with a trailing "Z", which
// would make `new Date(iso)` silently shift the displayed clock by the
// viewer's UTC offset. These helpers read/write the literal digits instead,
// so what an admin/alumni types is exactly what everyone sees, everywhere.
function parseVenueDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  const [, y, mo, d, h, mi, s] = match;
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), s ? Number(s) : 0);
}

function toDateTimeLocalValue(date: Date | null): string {
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatVenueDate(value: string | null | undefined): string {
  return parseVenueDateTime(value)?.toLocaleDateString() ?? '';
}

function formatVenueTime(value: string | null | undefined): string {
  return parseVenueDateTime(value)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '';
}

interface EventDisplayState {
  label: string;
  badgeClass: string;
  canRegister: boolean;
  registerLabel: string;
  countdownText: string;
  bucket: 'proposal' | 'upcoming' | 'past';
}

function getEventDisplayState(activity: GivebackActivity, now: Date): EventDisplayState {
  const scheduleStart = parseVenueDateTime(activity.schedule_start) ?? new Date(0);
  const scheduleEnd = parseVenueDateTime(activity.schedule_end) ?? new Date(0);
  const regStart = parseVenueDateTime(activity.registration_start_at);
  const regEnd = parseVenueDateTime(activity.registration_end_at);
  const daysBetween = (from: Date, to: Date) => Math.max(0, Math.ceil((to.getTime() - from.getTime()) / 86400000));

  if (activity.approval_status === 'pending') {
    return { label: 'Pending', badgeClass: 'bg-amber-500', canRegister: false, registerLabel: 'Pending Approval', countdownText: 'Registration ends in: ---', bucket: 'proposal' };
  }
  if (activity.approval_status === 'rejected') {
    return { label: 'Proposal Rejected', badgeClass: 'bg-red-600', canRegister: false, registerLabel: 'Rejected', countdownText: 'Registration ends in: ---', bucket: 'proposal' };
  }
  if (!activity.posted_at) {
    return { label: 'Event approved', badgeClass: 'bg-blue-600', canRegister: false, registerLabel: 'Post Event', countdownText: 'Registration ends in: ---', bucket: 'proposal' };
  }
  if (now > scheduleEnd) {
    return { label: 'Event concluded', badgeClass: 'bg-gray-500', canRegister: false, registerLabel: 'Concluded', countdownText: '', bucket: 'past' };
  }
  if (now >= scheduleStart && now <= scheduleEnd) {
    return { label: 'Ongoing', badgeClass: 'bg-orange-600', canRegister: false, registerLabel: 'Ongoing', countdownText: 'This event is ongoing', bucket: 'upcoming' };
  }
  if (regStart && now < regStart) {
    const days = daysBetween(now, regStart);
    return { label: 'Upcoming', badgeClass: 'bg-slate-500', canRegister: false, registerLabel: 'Registration Opens Soon', countdownText: `Registration opens in: ${days} day${days === 1 ? '' : 's'}`, bucket: 'upcoming' };
  }
  if (regEnd && now > regEnd) {
    return { label: 'Upcoming', badgeClass: 'bg-amber-700', canRegister: false, registerLabel: 'Registration Closed', countdownText: 'Registration is closed', bucket: 'upcoming' };
  }
  const deadline = regEnd || scheduleStart;
  const days = daysBetween(now, deadline);
  return { label: 'Upcoming', badgeClass: 'bg-green-600', canRegister: true, registerLabel: 'Register', countdownText: `Registration ends in: ${days} day${days === 1 ? '' : 's'}`, bucket: 'upcoming' };
}

const INITIAL_EVENTS: Event[] = [
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

function EventCard({ event, onView, onRegister }: any) {
  const isTeaching = event.tab === 'Teaching Opportunities';

  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left">
      <div className="relative h-56 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <span className="px-4 py-1.5 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg">
            {event.category}
          </span>
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
          {!isTeaching && (
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
            {event.participants} {isTeaching ? 'applications' : 'participants'}
          </div>
        </div>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-6 flex-1">
          {event.description}
        </p>

        {isTeaching && event.postedBy && (
          <div className="pt-4 border-t border-gray-100 mb-6 flex items-center gap-2 text-gray-400 text-[11px]">
            <User className="w-3 h-3" />
            <span>Posted by <span className="text-gray-600 font-medium">{event.postedBy}</span> • {event.postedDate}</span>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {event.tab === 'Seminars & Workshops' ? (
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
              className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-[#003087] text-white hover:bg-[#002566]"
            >
              Apply Now
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
  const schedule = `${formatVenueDate(activity.schedule_start)} • ${formatVenueTime(activity.schedule_start)} - ${formatVenueTime(activity.schedule_end)}`;

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

// EventActivityCard — real, DB-backed cards for Upcoming Events / Past Events /
// Alumni Proposals / My Submissions. `context` controls which action row renders.
function EventActivityCard({
  activity,
  userRole,
  context,
  displayState,
  isNew,
  onApprove,
  onReject,
  onPost,
  onEdit,
  onRemoveMine,
  onAdminRemove,
  onView,
  onRegister,
  onDismissNew,
}: any) {
  const isAdmin = userRole === 'admin';
  const schedule = `${formatVenueDate(activity.schedule_start)} • ${formatVenueTime(activity.schedule_start)} - ${formatVenueTime(activity.schedule_end)}`;

  const handleCardClick = () => {
    if (onDismissNew) onDismissNew(activity.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-[24px] overflow-hidden border shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left ${isNew ? 'event-glow border-[#C5A96A]' : 'border-gray-100'}`}
    >
      <div className="relative h-56 overflow-hidden">
        <img src={activity.image_url || CareerFairBG} alt={activity.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {isAdmin && context !== 'submissions' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onEdit(activity); }} className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onAdminRemove(activity.id); }} className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform active:scale-95">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          {!isAdmin && context === 'submissions' && activity.approval_status === 'rejected' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onEdit(activity); }} className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onRemoveMine(activity.id); }} className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform active:scale-95">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          {activity.category && (
            <span className="px-4 py-1.5 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg">
              {activity.category}
            </span>
          )}
          <span className={`px-4 py-1.5 text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg ${displayState.badgeClass}`}>
            {displayState.label}
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
          <div className="flex items-start gap-2 text-emerald-600 text-[13px] font-semibold">
            <Award className="w-4 h-4 mt-0.5" />
            {activity.fee_amount > 0 ? `₱${Number(activity.fee_amount).toLocaleString()} per person` : 'Free'}
          </div>
          {displayState.countdownText && (
            <div className="flex items-start gap-2 text-[#003087] text-[13px] font-semibold">
              <Clock className="w-4 h-4 mt-0.5" /> {displayState.countdownText}
            </div>
          )}
        </div>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4 flex-1">
          {activity.description}
        </p>

        {context === 'submissions' && activity.approval_status === 'rejected' && activity.rejection_reason && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-[12px]">
            <span className="font-bold">Admin feedback: </span>{activity.rejection_reason}
          </div>
        )}

        {(context === 'submissions' || context === 'proposals') && activity.created_by_name && (
          <div className="pt-4 border-t border-gray-100 mb-4 flex items-center gap-2 text-gray-400 text-[11px]">
            <User className="w-3 h-3" />
            <span>Submitted by <span className="text-gray-600 font-medium">{activity.created_by_name}</span></span>
          </div>
        )}

        <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          {context === 'proposals' && isAdmin && activity.approval_status === 'pending' ? (
            <>
              <button onClick={() => onApprove(activity.id)} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => onReject(activity)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </>
          ) : context === 'submissions' && activity.approval_status === 'approved' && !activity.posted_at ? (
            <button onClick={() => onPost(activity.id)} className="flex-1 py-2.5 bg-[#003087] text-white rounded-lg font-bold text-sm hover:bg-[#002566] transition-colors">
              Post Event
            </button>
          ) : context === 'past' ? (
            <button onClick={() => onView(activity)} className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
              View Details
            </button>
          ) : context === 'upcoming' ? (
            <>
              <button onClick={() => onView(activity)} className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                View Details
              </button>
              <button
                onClick={() => onRegister(activity)}
                disabled={!displayState.canRegister}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-[#003087] text-white hover:bg-[#002566] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {displayState.registerLabel}
              </button>
            </>
          ) : (
            <button onClick={() => onView(activity)} className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EventsView({ userRole, userName = 'Alumni User', userEmail = '' }: { userRole: string; userName?: string; userEmail?: string }) {
  const [activeTab, setActiveTab] = useState('Upcoming Events');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailData | null>(null);
  const [registrationEvent, setRegistrationEvent] = useState<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    feeAmount: number;
  } | null>(null);

  const [activities, setActivities] = useState<GivebackActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [editingActivity, setEditingActivity] = useState<GivebackActivity | null>(null);
  const [activityImage, setActivityImage] = useState<File | null>(null);
  const [activityImagePreview, setActivityImagePreview] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    venue: '',
    scheduleStart: '',
    scheduleEnd: '',
    participantLimit: '',
    feeAmount: '',
    status: 'upcoming',
    registrationOpen: true
  });

  // ── My Registrations state ──────────────────────────────
  const [myRegistrations, setMyRegistrations] = useState<MyRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const [events] = useState<Event[]>(() => {
    const saved = localStorage.getItem('addu_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // ── Upcoming Events / Alumni Proposals state (DB-backed) ─
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    scheduleStart: '',
    scheduleEnd: '',
    registrationStart: '',
    registrationEnd: '',
    capacity: '',
    feeAmount: '0',
  });
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [editingEventActivity, setEditingEventActivity] = useState<GivebackActivity | null>(null);
  const [resubmitOnSave, setResubmitOnSave] = useState(false);

  const [rejectingActivity, setRejectingActivity] = useState<GivebackActivity | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');

  const [dismissedNewEventIds, setDismissedNewEventIds] = useState<number[]>(() => {
    if (!userEmail) return [];
    const saved = localStorage.getItem(`dismissedNewEventIds:${userEmail}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [dismissedConcludedEventIds, setDismissedConcludedEventIds] = useState<number[]>(() => {
    if (!userEmail) return [];
    const saved = localStorage.getItem(`dismissedConcludedEventIds:${userEmail}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [lastSeenMySubmissionsAt, setLastSeenMySubmissionsAt] = useState<number>(() => {
    if (!userEmail) return 0;
    const saved = localStorage.getItem(`lastSeenMySubmissionsAt:${userEmail}`);
    return saved ? Number(saved) : 0;
  });
  // Ticks every minute so events cross from Upcoming into Past on their own,
  // without needing a click/refetch to force a re-render.
  const [nowTick, setNowTick] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNowTick(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchActivities();
    if (userRole !== 'admin') fetchMyRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // ── Mark "My Submissions" as seen once the alumni actually
  //    views it, using the server's own updated_at as the cutoff
  //    so approve/reject notifications clear reliably. ────────
  useEffect(() => {
    if (activeTab !== 'My Submissions' || userRole === 'admin' || !userEmail) return;
    const mine = activities.filter((a) => a.event_type === 'event' && a.submitted_by_email === userEmail);
    if (mine.length === 0) return;
    const latest = Math.max(...mine.map((a) => new Date(a.updated_at).getTime()));
    if (latest > lastSeenMySubmissionsAt) {
      setLastSeenMySubmissionsAt(latest);
      localStorage.setItem(`lastSeenMySubmissionsAt:${userEmail}`, String(latest));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activities, userRole, userEmail]);

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
      const response = await fetch('http://localhost:8000/api/giveback/activities?include_archived=true');
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
        `http://localhost:8000/api/giveback/registrations?email=${encodeURIComponent(userEmail)}`
      );
      if (response.ok) {
        const data = await response.json();
        setMyRegistrations(
          data.map((r: any) => ({
            id: r.id,
            eventId: r.activity_id,
            title: r.activity?.title ?? 'Event',
            date: formatVenueDate(r.activity?.schedule_start),
            time: `${formatVenueTime(r.activity?.schedule_start)} - ${formatVenueTime(r.activity?.schedule_end)}`,
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
      scheduleStart: '',
      scheduleEnd: '',
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
    if (!activityForm.title || !activityForm.description || !activityForm.venue || !activityForm.scheduleStart || !activityForm.scheduleEnd) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', activityForm.title);
    formData.append('description', activityForm.description);
    formData.append('venue', activityForm.venue);
    formData.append('schedule_start', activityForm.scheduleStart);
    formData.append('schedule_end', activityForm.scheduleEnd);
    formData.append('participant_limit', activityForm.participantLimit || '');
    formData.append('fee_amount', activityForm.feeAmount || '0');
    formData.append('status', activityForm.status);
    formData.append('registration_open', activityForm.registrationOpen ? '1' : '0');
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
    setActivityForm({
      title: activity.title,
      description: activity.description,
      venue: activity.venue,
      scheduleStart: toDateTimeLocalValue(parseVenueDateTime(activity.schedule_start)),
      scheduleEnd: toDateTimeLocalValue(parseVenueDateTime(activity.schedule_end)),
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
    if (!activityForm.title || !activityForm.description || !activityForm.venue || !activityForm.scheduleStart || !activityForm.scheduleEnd) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', activityForm.title);
    formData.append('description', activityForm.description);
    formData.append('venue', activityForm.venue);
    formData.append('schedule_start', activityForm.scheduleStart);
    formData.append('schedule_end', activityForm.scheduleEnd);
    formData.append('participant_limit', activityForm.participantLimit || '');
    formData.append('fee_amount', activityForm.feeAmount || '0');
    formData.append('status', activityForm.status);
    formData.append('registration_open', activityForm.registrationOpen ? '1' : '0');
    formData.append('created_by_name', editingActivity.created_by_name || userName);
    if (activityImage) formData.append('image', activityImage);
    // PHP never parses multipart bodies on a literal PUT verb — spoof it via POST.
    formData.append('_method', 'PUT');

    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${editingActivity.id}`, {
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

  const openRegistrationModalFromActivity = (activity: GivebackActivity, fallbackImage?: string) => {
    setRegistrationEvent({
      id: activity.id,
      title: activity.title,
      date: formatVenueDate(activity.schedule_start),
      time: `${formatVenueTime(activity.schedule_start)} - ${formatVenueTime(activity.schedule_end)}`,
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

  // ── Upcoming Events / Alumni Proposals handlers (real API) ─
  const resetEventForm = () => {
    setNewEventForm({
      title: '', description: '', location: '', category: '',
      scheduleStart: '', scheduleEnd: '',
      registrationStart: '', registrationEnd: '',
      capacity: '', feeAmount: '0',
    });
    setEventImage(null);
    setEventImagePreview(null);
    setEditingEventActivity(null);
    setResubmitOnSave(false);
  };

  const buildEventFormData = () => {
    const formData = new FormData();
    formData.append('title', newEventForm.title);
    formData.append('description', newEventForm.description);
    formData.append('venue', newEventForm.location);
    formData.append('schedule_start', newEventForm.scheduleStart);
    formData.append('schedule_end', newEventForm.scheduleEnd);
    formData.append('registration_open', '1');
    formData.append('participant_limit', newEventForm.capacity || '');
    formData.append('fee_amount', newEventForm.feeAmount || '0');
    formData.append('status', 'upcoming');
    formData.append('event_type', 'event');
    formData.append('category', newEventForm.category);
    if (newEventForm.registrationStart) {
      formData.append('registration_start_at', newEventForm.registrationStart);
    }
    if (newEventForm.registrationEnd) {
      formData.append('registration_end_at', newEventForm.registrationEnd);
    }
    formData.append('created_by_name', userName);
    if (eventImage) formData.append('image', eventImage);
    return formData;
  };

  const handleCreateEventActivity = async () => {
    if (!newEventForm.title || !newEventForm.description || !newEventForm.location || !newEventForm.category || !newEventForm.scheduleStart || !newEventForm.scheduleEnd) {
      alert('Please fill in all required fields');
      return;
    }
    const formData = buildEventFormData();
    if (userRole !== 'admin') {
      formData.append('is_proposal', 'true');
      formData.append('submitted_by_email', userEmail);
    }
    try {
      const response = await fetch('http://localhost:8000/api/giveback/activities', { method: 'POST', body: formData });
      if (response.ok) {
        await fetchActivities();
        resetEventForm();
        setActiveTab(userRole === 'admin' ? 'Upcoming Events' : 'My Submissions');
        if (userRole !== 'admin') alert('Event proposal submitted successfully! The admin will review it before it can go live.');
        triggerToast();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to submit event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to submit event');
    }
  };

  const handleEditEventActivity = (activity: GivebackActivity) => {
    setEditingEventActivity(activity);
    setNewEventForm({
      title: activity.title,
      description: activity.description,
      location: activity.venue,
      category: activity.category || '',
      scheduleStart: toDateTimeLocalValue(parseVenueDateTime(activity.schedule_start)),
      scheduleEnd: toDateTimeLocalValue(parseVenueDateTime(activity.schedule_end)),
      registrationStart: toDateTimeLocalValue(parseVenueDateTime(activity.registration_start_at)),
      registrationEnd: toDateTimeLocalValue(parseVenueDateTime(activity.registration_end_at)),
      capacity: activity.participant_limit ? String(activity.participant_limit) : '',
      feeAmount: String(activity.fee_amount || 0),
    });
    setEventImagePreview(activity.image_url || null);
    const isRejectedOwnProposal = userRole !== 'admin' && activity.approval_status === 'rejected';
    setResubmitOnSave(isRejectedOwnProposal);
    setActiveTab(isRejectedOwnProposal ? 'Edit Proposal' : 'Edit Event');
  };

  const handleUpdateEventActivity = async () => {
    if (!editingEventActivity) return;
    if (!newEventForm.title || !newEventForm.description || !newEventForm.location || !newEventForm.category || !newEventForm.scheduleStart || !newEventForm.scheduleEnd) {
      alert('Please fill in all required fields');
      return;
    }
    const formData = buildEventFormData();
    formData.append('submitted_by_email', editingEventActivity.submitted_by_email || (userRole !== 'admin' ? userEmail : ''));
    if (resubmitOnSave) formData.append('resubmit', 'true');
    // PHP never parses multipart bodies on a literal PUT verb — spoof it via POST.
    formData.append('_method', 'PUT');
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${editingEventActivity.id}`, { method: 'POST', body: formData });
      if (response.ok) {
        await fetchActivities();
        resetEventForm();
        setActiveTab(userRole === 'admin' ? 'Upcoming Events' : 'My Submissions');
        triggerToast();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    }
  };

  const handleCancelEventForm = () => {
    resetEventForm();
    setActiveTab(userRole === 'admin' ? 'Upcoming Events' : 'My Submissions');
  };

  const handleApproveProposal = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}/approve`, { method: 'PATCH' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to approve proposal');
      }
    } catch (error) {
      console.error('Error approving proposal:', error);
      alert('Failed to approve proposal');
    }
  };

  const handleOpenRejectModal = (activity: GivebackActivity) => {
    setRejectingActivity(activity);
    setRejectReasonText('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingActivity) return;
    if (!rejectReasonText.trim()) {
      alert('Please provide a reason for rejecting this proposal.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${rejectingActivity.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ reason: rejectReasonText.trim() }),
      });
      if (response.ok) {
        await fetchActivities();
        setRejectingActivity(null);
        setRejectReasonText('');
        triggerToast();
      } else {
        alert('Failed to reject proposal');
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      alert('Failed to reject proposal');
    }
  };

  const handlePostEvent = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}/post`, { method: 'PATCH' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to post event');
      }
    } catch (error) {
      console.error('Error posting event:', error);
      alert('Failed to post event');
    }
  };

  // Admin-side removal never hard-deletes an alumni-owned row — it archives
  // it out of the admin's own view so the alumni's copy (My Submissions,
  // with their own Edit/Remove options) is never affected.
  const handleArchiveEventActivity = async (id: number) => {
    if (!window.confirm('Remove this from your view? The alumni submitter will still see their own copy.')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}/archive`, { method: 'PATCH' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to remove event');
      }
    } catch (error) {
      console.error('Error archiving event:', error);
      alert('Failed to remove event');
    }
  };

  const handleRemoveMyProposal = async (id: number) => {
    if (!window.confirm('Permanently remove this proposal? This cannot be undone.')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to remove proposal');
      }
    } catch (error) {
      console.error('Error removing proposal:', error);
      alert('Failed to remove proposal');
    }
  };

  const handleDismissNewEvent = (id: number) => {
    setDismissedNewEventIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      if (userEmail) localStorage.setItem(`dismissedNewEventIds:${userEmail}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDismissConcludedEvent = (id: number) => {
    setDismissedConcludedEventIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      if (userEmail) localStorage.setItem(`dismissedConcludedEventIds:${userEmail}`, JSON.stringify(updated));
      return updated;
    });
  };

  const openActivityDetails = (activity: GivebackActivity) => {
    setSelectedEvent({
      title: activity.title,
      category: activity.category || 'Event',
      date: formatVenueDate(activity.schedule_start),
      time: `${formatVenueTime(activity.schedule_start)} - ${formatVenueTime(activity.schedule_end)}`,
      location: activity.venue,
      description: activity.description,
      image: activity.image_url || CareerFairBG,
    });
  };

  const now = nowTick;

  const upcomingEventActivities = activities
    .filter((a) =>
      a.event_type === 'event' && a.approval_status === 'approved' && a.posted_at && !a.is_archived &&
      (parseVenueDateTime(a.schedule_end) ?? new Date(0)) >= now
    )
    .sort((a, b) => new Date(b.posted_at as string).getTime() - new Date(a.posted_at as string).getTime());

  const pastEventActivities = activities
    .filter((a) =>
      a.event_type === 'event' && a.approval_status === 'approved' && a.posted_at && !a.is_archived &&
      (parseVenueDateTime(a.schedule_end) ?? new Date(0)) < now
    )
    .sort((a, b) => (parseVenueDateTime(b.schedule_end)?.getTime() ?? 0) - (parseVenueDateTime(a.schedule_end)?.getTime() ?? 0));

  const alumniProposalActivities = activities.filter((a) =>
    a.event_type === 'event' && a.submitted_by_email && a.approval_status !== 'approved' && !a.is_archived
  );

  const mySubmissionActivities = activities.filter((a) =>
    a.event_type === 'event' && a.submitted_by_email === userEmail && !a.posted_at
  );

  const pendingProposalCount = alumniProposalActivities.filter((a) => a.approval_status === 'pending').length;

  const hasUnseenMySubmissions = mySubmissionActivities.some(
    (a) => new Date(a.updated_at).getTime() > lastSeenMySubmissionsAt
  );

  const hasNewUpcomingEvent = upcomingEventActivities.some((a) => !dismissedNewEventIds.includes(a.id));
  const hasNewPastEvent = pastEventActivities.some((a) => !dismissedConcludedEventIds.includes(a.id));

  const baseTabs = ['GiveBack Activities', 'Upcoming Events', 'Past Events', 'Teaching Opportunities', 'Seminars & Workshops'];
  let tabs = userRole === 'admin'
    ? [...baseTabs, 'Alumni Proposals', 'Create Event', 'Create GiveBack Activity']
    : [...baseTabs, 'My Submissions', 'My Registrations']; // ← My Registrations added here

  if (editingEventActivity && (activeTab === 'Edit Event' || activeTab === 'Edit Proposal')) tabs = [...tabs, activeTab];
  if (editingActivity && activeTab === 'Edit GiveBack Activity') tabs = [...tabs, 'Edit GiveBack Activity'];

  const filteredEvents = events.filter(event => event.tab === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <style>{`
        @keyframes eventGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(197,169,106,0.6), 0 0 20px 2px rgba(197,169,106,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(197,169,106,0.35), 0 0 32px 6px rgba(197,169,106,0.55); }
        }
        .event-glow { animation: eventGlow 1.8s ease-in-out infinite; }
      `}</style>
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
              <span className="inline-flex items-center gap-1.5">
                {tab}
                {tab === 'Alumni Proposals' && pendingProposalCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 bg-red-600 text-white text-[10px] rounded-full font-bold">
                    {pendingProposalCount}
                  </span>
                )}
                {tab === 'My Submissions' && hasUnseenMySubmissions && (
                  <span className="w-2 h-2 bg-red-600 rounded-full" />
                )}
                {tab === 'Upcoming Events' && hasNewUpcomingEvent && (
                  <span className="w-2 h-2 bg-red-600 rounded-full" />
                )}
                {tab === 'Past Events' && hasNewPastEvent && (
                  <span className="w-2 h-2 bg-red-600 rounded-full" />
                )}
              </span>
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
                        date: formatVenueDate(selected.schedule_start),
                        time: `${formatVenueTime(selected.schedule_start)} - ${formatVenueTime(selected.schedule_end)}`,
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

        {/* Upcoming Events grid (real, DB-backed) */}
        {activeTab === 'Upcoming Events' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading events...</div>
            ) : upcomingEventActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No upcoming events yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEventActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="upcoming"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={!dismissedNewEventIds.includes(activity.id)}
                    onEdit={handleEditEventActivity}
                    onAdminRemove={handleArchiveEventActivity}
                    onView={openActivityDetails}
                    onRegister={openRegistrationModalFromActivity}
                    onDismissNew={handleDismissNewEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Past Events grid (real, DB-backed) */}
        {activeTab === 'Past Events' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading events...</div>
            ) : pastEventActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No past events yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEventActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="past"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={false}
                    onEdit={handleEditEventActivity}
                    onAdminRemove={handleArchiveEventActivity}
                    onView={openActivityDetails}
                    onDismissNew={handleDismissConcludedEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alumni Proposals grid (admin review queue) */}
        {activeTab === 'Alumni Proposals' && userRole === 'admin' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading proposals...</div>
            ) : alumniProposalActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No alumni proposals right now.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {alumniProposalActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="proposals"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={false}
                    onApprove={handleApproveProposal}
                    onReject={handleOpenRejectModal}
                    onEdit={handleEditEventActivity}
                    onAdminRemove={handleArchiveEventActivity}
                    onView={openActivityDetails}
                    onDismissNew={handleDismissNewEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Submissions grid (alumni's own proposals) */}
        {activeTab === 'My Submissions' && userRole !== 'admin' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading your submissions...</div>
            ) : mySubmissionActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">You haven't submitted any event proposals yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mySubmissionActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="submissions"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={false}
                    onPost={handlePostEvent}
                    onEdit={handleEditEventActivity}
                    onRemoveMine={handleRemoveMyProposal}
                    onView={openActivityDetails}
                    onDismissNew={handleDismissNewEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Teaching Opportunities / Seminars & Workshops — static demo content, unchanged */}
        {(activeTab === 'Teaching Opportunities' || activeTab === 'Seminars & Workshops') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onView={setSelectedEvent}
                onRegister={handleLegacyEventRegister}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Starts *</label>
                  <input type="datetime-local" value={activityForm.scheduleStart} onChange={(e) => setActivityForm({ ...activityForm, scheduleStart: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ends *</label>
                  <input type="datetime-local" value={activityForm.scheduleEnd} onChange={(e) => setActivityForm({ ...activityForm, scheduleEnd: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Venue *</label>
                  <input type="text" placeholder="Enter venue or location" value={activityForm.venue} onChange={(e) => setActivityForm({ ...activityForm, venue: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Starts *</label>
                  <input type="datetime-local" value={activityForm.scheduleStart} onChange={(e) => setActivityForm({ ...activityForm, scheduleStart: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ends *</label>
                  <input type="datetime-local" value={activityForm.scheduleEnd} onChange={(e) => setActivityForm({ ...activityForm, scheduleEnd: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Venue *</label>
                  <input type="text" placeholder="Enter venue or location" value={activityForm.venue} onChange={(e) => setActivityForm({ ...activityForm, venue: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
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

        {/* Create Event / Edit Event / Submit Proposal / Edit Proposal — one shared form */}
        {(activeTab === 'Create Event' || activeTab === 'Edit Event' || activeTab === 'Submit Proposal' || activeTab === 'Edit Proposal') && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingEventActivity ? (userRole === 'admin' ? 'Edit Event' : 'Edit Proposal') : (userRole === 'admin' ? 'Create New Event' : 'Submit Event Proposal')}
            </h3>
            {userRole !== 'admin' && !editingEventActivity && (
              <p className="text-gray-600 text-sm mb-6">Submit your event proposal for admin review. Once approved, you'll be able to post it live to the Upcoming Events section.</p>
            )}
            {userRole !== 'admin' && editingEventActivity && (
              <p className="text-gray-600 text-sm mb-6">Update your proposal and resubmit it for admin review.</p>
            )}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input type="text" placeholder="Enter event title" value={newEventForm.title} onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select value={newEventForm.category} onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent">
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input type="text" placeholder="e.g., ADDU Campus or Virtual Event" value={newEventForm.location} onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Event Schedule</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Starts *</label>
                    <input type="datetime-local" value={newEventForm.scheduleStart} onChange={(e) => setNewEventForm({ ...newEventForm, scheduleStart: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Ends *</label>
                    <input type="datetime-local" value={newEventForm.scheduleEnd} onChange={(e) => setNewEventForm({ ...newEventForm, scheduleEnd: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea rows={6} placeholder="Describe the event details..." value={newEventForm.description} onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity</label>
                  <input type="number" placeholder="Maximum number of attendees" value={newEventForm.capacity} onChange={(e) => setNewEventForm({ ...newEventForm, capacity: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Person (₱)</label>
                  <input type="number" min="0" placeholder="0 for free" value={newEventForm.feeAmount} onChange={(e) => setNewEventForm({ ...newEventForm, feeAmount: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Registration Window</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Registration Starts</label>
                    <input type="datetime-local" value={newEventForm.registrationStart} onChange={(e) => setNewEventForm({ ...newEventForm, registrationStart: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Registration Ends</label>
                    <input type="datetime-local" value={newEventForm.registrationEnd} onChange={(e) => setNewEventForm({ ...newEventForm, registrationEnd: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setEventImage(file); setEventImagePreview(URL.createObjectURL(file)); } }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                {eventImagePreview && <img src={eventImagePreview} alt="Preview" className="mt-3 h-32 rounded-lg object-cover" />}
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={editingEventActivity ? handleUpdateEventActivity : handleCreateEventActivity}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  {editingEventActivity ? (userRole === 'admin' ? 'Update Event' : 'Resubmit Proposal') : (userRole === 'admin' ? 'Create Event' : 'Submit Proposal')}
                </button>
                <button onClick={handleCancelEventForm} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reject Proposal Modal */}
      {rejectingActivity && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Reject Proposal</h3>
              <button onClick={() => { setRejectingActivity(null); setRejectReasonText(''); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Let the submitter of <span className="font-semibold">{rejectingActivity.title}</span> know why this proposal can't push through.
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Rejection *</label>
                <textarea
                  rows={4}
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  placeholder="Explain why this event proposal is being rejected..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setRejectingActivity(null); setRejectReasonText(''); }} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirmReject} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

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