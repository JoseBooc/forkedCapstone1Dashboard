// 1. Imports MUST be at the very top for ESLint
import { ArrowRight, ArrowLeft, Clock, Plus, Pencil, Trash2, EyeOff, Eye, Star, Newspaper, Archive, RotateCcw, X, Check } from 'lucide-react';
import { Footer } from '../Footer';
import { useState, useEffect } from 'react';

// Asset Imports
import admissionsFair from '../../../assets/AdmissionsFairBG.jpg';
import mentorProgram from '../../../assets/AlumniMentorBG.jpg';
import globalAlumni from '../../../assets/GlobalAlumniBG.jpg';
import achievements1 from '../../../assets/Achievements1BG.jpg';
import achievements2 from '../../../assets/Achievements2BG.jpg';
import whoMadeCut from '../../../assets/WhoCutBG.jpg';

const PLACEHOLDER = "https://images.unsplash.com/photo-1523050335456-c6bb7f9cc997?auto=format&fit=crop&q=80&w=800";

export interface Article {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: any;
  hidden?: boolean;
  featured?: boolean;
  is_archived?: boolean;
  approved?: boolean | null;
  created_at?: string;
  image_url?: string | null;
  _source?: 'seed' | 'api';
}

interface NewsItemProps {
  article: Article;
  userRole: string;
  onReadMore: () => void;
  onDelete: () => void;
  onToggleHide: () => void;
  onEdit: () => void;
  onFeature: () => void;
  onArchive?: () => void;
  onApprove?: () => void;
  onDeny?: () => void;
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 9999,
        background: '#003087',
        color: '#fff',
        padding: '14px 24px',
        borderRadius: 16,
        fontWeight: 600,
        fontSize: 14,
        boxShadow: '0 8px 32px rgba(0,48,135,0.25)',
        animation: 'fadeSlideUp 0.3s ease',
      }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {message}
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ approved }: { approved?: boolean | null }) {
  if (approved === true)
    return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Approved</span>;
  if (approved === false)
    return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Denied</span>;
  return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Pending</span>;
}

// ── NewsCard ───────────────────────────────────────────────────────────────
function NewsCard({ article, userRole, onReadMore, onDelete, onToggleHide, onEdit, onFeature, onArchive, onApprove, onDeny }: NewsItemProps) {
  const { category, title, excerpt, date, image, hidden, featured, approved } = article;

  return (
    <div className={`bg-white rounded-[32px] overflow-hidden border shadow-sm flex flex-col md:flex-row h-full text-left group transition-all ${hidden ? 'opacity-50 border-dashed border-gray-300' : 'border-gray-100'}`}>
      <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-200 relative">
        <img
          src={image || PLACEHOLDER}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
        {hidden && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Hidden</span>
          </div>
        )}
        {featured && !hidden && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-900" /> Featured
          </div>
        )}
      </div>

      <div className="md:w-2/3 p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider">
                {category}
              </span>
              <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                {date}
              </div>
              {userRole === 'admin' && <StatusBadge approved={approved} />}
            </div>

            {userRole === 'admin' && (
              <div className="flex items-center gap-1 flex-wrap justify-end">
                {approved !== true && (
                  <button onClick={onApprove} title="Approve" className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {approved !== false && (
                  <button onClick={onDeny} title="Deny" className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onFeature} title={featured ? 'Already featured' : 'Set as Featured'}
                  className={`p-2 rounded-lg transition-colors ${featured ? 'text-yellow-500 bg-yellow-50 cursor-default' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}>
                  <Star className={`w-4 h-4 ${featured ? 'fill-yellow-400' : ''}`} />
                </button>
                <button onClick={onEdit} title="Edit" className="p-2 rounded-lg text-gray-400 hover:text-[#003087] hover:bg-blue-50 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={onToggleHide} title={hidden ? 'Unhide' : 'Hide'} className="p-2 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors">
                  {hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                {onArchive && (
                  <button onClick={onArchive} title="Archive" className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                    <Archive className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onDelete} title="Delete" className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#003087] transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>
        </div>

        <button
          onClick={onReadMore}
          className="flex items-center gap-2 text-[#003087] font-bold text-sm hover:translate-x-1 transition-transform w-fit"
        >
          Read More <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Article Detail Page ────────────────────────────────────────────────────
function ArticleDetailPage({
  article,
  userRole,
  onBack,
  onEdit,
  onToggleHide,
  onDelete,
  onApprove,
  onDeny,
}: {
  article: Article;
  userRole: string;
  onBack: () => void;
  onEdit: () => void;
  onToggleHide: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onDeny: () => void;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">

        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#003087] font-semibold mb-8 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </button>

        {/* Hero Image — full width, no rounded sides, like the screenshot */}
        <div className="relative w-full rounded-[24px] overflow-hidden bg-gray-200 mb-8" style={{ maxHeight: 520 }}>
          <img
            src={article.image || PLACEHOLDER}
            alt={article.title}
            className="w-full object-cover"
            style={{ maxHeight: 520, width: '100%' }}
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
          />
          {/* Featured badge over image */}
          {article.featured && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
              <Star className="w-3 h-3 fill-yellow-900" /> Featured
            </div>
          )}
          {article.hidden && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-sm font-bold bg-black/50 px-4 py-2 rounded-full">
                Hidden from Alumni
              </span>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider">
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            {article.date}
          </div>
          {userRole === 'admin' && <StatusBadge approved={article.approved} />}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Admin controls — below title, above content */}
        {userRole === 'admin' && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100">
            {article.approved !== true && (
              <button
                onClick={onApprove}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Check className="w-3 h-3" /> Approve
              </button>
            )}
            {article.approved !== false && (
              <button
                onClick={onDeny}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <X className="w-3 h-3" /> Deny
              </button>
            )}
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-[#003087] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={onToggleHide}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              {article.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {article.hidden ? 'Unhide' : 'Hide'}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}

        {/* Article body */}
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {article.content || article.excerpt}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ── Helper: normalise API response → Article ───────────────────────────────
function normaliseArticle(item: any): Article {
  return {
    id: item.id,
    category: item.category ?? 'General',
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : item.date ?? '',
    image: item.image_url || item.image || PLACEHOLDER,
    hidden: item.hidden ?? false,
    featured: item.featured ?? false,
    is_archived: item.is_archived ?? false,
    approved: item.approved ?? null,
    created_at: item.created_at,
    image_url: item.image_url,
    _source: 'api',
  };
}

// ── Seed Articles ──────────────────────────────────────────────────────────
const seedArticles: Article[] = [
  {
    id: 1,
    category: "Scholarship",
    title: "HAPPENING NOW | Ateneo de Davao University Admissions and Scholarship Fair",
    excerpt: "The Admissions and Scholars Fair runs from January 23 to 25, 2026, bringing admissions, academic programs, and scholarships all in one place.",
    content: `The Ateneo de Davao University Admissions and Scholarship Fair is currently underway, offering prospective students and their families a comprehensive overview of academic programs, admission requirements, and scholarship opportunities.

Visitors can explore booths from different colleges, attend information sessions, and speak directly with faculty members and admissions officers. The fair aims to make the application process more accessible and transparent.

Students are encouraged to take advantage of on-site consultations and early application assistance throughout the event.`,
    date: "January 10, 2026",
    image: admissionsFair,
    hidden: false,
    featured: true,
    is_archived: false,
    approved: true,
    _source: 'seed',
  },
  {
    id: 2,
    category: "Programs",
    title: "New Alumni Mentorship Program Launches",
    excerpt: "Connect with fellow Ateneans and share your expertise with the next generation through our expanded mentorship initiative.",
    content: `The Alumni Mentorship Program connects experienced graduates with current students and recent alumni to provide career guidance and professional development.

Participants will engage in one-on-one mentoring sessions, networking events, and skills workshops. The program is designed to strengthen the Atenean community while helping mentees navigate their career paths.

Applications for mentors and mentees are now open.`,
    date: "January 5, 2026",
    image: mentorProgram,
    hidden: false,
    featured: false,
    is_archived: false,
    approved: true,
    _source: 'seed',
  },
  {
    id: 3,
    category: "Community",
    title: "Global Alumni Chapters Expand to 15 Cities",
    excerpt: "From Manila to New York, our international network continues to grow, bringing Ateneans together across continents.",
    content: `Ateneo de Davao University's global alumni network continues to expand, now reaching 15 major cities worldwide.

These chapters organize regular meetups, community service projects, and professional networking events, helping alumni stay connected no matter where they are.

The initiative reflects the university's commitment to fostering lifelong relationships among Ateneans.`,
    date: "December 28, 2025",
    image: globalAlumni,
    hidden: false,
    featured: false,
    is_archived: false,
    approved: true,
    _source: 'seed',
  },
  {
    id: 4,
    category: "Achievements",
    title: "Congratulations to the AdDU College of Law for their outstanding performance in the 2025 Bar Exam!",
    excerpt: "AdDU is TOP 1 among law schools with 51-100 candidates! Our university has produced 82 new Attorneys this year with a 100% passing rate.",
    content: `The Ateneo de Davao University College of Law has achieved an outstanding milestone in the 2025 Bar Examinations.

With a 100% passing rate and 82 new attorneys, the institution ranks first among law schools with 51–100 examinees. This achievement highlights the dedication of both students and faculty in maintaining academic excellence.

The university extends its congratulations to all passers for their remarkable accomplishment.`,
    date: "January 7, 2026",
    image: achievements1,
    hidden: false,
    featured: false,
    is_archived: false,
    approved: true,
    _source: 'seed',
  },
  {
    id: 5,
    category: "Achievements",
    title: "ADDU 26th in the Webometrics Philippines Ranking January 2026!",
    excerpt: "Congratulations to the Ateneo de Davao University Community on ranking 26th out of 356 universities in the Philippines!",
    content: `Ateneo de Davao University has secured the 26th spot in the Webometrics Ranking of Philippine Universities for January 2026.

This recognition reflects the university's strong online presence, research output, and commitment to academic excellence in the digital space.

The achievement is a testament to the collective efforts of faculty, students, and staff.`,
    date: "January 24, 2026",
    image: achievements2,
    hidden: false,
    featured: false,
    is_archived: false,
    approved: true,
    _source: 'seed',
  },
  {
    id: 6,
    category: "Achievements",
    title: "WHO MADE THE CUT? ⚖️📚",
    excerpt: "Ateneo schools dominate the 2025 Bar exams as Ateneo de Manila University tops law schools with over 100 examinees.",
    content: `Ateneo institutions have once again demonstrated excellence in the 2025 Bar Examinations.

Ateneo de Manila University led the rankings among schools with over 100 examinees, while Ateneo de Davao University also achieved remarkable results.

These accomplishments reinforce the strong tradition of legal education within Ateneo schools nationwide.`,
    date: "January 7, 2026",
    image: whoMadeCut,
    hidden: false,
    featured: false,
    is_archived: false,
    approved: true,
    _source: 'seed',
  },
];

// ── NewsView ───────────────────────────────────────────────────────────────
export function NewsView({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'edit' | 'archived'>('feed');
  const [toast, setToast] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null); // null = list view
  const [loading, setLoading] = useState(true);
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [news, setNews] = useState<Article[]>([]);
  const [localSeed, setLocalSeed] = useState<Article[]>(seedArticles);

  const emptyForm = { title: '', excerpt: '', content: '', category: '', image: '', featured: false };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const showToast = (msg: string) => setToast(msg);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const includeArchived = userRole === 'admin' ? '?include_archived=true' : '';
      const response = await fetch(`http://localhost:8000/api/giveback/posts${includeArchived}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.map(normaliseArticle));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const apiNews = userRole === 'admin'
    ? news.filter((a) => !a.is_archived)
    : news.filter((a) => !a.hidden && !a.is_archived && a.approved === true);

  const usingSeed = apiNews.length === 0;

  const visibleNews = usingSeed
    ? localSeed.filter(a => !a.is_archived && (userRole === 'admin' || (!a.hidden && a.approved === true)))
    : apiNews;

  const archivedNews = usingSeed
    ? localSeed.filter(a => a.is_archived)
    : news.filter((a) => a.is_archived);

  const featuredArticle = visibleNews.find((a) => a.featured) ?? visibleNews[0] ?? null;
  const remainingArticles = visibleNews.filter((a) => a.id !== featuredArticle?.id);

  // ── Keep selectedArticle in sync when seed/news updates ──────────────────
  useEffect(() => {
    if (!selectedArticle) return;
    const pool = usingSeed ? localSeed : news;
    const updated = pool.find(a => a.id === selectedArticle.id);
    if (updated) setSelectedArticle(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSeed, news]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updateSeedOrApi = (id: number, patch: Partial<Article>) => {
    if (usingSeed) {
      setLocalSeed(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    } else {
      setNews(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (usingSeed) {
      setLocalSeed(prev => prev.filter(a => a.id !== id));
      if (selectedArticle?.id === id) setSelectedArticle(null);
      showToast('Article deleted.');
      setDeleteConfirmId(null);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/posts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setNews(prev => prev.filter(a => a.id !== id));
        if (selectedArticle?.id === id) setSelectedArticle(null);
        showToast('Article deleted.');
      } else {
        showToast('Failed to delete article.');
      }
    } catch {
      showToast('Failed to delete article.');
    }
    setDeleteConfirmId(null);
  };

  const handleToggleHide = async (id: number) => {
    const pool = usingSeed ? localSeed : news;
    const article = pool.find(a => a.id === id);
    if (!article) return;
    const newHidden = !article.hidden;
    if (usingSeed) { updateSeedOrApi(id, { hidden: newHidden }); return; }
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden: newHidden }),
      });
      if (response.ok) updateSeedOrApi(id, { hidden: newHidden });
    } catch {
      showToast('Failed to update visibility.');
    }
  };

  const handleApprove = async (id: number) => {
    if (usingSeed) { updateSeedOrApi(id, { approved: true }); showToast('Article approved.'); return; }
    try {
      await fetch(`http://localhost:8000/api/giveback/posts/${id}/approve`, { method: 'PATCH' });
      updateSeedOrApi(id, { approved: true });
      showToast('Article approved.');
    } catch {
      updateSeedOrApi(id, { approved: true });
      showToast('Article approved.');
    }
  };

  const handleDeny = async (id: number) => {
    if (usingSeed) { updateSeedOrApi(id, { approved: false }); showToast('Article denied.'); return; }
    try {
      await fetch(`http://localhost:8000/api/giveback/posts/${id}/deny`, { method: 'PATCH' });
      updateSeedOrApi(id, { approved: false });
      showToast('Article denied.');
    } catch {
      updateSeedOrApi(id, { approved: false });
      showToast('Article denied.');
    }
  };

  const handleFeature = async (id: number) => {
    const setter = usingSeed ? setLocalSeed : setNews;
    setter((prev: Article[]) => {
      const updated = prev.map(a => ({ ...a, featured: a.id === id }));
      const target = updated.find(a => a.id === id)!;
      const rest = updated.filter(a => a.id !== id);
      return [target, ...rest];
    });
    showToast('Featured article updated.');
    if (!usingSeed) {
      try { await fetch(`http://localhost:8000/api/giveback/posts/${id}/feature`, { method: 'PATCH' }); } catch {}
    }
  };

  const handleArchive = async (id: number) => {
    if (usingSeed) {
      updateSeedOrApi(id, { is_archived: true });
      if (selectedArticle?.id === id) setSelectedArticle(null);
      showToast('Article archived.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/posts/${id}/archive`, { method: 'PATCH' });
      if (response.ok) {
        setNews(prev => prev.map(a => a.id === id ? { ...a, is_archived: true } : a));
        if (selectedArticle?.id === id) setSelectedArticle(null);
        showToast('Article archived.');
      }
    } catch { showToast('Failed to archive article.'); }
  };

  const handleRestore = async (id: number) => {
    if (usingSeed) { updateSeedOrApi(id, { is_archived: false }); showToast('Article restored.'); return; }
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/posts/${id}/restore`, { method: 'PATCH' });
      if (response.ok) { setNews(prev => prev.map(a => a.id === id ? { ...a, is_archived: false } : a)); showToast('Article restored.'); }
    } catch { showToast('Failed to restore article.'); }
  };

  const handleEdit = (article: Article) => {
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      image: typeof article.image === 'string' && article.image !== PLACEHOLDER ? article.image : '',
      featured: article.featured ?? false,
    });
    setEditingId(article.id);
    setSelectedArticle(null);
    setActiveTab('edit');
  };

  const handlePublish = async () => {
    if (!form.title || !form.excerpt || !form.content || !form.category) {
      showToast('Please fill in all required fields.');
      return;
    }
    if (usingSeed) {
      const newArticle: Article = {
        id: Math.max(...localSeed.map(a => a.id)) + 1,
        category: form.category,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        image: form.image || PLACEHOLDER,
        hidden: false,
        featured: false,
        is_archived: false,
        approved: null,
        _source: 'seed',
      };
      if (form.featured) {
        setLocalSeed(prev => [{ ...newArticle, featured: true }, ...prev.map(a => ({ ...a, featured: false }))]);
      } else {
        setLocalSeed(prev => [...prev, newArticle]);
      }
      setForm(emptyForm);
      setNewPostImage(null);
      setActiveTab('feed');
      showToast('Article published successfully!');
      return;
    }
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('excerpt', form.excerpt);
    formData.append('content', form.content);
    formData.append('category', form.category);
    if (form.featured) formData.append('featured', 'true');
    if (newPostImage) formData.append('image', newPostImage);
    else if (form.image) formData.append('image_url', form.image);
    try {
      const response = await fetch('http://localhost:8000/api/giveback/posts', { method: 'POST', body: formData });
      if (response.ok) {
        await fetchPosts();
        setForm(emptyForm);
        setNewPostImage(null);
        setActiveTab('feed');
        showToast('Article published successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.message || 'Failed to publish article.');
      }
    } catch { showToast('Failed to publish article.'); }
  };

  const handleSaveEdit = async () => {
    if (!form.title || !form.excerpt || !form.content || !form.category) {
      showToast('Please fill in all required fields.');
      return;
    }
    if (usingSeed) {
      setLocalSeed(prev => prev.map(a =>
        a.id === editingId
          ? { ...a, title: form.title, excerpt: form.excerpt, content: form.content, category: form.category, image: form.image || a.image }
          : a
      ));
      setForm(emptyForm);
      setEditingId(null);
      setActiveTab('feed');
      showToast('Article updated successfully!');
      return;
    }
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('excerpt', form.excerpt);
    formData.append('content', form.content);
    formData.append('category', form.category);
    if (newPostImage) formData.append('image', newPostImage);
    else if (form.image) formData.append('image_url', form.image);
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/posts/${editingId}`, { method: 'PUT', body: formData });
      if (response.ok) {
        await fetchPosts();
        setForm(emptyForm);
        setNewPostImage(null);
        setEditingId(null);
        setActiveTab('feed');
        showToast('Article updated successfully!');
      } else { showToast('Failed to update article.'); }
    } catch { showToast('Failed to update article.'); }
  };

  // ── Form renderer ─────────────────────────────────────────────────────────
  const renderForm = (isEdit: boolean) => (
    <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Article' : 'Post New Article'}
      </h2>
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
          <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]">
            <option value="">Select a category</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Programs">Programs</option>
            <option value="Community">Community</option>
            <option value="Achievements">Achievements</option>
            <option value="Events">Events</option>
            <option value="Announcements">Announcements</option>
            <option value="Giving">Giving</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Article title"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt <span className="text-red-500">*</span></label>
          <textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
            placeholder="Short summary shown on the news feed" rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Content <span className="text-red-500">*</span></label>
          <textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Full article content" rows={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Featured Image <span className="text-gray-400 font-normal">(optional — upload or paste URL)</span>
          </label>
          {isEdit && form.image && (
            <img src={form.image} alt="Current" className="w-full h-40 object-cover rounded-xl mb-2 bg-gray-100"
              onError={(e) => (e.currentTarget.style.display = 'none')} />
          )}
          <input type="file" accept="image/*" onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] mb-2" />
          <input type="text" value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
            placeholder={isEdit ? 'Or paste a new image URL to replace' : 'Or paste an image URL: https://...'}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))}
            className="w-4 h-4 accent-[#003087]" />
          <span className="text-sm font-semibold text-gray-700">
            Feature this article <span className="text-gray-400 font-normal">(pins to top and sets as the featured banner)</span>
          </span>
        </label>
        <div className="flex gap-3 pt-2">
          <button onClick={isEdit ? handleSaveEdit : handlePublish}
            className="flex-1 bg-[#003087] text-white py-3 rounded-xl font-semibold hover:bg-[#002066] transition-colors">
            {isEdit ? 'Save Changes' : 'Publish Article'}
          </button>
          <button onClick={() => { setActiveTab('feed'); setForm(emptyForm); setEditingId(null); setNewPostImage(null); }}
            className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ── Article detail page view ───────────────────────────────────────────────
  if (selectedArticle && activeTab === 'feed') {
    return (
      <>
        <ArticleDetailPage
          article={selectedArticle}
          userRole={userRole}
          onBack={handleBack}
          onEdit={() => handleEdit(selectedArticle)}
          onToggleHide={() => handleToggleHide(selectedArticle.id)}
          onDelete={() => setDeleteConfirmId(selectedArticle.id)}
          onApprove={() => handleApprove(selectedArticle.id)}
          onDeny={() => handleDeny(selectedArticle.id)}
        />

        {/* Delete Confirm Modal — still needs to work on detail page */}
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] w-full max-w-md p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Article?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The article will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors">
                  Yes, Delete
                </button>
                <button onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </>
    );
  }

  // ── Main list view ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-8 space-y-12 flex-1">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">News & Updates</h1>
            <p className="text-gray-500 font-medium">Stay informed about alumni news and announcements</p>
          </div>
          {userRole === 'admin' && activeTab === 'feed' && (
            <button
              onClick={() => { setForm(emptyForm); setNewPostImage(null); setActiveTab('create'); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" /> Post News
            </button>
          )}
        </div>

        {/* Tab bar */}
        {activeTab === 'feed' && (
          <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
            <button className="px-6 py-3 border-b-2 border-[#003087] text-[#003087] font-semibold">News Feed</button>
            {userRole === 'admin' && (
              <button onClick={() => setActiveTab('archived')}
                className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors font-semibold">
                Archived
              </button>
            )}
          </div>
        )}

        {/* ── Feed ── */}
        {activeTab === 'feed' && (
          <>
            {loading && !usingSeed ? (
              <div className="text-center py-10 text-gray-500">Loading posts...</div>
            ) : (
              <>
                {visibleNews.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Newspaper className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-1">No articles yet</h3>
                    <p className="text-gray-400 text-sm">
                      {userRole === 'admin' ? 'Click "Post News" to publish your first article.' : 'Check back soon for updates.'}
                    </p>
                  </div>
                )}

                {/* Featured banner */}
                {featuredArticle && (
                  <section className={`relative overflow-hidden rounded-[40px] bg-white border border-gray-100 shadow-lg ${featuredArticle.hidden ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-1/2 relative h-[450px] lg:h-auto overflow-hidden bg-gray-200">
                        <img
                          src={featuredArticle.image || PLACEHOLDER}
                          className="w-full h-full object-cover"
                          alt={featuredArticle.title}
                          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                        />
                        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
                          <Star className="w-3 h-3 fill-yellow-900" /> Featured
                        </div>
                        {featuredArticle.hidden && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-white text-sm font-bold bg-black/50 px-4 py-2 rounded-full">Hidden from Alumni</span>
                          </div>
                        )}
                      </div>
                      <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-between text-left">
                        <div>
                          {userRole === 'admin' && (
                            <div className="mb-3"><StatusBadge approved={featuredArticle.approved} /></div>
                          )}
                          {userRole === 'admin' && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {featuredArticle.approved !== true && (
                                <button onClick={() => handleApprove(featuredArticle.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                  <Check className="w-3 h-3" /> Approve
                                </button>
                              )}
                              {featuredArticle.approved !== false && (
                                <button onClick={() => handleDeny(featuredArticle.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                  <X className="w-3 h-3" /> Deny
                                </button>
                              )}
                              <button onClick={() => handleEdit(featuredArticle)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#003087] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <Pencil className="w-3 h-3" /> Edit
                              </button>
                              <button onClick={() => handleToggleHide(featuredArticle.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                                {featuredArticle.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {featuredArticle.hidden ? 'Unhide' : 'Hide'}
                              </button>
                              <button onClick={() => handleArchive(featuredArticle.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                                <Archive className="w-3 h-3" /> Archive
                              </button>
                              <button onClick={() => setDeleteConfirmId(featuredArticle.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          )}
                          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 leading-tight">{featuredArticle.title}</h2>
                          <p className="text-gray-600 text-sm leading-relaxed mb-8">{featuredArticle.excerpt}</p>
                        </div>
                        <button onClick={() => handleReadMore(featuredArticle)}
                          className="text-[#003087] font-bold text-sm flex items-center gap-2 w-fit hover:translate-x-1 transition-transform">
                          Read More <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* Remaining articles */}
                {remainingArticles.length > 0 && (
                  <div className="flex flex-col gap-8 mt-8">
                    {remainingArticles.map((article) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        userRole={userRole}
                        onReadMore={() => handleReadMore(article)}
                        onDelete={() => setDeleteConfirmId(article.id)}
                        onToggleHide={() => handleToggleHide(article.id)}
                        onEdit={() => handleEdit(article)}
                        onFeature={() => handleFeature(article.id)}
                        onArchive={() => handleArchive(article.id)}
                        onApprove={() => handleApprove(article.id)}
                        onDeny={() => handleDeny(article.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── Archived Tab ── */}
        {activeTab === 'archived' && userRole === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Archived Posts</h2>
              <div className="h-[2px] flex-1 bg-gray-100"></div>
              <button onClick={() => setActiveTab('feed')}
                className="flex items-center gap-2 text-[#003087] font-semibold text-sm hover:-translate-x-1 transition-transform">
                <ArrowLeft className="w-4 h-4" /> Back to Feed
              </button>
            </div>
            {archivedNews.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No archived posts.</div>
            ) : (
              <div className="flex flex-col gap-8">
                {archivedNews.map((article) => (
                  <div key={article.id} className="relative">
                    <NewsCard
                      article={article}
                      userRole={userRole}
                      onReadMore={() => handleReadMore(article)}
                      onDelete={() => setDeleteConfirmId(article.id)}
                      onToggleHide={() => handleToggleHide(article.id)}
                      onEdit={() => handleEdit(article)}
                      onFeature={() => handleFeature(article.id)}
                      onApprove={() => handleApprove(article.id)}
                      onDeny={() => handleDeny(article.id)}
                    />
                    <div className="absolute top-6 right-6">
                      <button onClick={() => handleRestore(article.id)} title="Restore"
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors shadow">
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && renderForm(false)}
        {activeTab === 'edit' && renderForm(true)}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Article?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The article will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirmId(null)}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <Footer />
    </div>
  );
}