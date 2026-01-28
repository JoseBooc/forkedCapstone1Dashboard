import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Award, User, FileText } from 'lucide-react';
import { Footer } from '../Footer';

// Upcoming Events Images
import EngageWebDevBG from '../../../assets/EngageWebDevBG.jpg';
import StocksBG from '../../../assets/StocksBG.jpg';
import Swim101 from '../../../assets/Swim101.jpg';
import DigitalMarket from '../../../assets/DigitalMarket.jpg';
import DesignThinkBG from '../../../assets/DesignThinkBG.jpg';
import LeadershipBG from '../../../assets/LeadershipBG.jpg';

// Past Events Images
import ChristmasReunion from '../../../assets/ChristmasReunion.jpg';
import DataSciBG from '../../../assets/DataSciBG.jpg';
import CareerFairBG from '../../../assets/CareerFairBG.jpg';
import GolfTournaBG from '../../../assets/GolfTournaBG.jpg';
import LeaderSummitBG from '../../../assets/LeaderSummitBG.jpg';

// Teaching Images
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

// Seminars & Workshops Images
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
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  description: string;
  image: string;
  tab: 'Upcoming Events' | 'Past Events' | 'Teaching Opportunities' | 'Seminars & Workshops';
  postedBy?: string;
  postedDate?: string;
  compensation?: string;
}

function EventCard({ event }: { event: Event }) {
  const isPast = event.tab === 'Past Events';
  const isTeaching = event.tab === 'Teaching Opportunities';

  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left">
      <div className="relative h-56 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4">
          <span className="px-4 py-1.5 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
        {isTeaching && <p className="text-[#003087] text-[11px] font-bold uppercase mb-4">{event.location}</p>}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" /> {event.date}
          </div>
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5" /> {event.time}
          </div>
          {!isTeaching && (
            <div className="flex items-start gap-2 text-gray-500 text-[13px]">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> {event.location}
            </div>
          )}
          {isTeaching && (
            <div className="flex items-start gap-2 text-[#22C55E] text-[13px] font-semibold">
              <Award className="w-4 h-4 mt-0.5" /> {event.compensation}
            </div>
          )}
          <div className="flex items-start gap-2 text-[#003087] text-[13px] font-semibold">
            <Users className="w-4 h-4 mt-0.5" /> 
            {event.participants} {isPast ? 'attended' : isTeaching ? 'applications' : 'participants'}
          </div>
        </div>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-6 flex-1 whitespace-pre-line">
          {event.description}
        </p>

        {isTeaching && (
          <div className="pt-4 border-t border-gray-100 mb-6 flex items-center gap-2 text-gray-400 text-[11px]">
            <User className="w-3 h-3" />
            <span>Posted by <span className="text-gray-600 font-medium">{event.postedBy}</span> • {event.postedDate}</span>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <button className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors ${
            isPast ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#003087] text-white hover:bg-[#002566]'
          }`}>
            {isPast ? 'View Gallery' : isTeaching ? 'Apply Now' : 'Register Now'}
          </button>
          <button className="px-3 py-2.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function EventsView({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState('Upcoming Events');
  const tabs = ['Upcoming Events', 'Past Events', 'Teaching Opportunities', 'Seminars & Workshops'];

  const allEvents: Event[] = [
    // --- UPCOMING EVENTS ---
    { title: "Web Development For Beginners", category: "Computer Science", date: "January 26, 2026", time: "6:00 PM - 8:00 PM", location: "Online", participants: 245, description: "Learn the fundamentals of web development in this beginner-friendly workshop.", image: EngageWebDevBG, tab: 'Upcoming Events' },
    { title: "Stocks, Funds & Investment", category: "Finance", date: "January 20, 2026", time: "Tue, Thu & Fri, 6:00 PM - 7:00 PM", location: "Online", participants: 178, description: "10 sessions comprehensive course on stocks, funds, and investment strategies.", image: StocksBG, tab: 'Upcoming Events' },
    { title: "Swimming 101 for Adults", category: "Sports & Wellness", date: "January 20, 2026", time: "Tue & Thu 5:00 PM, Sat 1:30 PM", location: "ADDU Aquatic Center", participants: 89, description: "10 sessions comprehensive swimming program for adults. Learn basic techniques.", image: Swim101, tab: 'Upcoming Events' },
    { title: "Fundamentals of Digital Marketing", category: "Marketing", date: "January 21, 2026", time: "Mon, Wed & Fri, 6:00 PM - 8:00 PM", location: "Online", participants: 156, description: "4 sessions course covering the fundamentals of digital marketing.", image: DigitalMarket, tab: 'Upcoming Events' },
    { title: "Design Thinking Workshop", category: "Innovation & Design", date: "January 24, 2026", time: "Saturday, 9:00 AM - 11:00 AM", location: "Online", participants: 198, description: "8 sessions workshop on design thinking - human-centered innovation.", image: DesignThinkBG, tab: 'Upcoming Events' },
    { title: "Executive Leadership Training", category: "Leadership", date: "January 26, 2026", time: "Mon, Wed & Thu, 6:00 PM - 8:00 PM", location: "Online", participants: 132, description: "12 sessions comprehensive leadership training program.", image: LeadershipBG, tab: 'Upcoming Events' },

    // --- PAST EVENTS ---
    { title: "Christmas Alumni Reunion 2025", category: "Social Event", date: "December 20, 2025", time: "6:00 PM - 10:00 PM", location: "ADDU Gymnasium", participants: 423, description: "A festive celebration bringing together alumni for fellowship, dinner, and holiday cheer.", image: ChristmasReunion, tab: 'Past Events' },
    { title: "Data Science & Analytics Workshop", category: "Professional Dev", date: "November 15, 2025", time: "1:00 PM - 6:00 PM", location: "ADDU Computer Lab", participants: 87, description: "Hands-on workshop covering Python, data visualization, and machine learning basics.", image: DataSciBG, tab: 'Past Events' },
    { title: "Alumni Career Fair 2025", category: "Career", date: "October 28, 2025", time: "9:00 AM - 5:00 PM", location: "ADDU Covered Court", participants: 542, description: "Major job fair featuring 50+ companies actively recruiting ADDU alumni across all levels.", image: CareerFairBG, tab: 'Past Events' },
    { title: "Alumni Golf Tournament", category: "Sports", date: "September 22, 2025", time: "6:00 AM - 2:00 PM", location: "Apo Golf & Country Club", participants: 76, description: "Annual charity golf tournament with proceeds supporting ADDU scholarship programs", image: GolfTournaBG, tab: 'Past Events' },
    { title: "Leadership Summit: Future of Work", category: "Professional Dev", date: "July 20, 2025", time: "2:00 PM - 7:00 PM", location: "Virtual Event", participants: 234, description: "Panel discussions on remote work, digital transformation, and emerging career trends.", image: LeaderSummitBG, tab: 'Past Events' },

    // --- TEACHING OPPORTUNITIES ---
    { title: "Guest Lecturer - Digital Marketing", category: "Business", date: "1 Semester", time: "Tue & Thu preferred", location: "School of Business and Governance", participants: 8, compensation: "Honorarium provided", description: "Share your expertise in digital marketing with our business students.", image: GuestLectureBG, tab: 'Teaching Opportunities', postedBy: "Dr. Antonio Reyes", postedDate: "5 days ago" },
    { title: "Workshop Facilitator - Python", category: "Computer Science", date: "2 Days", time: "March 8-9, 2026", location: "Department of Computer Science", participants: 15, compensation: "Php 15,000", description: "Conduct hands-on Python workshop for intermediate students.", image: WorkshopBG, tab: 'Teaching Opportunities', postedBy: "Prof. Maria Santos", postedDate: "2 weeks ago" },
    { title: "Mentor - Engineering Capstone", category: "Engineering", date: "1 Academic Year", time: "4 hours/month", location: "College of Engineering", participants: 12, compensation: "Certificate + Recognition", description: "Guide senior engineering students through their capstone projects.", image: MentorCapBG, tab: 'Teaching Opportunities', postedBy: "Engr. Robert Tan", postedDate: "1 week ago" },
    { title: "Adjunct Professor - Finance", category: "Finance", date: "1 Semester", time: "MWF 2:00 PM - 3:30 PM", location: "School of Business and Governance", participants: 6, compensation: "Competitive academic rate", description: "Teach undergraduate financial management course.", image: FinancialManageBG, tab: 'Teaching Opportunities', postedBy: "Dean Patricia Cruz", postedDate: "3 days ago" },
    { title: "Guest Speaker - Nursing", category: "Nursing", date: "2-hour Session", time: "Feb 25, 2026 at 3:00 PM", location: "School of Nursing", participants: 4, compensation: "Honorarium + Travel", description: "Share insights on healthcare administration with nursing students.", image: HealthCareBG, tab: 'Teaching Opportunities', postedBy: "Dr. Elizabeth Gomez", postedDate: "1 week ago" },
    { title: "Workshop Leader - UX/UI", category: "IT", date: "5 Days Intensive", time: "April 14-18, 9:00 AM", location: "Dept. of Information Technology", participants: 11, compensation: "Php 50,000", description: "Lead intensive UX/UI bootcamp covering research and prototyping.", image: WorkshopLeadBG, tab: 'Teaching Opportunities', postedBy: "Prof. Jennifer Lim", postedDate: "4 days ago" },
    { title: "Career Advisor - Law", category: "Law", date: "Ongoing", time: "2 hours/week", location: "College of Law", participants: 7, compensation: "Volunteer (Recognition)", description: "Provide career guidance to law students preparing for bar exams.", image: CareerAdviceBG, tab: 'Teaching Opportunities', postedBy: "Atty. Marco Gonzales", postedDate: "2 weeks ago" },
    { title: "Lab Instructor - Data Science", category: "Mathematics", date: "1 Semester", time: "Saturdays 10:00 AM", location: "Department of Mathematics", participants: 9, compensation: "Standard adjunct rate", description: "Supervise data science lab sessions using R and Python.", image: LabInstructBG, tab: 'Teaching Opportunities', postedBy: "Dr. Thomas Valdez", postedDate: "6 days ago" },
    { title: "Skills Workshop - Speaking", category: "Communication", date: "3-hour Workshop", time: "March 12, 2026", location: "Department of Communication", participants: 13, compensation: "Php 8,000", description: "Teach students effective public speaking and presentation techniques.", image: SkillWorkshopBG, tab: 'Teaching Opportunities', postedBy: "Prof. Amanda Reyes", postedDate: "1 week ago" },
    { title: "Practicum Supervisor", category: "Accounting", date: "6 months", time: "Monthly check-ins", location: "School of Business", participants: 5, compensation: "Certificate + Recognition", description: "Supervise accounting students during their industry practicum.", image: AccountingBG, tab: 'Teaching Opportunities', postedBy: "CPA Catherine Velasco", postedDate: "3 days ago" },

    // --- SEMINARS & WORKSHOPS ---
    { title: "Leadership in the Digital Age", category: "Professional Dev", date: "March 15, 2026", time: "9:00 AM - 4:00 PM", location: "ADDU Finster Hall", participants: 120, description: "Leading teams in a digital-first environment with focus on remote management.", image: LeaderDigitalBG, tab: 'Seminars & Workshops' },
    { title: "Advanced Financial Analytics", category: "Finance", date: "April 05, 2026", time: "1:00 PM - 5:00 PM", location: "Virtual / Zoom", participants: 85, description: "Master financial modeling and data analytics for modern investment strategies.", image: AdvFinanceBG, tab: 'Seminars & Workshops' },
    { title: "AI and Machine Learning", category: "Technology", date: "April 12, 2026", time: "10:00 AM - 12:00 PM", location: "ADDU Community Center", participants: 45, description: "Strategic overview of AI capabilities for business implementations.", image: AIandMachineBG, tab: 'Seminars & Workshops' },
    { title: "Agile Project Management", category: "Management", date: "May 20, 2026", time: "9:00 AM - 3:00 PM", location: "Online", participants: 200, description: "Certification-ready workshop for Agile and Scrum methodologies.", image: ProjectManagementBG, tab: 'Seminars & Workshops' },
    { title: "Legal Issues in E-Commerce", category: "Law", date: "June 10, 2026", time: "2:00 PM - 5:00 PM", location: "ADDU College of Law", participants: 60, description: "Deep dive into digital trade, consumer rights, and data privacy frameworks.", image: LegalLawBG, tab: 'Seminars & Workshops' },
    { title: "Entrepreneurship Mastery", category: "Business", date: "June 15, 2026", time: "9:00 AM - 5:00 PM", location: "Online", participants: 110, description: "Scale your startup with expert insights on operations and funding.", image: EntrepBG, tab: 'Seminars & Workshops' },
    { title: "Workplace Mental Health", category: "Wellness", date: "July 02, 2026", time: "1:30 PM - 4:30 PM", location: "Virtual", participants: 150, description: "Promoting psychological safety and mental well-being in corporate settings.", image: MentalHealthBG, tab: 'Seminars & Workshops' },
    { title: "Modern Content Marketing", category: "Marketing", date: "July 20, 2026", time: "10:00 AM - 3:00 PM", location: "ADDU Arrupe Hall", participants: 95, description: "Storytelling and content strategies for the social media era.", image: MarketingBG, tab: 'Seminars & Workshops' },
    { title: "Cybersecurity Essentials", category: "IT Security", date: "August 05, 2026", time: "9:00 AM - 12:00 PM", location: "Online", participants: 180, description: "Protecting business data from modern threats and social engineering.", image: CybersecBG, tab: 'Seminars & Workshops' },
    { title: "Sustainable Business", category: "Innovation", date: "August 18, 2026", time: "1:00 PM - 4:00 PM", location: "ADDU Community Center", participants: 70, description: "Integrating ESG principles into your business strategy and operations.", image: SustainBG, tab: 'Seminars & Workshops' },
    { title: "Excel for Business Pros", category: "Data", date: "September 03, 2026", time: "9:00 AM - 12:00 PM", location: "Online", participants: 300, description: "Advanced functions, pivot tables, and data visualization techniques.", image: ExcelBG, tab: 'Seminars & Workshops' },
    { title: "Pharmacy Trends 2026", category: "Healthcare", date: "September 15, 2026", time: "2:00 PM - 5:00 PM", location: "ADDU School of Nursing", participants: 55, description: "Updating clinical knowledge on emerging pharmaceuticals and patient care.", image: PharmaBG, tab: 'Seminars & Workshops' }
  ];

  const filteredEvents = allEvents.filter(event => event.tab === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 p-8 space-y-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900">Engagement</h1>
          <p className="text-gray-500 text-sm mt-1">Discover events, teaching opportunities, and educational seminars</p>
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
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#003087]" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Teaching Opportunities' && (
          <div className="bg-[#003087] rounded-[24px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-left">
            <div>
              <h2 className="text-2xl font-bold mb-2">Share Your Expertise with Future Ateneans</h2>
              <p className="text-blue-100 text-sm max-w-2xl">
                Give back to your alma mater by teaching, mentoring, or facilitating workshops. Help shape the next generation of professionals.
              </p>
            </div>
            <button className="whitespace-nowrap bg-white text-[#003087] px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
              Express Interest
            </button>
          </div>
        )}

        {/* ORANGE THEMED HEADER FOR SEMINARS */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}