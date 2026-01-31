import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Edit3, Save, X, Trash2 } from 'lucide-react';
import { Footer } from '../Footer';

interface ProfileViewProps {
  userRole: 'alumni' | 'admin';
}

export function ProfileView({ userRole }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Main State
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    telephone: "",
    address: "",
    civilStatus: "",
    birthDate: "",
    region: "",
    province: "",
    city: "",
    course: "",
    batchYear: "",
    jobTitle: "",
    company: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(userEmail)}`);
      const userData = await response.json();

      setFormData({
        firstName: userData.first_name || '',
        middleName: userData.middle_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone_number || '',
        telephone: userData.telephone_number || '',
        address: userData.current_address || '',
        civilStatus: userData.civil_status || '',
        birthDate: userData.birth_date || '',
        region: userData.region || '',
        province: userData.province || '',
        city: userData.city || '',
        course: userData.course || '',
        batchYear: userData.batch_year || '',
        jobTitle: '',
        company: ''
      });
      
      // Update localStorage with the current name from database
      const fullName = `${userData.first_name || ''}${userData.middle_name ? ' ' + userData.middle_name : ''} ${userData.last_name || ''}`.trim();
      if (fullName) {
        localStorage.setItem('userName', fullName);
        // Trigger events to update sidebar
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('userProfileUpdated'));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  // Temporary state to allow "Cancel" functionality
  const [tempData, setTempData] = useState(formData);

  const [education, setEducation] = useState([
    { id: 1, degree: "Bachelor of Science in Computer Science", school: "Ateneo de Davao University", period: "2011 - 2015" }
  ]);

  const [experience, setExperience] = useState([
    { id: 1, role: "Senior Software Engineer", company: "Tech Corp International", period: "2020 - Present" },
    { id: 2, role: "Software Engineer", company: "Startup Inc.", period: "2015 - 2020" }
  ]);

  // Generate years array for batch year dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

  const handleEdit = () => {
    setTempData(formData); // Store current data before editing
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('No user email found');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(userEmail)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          phone_number: formData.phone,
          telephone_number: formData.telephone,
          current_address: formData.address,
          civil_status: formData.civilStatus,
          birth_date: formData.birthDate,
          region: formData.region,
          province: formData.province,
          city: formData.city,
          course: formData.course,
          batch_year: formData.batchYear,
        }),
      });

      if (response.ok) {
        // Update localStorage with the new full name
        const fullName = `${formData.firstName}${formData.middleName ? ' ' + formData.middleName : ''} ${formData.lastName}`.trim();
        localStorage.setItem('userName', fullName);
        
        // Trigger a storage event to update sidebar in real-time
        window.dispatchEvent(new Event('storage'));
        
        // Trigger a custom event to refresh user management if open
        window.dispatchEvent(new CustomEvent('userProfileUpdated'));
        
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleCancel = () => {
    setFormData(tempData); // Revert to original data
    setIsEditing(false);
  };

  const addEducation = () => {
    const newId = education.length > 0 ? Math.max(...education.map(e => e.id)) + 1 : 1;
    setEducation([...education, { id: newId, degree: "New Degree", school: "University Name", period: "Year - Year" }]);
  };

  const addExperience = () => {
    const newId = experience.length > 0 ? Math.max(...experience.map(e => e.id)) + 1 : 1;
    setExperience([...experience, { id: newId, role: "New Job Role", company: "Company Name", period: "Year - Year" }]);
  };

  const deleteEducation = (id: number) => setEducation(education.filter(item => item.id !== id));
  const deleteExperience = (id: number) => setExperience(experience.filter(item => item.id !== id));

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-8 space-y-8 flex-1">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 text-left">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm">Manage your personal information and career history</p>
          </div>
          {!isEditing ? (
            <button onClick={handleEdit} className="flex items-center gap-2 px-6 py-2 bg-[#003087] text-white rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={handleCancel} className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-md">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Main Profile Card - UPDATES LIVE */}
        {loading ? (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500">Loading profile...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="w-32 h-32 bg-[#003087] rounded-full flex items-center justify-center text-white text-4xl font-bold shrink-0">
              {formData.firstName && formData.lastName ? `${formData.firstName[0]}${formData.lastName[0]}` : 'U'}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{formData.firstName} {formData.middleName} {formData.lastName}</h2>
                <p className="text-gray-500 font-medium">Class of {formData.batchYear || 'N/A'} • {formData.course || 'Course Not Set'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12">
                <div className="flex items-center gap-3 text-gray-600"><Mail className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.email || 'Not provided'}</span></div>
                <div className="flex items-center gap-3 text-gray-600"><Phone className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.phone || 'Not provided'}</span></div>
                <div className="flex items-center gap-3 text-gray-600"><MapPin className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.city || 'City not set'}, {formData.province || 'Province not set'}</span></div>
                <div className="flex items-center gap-3 text-gray-600"><Briefcase className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.jobTitle || 'Job title not set'} {formData.company && `at ${formData.company}`}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info Form */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">First Name</label>
              <input 
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Middle Name</label>
              <input 
                type="text"
                value={formData.middleName || ''}
                onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Last Name</label>
              <input 
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input 
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={true}
                className="w-full p-4 border rounded-xl transition-all bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input 
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Telephone Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Telephone Number</label>
              <input 
                type="text"
                value={formData.telephone || ''}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Birth Date</label>
              <input 
                type="date"
                value={formData.birthDate || ''}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Civil Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Civil Status</label>
              <select
                value={formData.civilStatus || ''}
                onChange={(e) => setFormData({...formData, civilStatus: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <option value="">Select your civil status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Region</label>
              <select
                value={formData.region || ''}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Province</label>
              <input 
                type="text"
                value={formData.province || ''}
                onChange={(e) => setFormData({...formData, province: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">City</label>
              <input 
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Course */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Course</label>
              <select
                value={formData.course || ''}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Batch Year</label>
              <select
                value={formData.batchYear || ''}
                onChange={(e) => setFormData({...formData, batchYear: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <option value="">Select batch year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Job Title</label>
              <input 
                type="text"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Company</label>
              <input 
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Current Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Current Address</label>
              <input 
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                disabled={!isEditing}
                className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-left">
          <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900">Educational Background</h3>
              {isEditing && (
                <button onClick={addEducation} className="px-4 py-2 text-sm text-[#003087] font-bold border-2 border-[#003087] rounded-lg hover:bg-blue-50 transition-colors">
                  + Add Education
                </button>
              )}
          </div>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={edu.id} className="bg-gray-50 rounded-2xl p-6 flex items-start gap-6 border border-gray-100 relative">
                <div className="w-12 h-12 bg-[#003087] rounded-xl flex items-center justify-center text-white shrink-0"><GraduationCap className="w-6 h-6" /></div>
                <div className="flex-1 space-y-2">
                  <input 
                    disabled={!isEditing}
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].degree = e.target.value;
                      setEducation(newEdu);
                    }}
                    className={`font-bold text-gray-900 bg-transparent w-full outline-none ${isEditing ? 'border-b border-blue-300' : ''}`}
                  />
                  <input 
                    disabled={!isEditing}
                    value={edu.school}
                    onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].school = e.target.value;
                      setEducation(newEdu);
                    }}
                    className={`text-sm text-gray-500 bg-transparent w-full outline-none ${isEditing ? 'border-b border-blue-300' : ''}`}
                  />
                  <input 
                    disabled={!isEditing}
                    value={edu.period}
                    onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].period = e.target.value;
                      setEducation(newEdu);
                    }}
                    className={`text-xs text-gray-400 font-medium bg-transparent w-full outline-none ${isEditing ? 'border-b border-blue-300' : ''}`}
                  />
                </div>
                {isEditing && (
                  <button onClick={() => deleteEducation(edu.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-left">
          <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900">Career Milestones</h3>
              {isEditing && (
                <button onClick={addExperience} className="px-4 py-2 text-sm text-[#003087] font-bold border-2 border-[#003087] rounded-lg hover:bg-blue-50 transition-colors">
                  + Add Experience
                </button>
              )}
          </div>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={exp.id} className="bg-gray-50 rounded-2xl p-6 flex items-start gap-6 border border-gray-100 relative">
                <div className="w-12 h-12 bg-[#003087] rounded-xl flex items-center justify-center text-white shrink-0"><Briefcase className="w-6 h-6" /></div>
                <div className="flex-1 space-y-2">
                  <input 
                    disabled={!isEditing}
                    value={exp.role}
                    onChange={(e) => {
                      const newExp = [...experience];
                      newExp[index].role = e.target.value;
                      setExperience(newExp);
                    }}
                    className={`font-bold text-gray-900 bg-transparent w-full outline-none ${isEditing ? 'border-b border-blue-300' : ''}`}
                  />
                  <input 
                    disabled={!isEditing}
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...experience];
                      newExp[index].company = e.target.value;
                      setExperience(newExp);
                    }}
                    className={`text-sm text-gray-500 bg-transparent w-full outline-none ${isEditing ? 'border-b border-blue-300' : ''}`}
                  />
                  <input 
                    disabled={!isEditing}
                    value={exp.period}
                    onChange={(e) => {
                      const newExp = [...experience];
                      newExp[index].period = e.target.value;
                      setExperience(newExp);
                    }}
                    className={`text-xs text-gray-400 font-medium bg-transparent w-full outline-none ${isEditing ? 'border-b border-blue-300' : ''}`}
                  />
                </div>
                {isEditing && (
                  <button onClick={() => deleteExperience(exp.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}