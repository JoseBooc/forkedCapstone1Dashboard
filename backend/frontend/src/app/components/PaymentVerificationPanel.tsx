import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Download, Search } from 'lucide-react';

interface PaymentVerificationProps {
  userRole: 'alumni' | 'admin';
}

interface Registration {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  activity_id: number;
  activity: {
    id: number;
    title: string;
    venue: string;
    schedule_start: string;
  };
  guests_count: number;
  amount_due: number;
  payment_method: string;
  reference_number: string | null;
  proof_path: string | null;
  payment_status: 'pending' | 'verified' | 'rejected';
  status: string;
  created_at: string;
}

interface Donation {
  id: number;
  amount: number;
  frequency: string;
  designation: string;
  payment_method: string;
  reference_number: string | null;
  transaction_date: string | null;
  gcash_number: string | null;
  account_name: string | null;
  bank_name: string | null;
  card_number: string | null;
  proof_path: string | null;
  payment_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export function PaymentVerificationPanel({ userRole }: PaymentVerificationProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showDonationProofModal, setShowDonationProofModal] = useState(false);
  const [activeSection, setActiveSection] = useState<'registrations' | 'donations'>('registrations');

  useEffect(() => {
    if (userRole === 'admin') {
      fetchRegistrations();
      fetchDonations();
    }
  }, [userRole]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/giveback/registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    setLoadingDonations(true);
    try {
      const response = await fetch('http://localhost:8000/api/donations');
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoadingDonations(false);
    }
  };

  const updatePaymentStatus = async (id: number, status: Registration['payment_status']) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/registrations/${id}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: status }),
      });
      if (response.ok) {
        await fetchRegistrations();
        alert(`Payment ${status} successfully!`);
      } else {
        alert('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error updating payment status');
    }
  };

  const updateDonationStatus = async (id: number, status: Donation['payment_status']) => {
    try {
      const response = await fetch(`http://localhost:8000/api/donations/${id}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: status }),
      });
      if (response.ok) {
        await fetchDonations();
        alert(`Donation ${status} successfully!`);
      } else {
        alert('Failed to update donation status');
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesFilter = filter === 'all' || reg.payment_status === filter;
    const matchesSearch =
      searchTerm === '' ||
      reg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.activity?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    pending: registrations.filter((r) => r.payment_status === 'pending').length,
    verified: registrations.filter((r) => r.payment_status === 'verified').length,
    rejected: registrations.filter((r) => r.payment_status === 'rejected').length,
    total: registrations.length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (userRole !== 'admin') {
    return <div className="p-8 text-center text-gray-500">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Verification Panel</h1>
            <p className="text-gray-600">Review and verify payment submissions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSection('registrations')}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                activeSection === 'registrations' ? 'bg-[#003087] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Event Registrations
            </button>
            <button
              onClick={() => setActiveSection('donations')}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeSection === 'donations' ? 'bg-[#003087] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              GiveBack Donations
              {donations.filter((d) => d.payment_status === 'pending').length > 0 && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {donations.filter((d) => d.payment_status === 'pending').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── REGISTRATIONS SECTION ── */}
        {activeSection === 'registrations' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
                </div>
                <p className="text-sm text-gray-600">Pending Verification</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.verified}</span>
                </div>
                <p className="text-sm text-gray-600">Verified Payments</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.rejected}</span>
                </div>
                <p className="text-sm text-gray-600">Rejected Payments</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                </div>
                <p className="text-sm text-gray-600">Total Registrations</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  {(['all', 'pending', 'verified', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        filter === status
                          ? 'bg-[#003087] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                      {status !== 'all' && (
                        <span className="ml-2 text-xs">({stats[status as keyof typeof stats]})</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] w-full md:w-80"
                  />
                </div>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Registrant', 'Event', 'Payment Method', 'Reference #', 'Amount', 'Status', 'Date', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Loading registrations...</td></tr>
                    ) : filteredRegistrations.length === 0 ? (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No registrations found</td></tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{reg.first_name} {reg.last_name}</p>
                              <p className="text-sm text-gray-500">{reg.email}</p>
                              {reg.guests_count > 0 && (
                                <p className="text-xs text-gray-400">+{reg.guests_count} guest(s)</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{reg.activity?.title || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{reg.activity?.venue || ''}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {reg.payment_method.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{reg.reference_number || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{formatCurrency(reg.amount_due)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              reg.payment_status === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : reg.payment_status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reg.payment_status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {reg.payment_status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                              {reg.payment_status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {reg.payment_status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">{formatDate(reg.created_at)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 items-center">
                              {reg.proof_path && (
                                <button
                                  onClick={() => { setSelectedRegistration(reg); setShowProofModal(true); }}
                                  className="text-[#003087] hover:text-blue-700 font-medium text-sm"
                                >
                                  View Proof
                                </button>
                              )}
                              {reg.payment_status === 'pending' && (
                                <>
                                  <button onClick={() => updatePaymentStatus(reg.id, 'verified')} className="text-green-600 hover:text-green-800" title="Approve">
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => updatePaymentStatus(reg.id, 'rejected')} className="text-red-600 hover:text-red-800" title="Reject">
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                              {reg.payment_status !== 'pending' && (
                                <button onClick={() => updatePaymentStatus(reg.id, 'pending')} className="text-gray-600 hover:text-gray-800" title="Revert to Pending">
                                  <Clock className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── DONATIONS SECTION ── */}
        {activeSection === 'donations' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <Clock className="w-6 h-6 text-yellow-600" />, count: donations.filter((d) => d.payment_status === 'pending').length, label: 'Pending' },
                { icon: <CheckCircle className="w-6 h-6 text-green-600" />, count: donations.filter((d) => d.payment_status === 'verified').length, label: 'Verified' },
                { icon: <XCircle className="w-6 h-6 text-red-600" />, count: donations.filter((d) => d.payment_status === 'rejected').length, label: 'Rejected' },
                { icon: <FileText className="w-6 h-6 text-blue-600" />, count: donations.length, label: 'Total Donations' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">{s.icon}<span className="text-2xl font-bold text-gray-900">{s.count}</span></div>
                  <p className="text-sm text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Donor', 'Amount', 'Designation', 'Payment Method', 'Reference #', 'Date', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingDonations ? (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Loading donations...</td></tr>
                    ) : donations.length === 0 ? (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No donations found</td></tr>
                    ) : (
                      donations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{donation.account_name || donation.gcash_number || 'Anonymous'}</p>
                            <p className="text-xs text-gray-400">{donation.payment_method}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{formatCurrency(donation.amount)}</p>
                            <p className="text-xs text-gray-400">{donation.frequency}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700">{donation.designation}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {donation.payment_method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{donation.reference_number || 'N/A'}</p>
                            {donation.transaction_date && (
                              <p className="text-xs text-gray-400">{donation.transaction_date}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">{formatDate(donation.created_at)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              donation.payment_status === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : donation.payment_status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {donation.payment_status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {donation.payment_status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                              {donation.payment_status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {donation.payment_status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 items-center">
                              {donation.proof_path && (
                                <button
                                  onClick={() => { setSelectedDonation(donation); setShowDonationProofModal(true); }}
                                  className="text-[#003087] hover:text-blue-700 font-medium text-sm"
                                >
                                  View Proof
                                </button>
                              )}
                              {donation.payment_status === 'pending' && (
                                <>
                                  <button onClick={() => updateDonationStatus(donation.id, 'verified')} className="text-green-600 hover:text-green-800" title="Approve">
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => updateDonationStatus(donation.id, 'rejected')} className="text-red-600 hover:text-red-800" title="Reject">
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                              {donation.payment_status !== 'pending' && (
                                <button onClick={() => updateDonationStatus(donation.id, 'pending')} className="text-gray-600 hover:text-gray-800" title="Revert to Pending">
                                  <Clock className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── REGISTRATION PROOF MODAL ── */}
      {showProofModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Proof of Payment</h2>
              <button onClick={() => setShowProofModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Registration Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedRegistration.first_name} {selectedRegistration.last_name}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedRegistration.email}</p>
                  <p className="text-sm"><span className="font-medium">Event:</span> {selectedRegistration.activity?.title}</p>
                  <p className="text-sm"><span className="font-medium">Amount:</span> {formatCurrency(selectedRegistration.amount_due)}</p>
                  <p className="text-sm"><span className="font-medium">Payment Method:</span> {selectedRegistration.payment_method.replace('_', ' ')}</p>
                  {selectedRegistration.reference_number && (
                    <p className="text-sm"><span className="font-medium">Reference #:</span> {selectedRegistration.reference_number}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Proof Image</h3>
                {selectedRegistration.proof_path ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img src={`http://localhost:8000${selectedRegistration.proof_path}`} alt="Proof of Payment" className="w-full h-auto" />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No proof uploaded</p>
                )}
              </div>
              {selectedRegistration.proof_path && (
                <div className="mt-4">
                  <a href={`http://localhost:8000${selectedRegistration.proof_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#003087] font-semibold hover:underline">
                    <Download className="w-4 h-4" /> Download Full Image
                  </a>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              {selectedRegistration.payment_status === 'pending' && (
                <>
                  <button onClick={() => { updatePaymentStatus(selectedRegistration.id, 'verified'); setShowProofModal(false); }} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors">Approve</button>
                  <button onClick={() => { updatePaymentStatus(selectedRegistration.id, 'rejected'); setShowProofModal(false); }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Reject</button>
                </>
              )}
              <button onClick={() => setShowProofModal(false)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DONATION PROOF MODAL ── */}
      {showDonationProofModal && selectedDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Donation Proof of Payment</h2>
              <button onClick={() => setShowDonationProofModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Donation Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><span className="font-medium">Amount:</span> {formatCurrency(selectedDonation.amount)} ({selectedDonation.frequency})</p>
                  <p className="text-sm"><span className="font-medium">Designation:</span> {selectedDonation.designation}</p>
                  <p className="text-sm"><span className="font-medium">Payment Method:</span> {selectedDonation.payment_method}</p>
                  {selectedDonation.gcash_number && <p className="text-sm"><span className="font-medium">GCash Number:</span> {selectedDonation.gcash_number}</p>}
                  {selectedDonation.account_name && <p className="text-sm"><span className="font-medium">Account Name:</span> {selectedDonation.account_name}</p>}
                  {selectedDonation.bank_name && <p className="text-sm"><span className="font-medium">Bank:</span> {selectedDonation.bank_name}</p>}
                  {selectedDonation.reference_number && <p className="text-sm"><span className="font-medium">Reference #:</span> {selectedDonation.reference_number}</p>}
                  {selectedDonation.transaction_date && <p className="text-sm"><span className="font-medium">Transaction Date:</span> {selectedDonation.transaction_date}</p>}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Proof Image</h3>
                {selectedDonation.proof_path ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img src={`http://localhost:8000${selectedDonation.proof_path}`} alt="Proof of Payment" className="w-full h-auto" />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No proof uploaded</p>
                )}
                {selectedDonation.proof_path && (
                  <a href={`http://localhost:8000${selectedDonation.proof_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 text-[#003087] font-semibold hover:underline">
                    <Download className="w-4 h-4" /> Download Full Image
                  </a>
                )}
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              {selectedDonation.payment_status === 'pending' && (
                <>
                  <button onClick={() => { updateDonationStatus(selectedDonation.id, 'verified'); setShowDonationProofModal(false); }} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors">Approve</button>
                  <button onClick={() => { updateDonationStatus(selectedDonation.id, 'rejected'); setShowDonationProofModal(false); }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Reject</button>
                </>
              )}
              <button onClick={() => setShowDonationProofModal(false)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}