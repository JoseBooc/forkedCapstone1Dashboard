import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, X, Calendar, Target, TrendingUp } from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  description: string;
  category?: string;
  image_url?: string;
  goal_amount: number;
  raised_amount: number;
  end_date: string;
  is_active: boolean;
  days_left: string;
  progress_percentage: number;
  donors_count?: number;
  remaining_amount?: number;
}

interface Donor {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  amount: number;
  created_at: string;
}

interface CampaignsManagementViewProps {
  userRole: 'alumni' | 'admin';
}

export function CampaignsManagementView({ userRole }: CampaignsManagementViewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [selectedCampaignDonors, setSelectedCampaignDonors] = useState<Donor[]>([]);
  const [selectedCampaignTitle, setSelectedCampaignTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    goal_amount: '',
    end_date: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/campaigns?role=admin');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCampaign 
        ? `http://localhost:8000/api/campaigns/${editingCampaign.id}`
        : 'http://localhost:8000/api/campaigns';
      
      const method = editingCampaign ? 'PUT' : 'POST';

      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('goal_amount', formData.goal_amount);
      formDataToSend.append('end_date', formData.end_date);
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      } else if (formData.image_url) {
        formDataToSend.append('image_url', formData.image_url);
      }
      
      await fetch(url, {
        method,
        body: formDataToSend,
      });

      fetchCampaigns();
      resetForm();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      category: campaign.category || '',
      image_url: campaign.image_url || '',
      goal_amount: campaign.goal_amount.toString(),
      end_date: campaign.end_date,
    });
    setImagePreview(campaign.image_url || '');
    setSelectedImage(null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await fetch(`http://localhost:8000/api/campaigns/${id}`, {
        method: 'DELETE',
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/campaigns/${id}/toggle-active`, {
        method: 'PATCH',
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error toggling campaign status:', error);
    }
  };

  const handleViewDonors = async (campaign: Campaign) => {
    try {
      const response = await fetch(`http://localhost:8000/api/campaigns/${campaign.id}/donors`);
      const donors = await response.json();
      setSelectedCampaignDonors(donors);
      setSelectedCampaignTitle(campaign.title);
      setShowDonorModal(true);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCampaign(null);
    setFormData({
      category: '',
      image_url: '',
      title: '',
      description: '',
      goal_amount: '',
      end_date: '',
    });
    setSelectedImage(null);
    setImagePreview('');
  };

  if (userRole !== 'admin') {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-semibold">Access Denied</p>
          <p className="text-red-600 text-sm mt-2">You need admin privileges to manage campaigns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Campaign Management</h1>
            <p className="text-gray-600 mt-2">Create and manage donation campaigns</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-xl font-semibold hover:bg-[#002566] transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>

        {/* Campaign Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    placeholder="e.g., Scholarship Fund 2026"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    placeholder="Describe the campaign and its purpose..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                      placeholder="e.g., Scholarships, Infrastructure"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                      placeholder="https://example.com/image.jpg"
                      disabled={!!selectedImage}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Campaign Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#003087] file:text-white hover:file:bg-[#002566] file:cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                        <img 
                          src={imagePreview.startsWith('blob:') || imagePreview.startsWith('data:') 
                            ? imagePreview 
                            : `http://localhost:8000${imagePreview}`
                          } 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview('');
                            setFormData({ ...formData, image_url: '' });
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Goal Amount (₱) *
                    </label>
                    <input
                      type="number"
                      value={formData.goal_amount}
                      onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                      required
                      min="1"
                      step="0.01"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#003087] text-white rounded-xl font-semibold hover:bg-[#002566] transition-all"
                  >
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Donor List Modal */}
        {showDonorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Donors for "{selectedCampaignTitle}"
                </h2>
                <button 
                  onClick={() => setShowDonorModal(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedCampaignDonors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No donations yet for this campaign.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCampaignDonors.map((donor) => (
                        <tr key={donor.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{donor.full_name}</td>
                          <td className="py-3 px-4 text-gray-600">{donor.email}</td>
                          <td className="py-3 px-4 text-right font-semibold text-[#003087]">
                            ₱{donor.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(donor.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200">
                        <td colSpan={2} className="py-3 px-4 font-semibold text-gray-700">
                          Total Donations: {selectedCampaignDonors.length}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#003087]">
                          ₱{selectedCampaignDonors.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all ${
                campaign.is_active ? 'border-green-200' : 'border-gray-200 opacity-60'
              }`}
            >
              {campaign.image_url && (
                <img
                  src={campaign.image_url.startsWith('http') ? campaign.image_url : `http://localhost:8000${campaign.image_url}`}
                  alt={campaign.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}
              {/* Campaign Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {campaign.is_active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleViewDonors(campaign)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  title="View Donors"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Campaign Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-[#003087]" />
                  <span className="text-gray-700">
                    Goal: <span className="font-semibold">₱{campaign.goal_amount.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">
                    Raised: <span className="font-semibold text-green-600">₱{campaign.raised_amount.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-700">
                    {campaign.days_left}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-[#003087]">
                    {campaign.progress_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#003087] h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(campaign.progress_percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(campaign.id)}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                    campaign.is_active
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {campaign.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(campaign)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No campaigns yet. Create your first campaign!</p>
          </div>
        )}
      </div>
    </div>
  );
}