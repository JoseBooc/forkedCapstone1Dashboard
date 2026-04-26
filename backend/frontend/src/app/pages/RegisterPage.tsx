import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Phone, Calendar, MapPin, Upload } from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';

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

const PSGC_API = 'https://psgc.cloud/api';

const REGION_PSGC_CODES: Record<string, string> = {
  'ncr': '1300000000',
  'car': '1400000000',
  'region-1': '0100000000',
  'region-2': '0200000000',
  'region-3': '0300000000',
  'region-4a': '0400000000',
  'region-4b': '1700000000',
  'region-5': '0500000000',
  'region-6': '0600000000',
  'region-7': '0700000000',
  'region-8': '0800000000',
  'region-9': '0900000000',
  'region-10': '1000000000',
  'region-11': '1100000000',
  'region-12': '1200000000',
  'region-13': '1600000000',
  'barmm': '1900000000',
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
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [telephoneError, setTelephoneError] = useState('');

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name')
      .then(res => res.json())
      .then((data: { name: { common: string } }[]) => {
        const sorted = data
          .map(c => c.name.common)
          .filter(name => name !== 'Philippines')
          .sort((a, b) => a.localeCompare(b));
        setCountries(['Philippines', ...sorted]);
      })
      .catch(() => setCountries(['Philippines']));
  }, []);

  useEffect(() => {
    if (!formData.region) return;
    const regionCode = REGION_PSGC_CODES[formData.region];
    if (!regionCode) return;

    setFormData(prev => ({ ...prev, province: '', city: '' }));
    setProvinces([]);
    setCities([]);

    if (formData.region === 'ncr') {
      setLoadingCities(true);
      fetch(`${PSGC_API}/regions/${regionCode}/cities-municipalities`)
        .then(res => res.json())
        .then((data: { name: string }[]) =>
          setCities(data.map(c => c.name).sort((a, b) => a.localeCompare(b)))
        )
        .catch(() => setCities([]))
        .finally(() => setLoadingCities(false));
    } else {
      setLoadingProvinces(true);
      fetch(`${PSGC_API}/regions/${regionCode}/provinces`)
        .then(res => res.json())
        .then((data: { code: string; name: string }[]) =>
          setProvinces(data.sort((a, b) => a.name.localeCompare(b.name)))
        )
        .catch(() => setProvinces([]))
        .finally(() => setLoadingProvinces(false));
    }
  }, [formData.region]);

  useEffect(() => {
    if (!formData.province || formData.region === 'ncr') return;
    const province = provinces.find(p => p.name === formData.province);
    if (!province) return;

    setFormData(prev => ({ ...prev, city: '' }));
    setCities([]);
    setLoadingCities(true);

    fetch(`${PSGC_API}/provinces/${province.code}/cities-municipalities`)
      .then(res => res.json())
      .then((data: { name: string }[]) =>
        setCities(data.map(c => c.name).sort((a, b) => a.localeCompare(b)))
      )
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, [formData.province, provinces]);

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
    
    // Validate required file uploads
    if (!validIdFile) {
      alert('Please upload your Valid ID');
      return;
    }

    if (formData.hasDiploma === 'yes' && !diplomaFile) {
      alert('Please upload your Diploma/Degree');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address (e.g., user@gmail.com)');
      return;
    }

    // Validate email domain (ensure it's a real email provider)
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
      // Clean and prepare middle name - ensure empty string becomes null
      const cleanMiddleName = formData.middleName && formData.middleName.trim() !== '' ? formData.middleName.trim() : null;
      
      // Construct full name - only include middle name if it exists
      const fullName = cleanMiddleName 
        ? `${formData.firstName} ${cleanMiddleName} ${formData.lastName}`.trim()
        : `${formData.firstName} ${formData.lastName}`.trim();
      
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      
      // Append all user data fields
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
      
      // Append file upload fields
      formDataToSend.append('has_diploma', formData.hasDiploma);
      if (diplomaFile) {
        formDataToSend.append('diploma_file', diplomaFile);
      }
      formDataToSend.append('id_type', formData.idType);
      if (validIdFile) {
        formDataToSend.append('valid_id_file', validIdFile);
      }

      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        body: formDataToSend, // Send FormData instead of JSON
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

  const validatePhone = (value: string): string => {
    if (!value) return '';
    if (!/^\d+$/.test(value)) return 'Only digits are allowed';
    if (value.startsWith('09') && value.length !== 11) return 'Philippine mobile numbers must be 11 digits (09XXXXXXXXX)';
    if (!value.startsWith('09') && (value.length < 7 || value.length > 15)) return 'Enter a valid number with 7–15 digits';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const digitsOnly = ['phoneNumber', 'telephoneNumber', 'zipcode'];
    const sanitized = digitsOnly.includes(name) ? value.replace(/\D/g, '') : value;

    setFormData({ ...formData, [name]: sanitized });

    if (name === 'phoneNumber') setPhoneError(validatePhone(sanitized));
    if (name === 'telephoneNumber') setTelephoneError(sanitized ? validatePhone(sanitized) : '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'diploma' | 'validId') => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === 'diploma') {
        setDiplomaFile(file);
      } else {
        setValidIdFile(file);
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Blue Background with Campus Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-[#003087] relative overflow-hidden"
        style={{
          background: `linear-gradient(rgba(0, 61, 122, 0.85), rgba(0, 61, 122, 0.85)), url('https://upload.wikimedia.org/wikipedia/en/3/3e/Ateneo_De_Davao_University_%28Roxas_Avenue%2C_Davao_City%3B_08-21-2023%29.jpg') center/cover`
        }}
      >
        {/* Back to Home Button - Desktop */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Content */}
        <div className="flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 p-4">
              <img src={ADDULogo} alt="ADDU Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-2 text-center">Alumni Portal</h1>
          <p className="text-xl mb-8 text-blue-100">Ateneo de Davao University</p>

          {/* Welcome Text */}
          <h2 className="text-3xl font-bold mb-6 text-center">
            Welcome Home, <span className="text-orange-400">Ateneans</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-center max-w-md text-blue-100">
            Connecting generations of excellence. Join our thriving community of over 50,000 alumni making a difference worldwide.
          </p>
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

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#003087] mb-2">Register</h2>
          <p className="text-gray-600 mb-8">Create your alumni account</p>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Middle Name */}
              <div>
                <label htmlFor="middleName" className="block text-gray-700 font-medium mb-2">Middle Name <span className="text-gray-400 font-normal text-sm">(Optional)</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="middleName"
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Middle Name (if applicable)"
                    autoComplete="off"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email (e.g., user@gmail.com)"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
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
                <textarea
                  id="currentAddress"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter your current address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition resize-none"
                  required
                />
              </div>
            </div>

            {/* Country/Location & Zipcode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Country/Location */}
              <div>
                <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country/Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  >
                    <option value="">Select your country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Zipcode */}
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

            {/* Philippine Location Fields - Only show when Philippines is selected */}
            {formData.country === 'Philippines' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Region of Origin */}
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
                    <option value="region-9">Region IX (Zamboanga Peninsula)</option>
                    <option value="region-10">Region X (Northern Mindanao)</option>
                    <option value="region-12">Region XII (SOCCSKSARGEN)</option>
                    <option value="region-13">Region XIII (Caraga)</option>
                    <option value="barmm">BARMM (Bangsamoro Autonomous Region)</option>
                  </select>
                </div>

                {/* Province - Only show if region has provinces (not for NCR) */}
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
                      {loadingProvinces ? (
                        <option disabled>Loading provinces...</option>
                      ) : (
                        provinces.map(p => (
                          <option key={p.code} value={p.name}>{p.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                )}

                {/* Location of Town/City */}
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
                    <option value="" disabled hidden>Select your city/municipality</option>
                    {loadingCities ? (
                      <option disabled>Loading cities...</option>
                    ) : (
                      cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* Phone Number & Telephone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${phoneError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="09XXXXXXXXX"
                    maxLength={15}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      phoneError
                        ? 'border-red-500 focus:ring-red-400 bg-red-50'
                        : 'border-gray-300 focus:ring-[#003D7A]'
                    }`}
                    required
                  />
                </div>
                {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
              </div>

              {/* Telephone Number (Optional) */}
              <div>
                <label htmlFor="telephoneNumber" className="block text-gray-700 font-medium mb-2">Telephone Number <span className="text-gray-400 font-normal text-sm">(Optional)</span></label>
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${telephoneError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    id="telephoneNumber"
                    type="tel"
                    name="telephoneNumber"
                    value={formData.telephoneNumber}
                    onChange={handleChange}
                    placeholder="09XXXXXXXXX"
                    maxLength={15}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      telephoneError
                        ? 'border-red-500 focus:ring-red-400 bg-red-50'
                        : 'border-gray-300 focus:ring-[#003D7A]'
                    }`}
                  />
                </div>
                {telephoneError && <p className="mt-1 text-xs text-red-500">{telephoneError}</p>}
              </div>
            </div>

            {/* Birth Date */}
            <div className="mb-6">
              <label htmlFor="birthDate" className="block text-gray-700 font-medium mb-2">Birth Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Sex */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Sex</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value="male"
                    checked={formData.sex === 'male'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#003D7A] focus:ring-2 focus:ring-[#003D7A]"
                    required
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value="female"
                    checked={formData.sex === 'female'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#003D7A] focus:ring-2 focus:ring-[#003D7A]"
                  />
                  <span className="text-gray-700">Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value="prefer_not_to_say"
                    checked={formData.sex === 'prefer_not_to_say'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#003D7A] focus:ring-2 focus:ring-[#003D7A]"
                  />
                  <span className="text-gray-700">Prefer not to say</span>
                </label>
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

              {/* Conditional: Show text input if "Other" is selected */}
              {formData.religion === 'other' && (
                <input
                  type="text"
                  name="religionOther"
                  value={formData.religionOther}
                  onChange={handleChange}
                  placeholder="Please specify your religion"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition mt-3"
                  required
                />
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

            {/* Conditional: Marriage Date for Married/Separated/Annulled/Divorced/Widowed */}
            {['married', 'separated', 'annulled', 'divorced', 'widowed'].includes(formData.maritalStatus) && (
              <div className="mb-6">
                <label htmlFor="marriageDate" className="block text-gray-700 font-medium mb-2">Month and Year of Marriage</label>
                <input
                  id="marriageDate"
                  type="month"
                  name="marriageDate"
                  value={formData.marriageDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
              </div>
            )}

            {/* Conditional: Marriage Intentions for Single */}
            {formData.maritalStatus === 'single' && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Do you intend to get married in the future?</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="intendToMarry"
                        value="yes"
                        checked={formData.intendToMarry === 'yes'}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#003D7A] focus:ring-2 focus:ring-[#003D7A]"
                        required
                      />
                      <span className="text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="intendToMarry"
                        value="no"
                        checked={formData.intendToMarry === 'no'}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#003D7A] focus:ring-2 focus:ring-[#003D7A]"
                      />
                      <span className="text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* If Yes: Age */}
                {formData.intendToMarry === 'yes' && (
                  <div>
                    <label htmlFor="intendedMarriageAge" className="block text-gray-700 font-medium mb-2">At what age?</label>
                    <input
                      id="intendedMarriageAge"
                      type="number"
                      name="intendedMarriageAge"
                      value={formData.intendedMarriageAge}
                      onChange={handleChange}
                      placeholder="Enter age"
                      min="18"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                      required
                    />
                  </div>
                )}

                {/* If No: Reason */}
                {formData.intendToMarry === 'no' && (
                  <div>
                    <label htmlFor="noMarriageReason" className="block text-gray-700 font-medium mb-2">Reason (Optional)</label>
                    <textarea
                      id="noMarriageReason"
                      name="noMarriageReason"
                      value={formData.noMarriageReason}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Please share your reason (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Course & Batch Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Course Graduated */}
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

              {/* Batch Year */}
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

            {/* Do you have your diploma/degree */}
            <div className="mb-6">
              <label htmlFor="hasDiploma" className="block text-gray-700 font-medium mb-2">Do you have your diploma/degree? (Optional)</label>
              <select
                id="hasDiploma"
                name="hasDiploma"
                value={formData.hasDiploma}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {/* Upload Diploma/Degree (Conditional) */}
            {formData.hasDiploma === 'yes' && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Upload Diploma/Degree</label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                  <input
                    type="file"
                    id="diplomaFile"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => handleFileChange(e, 'diploma')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="pointer-events-none">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-1">
                      {diplomaFile ? diplomaFile.name : 'Click to upload your Diploma/Degree'}
                    </p>
                    <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Proof of Identity */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Proof of Identity (Valid ID) </label>
              
              {/* Select ID Type */}
              <div className="mb-4">
                <label htmlFor="idType" className="block text-gray-600 text-sm mb-2">Select ID Type </label>
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

              {/* File Upload */}
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                <input
                  type="file"
                  id="validIdFile"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => handleFileChange(e, 'validId')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-1">
                    {validIdFile ? validIdFile.name : 'Click to upload your Valid ID'}
                  </p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-[#003D7A] text-white py-4 rounded-lg hover:bg-[#002855] transition font-semibold text-lg shadow-lg mb-6"
            >
              Register
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#003D7A] hover:text-[#002855] font-bold transition"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Registration Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center">
            {/* Checkmark Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Submitted Successfully!</h2>

            <p className="text-gray-600 leading-relaxed mb-8">
              Your registered account will be verified by an administrator within{' '}
              <span className="font-semibold text-[#003087]">24 to 48 hours</span>. You will be able to
              log in once your account has been approved.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#003087] text-white rounded-xl font-semibold text-base hover:bg-[#002066] transition-colors shadow-md"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
