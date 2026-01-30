import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Phone, Calendar, MapPin, Upload } from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    currentAddress: '',
    phoneNumber: '',
    telephoneNumber: '',
    civilStatus: '',
    birthDate: '',
    region: '',
    province: '',
    city: '',
    course: '',
    batchYear: '',
    hasDiploma: 'no',
    idType: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [validIdFile, setValidIdFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add registration logic here
    // For now, just navigate to login
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                <label htmlFor="middleName" className="block text-gray-700 font-medium mb-2">Middle Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="middleName"
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Middle Name"
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
                  placeholder="Enter your email"
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

            {/* Phone Number & Telephone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Phone Number */}
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Telephone Number (Optional) */}
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Civil Status & Birth Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Civil Status */}
              <div>
                <label htmlFor="civilStatus" className="block text-gray-700 font-medium mb-2">Civil Status</label>
                <select
                  id="civilStatus"
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                >
                  <option value="">Select your civil status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>

              {/* Birth Date */}
              <div>
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
            </div>

            {/* Region, Province, Location */}
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
                  <option value="">Select your region</option>
                  <option value="region-11">Region XI - Davao Region</option>
                  <option value="ncr">NCR</option>
                  <option value="region-1">Region I - Ilocos Region</option>
                  <option value="region-2">Region II - Cagayan Valley</option>
                  <option value="region-3">Region III - Central Luzon</option>
                  <option value="region-4a">Region IV-A - CALABARZON</option>
                  <option value="region-5">Region V - Bicol Region</option>
                  <option value="region-6">Region VI - Western Visayas</option>
                  <option value="region-7">Region VII - Central Visayas</option>
                  <option value="region-8">Region VIII - Eastern Visayas</option>
                  <option value="region-9">Region IX - Zamboanga Peninsula</option>
                  <option value="region-10">Region X - Northern Mindanao</option>
                  <option value="region-12">Region XII - SOCCSKSARGEN</option>
                  <option value="region-13">Region XIII - Caraga</option>
                  <option value="barmm">BARMM</option>
                  <option value="car">CAR - Cordillera Administrative Region</option>
                </select>
              </div>

              {/* Province */}
              <div>
                <label htmlFor="province" className="block text-gray-700 font-medium mb-2">Province</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="province"
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    placeholder="e.g., Davao del Sur"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Location of Town/City */}
              <div>
                <label htmlFor="city" className="block text-gray-700 font-medium mb-2">Location of Town/City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Davao City"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Course & Batch Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Course Graduated */}
              <div>
                <label htmlFor="course" className="block text-gray-700 font-medium mb-2">Course Graduated</label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                >
                  <option value="">Select your course</option>
                  <option value="bs-computer-science">BS Computer Science</option>
                  <option value="bs-information-technology">BS Information Technology</option>
                  <option value="bs-information-systems">BS Information Systems</option>
                  <option value="bs-data-science">BS Data Science</option>
                  <option value="other">Other</option>
                </select>
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
                  <option value="">Select batch year</option>
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
              <label className="block text-gray-700 font-medium mb-2">Proof of Identity (Valid ID)</label>
              
              {/* Select ID Type */}
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
                  <option value="">Choose your valid ID</option>
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
                  required
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
    </div>
  );
}
