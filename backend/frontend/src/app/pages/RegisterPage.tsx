import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Phone, Calendar, MapPin, Upload } from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';
import campusNight from '../../assets/Roxas-Colored.jpg';

const C = {
  navy:   '#001F5B',
  navyDk: '#00153D',
  blue:   '#003087',
  gold:   '#C5A96A',
  goldLt: '#D4BC86',
  slate:  '#2C3E50',
  muted:  '#6B7280',
  white:  '#FFFFFF',
} as const;

const PROGRAM_OPTIONS = [
  'BS Computer Science',
  'BS Information Systems',
  'BS Information Technology',
  'BS Data Science',
  'BS Information Management',
  'AB Communication',
  'AB English Language',
  'AB Interdisciplinary Studies Minor In Language and Literature',
  'AB Interdisciplinary Studies Minor In Media and Business',
  'AB Interdisciplinary Studies Minor In Media and Technology',
  'AB Interdisciplinary Studies Minor In Philosophy and Theology',
  'AB Philosophy',
  'AB Anthropology',
  'AB Development Studies',
  'AB Economics',
  'AB International Studies Major in American Studies',
  'AB International Studies Major in Asian Studies',
  'AB Islamic Studies',
  'AB Political Science',
  'AB Psychology',
  'AB Sociology',
  'BS Social Work',
  'BS Biology Major in General Biology',
  'BS Biology Major in Medical Biology',
  'BS Chemistry',
  'BS Environmental Science',
  'BS Mathematics',
  'BS Accountancy',
  'BS Management Accounting',
  'BS Business Management',
  'BS Entrepreneurship',
  'BS Entrepreneurship Major in Agri-Business',
  'BS Finance',
  'BS Human Resource Development and Management',
  'BS Marketing',
  'Bachelor of Public Administration',
  'BS Architecture',
  'BS Aerospace Engineering',
  'BS Civil Engineering',
  'BS Chemical Engineering',
  'BS Computer Engineering',
  'BS Electrical Engineering',
  'BS Electronics Engineering',
  'BS Industrial Engineering',
  'BS Mechanical Engineering',
  'BS Robotics Engineering',
  'Bachelor of Early Childhood Education',
  'Bachelor of Elementary Education',
  'Bachelor of Secondary Education Major In English',
  'Bachelor of Secondary Education Major In Mathematics',
  'Bachelor of Secondary Education Major In Social Studies',
  'Bachelor of Secondary Education Major In Science',
  'BS Nursing',
];

type RegionKey = 'ncr' | 'car' | 'region-1' | 'region-2' | 'region-3' | 'region-4a' | 'region-4b' | 'region-5' | 'region-6' | 'region-7' | 'region-8' | 'nir' | 'region-9' | 'region-10' | 'region-11' | 'region-12' | 'region-13' | 'barmm';

interface RegionData {
  name: string;
  provinces: string[];
  cities: string[];
}

const PHILIPPINES_REGIONS_DATA: Record<RegionKey, RegionData> = {
  'ncr': {
    name: 'NCR (National Capital Region)',
    provinces: [],
    cities: ['Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'San Juan', 'Taguig', 'Valenzuela']
  },
  'car': {
    name: 'CAR (Cordillera Administrative Region)',
    provinces: ['Abra', 'Apayao', 'Benguet', 'Ifugao', 'Kalinga', 'Mountain Province'],
    cities: ['Baguio City']
  },
  'region-1': {
    name: 'Region I (Ilocos Region)',
    provinces: ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
    cities: ['Laoag', 'Batac', 'Vigan', 'Candon', 'San Fernando', 'Dagupan', 'Alaminos', 'San Carlos', 'Urdaneta']
  },
  'region-2': {
    name: 'Region II (Cagayan Valley)',
    provinces: ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino'],
    cities: ['Tuguegarao', 'Cauayan', 'Ilagan', 'Santiago']
  },
  'region-3': {
    name: 'Region III (Central Luzon)',
    provinces: ['Aurora', 'Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales'],
    cities: ['Angeles', 'Olongapo', 'Balanga', 'Malolos', 'Meycauayan', 'San Jose Del Monte', 'Mabalacat', 'Cabanatuan', 'Gapan', 'Palayan', 'San Jose', 'Muñoz', 'San Fernando', 'Tarlac City']
  },
  'region-4a': {
    name: 'Region IV-A (CALABARZON)',
    provinces: ['Batangas', 'Cavite', 'Laguna', 'Quezon', 'Rizal'],
    cities: ['Antipolo', 'Batangas City', 'Lipa', 'Santo Tomas', 'Tanauan', 'Bacoor', 'Cavite City', 'Dasmariñas', 'Gen. Trias', 'Imus', 'Tagaytay', 'Trece Martires', 'Biñan', 'Cabuyao', 'Calamba', 'San Pablo', 'Santa Rosa', 'Lucena', 'Tayabas']
  },
  'region-4b': {
    name: 'Region IV-B (MIMAROPA)',
    provinces: ['Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon'],
    cities: ['Calapan', 'Puerto Princesa']
  },
  'region-5': {
    name: 'Region V (Bicol Region)',
    provinces: ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon'],
    cities: ['Legazpi', 'Ligao', 'Tabaco', 'Iriga', 'Naga', 'Masbate City', 'Sorsogon City']
  },
  'region-6': {
    name: 'Region VI (Western Visayas)',
    provinces: ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo'],
    cities: ['Iloilo City', 'Passi', 'Roxas City']
  },
  'region-7': {
    name: 'Region VII (Central Visayas)',
    provinces: ['Bohol', 'Cebu'],
    cities: ['Cebu City', 'Lapu-Lapu', 'Mandaue', 'Tagbilaran', 'Bogo', 'Carcar', 'Danao', 'Naga', 'Talisay', 'Toledo']
  },
  'region-8': {
    name: 'Region VIII (Eastern Visayas)',
    provinces: ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte'],
    cities: ['Tacloban', 'Ormoc', 'Baybay', 'Borongan', 'Catbalogan', 'Calbayog', 'Maasin']
  },
  'nir': {
    name: 'NIR (Negros Island Region)',
    provinces: ['Negros Occidental', 'Negros Oriental', 'Siquijor'],
    cities: ['Bacolod', 'Bago', 'Cadiz', 'Escalante', 'Himamaylan', 'Kabankalan', 'La Carlota', 'Sagay', 'San Carlos', 'Silay', 'Sipalay', 'Talisay', 'Victorias', 'Dumaguete', 'Bais', 'Bayawan', 'Canlaon', 'Guihulngan', 'Tanjay']
  },
  'region-9': {
    name: 'Region IX (Zamboanga Peninsula)',
    provinces: ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay'],
    cities: ['Zamboanga City', 'Isabela City', 'Dapitan', 'Dipolog', 'Pagadian']
  },
  'region-10': {
    name: 'Region X (Northern Mindanao)',
    provinces: ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental'],
    cities: ['Cagayan de Oro', 'Iligan', 'Malaybalay', 'Valencia', 'Oroquieta', 'Ozamiz', 'Tangub', 'El Salvador', 'Gingoog']
  },
  'region-11': {
    name: 'Region XI (Davao Region)',
    provinces: ['Davao de Oro', 'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental'],
    cities: ['Davao City', 'Panabo', 'Island Garden City of Samal', 'Tagum', 'Digos', 'Mati']
  },
  'region-12': {
    name: 'Region XII (SOCCSKSARGEN)',
    provinces: ['Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat'],
    cities: ['General Santos', 'Koronadal', 'Kidapawan', 'Tacurong']
  },
  'region-13': {
    name: 'Region XIII (Caraga)',
    provinces: ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur'],
    cities: ['Butuan', 'Cabadbaran', 'Bayugan', 'Surigao City', 'Bislig', 'Tandag']
  },
  'barmm': {
    name: 'BARMM (Bangsamoro Autonomous Region)',
    provinces: ['Basilan', 'Lanao del Sur', 'Maguindanao del Norte', 'Maguindanao del Sur', 'Sulu', 'Tawi-Tawi'],
    cities: ['Cotabato City', 'Lamitan', 'Marawi']
  }
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    currentAddress: '',
    country: '',
    phoneNumber: '',
    telephoneNumber: '',
    zipcode: '',
    sex: '',
    religion: '',
    religionOther: '',
    maritalStatus: '',
    marriageDate: '',
    intendToMarry: '',
    intendedMarriageAge: '',
    noMarriageReason: '',
    birthDate: '',
    region: '',
    province: '',
    city: '',
    course: '',
    batchYear: '',
    hasDiploma: 'no',
    idType: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [validIdFile, setValidIdFile] = useState<File | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    // Validate password is not empty
    if (!formData.password || formData.password.trim() === '') {
      alert('Password cannot be empty.');
      return;
    }

    // Validate phone number length
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      alert('Phone number must be between 7 and 15 digits.');
      return;
    }

    // Validate telephone number length if provided
    if (formData.telephoneNumber && formData.telephoneNumber.trim() !== '') {
      if (!phoneRegex.test(formData.telephoneNumber.replace(/\D/g, ''))) {
        alert('Telephone number must be between 7 and 15 digits.');
        return;
      }
    }

    if (!validIdFile) {
      alert('Please upload your Valid ID');
      return;
    }

    if (formData.hasDiploma === 'yes' && !diplomaFile) {
      alert('Please upload your Diploma/Degree');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address (e.g., user@gmail.com)');
      return;
    }

    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
      'icloud.com', 'protonmail.com', 'zoho.com', 'aol.com',
      'addu.edu.ph', 'mail.com', 'yandex.com', 'gmx.com'
    ];

    if (!emailDomain || (!commonDomains.includes(emailDomain) && !emailDomain.includes('.'))) {
      alert('Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)');
      return;
    }

    try {
      const cleanMiddleName = formData.middleName && formData.middleName.trim() !== '' ? formData.middleName.trim() : null;
      const fullName = cleanMiddleName
        ? `${formData.firstName} ${cleanMiddleName} ${formData.lastName}`.trim()
        : `${formData.firstName} ${formData.lastName}`.trim();

      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.firstName.trim());
      formDataToSend.append('middle_name', cleanMiddleName || '');
      formDataToSend.append('last_name', formData.lastName.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', 'alumni');
      formDataToSend.append('phone_number', formData.phoneNumber.trim());
      formDataToSend.append('telephone_number', formData.telephoneNumber && formData.telephoneNumber.trim() !== '' ? formData.telephoneNumber.trim() : '');
      formDataToSend.append('current_address', formData.currentAddress.trim());
      formDataToSend.append('country', formData.country);
      formDataToSend.append('zipcode', formData.zipcode.trim());
      formDataToSend.append('sex', formData.sex);
      formDataToSend.append('religion', formData.religion);
      formDataToSend.append('religion_other', formData.religionOther && formData.religionOther.trim() !== '' ? formData.religionOther.trim() : '');
      formDataToSend.append('marital_status', formData.maritalStatus);
      formDataToSend.append('marriage_date', formData.marriageDate && formData.marriageDate !== '' ? formData.marriageDate : '');
      formDataToSend.append('intend_to_marry', formData.intendToMarry || '');
      formDataToSend.append('intended_marriage_age', formData.intendedMarriageAge && formData.intendedMarriageAge.trim() !== '' ? formData.intendedMarriageAge.trim() : '');
      formDataToSend.append('no_marriage_reason', formData.noMarriageReason && formData.noMarriageReason.trim() !== '' ? formData.noMarriageReason.trim() : '');
      formDataToSend.append('birth_date', formData.birthDate);
      formDataToSend.append('region', formData.country === 'Philippines' ? formData.region : '');
      formDataToSend.append('province', formData.country === 'Philippines' ? formData.province.trim() : '');
      formDataToSend.append('city', formData.country === 'Philippines' ? formData.city.trim() : '');
      formDataToSend.append('course', formData.course);
      formDataToSend.append('batch_year', formData.batchYear);
      formDataToSend.append('name', fullName);
      formDataToSend.append('has_diploma', formData.hasDiploma);
      if (diplomaFile) formDataToSend.append('diploma_file', diplomaFile);
      formDataToSend.append('id_type', formData.idType);
      if (validIdFile) formDataToSend.append('valid_id_file', validIdFile);

      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        await response.json();
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        alert(error.message || 'Registration failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Unable to connect to the server. Please ensure the Laravel server is running and try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'diploma' | 'validId') => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === 'diploma') setDiplomaFile(file);
      else setValidIdFile(file);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* Left Side */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, rgba(0,21,61,0.92) 0%, rgba(0,48,135,0.75) 60%, rgba(0,21,61,0.88) 100%), url(${campusNight}) center/cover`
        }}
      >
        {/* Gold line accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
          background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
          opacity: 0.6,
        }} />

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: 36, left: 36, zIndex: 10,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400,
            letterSpacing: '0.03em', color: 'rgba(255,255,255,0.7)',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Centered content */}
        <div style={{
          position: 'relative', zIndex: 2,
          height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 4rem', textAlign: 'center',
        }}>
          {/* Logo */}
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginBottom: 28,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <img src={ADDULogo} alt="ADDU Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>

          {/* Eyebrow */}
          <span style={{
            display: 'inline-block',
            padding: '3px 14px',
            borderRadius: 100,
            border: `1px solid ${C.gold}`,
            color: C.gold,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Ad Majorem Dei Gloriam
          </span>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.4rem, 3.5vw, 3.2rem)',
            fontWeight: 500,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Welcome Home,<br />
            <em style={{ color: C.goldLt, fontStyle: 'italic' }}>Ateneans.</em>
          </h1>

          <p style={{
            fontSize: 14, fontWeight: 300,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8, maxWidth: 340,
            marginBottom: 40,
          }}>
            Connecting generations of excellence. Join our thriving community of over 50,000 alumni making a difference worldwide.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 32,
          }}>
            {[
              { n: '50K+', l: 'Alumni' },
              { n: '50+',  l: 'Countries' },
              { n: '60+',  l: 'Years' },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.7rem', fontWeight: 600,
                  color: C.gold, lineHeight: 1,
                }}>
                  {n}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginTop: 4,
                }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        {/* Mobile Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-[#003D7A] hover:text-[#002855] transition lg:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-h-[90vh] overflow-y-auto">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-2">
              <img src={ADDULogo} alt="ADDU Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#003087] mb-2">Register</h2>
          <p className="text-gray-600 mb-8">Create your alumni account</p>

          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" required />
                </div>
              </div>
              <div>
                <label htmlFor="middleName" className="block text-gray-700 font-medium mb-2">Middle Name <span className="text-gray-400 font-normal text-sm">(Optional)</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input id="middleName" type="text" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name (if applicable)" autoComplete="off" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" required />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email (e.g., user@gmail.com)" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Please enter a valid email address" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" required />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Current Address */}
            <div className="mb-6">
              <label htmlFor="currentAddress" className="block text-gray-700 font-medium mb-2">Current Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                <textarea id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} rows={3} placeholder="Enter your current address" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition resize-none" required />
              </div>
            </div>

            {/* Country & Zipcode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country/Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select id="country" name="country" value={formData.country} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" required>
                    <option value="">Select your country</option>
                    <option value="Philippines">Philippines</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="China">China</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Norway">Norway</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="zipcode" className="block text-gray-700 font-medium mb-2">Zipcode</label>
                <input
                  id="zipcode"
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="Enter your zipcode"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Philippine Region / Province / City Fields */}
            {formData.country === 'Philippines' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="region" className="block text-gray-700 font-medium mb-2">Region of Origin</label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  >
                    <option value="" disabled hidden>Select your region</option>
                    <option value="region-11">Region XI (Davao Region)</option>
                    <option value="ncr">NCR (National Capital Region)</option>
                    <option value="car">CAR (Cordillera Administrative Region)</option>
                    <option value="region-1">Region I (Ilocos Region)</option>
                    <option value="region-2">Region II (Cagayan Valley)</option>
                    <option value="region-3">Region III (Central Luzon)</option>
                    <option value="region-4a">Region IV-A (CALABARZON)</option>
                    <option value="region-4b">Region IV-B (MIMAROPA)</option>
                    <option value="region-5">Region V (Bicol Region)</option>
                    <option value="region-6">Region VI (Western Visayas)</option>
                    <option value="region-7">Region VII (Central Visayas)</option>
                    <option value="region-8">Region VIII (Eastern Visayas)</option>
                    <option value="nir">NIR (Negros Island Region)</option>
                    <option value="region-9">Region IX (Zamboanga Peninsula)</option>
                    <option value="region-10">Region X (Northern Mindanao)</option>
                    <option value="region-12">Region XII (SOCCSKSARGEN)</option>
                    <option value="region-13">Region XIII (Caraga)</option>
                    <option value="barmm">BARMM (Bangsamoro Autonomous Region)</option>
                  </select>
                </div>

                {/* Province — hidden for NCR which has no provinces */}
                {formData.region !== 'ncr' && (
                  <div>
                    <label htmlFor="province" className="block text-gray-700 font-medium mb-2">Province</label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                      required
                    >
                      <option value="" disabled hidden>Select your province</option>
                      {formData.region && PHILIPPINES_REGIONS_DATA[formData.region as RegionKey]?.provinces.length > 0 ? (
                        PHILIPPINES_REGIONS_DATA[formData.region as RegionKey].provinces.map((province: string) => (
                          <option key={province} value={province}>{province}</option>
                        ))
                      ) : (
                        <option disabled>No provinces available for this region</option>
                      )}
                    </select>
                  </div>
                )}

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-2">Location of Town/City</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  >
                    <option value="" disabled hidden>Select your city</option>
                    {formData.region && PHILIPPINES_REGIONS_DATA[formData.region as RegionKey]?.cities.length > 0 ? (
                      PHILIPPINES_REGIONS_DATA[formData.region as RegionKey].cities.map((city: string) => (
                        <option key={city} value={city}>{city}</option>
                      ))
                    ) : (
                      <option disabled>No cities available for this region</option>
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    minLength={7}
                    maxLength={15}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="telephoneNumber" className="block text-gray-700 font-medium mb-2">Telephone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="telephoneNumber"
                    type="tel"
                    name="telephoneNumber"
                    value={formData.telephoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your telephone number"
                    minLength={7}
                    maxLength={15}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Birth Date */}
            <div className="mb-6">
              <label htmlFor="birthDate" className="block text-gray-700 font-medium mb-2">Birth Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="birthDate" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" required />
              </div>
            </div>

            {/* Sex */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Sex</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sex" value="male" checked={formData.sex === 'male'} onChange={handleChange} className="w-4 h-4 text-[#003D7A]" required /><span className="text-gray-700">Male</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sex" value="female" checked={formData.sex === 'female'} onChange={handleChange} className="w-4 h-4 text-[#003D7A]" /><span className="text-gray-700">Female</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sex" value="prefer_not_to_say" checked={formData.sex === 'prefer_not_to_say'} onChange={handleChange} className="w-4 h-4 text-[#003D7A]" /><span className="text-gray-700">Prefer not to say</span></label>
              </div>
            </div>

            {/* Religion */}
            <div className="mb-6">
              <label htmlFor="religion" className="block text-gray-700 font-medium mb-2">Religion</label>
              <select
                id="religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                required
              >
                <option value="" disabled hidden>Select your religion</option>
                <option value="roman_catholic">Roman Catholic</option>
                <option value="protestant">Protestant</option>
                <option value="iglesia_ni_cristo">Iglesia ni Cristo</option>
                <option value="islam">Islam</option>
                <option value="born_again_christian">Born Again Christian</option>
                <option value="buddhist">Buddhist</option>
                <option value="other">Other (please specify)</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {formData.religion === 'other' && (
                <input type="text" name="religionOther" value={formData.religionOther} onChange={handleChange} placeholder="Please specify your religion" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition mt-3" required />
              )}
            </div>

            {/* Marital Status */}
            <div className="mb-6">
              <label htmlFor="maritalStatus" className="block text-gray-700 font-medium mb-2">Marital Status</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                required
              >
                <option value="" disabled hidden>Select your marital status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="living_in">Living-in</option>
                <option value="separated">Separated</option>
                <option value="annulled">Annulled</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            {['married', 'separated', 'annulled', 'divorced', 'widowed'].includes(formData.maritalStatus) && (
              <div className="mb-6">
                <label htmlFor="marriageDate" className="block text-gray-700 font-medium mb-2">Month and Year of Marriage</label>
                <input id="marriageDate" type="month" name="marriageDate" value={formData.marriageDate} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" required />
              </div>
            )}

            {formData.maritalStatus === 'single' && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Do you intend to get married in the future?</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="intendToMarry" value="yes" checked={formData.intendToMarry === 'yes'} onChange={handleChange} className="w-4 h-4 text-[#003D7A]" required /><span className="text-gray-700">Yes</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="intendToMarry" value="no" checked={formData.intendToMarry === 'no'} onChange={handleChange} className="w-4 h-4 text-[#003D7A]" /><span className="text-gray-700">No</span></label>
                  </div>
                </div>
                {formData.intendToMarry === 'yes' && (
                  <div>
                    <label htmlFor="intendedMarriageAge" className="block text-gray-700 font-medium mb-2">At what age?</label>
                    <input id="intendedMarriageAge" type="number" name="intendedMarriageAge" value={formData.intendedMarriageAge} onChange={handleChange} placeholder="Enter age" min="18" max="100" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition" required />
                  </div>
                )}
                {formData.intendToMarry === 'no' && (
                  <div>
                    <label htmlFor="noMarriageReason" className="block text-gray-700 font-medium mb-2">Reason (Optional)</label>
                    <textarea id="noMarriageReason" name="noMarriageReason" value={formData.noMarriageReason} onChange={handleChange} rows={3} placeholder="Please share your reason (optional)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition resize-none" />
                  </div>
                )}
              </div>
            )}

            {/* Course & Batch Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="course" className="block text-gray-700 font-medium mb-2">Degree Program Completed:</label>
                <input
                  id="course"
                  list="program-options"
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Type to search or select your program"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
                <datalist id="program-options">
                  {PROGRAM_OPTIONS.map((program) => (
                    <option key={program} value={program} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="batchYear" className="block text-gray-700 font-medium mb-2">Batch Year</label>
                <select
                  id="batchYear"
                  name="batchYear"
                  value={formData.batchYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                >
                  <option value="" disabled hidden>Select batch year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Diploma */}
            <div className="mb-6">
              <label htmlFor="hasDiploma" className="block text-gray-700 font-medium mb-2">Do you have your diploma/degree? (Optional)</label>
              <select id="hasDiploma" name="hasDiploma" value={formData.hasDiploma} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {formData.hasDiploma === 'yes' && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Upload Diploma/Degree</label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                  <input type="file" id="diplomaFile" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileChange(e, 'diploma')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="pointer-events-none">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-1">{diplomaFile ? diplomaFile.name : 'Click to upload your Diploma/Degree'}</p>
                    <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Valid ID */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Proof of Identity (Valid ID)</label>
              <div className="mb-4">
                <label htmlFor="idType" className="block text-gray-600 text-sm mb-2">Select ID Type</label>
                <select
                  id="idType"
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                >
                  <option value="" disabled hidden>Choose your valid ID</option>
                  <option value="drivers-license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="umid">UMID</option>
                  <option value="sss">SSS ID</option>
                  <option value="philhealth">PhilHealth ID</option>
                  <option value="postal">Postal ID</option>
                  <option value="voters">Voter's ID</option>
                  <option value="prc">PRC ID</option>
                  <option value="national-id">National ID (PhilSys)</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                <input type="file" id="validIdFile" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileChange(e, 'validId')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="pointer-events-none">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-1">{validIdFile ? validIdFile.name : 'Click to upload your Valid ID'}</p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#003D7A] text-white py-4 rounded-lg hover:bg-[#002855] transition font-semibold text-lg shadow-lg mb-6">
              Register
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="text-[#003D7A] hover:text-[#002855] font-bold transition">
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Submitted Successfully!</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Your registered account will be verified by an administrator within{' '}
              <span className="font-semibold text-[#003087]">24 to 48 hours</span>. You will be able to log in once your account has been approved.
            </p>
            <button onClick={() => navigate('/login')} className="w-full py-3 bg-[#003087] text-white rounded-xl font-semibold text-base hover:bg-[#002066] transition-colors shadow-md">
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}