import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Edit3, Save, X, Trash2, Camera } from 'lucide-react';
import { Footer } from '../Footer';

const PROGRAM_OPTIONS = [
  'BS Computer Science', 'BS Information Systems', 'BS Information Technology',
  'BS Data Science', 'BS Information Management', 'AB Communication',
  'AB English Language', 'AB Interdisciplinary Studies Minor In Language and Literature',
  'AB Interdisciplinary Studies Minor In Media and Business',
  'AB Interdisciplinary Studies Minor In Media and Technology',
  'AB Interdisciplinary Studies Minor In Philosophy and Theology',
  'AB Philosophy', 'AB Anthropology', 'AB Development Studies', 'AB Economics',
  'AB International Studies Major in American Studies',
  'AB International Studies Major in Asian Studies', 'AB Islamic Studies',
  'AB Political Science', 'AB Psychology', 'AB Sociology', 'BS Social Work',
  'BS Biology Major in General Biology', 'BS Biology Major in Medical Biology',
  'BS Chemistry', 'BS Environmental Science', 'BS Mathematics', 'BS Accountancy',
  'BS Management Accounting', 'BS Business Management', 'BS Entrepreneurship',
  'BS Entrepreneurship Major in Agri-Business', 'BS Finance',
  'BS Human Resource Development and Management', 'BS Marketing',
  'Bachelor of Public Administration', 'BS Architecture', 'BS Aerospace Engineering',
  'BS Civil Engineering', 'BS Chemical Engineering', 'BS Computer Engineering',
  'BS Electrical Engineering', 'BS Electronics Engineering', 'BS Industrial Engineering',
  'BS Mechanical Engineering', 'BS Robotics Engineering',
  'Bachelor of Early Childhood Education', 'Bachelor of Elementary Education',
  'Bachelor of Secondary Education Major In English',
  'Bachelor of Secondary Education Major In Mathematics',
  'Bachelor of Secondary Education Major In Social Studies',
  'Bachelor of Secondary Education Major In Science', 'BS Nursing',
];

const PSGC_API = 'https://psgc.cloud/api';

const REGION_PSGC_CODES: Record<string, string> = {
  'ncr': '1300000000', 'car': '1400000000', 'region-1': '0100000000',
  'region-2': '0200000000', 'region-3': '0300000000', 'region-4a': '0400000000',
  'region-4b': '1700000000', 'region-5': '0500000000', 'region-6': '0600000000',
  'region-7': '0700000000', 'region-8': '0800000000', 'region-9': '0900000000',
  'region-10': '1000000000', 'region-11': '1100000000', 'region-12': '1200000000',
  'region-13': '1600000000', 'barmm': '1900000000',
};

interface ProfileViewProps {
  userRole: 'alumni' | 'admin';
}

export function ProfileView({ userRole }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [telephoneError, setTelephoneError] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Main State
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    telephone: "",
    address: "",
    country: "",
    zipcode: "",
    sex: "",
    religion: "",
    religionOther: "",
    maritalStatus: "",
    marriageDate: "",
    intendToMarry: "",
    intendedMarriageAge: "",
    noMarriageReason: "",
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

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name')
      .then(r => r.json())
      .then((data: { name: { common: string } }[]) => {
        const names = data.map(c => c.name.common).sort();
        setCountries(names.filter(n => n !== 'Philippines'));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!formData.region || !REGION_PSGC_CODES[formData.region]) {
      setProvinces([]);
      setCities([]);
      return;
    }
    setLoadingProvinces(true);
    setProvinces([]);
    setCities([]);
    const code = REGION_PSGC_CODES[formData.region];
    const endpoint = formData.region === 'ncr'
      ? `${PSGC_API}/regions/${code}/cities-municipalities/`
      : `${PSGC_API}/regions/${code}/provinces/`;
    fetch(endpoint)
      .then(r => r.json())
      .then((data: { code: string; name: string }[]) => {
        setProvinces(data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {})
      .finally(() => setLoadingProvinces(false));
  }, [formData.region]);

  useEffect(() => {
    if (!formData.province || formData.region === 'ncr') return;
    const prov = provinces.find(p => p.name === formData.province);
    if (!prov) return;
    setLoadingCities(true);
    setCities([]);
    fetch(`${PSGC_API}/provinces/${prov.code}/cities-municipalities/`)
      .then(r => r.json())
      .then((data: { code: string; name: string }[]) => {
        setCities(data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {})
      .finally(() => setLoadingCities(false));
  }, [formData.province, formData.region, provinces]);

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
        country: userData.country || '',
        zipcode: userData.zipcode || '',
        sex: userData.sex || '',
        religion: userData.religion || '',
        religionOther: userData.religion_other || '',
        maritalStatus: userData.marital_status || '',
        marriageDate: userData.marriage_date || '',
        intendToMarry: userData.intend_to_marry || '',
        intendedMarriageAge: userData.intended_marriage_age || '',
        noMarriageReason: userData.no_marriage_reason || '',
        birthDate: userData.birth_date || '',
        region: userData.region || '',
        province: userData.province || '',
        city: userData.city || '',
        course: userData.course || '',
        batchYear: userData.batch_year || '',
        jobTitle: '',
        company: ''
      });

      setProfileImageUrl(userData.profile_image_path ? `http://localhost:8000/storage/${userData.profile_image_path}` : '');
      
      // Also save to localStorage for sidebar
      if (userData.profile_image_path) {
        localStorage.setItem('userProfileImage', `http://localhost:8000/storage/${userData.profile_image_path}`);
      } else {
        localStorage.removeItem('userProfileImage');
      }
      
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

  const validatePhone = (value: string, field: 'phone' | 'telephone') => {
    if (!value) {
      if (field === 'phone') setPhoneError('');
      else setTelephoneError('');
      return;
    }
    const isValid = value.startsWith('09')
      ? value.length === 11
      : value.length >= 7 && value.length <= 15;
    const msg = isValid ? '' : value.startsWith('09')
      ? 'Philippine mobile numbers must be 11 digits (e.g. 09171234567)'
      : 'Enter a valid phone number (7–15 digits)';
    if (field === 'phone') setPhoneError(msg);
    else setTelephoneError(msg);
  };

  const handleFieldChange = (field: string, value: string) => {
    if (['phone', 'telephone', 'zipcode'].includes(field)) {
      value = value.replace(/\D/g, '');
    }
    if (field === 'phone') { validatePhone(value, 'phone'); setFormData(prev => ({ ...prev, phone: value })); return; }
    if (field === 'telephone') { validatePhone(value, 'telephone'); setFormData(prev => ({ ...prev, telephone: value })); return; }
    if (field === 'zipcode') { setFormData(prev => ({ ...prev, zipcode: value })); return; }
    if (field === 'country') {
      setFormData(prev => ({ ...prev, country: value, region: '', province: '', city: '' }));
      setProvinces([]);
      setCities([]);
      return;
    }
    if (field === 'region') {
      setFormData(prev => ({ ...prev, region: value, province: '', city: '' }));
      return;
    }
    if (field === 'province') {
      setFormData(prev => ({ ...prev, province: value, city: '' }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;
    try {
      setChangingPassword(true);
      const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(userEmail)}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordSuccess('Password changed successfully.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(data.error || 'Failed to change password.');
      }
    } catch {
      setPasswordError('Error connecting to server.');
    } finally {
      setChangingPassword(false);
    }
  };

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

      // Clean middle name - convert empty string to null
      const cleanMiddleName = formData.middleName && formData.middleName.trim() !== '' ? formData.middleName.trim() : null;
      
      // Clean other optional fields
      const cleanTelephone = formData.telephone && formData.telephone.trim() !== '' ? formData.telephone.trim() : null;
      const cleanReligionOther = formData.religionOther && formData.religionOther.trim() !== '' ? formData.religionOther.trim() : null;
      const cleanMarriageDate = formData.marriageDate && formData.marriageDate !== '' ? formData.marriageDate : null;
      const cleanIntendedMarriageAge = formData.intendedMarriageAge && formData.intendedMarriageAge.trim() !== '' ? formData.intendedMarriageAge.trim() : null;
      const cleanNoMarriageReason = formData.noMarriageReason && formData.noMarriageReason.trim() !== '' ? formData.noMarriageReason.trim() : null;

      const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(userEmail)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          middle_name: cleanMiddleName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          telephone_number: cleanTelephone,
          current_address: formData.address,
          country: formData.country,
          zipcode: formData.zipcode,
          sex: formData.sex,
          religion: formData.religion,
          religion_other: cleanReligionOther,
          marital_status: formData.maritalStatus,
          marriage_date: cleanMarriageDate,
          intend_to_marry: formData.intendToMarry,
          intended_marriage_age: cleanIntendedMarriageAge,
          no_marriage_reason: cleanNoMarriageReason,
          birth_date: formData.birthDate,
          region: formData.country === 'Philippines' ? formData.region : null,
          province: formData.country === 'Philippines' ? formData.province : null,
          city: formData.country === 'Philippines' ? formData.city : null,
          course: formData.course,
          batch_year: formData.batchYear,
        }),
      });

      if (response.ok) {
        // Update localStorage with the new full name (only include middle name if not empty)
        const fullName = `${formData.firstName}${cleanMiddleName ? ' ' + cleanMiddleName : ''} ${formData.lastName}`.trim();
        localStorage.setItem('userName', fullName);
        // Update stored email if it changed
        if (formData.email && formData.email !== userEmail) {
          localStorage.setItem('userEmail', formData.email);
        }
        
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

  const getInitials = () => {
    if (!formData.firstName && !formData.lastName) {
      return 'U';
    }

    const firstInitial = formData.firstName ? formData.firstName[0].toUpperCase() : '';
    const lastInitial = formData.lastName ? formData.lastName[0].toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || 'U';
  };

  const handleProfileImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be 5MB or smaller.');
      event.target.value = '';
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('No user email found');
      event.target.value = '';
      return;
    }

    try {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append('profile_image', file);

      const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(userEmail)}/profile-image`, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to upload profile image';
        try {
          const errorData = await response.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Keep fallback message if response is not JSON.
        }
        alert(errorMessage);
        return;
      }

      const result = await response.json();
      const newImageUrl = result.user?.profile_image_path
        ? `http://localhost:8000/storage/${result.user.profile_image_path}`
        : '';

      setProfileImageUrl(newImageUrl);
      
      // Save to localStorage for sidebar
      if (newImageUrl) {
        localStorage.setItem('userProfileImage', newImageUrl);
      } else {
        localStorage.removeItem('userProfileImage');
      }
      window.dispatchEvent(new CustomEvent('userProfileUpdated'));
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Error uploading profile image');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
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
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => isEditing && !uploadingImage && fileInputRef.current?.click()}
                disabled={!isEditing || uploadingImage}
                className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-[#003087] flex items-center justify-center text-white text-4xl font-bold ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                title={isEditing ? 'Change profile image' : 'Profile image'}
              >
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials()
                )}
              </button>
              {isEditing && (
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#003087] text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Camera className="w-4 h-4" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleProfileImageSelect}
                className="hidden"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{formData.firstName} {formData.middleName} {formData.lastName}</h2>
                <p className="text-gray-500 font-medium">Class of {formData.batchYear || 'N/A'} • {formData.course || 'Course Not Set'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12">
                <div className="flex items-center gap-3 text-gray-600"><Mail className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.email || 'Not provided'}</span></div>
                <div className="flex items-center gap-3 text-gray-600"><Phone className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.phone || 'Not provided'}</span></div>
                <div className="flex items-center gap-3 text-gray-600"><MapPin className="w-4 h-4 text-[#003087]" /><span className="text-sm">
                  {formData.country === 'Philippines' 
                    ? `${formData.city || 'City not set'}, ${formData.province || 'Province not set'}`
                    : formData.country || 'Location not set'}
                </span></div>
                <div className="flex items-center gap-3 text-gray-600"><Briefcase className="w-4 h-4 text-[#003087]" /><span className="text-sm">{formData.jobTitle || 'Job title not set'} {formData.company && `at ${formData.company}`}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info Form */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {/* First Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">First Name</label>
              <input 
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Middle Name</label>
              <input 
                type="text"
                value={formData.middleName || ''}
                onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Last Name</label>
              <input 
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                disabled={!isEditing}
                inputMode="numeric"
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${
                  !isEditing ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                  : phoneError ? 'bg-red-50 border-red-500 text-gray-900'
                  : 'bg-white border-blue-400 text-gray-900'
                }`}
              />
              {phoneError && isEditing && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
            </div>

            {/* Telephone Number */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Telephone Number</label>
              <input
                type="text"
                value={formData.telephone || ''}
                onChange={(e) => handleFieldChange('telephone', e.target.value)}
                disabled={!isEditing}
                inputMode="numeric"
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${
                  !isEditing ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                  : telephoneError ? 'bg-red-50 border-red-500 text-gray-900'
                  : 'bg-white border-blue-400 text-gray-900'
                }`}
              />
              {telephoneError && isEditing && <p className="text-xs text-red-500 mt-1">{telephoneError}</p>}
            </div>

            {/* Birth Date */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Birth Date</label>
              <input 
                type="date"
                value={formData.birthDate || ''}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Zipcode */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Zipcode</label>
              <input
                type="text"
                value={formData.zipcode || ''}
                onChange={(e) => handleFieldChange('zipcode', e.target.value)}
                disabled={!isEditing}
                inputMode="numeric"
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Sex */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Sex</label>
              <select
                value={formData.sex || ''}
                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <option value="">Select your sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            {/* Religion */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Religion</label>
              <select
                value={formData.religion || ''}
                onChange={(e) => setFormData({...formData, religion: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <option value="">Select your religion</option>
                <option value="roman_catholic">Roman Catholic</option>
                <option value="protestant">Protestant</option>
                <option value="iglesia_ni_cristo">Iglesia ni Cristo</option>
                <option value="islam">Islam</option>
                <option value="born_again_christian">Born Again Christian</option>
                <option value="buddhist">Buddhist</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            {/* Religion Other (if applicable) */}
            {formData.religion === 'other' && (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Religion (Other)</label>
                <input 
                  type="text"
                  value={formData.religionOther || ''}
                  onChange={(e) => setFormData({...formData, religionOther: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Please specify"
                  className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                />
              </div>
            )}

            {/* Marital Status */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Marital Status</label>
              <select
                value={formData.maritalStatus || ''}
                onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <option value="">Select your marital status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="living_in">Living-in</option>
                <option value="separated">Separated</option>
                <option value="annulled">Annulled</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            {/* Marriage Date (if applicable) */}
            {['married', 'separated', 'annulled', 'divorced', 'widowed'].includes(formData.maritalStatus) && (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Marriage Date</label>
                <input 
                  type="month"
                  value={formData.marriageDate || ''}
                  onChange={(e) => setFormData({...formData, marriageDate: e.target.value})}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                />
              </div>
            )}

            {/* Marriage Intentions (if single) */}
            {formData.maritalStatus === 'single' && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Intend to Marry?</label>
                  <select
                    value={formData.intendToMarry || ''}
                    onChange={(e) => setFormData({...formData, intendToMarry: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {formData.intendToMarry === 'yes' && (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Intended Age</label>
                    <input 
                      type="number"
                      value={formData.intendedMarriageAge || ''}
                      onChange={(e) => setFormData({...formData, intendedMarriageAge: e.target.value})}
                      disabled={!isEditing}
                      min="18"
                      max="100"
                      className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                    />
                  </div>
                )}

                {formData.intendToMarry === 'no' && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Reason</label>
                    <textarea
                      value={formData.noMarriageReason || ''}
                      onChange={(e) => setFormData({...formData, noMarriageReason: e.target.value})}
                      disabled={!isEditing}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg transition-all text-sm resize-none ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                    />
                  </div>
                )}
              </>
            )}

            {/* Country/Location */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Country/Location</label>
              <select
                value={formData.country || ''}
                onChange={(e) => handleFieldChange('country', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <option value="">Select your country</option>
                <option value="Philippines">Philippines</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Philippine Location Fields - Only show when Philippines is selected */}
            {formData.country === 'Philippines' && (
              <>
                {/* Region */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Region</label>
                  <select
                    value={formData.region || ''}
                    onChange={(e) => handleFieldChange('region', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
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
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    {formData.region === 'ncr' ? 'City / Municipality' : 'Province'}
                  </label>
                  <select
                    value={formData.province || ''}
                    onChange={(e) => handleFieldChange('province', e.target.value)}
                    disabled={!isEditing || loadingProvinces || provinces.length === 0}
                    className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing && !loadingProvinces ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    <option value="">
                      {loadingProvinces ? 'Loading...' : formData.region === 'ncr' ? 'Select city/municipality' : 'Select province'}
                    </option>
                    {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                  </select>
                </div>

                {/* City */}
                {formData.region !== 'ncr' && (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">City / Municipality</label>
                    <select
                      value={formData.city || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing || loadingCities || cities.length === 0}
                      className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing && !loadingCities ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                    >
                      <option value="">
                        {loadingCities ? 'Loading...' : 'Select city/municipality'}
                      </option>
                      {cities.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Course */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Course</label>
              <input
                list="course-options"
                value={formData.course || ''}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                disabled={!isEditing}
                placeholder="Type or select your course"
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
              <datalist id="course-options">
                {PROGRAM_OPTIONS.map(opt => <option key={opt} value={opt} />)}
              </datalist>
            </div>

            {/* Batch Year */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Batch Year</label>
              <select
                value={formData.batchYear || ''}
                onChange={(e) => setFormData({...formData, batchYear: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <option value="">Select batch year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Job Title</label>
              <input 
                type="text"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Company */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Company</label>
              <input 
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>

            {/* Current Address */}
            <div className="space-y-1 md:col-span-3">
              <label className="text-sm font-semibold text-gray-700">Current Address</label>
              <input 
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all text-sm ${isEditing ? 'bg-white border-blue-400 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'}`}
              />
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 max-w-3xl">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          {passwordError && <p className="text-sm text-red-500 mt-4">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-green-600 mt-4">{passwordSuccess}</p>}
          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="mt-5 px-6 py-2 bg-[#003087] text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
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