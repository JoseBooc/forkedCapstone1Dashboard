import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Target, TrendingUp, Users, Calendar, X, ChevronLeft, Lock, Heart, CheckCircle2 } from 'lucide-react';
import { Footer } from '../Footer';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  budget_goal: string;
  raised_amount: string;
  target_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'paused' | 'cancelled';
  image_url?: string;
  collaboration_partner?: string;
  is_active: boolean;
  progress_percentage?: number;
  days_remaining?: string;
  remaining_amount?: number;
  donors_count?: number;
}

interface ProjectsViewProps {
  userRole?: 'alumni' | 'admin';
  onNavigate?: (view: string) => void;
}

export function ProjectsView({ userRole = 'alumni', onNavigate }: ProjectsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDonating, setIsDonating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget_goal: '',
    target_date: '',
    collaboration_partner: '',
    image_url: '',
    status: 'upcoming' as const,
  });

  const [donationData, setDonationData] = useState({
    amount: '',
    firstName: '',
    lastName: '',
    email: '',
    paymentMethod: 'Credit Card',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!formData.title || !formData.budget_goal || !formData.target_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget_goal: parseFloat(formData.budget_goal),
        }),
      });

      if (response.ok) {
        alert('Project created successfully!');
        fetchProjects();
        setShowForm(false);
        setIsCreating(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          budget_goal: '',
          target_date: '',
          collaboration_partner: '',
          image_url: '',
          status: 'upcoming',
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Project deleted successfully');
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleDonateToProject = async () => {
    if (!donationData.amount || !donationData.firstName || !donationData.lastName || !donationData.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedProject) return;

    setIsDonating(true);
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${selectedProject.id}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(donationData.amount),
          first_name: donationData.firstName,
          last_name: donationData.lastName,
          email: donationData.email,
          payment_method: donationData.paymentMethod,
        }),
      });

      if (response.ok) {
        alert('Thank you for your support!');
        setShowDonationModal(false);
        fetchProjects();
        setDonationData({
          amount: '',
          firstName: '',
          lastName: '',
          email: '',
          paymentMethod: 'Credit Card',
        });
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Failed to process donation');
    } finally {
      setIsDonating(false);
    }
  };

  const getFilteredProjects = () => {
    let filtered = projects;
    if (activeTab === 'active') {
      filtered = filtered.filter(p => p.status === 'active');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(p => p.status === 'completed');
    }
    return filtered;
  };

  if (showForm) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => {
                setShowForm(false);
                setIsCreating(false);
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  budget_goal: '',
                  target_date: '',
                  collaboration_partner: '',
                  image_url: '',
                  status: 'upcoming',
                });
              }}
              className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Projects
            </button>

            <div className="bg-white rounded-[40px] shadow-xl p-12 space-y-8 border border-gray-100">
              <div className="space-y-2 border-b border-gray-100 pb-8">
                <h1 className="text-4xl font-bold text-gray-900">Create New Project</h1>
                <p className="text-gray-500">Launch a new give-back initiative or OSMQA collaboration</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Project Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Community Water Project"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the project goals and impact..."
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option>Infrastructure</option>
                      <option>Education</option>
                      <option>Environment</option>
                      <option>Healthcare</option>
                      <option>Community Service</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Collaboration Partner</label>
                    <input
                      type="text"
                      value={formData.collaboration_partner}
                      onChange={(e) => setFormData({ ...formData, collaboration_partner: e.target.value })}
                      placeholder="e.g., OSMQA Organization"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Budget Goal (₱) *</label>
                    <input
                      type="number"
                      value={formData.budget_goal}
                      onChange={(e) => setFormData({ ...formData, budget_goal: e.target.value })}
                      placeholder="0.00"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Target Date *</label>
                    <input
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateProject}
                    className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-all"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* HERO */}
        <div className="bg-[#003087] text-white py-24 px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Give Back Projects</h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Support community initiatives and collaborative projects that create lasting impact
            </p>
            <div className="pt-4">
              {userRole === 'admin' && (
                <button
                  onClick={() => {
                    setShowForm(true);
                    setIsCreating(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" /> Create New Project
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto px-8 mt-16 border-b border-gray-200">
          <div className="flex gap-12">
            {(['all', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-base font-bold transition-all border-b-4 capitalize ${
                  activeTab === tab
                    ? 'border-[#003087] text-[#003087]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECTS LIST */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-semibold text-lg">Loading projects...</p>
            </div>
          ) : getFilteredProjects().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-semibold text-lg">No projects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {getFilteredProjects().map((project) => (
                <div key={project.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Image/Icon */}
                    <div className="md:w-2/5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl h-64 flex items-center justify-center shrink-0">
                      <Target className="w-20 h-20 text-[#003087] opacity-30" />
                    </div>

                    {/* Right: Content */}
                    <div className="md:w-3/5 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <span className="inline-block bg-blue-100 text-[#003087] text-xs font-bold px-3 py-1 rounded-full mb-3">
                            {project.category}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{project.description.substring(0, 150)}...</p>
                          {project.collaboration_partner && (
                            <p className="text-sm text-[#003087] font-semibold mt-2 flex items-center gap-2">
                              <Heart className="w-4 h-4" /> Partnership: {project.collaboration_partner}
                            </p>
                          )}
                        </div>
                        {userRole === 'admin' && (
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => handleDeleteProject(project.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-600">Progress</span>
                          <span className="text-sm font-bold text-[#003087]">{project.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                          <div
                            className="h-full bg-[#003087] rounded-full transition-all"
                            style={{ width: `${Math.min(100, project.progress_percentage || 0)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                        <div className="bg-blue-50 rounded-xl p-4">
                          <span className="text-xs font-semibold text-gray-600">Goal</span>
                          <p className="text-lg font-bold text-[#003087]">₱{parseFloat(project.budget_goal).toLocaleString()}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                          <span className="text-xs font-semibold text-gray-600">Raised</span>
                          <p className="text-lg font-bold text-green-600">₱{parseFloat(project.raised_amount).toLocaleString()}</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4">
                          <span className="text-xs font-semibold text-gray-600">Supporters</span>
                          <p className="text-lg font-bold text-orange-600">{project.donors_count || 0}</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4">
                          <span className="text-xs font-semibold text-gray-600">Status</span>
                          <p className="text-lg font-bold text-red-600 capitalize">{project.status}</p>
                        </div>
                      </div>

                      {/* Bottom */}
                      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          <span className="font-bold text-[#003087]">
                            ₱{(project.remaining_amount || 0).toLocaleString()}
                          </span>
                          {' '}remaining
                        </p>
                        {userRole === 'alumni' && (
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setShowDonationModal(true);
                            }}
                            className="px-8 py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all shadow-lg"
                          >
                            Support Project
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DONATION MODAL */}
        {showDonationModal && selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Support {selectedProject.title}</h2>
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="font-bold text-[#003087]">₱{parseFloat(selectedProject.raised_amount).toLocaleString()} / ₱{parseFloat(selectedProject.budget_goal).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#003087] rounded-full"
                      style={{ width: `${Math.min(100, selectedProject.progress_percentage || 0)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Support Amount (₱) *</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {['500', '1000', '5000', '10000'].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDonationData({ ...donationData, amount: amt })}
                        className={`p-3 border-2 rounded-lg font-bold transition-all ${
                          donationData.amount === amt
                            ? 'bg-[#003087] border-[#003087] text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087]'
                        }`}
                      >
                        ₱{amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={donationData.amount}
                    onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                    placeholder="Custom amount"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">First Name *</label>
                    <input
                      type="text"
                      value={donationData.firstName}
                      onChange={(e) => setDonationData({ ...donationData, firstName: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      value={donationData.lastName}
                      onChange={(e) => setDonationData({ ...donationData, lastName: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={donationData.email}
                    onChange={(e) => setDonationData({ ...donationData, email: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Credit Card', 'GCash', 'Bank Transfer'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setDonationData({ ...donationData, paymentMethod: m })}
                        className={`p-3 border-2 rounded-xl font-bold text-sm transition-all ${
                          donationData.paymentMethod === m
                            ? 'bg-[#003087] border-[#003087] text-white'
                            : 'bg-white border-gray-200 text-gray-600'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => setShowDonationModal(false)}
                    disabled={isDonating}
                    className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDonateToProject}
                    disabled={isDonating}
                    className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg hover:bg-[#002566] transition-all disabled:opacity-50"
                  >
                    {isDonating ? 'Processing...' : `Support with ₱${donationData.amount || '0'}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
