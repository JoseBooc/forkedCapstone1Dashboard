import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Award, User, Plus, X, CheckCircle, XCircle, Trash2, Edit, RotateCcw, Search, RefreshCcw } from 'lucide-react';
import { Footer } from '../Footer';
import { EventRegistrationModal, MyRegistrations, type MyRegistration } from '../EventRegistrationModal';

// Image imports
import CareerFairBG from '../../../assets/CareerFairBG.jpg';

interface EventDetailData {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

interface GivebackActivity {
  id: number;
  title: string;
  description: string;
  venue: string;
  schedule_start: string;
  schedule_end: string;
  registration_open: boolean;
  participant_limit: number | null;
  fee_amount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  image_url?: string | null;
  created_by_name?: string | null;
  is_archived: boolean;
  event_type: 'giveback' | 'event';
  category: string | null;
  registration_start_at: string | null;
  registration_end_at: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_by_email: string | null;
  posted_at: string | null;
  updated_at: string;
}

// All event/registration times in this feature are venue wall-clock time
// (there's one campus, one timezone — no instant-in-time conversion needed).
// The backend stores them naively but serializes with a trailing "Z", which
// would make `new Date(iso)` silently shift the displayed clock by the
// viewer's UTC offset. These helpers read/write the literal digits instead,
// so what an admin/alumni types is exactly what everyone sees, everywhere.
function parseVenueDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  const [, y, mo, d, h, mi, s] = match;
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), s ? Number(s) : 0);
}

function toDateTimeLocalValue(date: Date | null): string {
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatVenueDate(value: string | null | undefined): string {
  return parseVenueDateTime(value)?.toLocaleDateString() ?? '';
}

function formatVenueTime(value: string | null | undefined): string {
  return parseVenueDateTime(value)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '';
}

// The API returns image_url as a path relative to the backend origin
// (e.g. "/storage/engagement-activities/x.jpg"). Used bare in an <img src>,
// the browser resolves it against the current page's origin instead —
// localhost:3000 in dev — which is wrong and fails silently since CRA's
// dev server 200s its SPA fallback for unmatched paths rather than 404ing.
function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `http://localhost:8000${url}`;
}

interface EventDisplayState {
  label: string;
  badgeClass: string;
  canRegister: boolean;
  registerLabel: string;
  countdownText: string;
  bucket: 'proposal' | 'upcoming' | 'past';
}

function getEventDisplayState(activity: GivebackActivity, now: Date): EventDisplayState {
  const scheduleStart = parseVenueDateTime(activity.schedule_start) ?? new Date(0);
  const scheduleEnd = parseVenueDateTime(activity.schedule_end) ?? new Date(0);
  const regStart = parseVenueDateTime(activity.registration_start_at);
  const regEnd = parseVenueDateTime(activity.registration_end_at);
  const daysBetween = (from: Date, to: Date) => Math.max(0, Math.ceil((to.getTime() - from.getTime()) / 86400000));

  if (activity.approval_status === 'pending') {
    return { label: 'Pending', badgeClass: 'bg-amber-500', canRegister: false, registerLabel: 'Pending Approval', countdownText: 'Registration ends in: ---', bucket: 'proposal' };
  }
  if (activity.approval_status === 'rejected') {
    return { label: 'Proposal Declined', badgeClass: 'bg-red-600', canRegister: false, registerLabel: 'Declined', countdownText: 'Registration ends in: ---', bucket: 'proposal' };
  }
  if (!activity.posted_at) {
    return { label: 'Event approved', badgeClass: 'bg-blue-600', canRegister: false, registerLabel: 'Post Event', countdownText: 'Registration ends in: ---', bucket: 'proposal' };
  }
  if (now > scheduleEnd) {
    return { label: 'Event concluded', badgeClass: 'bg-gray-500', canRegister: false, registerLabel: 'Concluded', countdownText: '', bucket: 'past' };
  }
  if (now >= scheduleStart && now <= scheduleEnd) {
    return { label: 'Ongoing', badgeClass: 'bg-orange-600', canRegister: false, registerLabel: 'Ongoing', countdownText: 'This event is ongoing', bucket: 'upcoming' };
  }
  if (regStart && now < regStart) {
    const days = daysBetween(now, regStart);
    return { label: 'Upcoming', badgeClass: 'bg-slate-500', canRegister: false, registerLabel: 'Registration Opens Soon', countdownText: `Registration opens in: ${days} day${days === 1 ? '' : 's'}`, bucket: 'upcoming' };
  }
  if (regEnd && now > regEnd) {
    return { label: 'Upcoming', badgeClass: 'bg-amber-700', canRegister: false, registerLabel: 'Registration Closed', countdownText: 'Registration is closed', bucket: 'upcoming' };
  }
  const deadline = regEnd || scheduleStart;
  const days = daysBetween(now, deadline);
  return { label: 'Upcoming', badgeClass: 'bg-green-600', canRegister: true, registerLabel: 'Register', countdownText: `Registration ends in: ${days} day${days === 1 ? '' : 's'}`, bucket: 'upcoming' };
}

// Canonical categories for Upcoming/Past Events, matching the Create Event
// form's options so the filter dropdown lists all choices an admin can pick,
// not just the ones currently in use.
const EVENT_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'Networking', label: 'Networking' },
  { value: 'Professional Dev', label: 'Professional Development' },
  { value: 'Social Event', label: 'Social Event' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Career', label: 'Career' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Teaching Opportunities', label: 'Teaching Opportunities' },
  { value: 'Seminars & Workshops', label: 'Seminars & Workshops' },
];


// EventActivityCard — real, DB-backed cards for Upcoming Events / Past Events /
// Alumni Proposals / My Submissions. `context` controls which action row renders.
function EventActivityCard({
  activity,
  userRole,
  context,
  displayState,
  isNew,
  onApprove,
  onReject,
  onPost,
  onEdit,
  onRemoveMine,
  onAdminRemove,
  onRestore,
  onView,
  onRegister,
  onDismissNew,
}: any) {
  const isAdmin = userRole === 'admin';
  const schedule = `${formatVenueDate(activity.schedule_start)} • ${formatVenueTime(activity.schedule_start)} - ${formatVenueTime(activity.schedule_end)}`;

  const handleCardClick = () => {
    if (onDismissNew) onDismissNew(activity.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-[24px] overflow-hidden border shadow-sm hover:shadow-md transition-all flex flex-col h-full text-left ${isNew ? 'event-glow border-[#C5A96A]' : 'border-gray-100'}`}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={resolveImageUrl(activity.image_url) || CareerFairBG}
          alt={activity.title}
          onClick={(e) => { e.stopPropagation(); onView(activity); }}
          className="w-full h-full object-cover cursor-pointer"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {isAdmin && context !== 'submissions' && context !== 'archived' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onEdit(activity); }} className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onAdminRemove(activity.id); }} className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform active:scale-95">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          {!isAdmin && context === 'submissions' && activity.approval_status === 'rejected' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onEdit(activity); }} className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onRemoveMine(activity.id); }} className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform active:scale-95">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          {activity.category && (
            <span className="px-4 py-1.5 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg">
              {activity.category}
            </span>
          )}
          <span className={`px-4 py-1.5 text-white text-[10px] rounded-full font-bold uppercase tracking-wider shadow-lg ${context === 'archived' ? 'bg-gray-500' : displayState.badgeClass}`}>
            {context === 'archived' ? 'Archived' : displayState.label}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3
          onClick={(e) => { e.stopPropagation(); onView(activity); }}
          className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:underline"
        >
          {activity.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" /> {schedule}
          </div>
          <div className="flex items-start gap-2 text-gray-500 text-[13px]">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> {activity.venue}
          </div>
          <div className="flex items-start gap-2 text-emerald-600 text-[13px] font-semibold">
            <Award className="w-4 h-4 mt-0.5" />
            {activity.fee_amount > 0 ? `₱${Number(activity.fee_amount).toLocaleString()} per person` : 'Free'}
          </div>
          {context !== 'archived' && displayState.countdownText && (
            <div className="flex items-start gap-2 text-[#003087] text-[13px] font-semibold">
              <Clock className="w-4 h-4 mt-0.5" /> {displayState.countdownText}
            </div>
          )}
        </div>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4 flex-1">
          {activity.description}
        </p>

        {context === 'submissions' && activity.approval_status === 'rejected' && activity.rejection_reason && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-[12px]">
            <span className="font-bold">Admin feedback: </span>{activity.rejection_reason}
          </div>
        )}

        {(context === 'submissions' || context === 'proposals') && activity.created_by_name && (
          <div className="pt-4 border-t border-gray-100 mb-4 flex items-center gap-2 text-gray-400 text-[11px]">
            <User className="w-3 h-3" />
            <span>Submitted by <span className="text-gray-600 font-medium">{activity.created_by_name}</span></span>
          </div>
        )}

        <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          {context === 'archived' ? (
            <button onClick={() => onRestore(activity.id)} className="flex-1 py-2.5 bg-[#003087] text-white rounded-lg font-bold text-sm hover:bg-[#002566] transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Restore
            </button>
          ) : context === 'proposals' && isAdmin && activity.approval_status === 'pending' ? (
            <>
              <button onClick={() => onApprove(activity.id)} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => onReject(activity)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Decline
              </button>
            </>
          ) : context === 'submissions' && activity.approval_status === 'approved' && !activity.posted_at ? (
            <button onClick={() => onPost(activity.id)} className="flex-1 py-2.5 bg-[#003087] text-white rounded-lg font-bold text-sm hover:bg-[#002566] transition-colors">
              Post Event
            </button>
          ) : context === 'past' ? null : context === 'upcoming' ? (
            <button
              onClick={() => onRegister(activity)}
              disabled={!displayState.canRegister}
              className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors bg-[#003087] text-white hover:bg-[#002566] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {displayState.registerLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EventsView({ userRole, userName = 'Alumni User', userEmail = '', userFirstName = '', userLastName = '' }: { userRole: string; userName?: string; userEmail?: string; userFirstName?: string; userLastName?: string }) {
  // Older sessions logged in before first/last name were tracked separately
  // won't have them in storage yet — fall back to splitting the display name.
  const [fallbackFirstName, ...fallbackLastParts] = userName.trim().split(/\s+/);
  const resolvedFirstName = userFirstName || fallbackFirstName || '';
  const resolvedLastName = userLastName || fallbackLastParts.join(' ');
  const [activeTab, setActiveTab] = useState('Upcoming Events');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailData | null>(null);
  const [registrationEvent, setRegistrationEvent] = useState<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    feeAmount: number;
  } | null>(null);

  const [activities, setActivities] = useState<GivebackActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // ── My Registrations state ──────────────────────────────
  const [myRegistrations, setMyRegistrations] = useState<MyRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // ── Upcoming Events / Alumni Proposals state (DB-backed) ─
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    scheduleStart: '',
    scheduleEnd: '',
    registrationEnd: '',
    capacity: '1',
    feeAmount: '0',
  });
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [editingEventActivity, setEditingEventActivity] = useState<GivebackActivity | null>(null);
  const [resubmitOnSave, setResubmitOnSave] = useState(false);

  const [rejectingActivity, setRejectingActivity] = useState<GivebackActivity | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');

  const [dismissedNewEventIds, setDismissedNewEventIds] = useState<number[]>(() => {
    if (!userEmail) return [];
    const saved = localStorage.getItem(`dismissedNewEventIds:${userEmail}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [dismissedConcludedEventIds, setDismissedConcludedEventIds] = useState<number[]>(() => {
    if (!userEmail) return [];
    const saved = localStorage.getItem(`dismissedConcludedEventIds:${userEmail}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [lastSeenMySubmissionsAt, setLastSeenMySubmissionsAt] = useState<number>(() => {
    if (!userEmail) return 0;
    const saved = localStorage.getItem(`lastSeenMySubmissionsAt:${userEmail}`);
    return saved ? Number(saved) : 0;
  });
  // ── Search / filter bar (Upcoming Events, Past Events, Teaching
  //    Opportunities, Seminars & Workshops). Inputs are separate from
  //    `appliedFilters` on purpose — typing/selecting doesn't filter
  //    anything until "Apply Filters" is clicked. ────────────────
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '', category: 'All', startDate: '' });

  const handleApplyFilters = () => {
    setAppliedFilters({ keyword: searchKeyword, category: selectedCategory, startDate });
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('All');
    setStartDate('');
    setAppliedFilters({ keyword: '', category: 'All', startDate: '' });
  };

  // Ticks every minute so events cross from Upcoming into Past on their own,
  // without needing a click/refetch to force a re-render.
  const [nowTick, setNowTick] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNowTick(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchActivities();
    if (userRole !== 'admin') fetchMyRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // ── Mark "My Submissions" as seen once the alumni actually
  //    views it, using the server's own updated_at as the cutoff
  //    so approve/reject notifications clear reliably. ────────
  useEffect(() => {
    if (activeTab !== 'My Submissions' || userRole === 'admin' || !userEmail) return;
    const mine = activities.filter((a) => a.event_type === 'event' && a.submitted_by_email === userEmail);
    if (mine.length === 0) return;
    const latest = Math.max(...mine.map((a) => new Date(a.updated_at).getTime()));
    if (latest > lastSeenMySubmissionsAt) {
      setLastSeenMySubmissionsAt(latest);
      localStorage.setItem(`lastSeenMySubmissionsAt:${userEmail}`, String(latest));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activities, userRole, userEmail]);

  useEffect(() => {
    const handleRegisterEvent = (event: any) => {
      const selected = event.detail.event;
      setRegistrationEvent({
        id: Number(selected.id) || 0,
        title: selected.title,
        date: selected.date,
        time: selected.time,
        location: selected.location,
        image: selected.image,
        feeAmount: 1000
      });
    };
    window.addEventListener('registerEvent', handleRegisterEvent as EventListener);
    return () => window.removeEventListener('registerEvent', handleRegisterEvent as EventListener);
  }, []);

  const triggerToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await fetch('http://localhost:8000/api/giveback/activities?include_archived=true');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  // ── Fetch registrations for the logged-in alumni ────────
  const fetchMyRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/giveback/registrations?email=${encodeURIComponent(userEmail)}`
      );
      if (response.ok) {
        const data = await response.json();
        setMyRegistrations(
          data.map((r: any) => ({
            id: r.id,
            eventId: r.activity_id,
            title: r.activity?.title ?? 'Event',
            date: formatVenueDate(r.activity?.schedule_start),
            time: `${formatVenueTime(r.activity?.schedule_start)} - ${formatVenueTime(r.activity?.schedule_end)}`,
            location: r.activity?.venue ?? '',
            image: r.activity?.image_url || CareerFairBG,
            feeAmount: Number(r.activity?.fee_amount ?? 0),
            paymentStatus: r.payment_method === 'cash' ? 'cash' : (r.payment_status ?? 'pending'),
            attendees: 1 + (r.guests_count ?? 0),
            receiptUrl: r.id
              ? `http://localhost:8000/api/giveback/registrations/${r.id}/receipt`
              : undefined,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const openRegistrationModalFromActivity = (activity: GivebackActivity, fallbackImage?: string) => {
    setRegistrationEvent({
      id: activity.id,
      title: activity.title,
      date: formatVenueDate(activity.schedule_start),
      time: `${formatVenueTime(activity.schedule_start)} - ${formatVenueTime(activity.schedule_end)}`,
      location: activity.venue,
      image: resolveImageUrl(activity.image_url) || fallbackImage || CareerFairBG,
      feeAmount: Number(activity.fee_amount || 0)
    });
  };

  // ── Upcoming Events / Alumni Proposals handlers (real API) ─
  const resetEventForm = () => {
    setNewEventForm({
      title: '', description: '', location: '', category: '',
      scheduleStart: '', scheduleEnd: '',
      registrationEnd: '',
      capacity: '1', feeAmount: '0',
    });
    setEventImage(null);
    setEventImagePreview(null);
    setEditingEventActivity(null);
    setResubmitOnSave(false);
  };

  const buildEventFormData = () => {
    const formData = new FormData();
    formData.append('title', newEventForm.title);
    formData.append('description', newEventForm.description);
    formData.append('venue', newEventForm.location);
    formData.append('schedule_start', newEventForm.scheduleStart);
    formData.append('schedule_end', newEventForm.scheduleEnd);
    formData.append('registration_open', '1');
    formData.append('participant_limit', newEventForm.capacity || '');
    formData.append('fee_amount', newEventForm.feeAmount || '0');
    formData.append('status', 'upcoming');
    formData.append('event_type', 'event');
    formData.append('category', newEventForm.category);
    if (newEventForm.registrationEnd) {
      formData.append('registration_end_at', newEventForm.registrationEnd);
    }
    formData.append('created_by_name', userName);
    if (eventImage) formData.append('image', eventImage);
    return formData;
  };

  const handleCreateEventActivity = async () => {
    if (!newEventForm.title || !newEventForm.description || !newEventForm.location || !newEventForm.category || !newEventForm.scheduleStart || !newEventForm.scheduleEnd || !newEventForm.capacity || newEventForm.feeAmount === '' || !newEventForm.registrationEnd) {
      alert('Please fill in all required fields');
      return;
    }
    if (newEventForm.scheduleStart < toDateTimeLocalValue(new Date())) {
      alert('Event Start date/time cannot be in the past.');
      return;
    }
    if (newEventForm.scheduleEnd <= newEventForm.scheduleStart) {
      alert('Event End date/time must be after the Event Start date/time.');
      return;
    }
    if (newEventForm.registrationEnd < toDateTimeLocalValue(new Date())) {
      alert('Registration Window cannot be set to a past date/time.');
      return;
    }
    if (newEventForm.registrationEnd >= newEventForm.scheduleEnd) {
      alert('Registration Window must end before the Event End date/time.');
      return;
    }
    const formData = buildEventFormData();
    if (userRole !== 'admin') {
      formData.append('is_proposal', 'true');
      formData.append('submitted_by_email', userEmail);
    }
    try {
      const response = await fetch('http://localhost:8000/api/giveback/activities', { method: 'POST', body: formData });
      if (response.ok) {
        await fetchActivities();
        resetEventForm();
        setActiveTab(userRole === 'admin' ? 'Upcoming Events' : 'My Submissions');
        if (userRole !== 'admin') alert('Event proposal submitted successfully! The admin will review it before it can go live.');
        triggerToast();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to submit event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to submit event');
    }
  };

  const handleEditEventActivity = (activity: GivebackActivity) => {
    setEditingEventActivity(activity);
    setNewEventForm({
      title: activity.title,
      description: activity.description,
      location: activity.venue,
      category: activity.category || '',
      scheduleStart: toDateTimeLocalValue(parseVenueDateTime(activity.schedule_start)),
      scheduleEnd: toDateTimeLocalValue(parseVenueDateTime(activity.schedule_end)),
      registrationEnd: toDateTimeLocalValue(parseVenueDateTime(activity.registration_end_at)),
      capacity: activity.participant_limit ? String(activity.participant_limit) : '1',
      feeAmount: String(activity.fee_amount || 0),
    });
    setEventImagePreview(resolveImageUrl(activity.image_url));
    const isRejectedOwnProposal = userRole !== 'admin' && activity.approval_status === 'rejected';
    setResubmitOnSave(isRejectedOwnProposal);
    setActiveTab(isRejectedOwnProposal ? 'Edit Proposal' : 'Edit Event');
  };

  const handleUpdateEventActivity = async () => {
    if (!editingEventActivity) return;
    if (!newEventForm.title || !newEventForm.description || !newEventForm.location || !newEventForm.category || !newEventForm.scheduleStart || !newEventForm.scheduleEnd || !newEventForm.capacity || newEventForm.feeAmount === '' || !newEventForm.registrationEnd) {
      alert('Please fill in all required fields');
      return;
    }
    // Only block a past Start/Registration End if it's actually being changed
    // — editing an already-past/archived event without touching its dates
    // shouldn't fail.
    const originalScheduleStart = toDateTimeLocalValue(parseVenueDateTime(editingEventActivity.schedule_start));
    if (newEventForm.scheduleStart !== originalScheduleStart && newEventForm.scheduleStart < toDateTimeLocalValue(new Date())) {
      alert('Event Start date/time cannot be in the past.');
      return;
    }
    if (newEventForm.scheduleEnd <= newEventForm.scheduleStart) {
      alert('Event End date/time must be after the Event Start date/time.');
      return;
    }
    const originalRegistrationEnd = toDateTimeLocalValue(parseVenueDateTime(editingEventActivity.registration_end_at));
    if (newEventForm.registrationEnd !== originalRegistrationEnd && newEventForm.registrationEnd < toDateTimeLocalValue(new Date())) {
      alert('Registration Window cannot be set to a past date/time.');
      return;
    }
    if (newEventForm.registrationEnd >= newEventForm.scheduleEnd) {
      alert('Registration Window must end before the Event End date/time.');
      return;
    }
    const formData = buildEventFormData();
    formData.append('submitted_by_email', editingEventActivity.submitted_by_email || (userRole !== 'admin' ? userEmail : ''));
    if (resubmitOnSave) formData.append('resubmit', 'true');
    // PHP never parses multipart bodies on a literal PUT verb — spoof it via POST.
    formData.append('_method', 'PUT');
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${editingEventActivity.id}`, { method: 'POST', body: formData });
      if (response.ok) {
        await fetchActivities();
        resetEventForm();
        setActiveTab(userRole === 'admin' ? 'Upcoming Events' : 'My Submissions');
        triggerToast();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    }
  };

  const handleCancelEventForm = () => {
    resetEventForm();
    setActiveTab(userRole === 'admin' ? 'Upcoming Events' : 'My Submissions');
  };

  const handleApproveProposal = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}/approve`, { method: 'PATCH' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to approve proposal');
      }
    } catch (error) {
      console.error('Error approving proposal:', error);
      alert('Failed to approve proposal');
    }
  };

  const handleOpenRejectModal = (activity: GivebackActivity) => {
    setRejectingActivity(activity);
    setRejectReasonText('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingActivity) return;
    if (!rejectReasonText.trim()) {
      alert('Please provide a reason for declining this proposal.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${rejectingActivity.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ reason: rejectReasonText.trim() }),
      });
      if (response.ok) {
        await fetchActivities();
        setRejectingActivity(null);
        setRejectReasonText('');
        triggerToast();
      } else {
        alert('Failed to decline proposal');
      }
    } catch (error) {
      console.error('Error declining proposal:', error);
      alert('Failed to decline proposal');
    }
  };

  const handlePostEvent = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}/post`, { method: 'PATCH' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to post event');
      }
    } catch (error) {
      console.error('Error posting event:', error);
      alert('Failed to post event');
    }
  };

  // Admin-side removal never hard-deletes an alumni-owned row — it archives
  // it out of the admin's own view so the alumni's copy (My Submissions,
  // with their own Edit/Remove options) is never affected.
  const handleArchiveEventActivity = async (id: number) => {
    if (!window.confirm('Remove this from your view? The alumni submitter will still see their own copy. You can restore it later from the Archived tab.')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}/archive`, { method: 'PATCH' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to remove event');
      }
    } catch (error) {
      console.error('Error archiving event:', error);
      alert('Failed to remove event');
    }
  };

  const handleRestoreEventActivity = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}/restore`, { method: 'PATCH' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to restore event');
      }
    } catch (error) {
      console.error('Error restoring event:', error);
      alert('Failed to restore event');
    }
  };

  const handleRemoveMyProposal = async (id: number) => {
    if (!window.confirm('Permanently remove this proposal? This cannot be undone.')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/activities/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchActivities();
        triggerToast();
      } else {
        alert('Failed to remove proposal');
      }
    } catch (error) {
      console.error('Error removing proposal:', error);
      alert('Failed to remove proposal');
    }
  };

  const handleDismissNewEvent = (id: number) => {
    setDismissedNewEventIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      if (userEmail) localStorage.setItem(`dismissedNewEventIds:${userEmail}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDismissConcludedEvent = (id: number) => {
    setDismissedConcludedEventIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      if (userEmail) localStorage.setItem(`dismissedConcludedEventIds:${userEmail}`, JSON.stringify(updated));
      return updated;
    });
  };

  const openActivityDetails = (activity: GivebackActivity) => {
    setSelectedEvent({
      title: activity.title,
      category: activity.category || 'Event',
      date: formatVenueDate(activity.schedule_start),
      time: `${formatVenueTime(activity.schedule_start)} - ${formatVenueTime(activity.schedule_end)}`,
      location: activity.venue,
      description: activity.description,
      image: resolveImageUrl(activity.image_url) || CareerFairBG,
    });
  };

  const now = nowTick;

  const upcomingEventActivities = activities
    .filter((a) =>
      a.event_type === 'event' && a.approval_status === 'approved' && a.posted_at && !a.is_archived &&
      (parseVenueDateTime(a.schedule_end) ?? new Date(0)) >= now
    )
    .sort((a, b) => new Date(b.posted_at as string).getTime() - new Date(a.posted_at as string).getTime());

  const pastEventActivities = activities
    .filter((a) =>
      a.event_type === 'event' && a.approval_status === 'approved' && a.posted_at && !a.is_archived &&
      (parseVenueDateTime(a.schedule_end) ?? new Date(0)) < now
    )
    .sort((a, b) => (parseVenueDateTime(b.schedule_end)?.getTime() ?? 0) - (parseVenueDateTime(a.schedule_end)?.getTime() ?? 0));

  const alumniProposalActivities = activities.filter((a) =>
    a.event_type === 'event' && a.submitted_by_email && a.approval_status !== 'approved' && !a.is_archived
  );

  const mySubmissionActivities = activities.filter((a) =>
    a.event_type === 'event' && a.submitted_by_email === userEmail && !a.posted_at
  );

  const archivedEventActivities = activities
    .filter((a) => a.event_type === 'event' && a.is_archived)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const pendingProposalCount = alumniProposalActivities.filter((a) => a.approval_status === 'pending').length;

  const hasUnseenMySubmissions = mySubmissionActivities.some(
    (a) => new Date(a.updated_at).getTime() > lastSeenMySubmissionsAt
  );

  const hasNewUpcomingEvent = upcomingEventActivities.some((a) => !dismissedNewEventIds.includes(a.id));
  const hasNewPastEvent = pastEventActivities.some((a) => !dismissedConcludedEventIds.includes(a.id));

  // Upcoming Events / Past Events are no longer separate tabs — they're
  // picked via the "View" dropdown in the filter bar instead. Teaching
  // Opportunities and Seminars & Workshops have been retired as their own
  // views entirely; they're just categories on regular events now. Only the
  // views that aren't simple filterable lists stay as real tabs.
  let tabs = userRole === 'admin'
    ? ['Alumni Proposals', 'Archived', 'Create Event']
    : ['My Submissions', 'My Registrations'];

  if (editingEventActivity && (activeTab === 'Edit Event' || activeTab === 'Edit Proposal')) tabs = [...tabs, activeTab];

  // 'Upcoming Events' is now the single combined events view (upcoming and
  // past events shown together, distinguished by each card's status badge).
  const showFilterBar = activeTab === 'Upcoming Events';

  // Teaching Opportunities and Seminars & Workshops are just two more
  // categories now (folded into the combined events list), so the filter
  // always offers the full fixed list from the Create Event form.
  const categoryOptions = EVENT_CATEGORY_OPTIONS;

  const matchesAppliedFilters = (
    title: string,
    description: string | undefined,
    category: string | null | undefined,
    dateValue: Date | string | null | undefined
  ) => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();
    if (keyword) {
      const haystack = `${title} ${description || ''}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (appliedFilters.category !== 'All' && (category || '') !== appliedFilters.category) return false;
    if (appliedFilters.startDate) {
      const filterDate = parseVenueDateTime(`${appliedFilters.startDate}T00:00`);
      const itemDate = dateValue instanceof Date ? dateValue : new Date(dateValue as string);
      // Dates we can't parse (e.g. "1 Semester") are left in rather than
      // hidden — the filter just doesn't apply to them.
      if (filterDate && !isNaN(itemDate.getTime()) && itemDate < filterDate) return false;
    }
    return true;
  };

  const visibleUpcomingEventActivities = upcomingEventActivities.filter((a) =>
    matchesAppliedFilters(a.title, a.description, a.category, parseVenueDateTime(a.schedule_start))
  );
  const visiblePastEventActivities = pastEventActivities.filter((a) =>
    matchesAppliedFilters(a.title, a.description, a.category, parseVenueDateTime(a.schedule_start))
  );

  const hasActiveFilters = !!appliedFilters.keyword || appliedFilters.category !== 'All' || !!appliedFilters.startDate;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <style>{`
        @keyframes eventGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(197,169,106,0.6), 0 0 20px 2px rgba(197,169,106,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(197,169,106,0.35), 0 0 32px 6px rgba(197,169,106,0.55); }
        }
        .event-glow { animation: eventGlow 1.8s ease-in-out infinite; }
      `}</style>
      {showSuccessToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">Action successful!</span>
        </div>
      )}

      <main className="flex-1 p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Engagement</h1>
            <p className="text-gray-500 text-sm mt-1">Manage events and alumni contributions</p>
          </div>
          {userRole !== 'admin' && (
            <button
              onClick={() => setActiveTab('Submit Proposal')}
              className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Submit Proposal
            </button>
          )}
        </div>

        {/* One row: View selector + search/filter bar on the left,
            remaining tabs (Alumni Proposals, Archived, etc.) on the right. */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-3">
          {showFilterBar && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
                placeholder="Search by title or description..."
                className="pl-9 pr-3 py-2 w-48 xl:w-64 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/20 transition-all"
              />
            </div>
          )}

          {showFilterBar && (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/20 transition-all appearance-none"
              >
                <option value="All">All Categories</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#003087]/20 transition-all"
              />

              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-[#003087] text-white rounded-lg font-bold text-sm hover:bg-[#002566] transition-colors whitespace-nowrap"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </>
          )}

          {tabs.length > 0 && (
            <div className="flex gap-6 ml-auto overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-1 text-[13px] font-bold whitespace-nowrap transition-all relative ${
                    activeTab === tab ? 'text-[#003087]' : 'text-gray-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {tab}
                    {tab === 'Alumni Proposals' && pendingProposalCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 bg-red-600 text-white text-[10px] rounded-full font-bold">
                        {pendingProposalCount}
                      </span>
                    )}
                    {tab === 'Archived' && archivedEventActivities.length > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 bg-gray-400 text-white text-[10px] rounded-full font-bold">
                        {archivedEventActivities.length}
                      </span>
                    )}
                    {tab === 'My Submissions' && hasUnseenMySubmissions && (
                      <span className="w-2 h-2 bg-red-600 rounded-full" />
                    )}
                  </span>
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#003087]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'Upcoming Events' && (hasNewUpcomingEvent || hasNewPastEvent) && (
          <p className="-mt-4 text-xs text-red-600 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-600 rounded-full inline-block" />
            {hasNewUpcomingEvent ? 'New events have been posted.' : 'Events have concluded since you last checked.'}
          </p>
        )}



        {/* ── My Registrations tab ───────────────────────────── */}
        {activeTab === 'My Registrations' && userRole !== 'admin' && (
          <MyRegistrations
            registrations={myRegistrations}
            isLoading={loadingRegistrations}
          />
        )}

        {/* Events grid (real, DB-backed) — upcoming and past shown together,
            each card's own status badge tells them apart. */}
        {activeTab === 'Upcoming Events' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading events...</div>
            ) : visibleUpcomingEventActivities.length === 0 && visiblePastEventActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {hasActiveFilters ? 'No events match your filters.' : 'No events yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleUpcomingEventActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="upcoming"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={!dismissedNewEventIds.includes(activity.id)}
                    onEdit={handleEditEventActivity}
                    onAdminRemove={handleArchiveEventActivity}
                    onView={openActivityDetails}
                    onRegister={openRegistrationModalFromActivity}
                    onDismissNew={handleDismissNewEvent}
                  />
                ))}
                {visiblePastEventActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="past"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={false}
                    onEdit={handleEditEventActivity}
                    onAdminRemove={handleArchiveEventActivity}
                    onView={openActivityDetails}
                    onDismissNew={handleDismissConcludedEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alumni Proposals grid (admin review queue) */}
        {activeTab === 'Alumni Proposals' && userRole === 'admin' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading proposals...</div>
            ) : alumniProposalActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No alumni proposals right now.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {alumniProposalActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="proposals"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={false}
                    onApprove={handleApproveProposal}
                    onReject={handleOpenRejectModal}
                    onEdit={handleEditEventActivity}
                    onAdminRemove={handleArchiveEventActivity}
                    onView={openActivityDetails}
                    onDismissNew={handleDismissNewEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Archived' && userRole === 'admin' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading archived events...</div>
            ) : archivedEventActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Nothing archived right now.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {archivedEventActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="archived"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={false}
                    onRestore={handleRestoreEventActivity}
                    onView={openActivityDetails}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Submissions grid (alumni's own proposals) */}
        {activeTab === 'My Submissions' && userRole !== 'admin' && (
          <div>
            {loadingActivities ? (
              <div className="text-center py-10 text-gray-500">Loading your submissions...</div>
            ) : mySubmissionActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">You haven't submitted any event proposals yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mySubmissionActivities.map((activity) => (
                  <EventActivityCard
                    key={activity.id}
                    activity={activity}
                    userRole={userRole}
                    context="submissions"
                    displayState={getEventDisplayState(activity, now)}
                    isNew={false}
                    onPost={handlePostEvent}
                    onEdit={handleEditEventActivity}
                    onRemoveMine={handleRemoveMyProposal}
                    onView={openActivityDetails}
                    onDismissNew={handleDismissNewEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Event / Edit Event / Submit Proposal / Edit Proposal — one shared form */}
        {(activeTab === 'Create Event' || activeTab === 'Edit Event' || activeTab === 'Submit Proposal' || activeTab === 'Edit Proposal') && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingEventActivity ? (userRole === 'admin' ? 'Edit Event' : 'Edit Proposal') : (userRole === 'admin' ? 'Create New Event' : 'Submit Event Proposal')}
            </h3>
            {userRole !== 'admin' && !editingEventActivity && (
              <p className="text-gray-600 text-sm mb-6">Submit your event proposal for admin review. Once approved, you'll be able to post it live to the Upcoming Events section.</p>
            )}
            {userRole !== 'admin' && editingEventActivity && (
              <p className="text-gray-600 text-sm mb-6">Update your proposal and resubmit it for admin review.</p>
            )}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input type="text" placeholder="Enter event title" value={newEventForm.title} onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select value={newEventForm.category} onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent">
                    <option value="">Select category</option>
                    <option value="Networking">Networking</option>
                    <option value="Professional Dev">Professional Development</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input type="text" placeholder="e.g., ADDU Campus or Virtual Event" value={newEventForm.location} onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Event Schedule</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Starts *</label>
                    <input
                      type="datetime-local"
                      value={newEventForm.scheduleStart}
                      onChange={(e) => {
                        const scheduleStart = e.target.value;
                        const endIsNowInvalid = newEventForm.scheduleEnd && newEventForm.scheduleEnd <= scheduleStart;
                        const scheduleEnd = endIsNowInvalid ? '' : newEventForm.scheduleEnd;
                        const registrationEndIsNowInvalid = newEventForm.registrationEnd && (!scheduleEnd || newEventForm.registrationEnd >= scheduleEnd);
                        setNewEventForm({
                          ...newEventForm,
                          scheduleStart,
                          scheduleEnd,
                          registrationEnd: registrationEndIsNowInvalid ? '' : newEventForm.registrationEnd,
                        });
                      }}
                      min={toDateTimeLocalValue(new Date())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Ends *</label>
                    <input
                      type="datetime-local"
                      value={newEventForm.scheduleEnd}
                      onChange={(e) => {
                        const scheduleEnd = e.target.value;
                        const registrationEndIsNowInvalid = newEventForm.registrationEnd && newEventForm.registrationEnd >= scheduleEnd;
                        setNewEventForm({
                          ...newEventForm,
                          scheduleEnd,
                          registrationEnd: registrationEndIsNowInvalid ? '' : newEventForm.registrationEnd,
                        });
                      }}
                      disabled={!newEventForm.scheduleStart}
                      min={newEventForm.scheduleStart || undefined}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {!newEventForm.scheduleStart && (
                      <p className="text-xs text-gray-500 mt-1">Set the start date/time first.</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description *</label>
                <textarea rows={6} placeholder="Describe the event details..." value={newEventForm.description} onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Capacity *</label>
                  <input type="number" required min="1" placeholder="Maximum number of attendees" value={newEventForm.capacity} onChange={(e) => setNewEventForm({ ...newEventForm, capacity: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Person (₱) *</label>
                  <input type="number" required min="0" placeholder="0 for free" value={newEventForm.feeAmount} onChange={(e) => setNewEventForm({ ...newEventForm, feeAmount: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                  {Number(newEventForm.feeAmount) === 0 && (
                    <p className="text-xs text-gray-500 mt-1">This will be listed as a Free event.</p>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Registration Window</p>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Registration Ends *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEventForm.registrationEnd}
                    onChange={(e) => setNewEventForm({ ...newEventForm, registrationEnd: e.target.value })}
                    disabled={!newEventForm.scheduleEnd}
                    min={toDateTimeLocalValue(new Date())}
                    max={newEventForm.scheduleEnd || undefined}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {!newEventForm.scheduleEnd && (
                    <p className="text-xs text-gray-500 mt-1">Set the event end date/time first.</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Banner Image</label>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setEventImage(file); setEventImagePreview(URL.createObjectURL(file)); } }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent" />
                {eventImagePreview && <img src={eventImagePreview} alt="Preview" className="mt-3 h-32 rounded-lg object-cover" />}
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={editingEventActivity ? handleUpdateEventActivity : handleCreateEventActivity}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  {editingEventActivity ? (userRole === 'admin' ? 'Update Event' : 'Resubmit Proposal') : (userRole === 'admin' ? 'Create Event' : 'Submit Proposal')}
                </button>
                <button onClick={handleCancelEventForm} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Decline Proposal Modal */}
      {rejectingActivity && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Decline Proposal</h3>
              <button onClick={() => { setRejectingActivity(null); setRejectReasonText(''); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Let the submitter of <span className="font-semibold">{rejectingActivity.title}</span> know why this proposal can't push through.
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Declining *</label>
                <textarea
                  rows={4}
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  placeholder="Explain why this event proposal is being declined..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setRejectingActivity(null); setRejectReasonText(''); }} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirmReject} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-y-auto overflow-x-hidden shadow-2xl">
            <div className="relative h-72">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedEvent(null)} className="absolute top-5 right-5 p-2.5 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10 text-left">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#003087] rounded-full text-xs font-bold uppercase mb-4">
                {selectedEvent.category}
              </span>
              <h2 className="text-3xl font-bold mb-5 text-gray-900">{selectedEvent.title}</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600 text-base">
                  <Calendar className="w-5 h-5 text-[#003087]" />
                  <span>{selectedEvent.date} • {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-base">
                  <MapPin className="w-5 h-5 text-[#003087]" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl mb-10">
                <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="w-full py-4 bg-[#003087] text-white rounded-xl font-bold text-base hover:bg-[#002566] transition-colors">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Registration Modal */}
      {registrationEvent && (
        <EventRegistrationModal
          event={{
            id: registrationEvent.id,
            title: registrationEvent.title,
            date: registrationEvent.date,
            time: registrationEvent.time,
            location: registrationEvent.location,
            image: registrationEvent.image,
            feeAmount: registrationEvent.feeAmount
          }}
          userFirstName={resolvedFirstName}
          userLastName={resolvedLastName}
          userEmail={userEmail}
          onClose={() => {
            setRegistrationEvent(null);
            // Refresh registrations after closing modal in case a new one was just submitted
            if (userRole !== 'admin') fetchMyRegistrations();
          }}
        />
      )}

      <Footer />
    </div>
  );
}