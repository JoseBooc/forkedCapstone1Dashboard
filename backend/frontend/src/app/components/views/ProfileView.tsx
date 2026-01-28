import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Edit3, Save, X, Trash2 } from 'lucide-react';
import { Footer } from '../Footer';

interface ProfileViewProps {
  userRole: 'alumni' | 'admin';
}

export function ProfileView({ userRole }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Main State
  const [formData, setFormData] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 912 345 6789",
    address: "123 Main Street, Davao City, Philippines",
    jobTitle: "Software Engineer",
    company: "Tech Corp"
  });

  // Temporary state to allow "Cancel" functionality
  const [tempData, setTempData] = useState(formData);

  const [education, setEducation] = useState([
    { id: 1, degree: "Bachelor of Science in Computer Science", school: "Ateneo de Davao University", period: "2011 - 2015" }
  ]);

  const [experience, setExperience] = useState([
    { id: 1, role: "Senior Software Engineer", company: "Tech Corp International", period: "2020 - Present" },
    { id: 2, role: "Software Engineer", company: "Startup Inc.", period: "2015 - 2020" }
  ]);

  const handleEdit = () => {
    setTempData(formData); // Store current data before editing
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send formData to your database
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
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 text-left">
          <div className="w-32 h-32 bg-[#003087] rounded-full flex items-center justify-center text-white text-4xl font-bold shrink-0">
            {formData.firstName[0]}{formData.lastName[0]}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
              <p className="text-gray-500 font-medium">Class of 2015 • BS Computer Science</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12">
              <div className="flex items-center gap-3 text-gray-600"><Mail className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.email}</span></div>
              <div className="flex items-center gap-3 text-gray-600"><Phone className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.phone}</span></div>
              <div className="flex items-center gap-3 text-gray-600"><MapPin className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.address}</span></div>
              <div className="flex items-center gap-3 text-gray-600"><Briefcase className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.jobTitle} at {formData.company}</span></div>
            </div>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "First Name", key: "firstName" },
              { label: "Last Name", key: "lastName" },
              { label: "Email Address", key: "email", type: "email" },
              { label: "Phone Number", key: "phone" },
              { label: "Job Title", key: "jobTitle" },
              { label: "Company", key: "company" },
              { label: "Address", key: "address" }
            ].map((field) => (
              <div key={field.key} className={`space-y-2 ${field.key === 'address' ? 'md:col-span-2' : ''}`}>
                <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                <input 
                  type={field.type || "text"}
                  value={(formData as any)[field.key]}
                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  disabled={!isEditing}
                  className={`w-full p-4 border rounded-xl transition-all ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                />
              </div>
            ))}
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