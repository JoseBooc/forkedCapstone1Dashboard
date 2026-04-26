import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, X, Plus, ChevronLeft, Mail, Phone, Trash2, Eye, EyeOff } from 'lucide-react';
import { Footer } from '../Footer';

interface AlumniEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  max_attendees?: number;
  event_type: 'social' | 'professional' | 'training' | 'fundraiser' | 'networking';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_active: boolean;
  image_url?: string;
  registered_count?: number;
  available_slots?: number;
  formatted_date?: string;
  time_remaining?: string;
}

interface EventRegistration {
  id: number;
  event_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  registered_at: string;
  attended?: boolean;
}

interface AlumniCommunityViewProps {
  userRole?: 'alumni' | 'admin';
  onNavigate?: (view: string) => void;
}

export function AlumniCommunityView({ userRole = 'alumni', onNavigate }: AlumniCommunityViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [events, setEvents] = useState<AlumniEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'myEvents'>('upcoming');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AlumniEvent | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    max_attendees: '',
    event_type: 'social' as const,
    status: 'upcoming' as const,
  });

  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        }),
      });

      if (response.ok) {
        alert('Event created successfully!');
        fetchEvents();
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          date: '',
          time: '',
          location: '',
          max_attendees: '',
          event_type: 'social',
          status: 'upcoming',
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const handleRegisterEvent = async () => {
    if (!registrationData.firstName || !registrationData.lastName || !registrationData.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedEvent) return;

    setIsRegistering(true);
    try {
      const response = await fetch(`http://localhost:8000/api/events/${selectedEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: registrationData.firstName,
          last_name: registrationData.lastName,
          email: registrationData.email,
          phone: registrationData.phone || null,
        }),
      });

      if (response.ok) {
        alert('Successfully registered for the event!');
        setShowRegistrationModal(false);
        fetchEvents();
        setRegistrationData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for event');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Event deleted successfully');
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      if (activeTab === 'upcoming') {
        return eventDate >= today && event.status !== 'cancelled';
      } else if (activeTab === 'past') {
        return eventDate < today;
      }
      return true;
    });
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
                  date: '',
                  time: '',
                  location: '',
                  max_attendees: '',
                  event_type: 'social',
                  status: 'upcoming',
                });
              }}
              className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Events
            </button>

            <div className="bg-white rounded-[40px] shadow-xl p-12 space-y-8 border border-gray-100">
              <div className="space-y-2 border-b border-gray-100 pb-8">
                <h1 className="text-4xl font-bold text-gray-900">Create New Alumni Event</h1>
                <p className="text-gray-500">Organize networking, social, or professional development events</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Spring Networking Breakfast"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the event..."
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
                      <option>Networking</option>
                      <option>Professional Development</option>
                      <option>Social Gathering</option>
                      <option>Sports & Recreation</option>
                      <option>Seminar / Workshop</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Event Type *</label>
                    <select
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                    >
                      <option value="social">Social</option>
                      <option value="professional">Professional</option>
                      <option value="training">Training</option>
                      <option value="fundraiser">Fundraiser</option>
                      <option value="networking">Networking</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Time *</label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g., 6:00 PM - 8:00 PM"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., ADDU Campus"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Max Attendees</label>
                    <input
                      type="number"
                      value={formData.max_attendees}
                      onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                      placeholder="Leave empty for unlimited"
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
                    onClick={handleCreateEvent}
                    className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-all"
                  >
                    Create Event
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
            <h1 className="text-5xl font-bold leading-tight">Alumni Community</h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Connect with fellow alumni through events, networking opportunities, and community activities
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
                  <Plus className="w-5 h-5" /> Create Event
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto px-8 mt-16 border-b border-gray-200">
          <div className="flex gap-12">
            {(['upcoming', 'past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-base font-bold transition-all border-b-4 capitalize ${
                  activeTab === tab
                    ? 'border-[#003087] text-[#003087]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
              </button>
            ))}
          </div>
        </div>

        {/* EVENTS LIST */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-semibold text-lg">Loading events...</p>
            </div>
          ) : getFilteredEvents().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-semibold text-lg">No {activeTab} events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {getFilteredEvents().map((event) => (
                <div key={event.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Visual */}
                    <div className="md:w-2/5 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl h-64 flex items-center justify-center shrink-0">
                      <Calendar className="w-20 h-20 text-[#003087] opacity-30" />
                    </div>

                    {/* Right: Content */}
                    <div className="md:w-3/5 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <span className="inline-block bg-blue-100 text-[#003087] text-xs font-bold px-3 py-1 rounded-full mb-3 capitalize">
                            {event.event_type}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{event.description.substring(0, 120)}...</p>
                        </div>
                        {userRole === 'admin' && (
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="ml-4 p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* Event Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 py-6 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[#003087]" />
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">Date</p>
                            <p className="font-bold text-gray-900">{event.formatted_date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#003087]" />
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">Time</p>
                            <p className="font-bold text-gray-900">{event.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-[#003087]" />
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">Location</p>
                            <p className="font-bold text-gray-900">{event.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-[#003087]" />
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">Registrations</p>
                            <p className="font-bold text-gray-900">
                              {event.registered_count || 0} {event.max_attendees ? `/ ${event.max_attendees}` : ''}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom */}
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">{event.time_remaining}</span>
                        {userRole === 'alumni' && event.status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowRegistrationModal(true);
                            }}
                            className="px-8 py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all shadow-lg flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> RSVP
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

        {/* REGISTRATION MODAL */}
        {showRegistrationModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Register for Event</h2>
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{selectedEvent.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {selectedEvent.formatted_date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {selectedEvent.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {selectedEvent.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">First Name *</label>
                    <input
                      type="text"
                      value={registrationData.firstName}
                      onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      value={registrationData.lastName}
                      onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => setShowRegistrationModal(false)}
                    disabled={isRegistering}
                    className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegisterEvent}
                    disabled={isRegistering}
                    className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg hover:bg-[#002566] transition-all disabled:opacity-50"
                  >
                    {isRegistering ? 'Registering...' : 'Confirm Registration'}
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
