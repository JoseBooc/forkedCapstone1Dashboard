import { useState, useEffect } from 'react';
import { 
  Heart, 
  ChevronLeft,
  CreditCard,
  Lock,
  Target,
  Calendar,
  TrendingUp,
  Settings,
  BarChart3,
  DollarSign,
  Users,
  Award,
  Check
} from 'lucide-react';
import { Footer } from '../Footer';
import { CampaignsManagementView } from './CampaignsManagementView';

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
  days_left?: string;
  progress_percentage?: number;
  donors_count?: number;
  remaining_amount?: number;
}

interface DonationsViewProps {
  userRole?: 'alumni' | 'admin';
}

interface Statistics {
  total_raised_this_year: number;
  active_donors: number;
  scholarships_awarded: number;
}

interface Donation {
  id: number;
  campaign_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  amount: number;
  payment_method: string;
  created_at: string;
  campaign?: Campaign;
}

interface CampaignDonationGroup {
  campaign: Campaign;
  total: number;
  count: number;
  donations: Donation[];
}

interface AnalyticsData {
  all_donations: Donation[];
  general_donations: {
    donations: Donation[];
    total: number;
    count: number;
  };
  campaign_donations: CampaignDonationGroup[];
  overall_total: number;
  overall_count: number;
}

export function DonationsView({ userRole = 'alumni' }: DonationsViewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [showManagement, setShowManagement] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>({
    total_raised_this_year: 0,
    active_donors: 0,
    scholarships_awarded: 1200
  });
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showCampaignSelect, setShowCampaignSelect] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchCampaigns();
    fetchStatistics();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/campaigns?role=${userRole}`);
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/donations/statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/donations/analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedCampaign) {
        // Donate to a specific campaign
        await fetch(`http://localhost:8000/api/campaigns/${selectedCampaign.id}/donate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: parseFloat(finalAmount || '0'),
            first_name: firstName,
            last_name: lastName,
            email: email,
          }),
        });
      } else {
        // General donation
        await fetch('http://localhost:8000/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: parseFloat(finalAmount || '0'),
            first_name: firstName,
            last_name: lastName,
            email: email,
          }),
        });
      }
    } catch (error) {
      console.error('Error processing donation:', error);
    }
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setSelectedAmount(null);
      setCustomAmount('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setShowPaymentSection(false);
      setShowDonationForm(false);
      setShowCampaignSelect(false);
      setSelectedCampaign(null);
      fetchCampaigns(); // Refresh campaigns
    }, 3000);
  };

  const finalAmount = customAmount || selectedAmount?.replace('₱', '').replace(',', '');

  const canProceedToPayment = finalAmount && firstName && lastName && email;

  // Show analytics dashboard for admin
  if (showAnalytics && userRole === 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <div className="p-8">
          <button 
            onClick={() => {
              setShowAnalytics(false);
              setAnalyticsData(null);
            }} 
            className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Donations
          </button>

          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#003087] rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Donation Analytics</h1>
              <p className="text-gray-600 text-lg">Comprehensive view of all donations and campaign performance</p>
            </div>

            {analyticsData ? (
              <>
                {/* Overview Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8" />
                      <span className="text-sm font-semibold opacity-90">Overall Total</span>
                    </div>
                    <p className="text-3xl font-bold">₱{analyticsData.overall_total.toLocaleString()}</p>
                    <p className="text-sm opacity-90 mt-2">{analyticsData.overall_count} donations</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <Heart className="w-8 h-8" />
                      <span className="text-sm font-semibold opacity-90">General Donations</span>
                    </div>
                    <p className="text-3xl font-bold">₱{analyticsData.general_donations.total.toLocaleString()}</p>
                    <p className="text-sm opacity-90 mt-2">{analyticsData.general_donations.count} donations</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="w-8 h-8" />
                      <span className="text-sm font-semibold opacity-90">Campaign Donations</span>
                    </div>
                    <p className="text-3xl font-bold">
                      ₱{(analyticsData.overall_total - analyticsData.general_donations.total).toLocaleString()}
                    </p>
                    <p className="text-sm opacity-90 mt-2">
                      {analyticsData.overall_count - analyticsData.general_donations.count} donations
                    </p>
                  </div>
                </div>

                {/* General Donations Table */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-green-600" />
                    General Donations
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Donor Name</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Email</th>
                          <th className="text-right py-3 px-4 font-bold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.general_donations.donations.map((donation) => (
                          <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{donation.first_name} {donation.last_name}</td>
                            <td className="py-3 px-4 text-gray-600">{donation.email}</td>
                            <td className="py-3 px-4 text-right font-bold text-green-600">
                              ₱{donation.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300 bg-gray-50">
                          <td colSpan={2} className="py-3 px-4 font-bold text-gray-900">Total</td>
                          <td className="py-3 px-4 text-right font-bold text-green-600 text-lg">
                            ₱{analyticsData.general_donations.total.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {analyticsData.general_donations.count} donations
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Campaign Donations */}
                {analyticsData.campaign_donations.map((campaignGroup) => (
                  <div key={campaignGroup.campaign.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <Target className="w-6 h-6 text-[#003087]" />
                        {campaignGroup.campaign.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          {campaignGroup.campaign.category || 'General'}
                        </span>
                        <span>
                          ₱{campaignGroup.total.toLocaleString()} raised from {campaignGroup.count} donors
                        </span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 font-bold text-gray-700">Donor Name</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700">Email</th>
                            <th className="text-right py-3 px-4 font-bold text-gray-700">Amount</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaignGroup.donations.map((donation) => (
                            <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">{donation.first_name} {donation.last_name}</td>
                              <td className="py-3 px-4 text-gray-600">{donation.email}</td>
                              <td className="py-3 px-4 text-right font-bold text-[#003087]">
                                ₱{donation.amount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(donation.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-gray-300 bg-gray-50">
                            <td colSpan={2} className="py-3 px-4 font-bold text-gray-900">Campaign Total</td>
                            <td className="py-3 px-4 text-right font-bold text-[#003087] text-lg">
                              ₱{campaignGroup.total.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {campaignGroup.count} donations
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading analytics data...</p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show campaign management for admin
  if (showManagement && userRole === 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <div className="p-8">
          <button 
            onClick={() => {
              setShowManagement(false);
              fetchCampaigns(); // Refresh campaigns when returning
            }} 
            className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Donations
          </button>
        </div>
        <CampaignsManagementView userRole={userRole} />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-white rounded-[40px] shadow-xl p-12 max-w-md text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-green-600 fill-current" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
            <p className="text-gray-600">Your donation of ₱{finalAmount} has been processed successfully.</p>
            <p className="text-sm text-gray-500">A receipt has been sent to your email.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!showDonationForm) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1">
          <div className="relative">
            {/* Hero Section */}
            <div className="bg-[#003087] text-white py-16 px-8 pb-24">
              <div className="max-w-6xl mx-auto text-center space-y-6">
                <h1 className="text-5xl font-bold">Supporting Excellence at ADDU</h1>
                <p className="text-xl text-blue-100 max-w-4xl mx-auto">
                  Your generosity empowers students, advances research, and strengthens our Jesuit mission of service
                  and excellence. Together, we're building a brighter future for the Philippines.
                </p>
                <button
                  onClick={() => {
                    setSelectedCampaign(null);
                    setShowDonationForm(true);
                  }}
                  className="mt-6 px-10 py-4 bg-white text-[#003087] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  Make General Donation
                </button>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="max-w-6xl mx-auto px-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16">
                {/* Raised This Year */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 text-center">
                  <p className="text-4xl font-bold text-[#003087] mb-2">
                    ₱{(statistics.total_raised_this_year / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-gray-600 font-semibold">Raised This Year</p>
                </div>

                {/* Active Donors */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 text-center">
                  <p className="text-4xl font-bold text-[#003087] mb-2">
                    {statistics.active_donors.toLocaleString()}
                  </p>
                  <p className="text-gray-600 font-semibold">Active Donors</p>
                </div>

                {/* Scholarships Awarded */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 text-center">
                  <p className="text-4xl font-bold text-[#003087] mb-2">
                    {statistics.scholarships_awarded.toLocaleString()}+
                  </p>
                  <p className="text-gray-600 font-semibold">Scholarships Awarded</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="py-8 space-y-8">
              {/* Admin Button Section */}
              <div className="max-w-6xl mx-auto px-8">
                {userRole === 'admin' && (
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setShowAnalytics(true);
                        fetchAnalytics();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all text-sm"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Analytics
                    </button>
                    <button
                      onClick={() => setShowManagement(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Campaigns
                    </button>
                  </div>
                )}
              </div>

              {/* Active Campaigns */}
              <div className="max-w-6xl mx-auto px-8">
              {campaigns.filter(c => c.is_active).length > 0 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Active Donation Campaigns</h2>
                    <p className="text-gray-600">Support specific projects and initiatives. Track progress and see the impact of our community's generosity.</p>
                  </div>

                <div className="space-y-6">
                  {campaigns.filter(c => c.is_active).map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                        {/* Campaign Image */}
                        <div className="md:col-span-4 relative">
                          <div className="relative h-full min-h-[200px] rounded-xl overflow-hidden">
                            {campaign.image_url ? (
                              <img 
                                src={campaign.image_url.startsWith('http') 
                                  ? campaign.image_url 
                                  : `http://localhost:8000${campaign.image_url}`
                                } 
                                alt={campaign.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '';
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).parentElement!.innerHTML = `
                                    <div class="w-full h-full bg-gradient-to-br from-[#003087] to-[#0052cc] flex items-center justify-center">
                                      <svg class="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    </div>
                                  `;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#003087] to-[#0052cc] flex items-center justify-center">
                                <Heart className="w-16 h-16 text-white/30" />
                              </div>
                            )}
                            
                            {/* Category Badge */}
                            {campaign.category && (
                              <div className="absolute top-3 left-3">
                                <span className="bg-[#003087] text-white text-xs font-bold px-3 py-1 rounded-full">
                                  {campaign.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Campaign Info */}
                        <div className="md:col-span-8 space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{campaign.description}</p>
                          </div>

                          {/* Progress Section */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-700">Progress</span>
                              <span className="text-lg font-bold text-[#003087]">{campaign.progress_percentage?.toFixed(1)}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-[#003087] h-4 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(campaign.progress_percentage || 0, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Goal */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                              <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <Target className="w-4 h-4" />
                                <span className="text-xs font-semibold">Goal</span>
                              </div>
                              <p className="text-xl font-bold text-blue-900">₱{campaign.goal_amount.toLocaleString()}</p>
                            </div>

                            {/* Raised */}
                            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                              <div className="flex items-center gap-2 text-green-600 mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xs font-semibold">Raised</span>
                              </div>
                              <p className="text-xl font-bold text-green-900">₱{campaign.raised_amount.toLocaleString()}</p>
                            </div>

                            {/* Donors */}
                            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                              <div className="flex items-center gap-2 text-orange-600 mb-1">
                                <Heart className="w-4 h-4" />
                                <span className="text-xs font-semibold">Donors</span>
                              </div>
                              <p className="text-xl font-bold text-orange-900">{campaign.donors_count || 0}</p>
                            </div>

                            {/* Days Left */}
                            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                              <div className="flex items-center gap-2 text-red-600 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-semibold">Days Left</span>
                              </div>
                              <p className="text-xl font-bold text-red-900">
                                {campaign.days_left?.includes('day') ? campaign.days_left.split(' ')[0] : campaign.days_left}
                              </p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-bold text-[#003087]">₱{(campaign.remaining_amount || 0).toLocaleString()}</span> remaining to reach goal
                            </p>
                            <button
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowDonationForm(true);
                              }}
                              className="flex items-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all"
                            >
                              <Heart className="w-4 h-4" />
                              Donate Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>

            {/* Donor Recognition Section */}
            <div className="max-w-6xl mx-auto px-8 py-16">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-bold text-gray-900">Donor Recognition</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  We honor our generous supporters who make our mission possible. Join our community of changemakers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Founder's Circle */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Founder's Circle</h3>
                      <p className="text-yellow-100 font-semibold">₱1,000,000+</p>
                    </div>
                    <Award className="w-12 h-12" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Named endowment opportunities</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Private events with university leadership</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Campus building/room naming rights</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Lifetime recognition on Founder's Wall</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Annual impact reports and personal updates</span>
                    </div>
                  </div>
                </div>

                {/* President's Council */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">President's Council</h3>
                      <p className="text-gray-100 font-semibold">₱500,000 - ₱999,999</p>
                    </div>
                    <Award className="w-12 h-12" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Invitation to exclusive university events</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Recognition in annual donor report</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Personal thank you from the President</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Priority access to campus events</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Quarterly impact updates</span>
                    </div>
                  </div>
                </div>

                {/* Loyola Society */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Loyola Society</h3>
                      <p className="text-orange-100 font-semibold">₱100,000 - ₱499,999</p>
                    </div>
                    <Award className="w-12 h-12" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Annual recognition event invitation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Name in university publications</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Donor appreciation events</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Semi-annual impact reports</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Special ADDU memorabilia</span>
                    </div>
                  </div>
                </div>

                {/* Blue & Gold Circle */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Blue & Gold Circle</h3>
                      <p className="text-blue-100 font-semibold">₱25,000 - ₱99,999</p>
                    </div>
                    <Heart className="w-12 h-12" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Recognition in donor honor roll</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Annual impact summary</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">University event invitations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Tax receipt and thank you letter</span>
                    </div>
                  </div>
                </div>
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
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => {
              setShowDonationForm(false);
              setSelectedCampaign(null);
              setSelectedAmount('');
              setCustomAmount('');
              setFirstName('');
              setLastName('');
              setEmail('');
              setCardNumber('');
              setExpiryDate('');
              setCvv('');
            }} 
            className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-[#003087] transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Campaigns
          </button>

          <div className="bg-white rounded-[40px] shadow-xl p-12 border border-gray-100">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4 pb-8 border-b border-gray-100">
                <div className="w-16 h-16 bg-[#003087] rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Make a Donation</h1>
                <p className="text-gray-500">Support ADDU and make a lasting difference</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Amount Selection */}
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-gray-900">Select Amount</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['₱100', '₱500', '₱1,000', '₱5,000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`py-4 rounded-xl font-bold border-2 transition-all ${
                          selectedAmount === amt 
                            ? 'bg-[#003087] border-[#003087] text-white' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₱</span>
                    <input
                      type="number"
                      placeholder="Or enter custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-gray-900">Your Information</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name *"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Last Name *"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </label>
                  <input
                    type="text"
                    placeholder="Card Number *"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    maxLength={19}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY *"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                      maxLength={5}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="CVV *"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      maxLength={4}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-900">Your payment information is secure and encrypted</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!finalAmount || !firstName || !lastName || !email || !cardNumber || !expiryDate || !cvv}
                  className="w-full py-5 bg-[#003087] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#002566] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Donate ₱{finalAmount || '0'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}