import { useState, useMemo } from 'react';
import { Search, Filter, MessageSquare, Mail, MapPin, Briefcase, Award, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface Alumnus {
  id: number;
  name: string;
  class: string;
  program: string;
  role: string;
  company?: string;
  location: string;
  email: string;
  initials: string;
  officerRole?: string;
}

export function DirectoryView({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState<'all' | 'officers'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(true);

  const allAlumni: Alumnus[] = [
    { id: 1, name: "Maria Santos", class: "2015", program: "Data Structures and Algorithms", role: "CEO", company: "Tech Innovations Inc.", location: "Manila, Philippines", email: "maria.s@email.com", initials: "MS" },
    { id: 2, name: "Roberto Cruz", class: "2018", program: "Web Development", role: "Full Stack Developer", company: "Digital Solutions", location: "Davao City, Philippines", email: "roberto.c@email.com", initials: "RC" },
    { id: 3, name: "Jennifer Lim", class: "2012", program: "Database Management Systems", role: "Database Administrator", company: "TechCorp", location: "Cebu City, Philippines", email: "jennifer.l@email.com", initials: "JL" },
    { id: 4, name: "Carlos Mendoza", class: "2020", program: "Software Engineering", role: "Software Engineer", company: "Global Corp", location: "Makati, Philippines", email: "carlos.m@email.com", initials: "CM" },
    { id: 5, name: "Sofia Reyes", class: "2016", program: "Mobile Application Development", role: "Mobile Developer", company: "AppWorks Inc.", location: "Davao City, Philippines", email: "sofia.r@email.com", initials: "SR" },
    { id: 6, name: "Miguel Torres", class: "2019", program: "Computer Networks and Security", role: "Network Security Specialist", company: "CyberSafe", location: "Cagayan de Oro, Philippines", email: "miguel.t@email.com", initials: "MT" },
    { id: 7, name: "Anna Garcia", class: "2021", program: "Artificial Intelligence", role: "ML Engineer", company: "AI Solutions", location: "Manila, Philippines", email: "anna.g@email.com", initials: "AG" },
    { id: 8, name: "David Lee", class: "2017", program: "Human Computer Interaction", role: "UX Designer", company: "Creative Studio", location: "Davao City, Philippines", email: "david.l@email.com", initials: "DL" },
    { id: 9, name: "Patricia Aquino", class: "2014", program: "Information Systems", role: "IT Consultant", company: "Accenture Philippines", location: "Taguig City, Philippines", email: "patricia.a@email.com", initials: "PA" },
    { id: 10, name: "Raphael Domingo", class: "2019", program: "Cloud Computing", role: "DevOps Engineer", company: "Amazon Web Services", location: "Singapore", email: "raphael.d@email.com", initials: "RD" },
    { id: 11, name: "Isabella Martinez", class: "2013", program: "Business Administration", role: "Marketing Director", company: "Unilever Philippines", location: "Makati City, Philippines", email: "isabella.m@email.com", initials: "IM" },
    { id: 12, name: "Francisco Bautista", class: "2016", program: "Entrepreneurship", role: "Founder & CEO", company: "StartUp Davao Hub", location: "Davao City, Philippines", email: "francisco.b@email.com", initials: "FB" },
    { id: 13, name: "Catherine Velasco", class: "2018", program: "Accounting", role: "Senior Auditor", company: "SGV & Co.", location: "Manila, Philippines", email: "catherine.v@email.com", initials: "CV" },
    { id: 14, name: "Vincent Ramos", class: "2015", program: "Finance", role: "Investment Banker", company: "BPI Capital", location: "Makati City, Philippines", email: "vincent.r@email.com", initials: "VR" },
    { id: 15, name: "Samantha Ocampo", class: "2020", program: "Human Resource Management", role: "HR Manager", company: "Jollibee Foods Corporation", location: "Pasig City, Philippines", email: "samantha.o@email.com", initials: "SO" },
    { id: 16, name: "Engineer Mark Fernandez", class: "2011", program: "Civil Engineering", role: "Project Manager", company: "DMCI Holdings", location: "Davao City, Philippines", email: "mark.f@email.com", initials: "EMF" },
    { id: 17, name: "Engineer Lisa Castillo", class: "2017", program: "Electrical Engineering", role: "Electrical Engineer", company: "Meralco", location: "Quezon City, Philippines", email: "lisa.c@email.com", initials: "ELC" },
    { id: 18, name: "Engineer Daniel Villar", class: "2019", program: "Mechanical Engineering", role: "Automotive Engineer", company: "Toyota Motor Philippines", location: "Laguna, Philippines", email: "daniel.v@email.com", initials: "EDV" },
    { id: 19, name: "Engineer Grace Navarro", class: "2014", program: "Electronics Engineering", role: "R&D Engineer", company: "Texas Instruments Philippines", location: "Baguio City, Philippines", email: "grace.n@email.com", initials: "EGN" },
    { id: 20, name: "Engineer Raymond Sy", class: "2016", program: "Industrial Engineering", role: "Operations Manager", company: "San Miguel Corporation", location: "Bulacan, Philippines", email: "raymond.s@email.com", initials: "ERS" },
    { id: 21, name: "Dr. Gabriel Rivera", class: "2010", program: "Medicine", role: "Cardiologist", company: "Davao Doctors Hospital", location: "Davao City, Philippines", email: "gabriel.r@email.com", initials: "DGR" },
    { id: 22, name: "Dr. Olivia Santiago", class: "2012", program: "Nursing", role: "Head Nurse", company: "St. Luke's Medical Center", location: "Quezon City, Philippines", email: "olivia.s@email.com", initials: "DOS" },
    { id: 23, name: "Dr. Benjamin Torres", class: "2015", program: "Physical Therapy", role: "Physical Therapist", company: "The Medical City", location: "Pasig City, Philippines", email: "benjamin.t@email.com", initials: "DBT" },
    { id: 24, name: "Pharmacist Elena Cruz", class: "2018", program: "Pharmacy", role: "Clinical Pharmacist", company: "Mercury Drug Corporation", location: "Manila, Philippines", email: "elena.c@email.com", initials: "PEC" },
    { id: 25, name: "Prof. Amanda Reyes", class: "2008", program: "Elementary Education", role: "Principal", company: "ADDU Grade School", location: "Davao City, Philippines", email: "amanda.r@email.com", initials: "PAR" },
    { id: 26, name: "Prof. Jonathan Pascual", class: "2013", program: "Secondary Education - Mathematics", role: "Math Teacher", company: "Philippine Science High School", location: "Quezon City, Philippines", email: "jonathan.p@email.com", initials: "PJP" },
    { id: 27, name: "Prof. Christina Morales", class: "2016", program: "Special Education", role: "SPED Coordinator", company: "Ateneo de Manila University", location: "Quezon City, Philippines", email: "christina.m@email.com", initials: "PCM" },
    { id: 28, name: "Atty. Marco Gonzales", class: "2009", program: "Political Science", role: "Corporate Lawyer", company: "Romulo Mabanta Law Firm", location: "Makati City, Philippines", email: "marco.g@email.com", initials: "AMG" },
    { id: 29, name: "Atty. Jessica Lim", class: "2014", program: "Legal Management", role: "Human Rights Lawyer", company: "Public Attorney's Office", location: "Manila, Philippines", email: "jessica.l@email.com", initials: "AJL" },
    { id: 30, name: "Dr. Thomas Valdez", class: "2011", program: "Psychology", role: "Clinical Psychologist", company: "Mind You Clinic", location: "Davao City, Philippines", email: "thomas.v@email.com", initials: "DTV" },
    { id: 31, name: "Michelle Chen", class: "2017", program: "International Relations", role: "Diplomat", company: "Department of Foreign Affairs", location: "Singapore", email: "michelle.c@email.com", initials: "MC" },
    { id: 32, name: "Alexander Wong", class: "2015", program: "Software Engineering", role: "Software Architect", company: "Google", location: "San Francisco, USA", email: "alex.w@email.com", initials: "AW" },
    { id: 33, name: "Sophia Ahmed", class: "2016", program: "Business Administration", role: "Management Consultant", company: "McKinsey & Company", location: "Dubai, UAE", email: "sophia.a@email.com", initials: "SA" },
    { id: 34, name: "Ricardo Fernandez", class: "2014", program: "Mechanical Engineering", role: "Aerospace Engineer", company: "Boeing", location: "Seattle, USA", email: "ricardo.f@email.com", initials: "RF" },
    { id: 35, name: "Victoria Tan", class: "2018", program: "Data Science", role: "Data Scientist", company: "Microsoft", location: "Vancouver, Canada", email: "victoria.t@email.com", initials: "VT" },
    { id: 36, name: "Nathan Park", class: "2019", program: "Computer Science", role: "Backend Engineer", company: "Shopify", location: "Toronto, Canada", email: "nathan.p@email.com", initials: "NP" },
  ];

  const chapters = [
    {
      title: "CS Cluster Chapter",
      officers: [
        { id: 101, name: "Dr. Antonio Ramirez", class: "2005", program: "Software Engineering", officerRole: "Chapter President", location: "Davao City, Philippines", email: "antonio.ramirez@email.com", initials: "DAR" },
        { id: 102, name: "Prof. Carmen Flores", class: "2008", program: "Data Science", officerRole: "Chapter Vice President", location: "Manila, Philippines", email: "carmen.flores@email.com", initials: "PCF" },
        { id: 103, name: "Engr. Ricardo Santos", class: "2010", program: "Computer Networks", officerRole: "Chapter Secretary", location: "Davao City, Philippines", email: "ricardo.santos@email.com", initials: "ERS" }
      ]
    },
    {
      title: "SBG Chapter",
      officers: [
        { id: 201, name: "Maria Victoria Tan", class: "2012", program: "Business Management", officerRole: "Chapter President", location: "Davao City, Philippines", email: "victoria.tan@email.com", initials: "MVT" },
        { id: 202, name: "Elena Rodriguez", class: "2015", program: "Accounting", officerRole: "Chapter Vice President", location: "Cebu City, Philippines", email: "elena.rodriguez@email.com", initials: "ER" },
        { id: 203, name: "Michael Santos", class: "2013", program: "Marketing", officerRole: "Chapter Secretary", location: "Manila, Philippines", email: "michael.santos@email.com", initials: "MS" }
      ]
    },
    {
      title: "Engineering Chapter",
      officers: [
        { id: 301, name: "Dr. Teresa Aquino", class: "2009", program: "Civil Engineering", officerRole: "Chapter President", location: "Davao City, Philippines", email: "teresa.aquino@email.com", initials: "DTA" },
        { id: 302, name: "Engr. Pablo Reyes", class: "2014", program: "Mechanical Engineering", officerRole: "Chapter Vice President", location: "Cagayan de Oro, Philippines", email: "pablo.reyes@email.com", initials: "EPR" }
      ]
    }
  ];

  const filteredAlumni = useMemo(() => {
    return allAlumni.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.program.toLowerCase().includes(searchQuery.toLowerCase());
      const year = parseInt(a.class);
      let matchesYear = true;
      if (yearFilter === "2020-2025") matchesYear = year >= 2020;
      else if (yearFilter === "2015-2019") matchesYear = year >= 2015 && year <= 2019;
      else if (yearFilter === "2010-2014") matchesYear = year >= 2010 && year <= 2014;
      return matchesSearch && matchesYear && (courseFilter === "All Courses" || a.program === courseFilter) && (locationFilter === "All Locations" || a.location.includes(locationFilter));
    });
  }, [searchQuery, yearFilter, courseFilter, locationFilter, allAlumni]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-8 space-y-6 flex-1">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900">Alumni Directory</h1>
          <p className="text-gray-500 text-sm">Connect with fellow Ateneans around the world</p>
        </div>

        <div className="flex gap-8 border-b border-gray-200">
          <button onClick={() => setActiveTab('all')} className={`pb-4 text-sm font-bold ${activeTab === 'all' ? 'text-[#003087] border-b-2 border-[#003087]' : 'text-gray-400'}`}>All Alumni</button>
          <button onClick={() => setActiveTab('officers')} className={`pb-4 text-sm font-bold flex items-center gap-2 ${activeTab === 'officers' ? 'text-[#003087] border-b-2 border-[#003087]' : 'text-gray-400'}`}><Award className="w-4 h-4" /> Alumni Officers</button>
        </div>

        {activeTab === 'all' ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Search by name, program, or company..." className="w-full pl-12 pr-4 py-3 bg-[#F1F5F9] border-none rounded-xl outline-none text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50"><Filter className="w-4 h-4" /> Filters</button>
              </div>
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-gray-400 uppercase">Graduation Year</label>
                    <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full p-3 bg-[#F1F5F9] rounded-xl text-sm outline-none appearance-none"><option>All Years</option><option>2020-2025</option><option>2015-2019</option><option>2010-2014</option></select>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-gray-400 uppercase">CS Course</label>
                    <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="w-full p-3 bg-[#F1F5F9] rounded-xl text-sm outline-none"><option>All Courses</option><option>Data Structures and Algorithms</option><option>Web Development</option><option>Software Engineering</option></select>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full p-3 bg-[#F1F5F9] rounded-xl text-sm outline-none"><option>All Locations</option><option>Manila</option><option>Davao City</option><option>Singapore</option></select>
                  </div>
                </div>
              )}
            </div>
            <div className="text-left py-2 text-sm text-gray-400">Showing {filteredAlumni.length} alumni</div>
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
              {filteredAlumni.map((alumnus) => <AlumniRow key={alumnus.id} alumnus={alumnus} />)}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-left">
              <h2 className="text-xl font-bold text-gray-900">ADDU Alumni Association Officers</h2>
              <p className="text-gray-500 text-sm">Meet the dedicated leaders of our alumni community</p>
            </div>
            {chapters.map((chapter, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-[#003087] p-4 flex items-center gap-3 text-white font-bold text-sm">
                  <Award className="w-5 h-5" /> {chapter.title}
                </div>
                <div className="divide-y divide-gray-50">
                  {chapter.officers.map((off: any) => <AlumniRow key={off.id} alumnus={off} isOfficer />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <DirectoryFooter />
    </div>
  );
}

function AlumniRow({ alumnus, isOfficer }: { alumnus: any, isOfficer?: boolean }) {
  return (
    <div className="p-6 flex flex-col lg:flex-row items-center gap-6 text-left transition-colors hover:bg-gray-50/50">
      <div className="w-12 h-12 bg-[#003087] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">{alumnus.initials}</div>
      <div className="flex-1 min-w-[180px]">
        <h3 className="text-[#003087] font-bold text-sm hover:underline cursor-pointer">{alumnus.name}</h3>
        <p className="text-gray-400 text-[11px]">Class of {alumnus.class}</p>
        {isOfficer && <p className="text-[#003087] font-bold text-[11px] mt-1">{alumnus.officerRole}</p>}
      </div>
      <div className="flex-1 text-gray-500 text-[12px]">{alumnus.program}</div>
      <div className="flex-1 text-gray-500 text-[12px] flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-gray-300" /> 
        <span className="truncate">{alumnus.role}{alumnus.company ? `, ${alumnus.company}` : ''}</span>
      </div>
      <div className="flex-1 flex items-center gap-2 text-gray-400 text-[12px]">
        <MapPin className="w-4 h-4 shrink-0" /> <span className="truncate">{alumnus.location}</span>
      </div>
      <div className="flex gap-2 shrink-0">
        <button className="flex items-center gap-2 px-4 py-2 border border-[#003087] rounded-lg text-[#003087] font-bold text-xs hover:bg-blue-50 transition-all"><MessageSquare className="w-3.5 h-3.5" /> Message</button>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#003087] rounded-lg text-[#003087] font-bold text-xs hover:bg-blue-50 transition-all"><Mail className="w-3.5 h-3.5" /> Email</button>
      </div>
    </div>
  );
}

function DirectoryFooter() {
  return (
    <footer className="bg-[#001D4A] text-white py-16 px-12 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">ADDU Alumni Association</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Connecting Ateneans worldwide and fostering lifelong relationships with our alma mater.
          </p>
          <div className="flex gap-4">
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"><Facebook className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"><Twitter className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"><Linkedin className="w-5 h-5" /></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"><Instagram className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Quick Links</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Events Calendar</li>
            <li className="hover:text-white cursor-pointer">Alumni Directory</li>
            <li className="hover:text-white cursor-pointer">Career Services</li>
            <li className="hover:text-white cursor-pointer">Mentorship Program</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Resources</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Alumni Benefits</li>
            <li className="hover:text-white cursor-pointer">Publications</li>
            <li className="hover:text-white cursor-pointer">Chapter Network</li>
            <li className="hover:text-white cursor-pointer">Volunteer</li>
            <li className="hover:text-white cursor-pointer">Support ADDU</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Contact Us</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 shrink-0" />
              <span>E. Jacinto St, Davao City, 8000 Davao del Sur</span>
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">📞</div>
              <span>(082) 221-2411</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-5 h-5 shrink-0" />
              <span>alumni@addu.edu.ph</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
        © 2026 Ateneo de Davao University Alumni Association. All rights reserved.
      </div>
    </footer>
  );
}