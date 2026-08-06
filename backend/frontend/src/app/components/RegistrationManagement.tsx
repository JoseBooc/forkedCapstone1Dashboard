import { useState, useEffect } from 'react';
import { Users, Search, Filter, Download, Eye, Trash2, Archive } from 'lucide-react';

interface RegistrationManagementProps {
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

export function RegistrationManagement({ userRole }: RegistrationManagementProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [events, setEvents] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchRegistrations();
      fetchEvents();
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

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/giveback/activities');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      searchTerm === '' ||
      reg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reg.payment_status === statusFilter;
    const matchesEvent = eventFilter === 'all' || reg.activity_id === Number(eventFilter);
    return matchesSearch && matchesStatus && matchesEvent;
  });

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
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Event', 'Guests', 'Amount', 'Payment Method', 'Status', 'Date'];
    const csvData = filteredRegistrations.map((reg) => [
      reg.id,
      `${reg.first_name} ${reg.last_name}`,
      reg.email,
      reg.activity?.title || 'N/A',
      reg.guests_count,
      reg.amount_due,
      reg.payment_method,
      reg.payment_status,
      reg.created_at,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const stats = {
    total: registrations.length,
    totalRevenue: registrations.filter((r) => r.payment_status === 'verified').reduce((sum, r) => sum + r.amount_due, 0),
    avgPayment: registrations.length > 0
      ? registrations.filter((r) => r.payment_status === 'verified').reduce((sum, r) => sum + r.amount_due, 0) / registrations.filter((r) => r.payment_status === 'verified').length
      : 0,
  };

  if (userRole !== 'admin') {
    return <div className="p-8 text-center text-gray-500">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Management</h1>
          <p className="text-gray-600">View and manage all event registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600">Total Registrations</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Download className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</span>
            </div>
            <p className="text-sm text-gray-600">Total Verified Revenue</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Filter className="w-6 h-6 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgPayment)}</span>
            </div>
            <p className="text-sm text-gray-600">Average Payment</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search registrants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              >
                <option value="all">All Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002566] transition-colors font-semibold"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Registrant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Loading registrations...
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {reg.first_name} {reg.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{reg.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{reg.activity?.title || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{formatDate(reg.activity?.schedule_start || '')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{reg.guests_count}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{formatCurrency(reg.amount_due)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{reg.payment_method.replace('_', ' ')}</p>
                        {reg.reference_number && (
                          <p className="text-xs text-gray-500">Ref: {reg.reference_number}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            reg.payment_status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : reg.payment_status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reg.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{formatDate(reg.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <a
                            href={`http://localhost:8000/api/giveback/registrations/${reg.id}/receipt`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#003087] hover:text-blue-700 font-medium text-sm"
                            title="Download Receipt"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
