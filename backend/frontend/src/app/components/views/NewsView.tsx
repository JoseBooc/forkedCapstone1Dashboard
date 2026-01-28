// 1. Imports MUST be at the very top for ESLint
import { ArrowRight, Clock } from 'lucide-react';
import { Footer } from '../Footer';

// Asset Imports
import admissionsFair from '../../../assets/AdmissionsFairBG.jpg';
import mentorProgram from '../../../assets/AlumniMentorBG.jpg';
import globalAlumni from '../../../assets/GlobalAlumniBG.jpg';
import achievements1 from '../../../assets/Achievements1BG.jpg';
import achievements2 from '../../../assets/Achievements2BG.jpg';
import whoMadeCut from '../../../assets/WhoCutBG.jpg';

// 2. Constants come after imports
const PLACEHOLDER = "https://images.unsplash.com/photo-1523050335456-c6bb7f9cc997?auto=format&fit=crop&q=80&w=800";

interface NewsItemProps {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: any;
}

function NewsCard({ category, title, excerpt, date, image }: NewsItemProps) {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row h-full text-left group">
      <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-200">
        <img 
          src={image || PLACEHOLDER} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
      </div>
      <div className="md:w-2/3 p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider">
            {category}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            {date}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#003087] transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {excerpt}
        </p>
        <button className="flex items-center gap-2 text-[#003087] font-bold text-sm hover:translate-x-1 transition-transform">
          Read More <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function NewsView({ userRole }: { userRole: string }) {
  const newsFeed = [
    {
      category: "Programs",
      title: "New Alumni Mentorship Program Launches",
      excerpt: "Connect with fellow Ateneans and share your expertise with the next generation through our expanded mentorship initiative.",
      date: "January 5, 2026",
      image: mentorProgram
    },
    {
      category: "Community",
      title: "Global Alumni Chapters Expand to 15 Cities",
      excerpt: "From Manila to New York, our international network continues to grow, bringing Ateneans together across continents.",
      date: "December 28, 2025",
      image: globalAlumni
    },
    {
      category: "Achievements",
      title: "Congratulations to the AdDU College of Law for their outstanding performance in the 2025 Bar Exam!",
      excerpt: "AdDU is TOP 1 among law schools with 51-100 candidates! Our university has produced 82 new Attorneys this year with a 100% passing rate.",
      date: "January 7, 2026",
      image: achievements1
    },
    {
      category: "Achievements",
      title: "ADDU 26th in the Webometrics Philippines Ranking January 2026!",
      excerpt: "Congratulations to the Ateneo de Davao University Community on ranking 26th out of 356 universities in the Philippines!",
      date: "January 24, 2026",
      image: achievements2
    },
    {
      category: "Achievements",
      title: "WHO MADE THE CUT? ⚖️📚",
      excerpt: "Ateneo schools dominate the 2025 Bar exams as Ateneo de Manila University tops law schools with over 100 examinees.",
      date: "January 7, 2026",
      image: whoMadeCut
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-8 space-y-12 flex-1">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">News & Updates</h1>
          <p className="text-gray-500 font-medium">Stay informed about alumni news and announcements</p>
        </div>

        {/* Featured Section */}
        <section className="relative overflow-hidden rounded-[40px] bg-white border border-gray-100 shadow-lg">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative h-[450px] lg:h-auto overflow-hidden bg-gray-200">
              <img 
                src={admissionsFair || PLACEHOLDER} 
                alt="Admissions Fair" 
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />
              <div className="absolute top-6 left-6">
                <span className="px-5 py-2 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-widest shadow-lg">
                  Featured
                </span>
              </div>
            </div>
            <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center text-left">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider w-fit mb-4">
                Scholarship
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 leading-tight">
                HAPPENING NOW | Ateneo de Davao University Admissions and Scholarship Fair
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                The Admissions and Scholars Fair runs from January 23 to 25, 2026, bringing admissions, academic programs, and scholarships all in one place.
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <span className="text-sm text-gray-400 font-medium">January 10, 2026</span>
                <button className="text-[#003087] font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                  Read More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* News Feed */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">News Feed</h2>
            <div className="h-[2px] flex-1 bg-gray-100"></div>
          </div>
          <div className="flex flex-col gap-8">
            {newsFeed.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer added at the bottom */}
      <Footer />
    </div>
  );
}