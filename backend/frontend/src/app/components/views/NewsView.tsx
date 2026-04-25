// 1. Imports MUST be at the very top for ESLint
import { ArrowRight, Clock, Plus, Trash2, Archive, RotateCcw } from 'lucide-react';
import { Footer } from '../Footer';
import { useEffect, useState } from 'react';

// Asset Imports
import admissionsFair from '../../../assets/AdmissionsFairBG.jpg';
import mentorProgram from '../../../assets/AlumniMentorBG.jpg';
import globalAlumni from '../../../assets/GlobalAlumniBG.jpg';
import achievements1 from '../../../assets/Achievements1BG.jpg';
import achievements2 from '../../../assets/Achievements2BG.jpg';
import whoMadeCut from '../../../assets/WhoCutBG.jpg';

// 2. Constants come after imports
const PLACEHOLDER = "https://images.unsplash.com/photo-1523050335456-c6bb7f9cc997?auto=format&fit=crop&q=80&w=800";

interface NewsItemProps {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: any;
}

interface NewsItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string | null;
  is_archived: boolean;
  created_at: string;
}

function NewsCard({ category, title, excerpt, date, image }: NewsItemProps) {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row h-full text-left group">
      <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-200">
        <img 
          src={image || PLACEHOLDER} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
      </div>
      <div className="md:w-2/3 p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider">
            {category}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            {date}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#003087] transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {excerpt}
        </p>
        <button className="flex items-center gap-2 text-[#003087] font-bold text-sm hover:translate-x-1 transition-transform">
          Read More <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function NewsView({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'archived'>('feed');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    featured: false
  });

  const [newPostImage, setNewPostImage] = useState<File | null>(null);

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
        setNews(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!newPost.title || !newPost.excerpt || !newPost.content || !newPost.category) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('excerpt', newPost.excerpt);
    formData.append('content', newPost.content);
    formData.append('category', newPost.category);
    if (newPostImage) {
      formData.append('image', newPostImage);
    }

    try {
      const response = await fetch('http://localhost:8000/api/giveback/posts', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        await fetchPosts();
        setNewPost({
          title: '',
          excerpt: '',
          content: '',
          category: '',
          image: '',
          featured: false
        });
        setNewPostImage(null);
        setActiveTab('feed');
        alert('Article published successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish article');
    }
  };

  const handleArchive = async (id: number) => {
    if (!window.confirm('Archive this post?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/posts/${id}/archive`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error archiving post:', error);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/posts/${id}/restore`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error restoring post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Permanently delete this post?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/posts/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // const newsFeed = [
  //   {
  //     category: "Programs",
  //     title: "New Alumni Mentorship Program Launches",
  //     excerpt: "Connect with fellow Ateneans and share your expertise with the next generation through our expanded mentorship initiative.",
  //     date: "January 5, 2026",
  //     image: mentorProgram
  //   },
  //   {
  //     category: "Community",
  //     title: "Global Alumni Chapters Expand to 15 Cities",
  //     excerpt: "From Manila to New York, our international network continues to grow, bringing Ateneans together across continents.",
  //     date: "December 28, 2025",
  //     image: globalAlumni
  //   },
  //   {
  //     category: "Achievements",
  //     title: "Congratulations to the AdDU College of Law for their outstanding performance in the 2025 Bar Exam!",
  //     excerpt: "AdDU is TOP 1 among law schools with 51-100 candidates! Our university has produced 82 new Attorneys this year with a 100% passing rate.",
  //     date: "January 7, 2026",
  //     image: achievements1
  //   },
  //   {
  //     category: "Achievements",
  //     title: "ADDU 26th in the Webometrics Philippines Ranking January 2026!",
  //     excerpt: "Congratulations to the Ateneo de Davao University Community on ranking 26th out of 356 universities in the Philippines!",
  //     date: "January 24, 2026",
  //     image: achievements2
  //   },
  //   {
  //     category: "Achievements",
  //     title: "WHO MADE THE CUT? ⚖️📚",
  //     excerpt: "Ateneo schools dominate the 2025 Bar exams as Ateneo de Manila University tops law schools with over 100 examinees.",
  //     date: "January 7, 2026",
  //     image: whoMadeCut
  //   }
  // ];

  const visiblePosts = news.filter((item) => !item.is_archived);
  const archivedPosts = news.filter((item) => item.is_archived);
  const featuredPost = visiblePosts[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-8 space-y-12 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">News & Updates</h1>
            <p className="text-gray-500 font-medium">Stay informed about alumni news and announcements</p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Post News
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-3 border-b-2 transition-colors font-semibold ${
              activeTab === 'feed' 
                ? 'border-[#003087] text-[#003087]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            News Feed
          </button>
          {userRole === 'admin' && (
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 border-b-2 transition-colors font-semibold ${
                activeTab === 'create' 
                  ? 'border-[#003087] text-[#003087]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Post
            </button>
          )}
          {userRole === 'admin' && (
            <button 
              onClick={() => setActiveTab('archived')}
              className={`px-6 py-3 border-b-2 transition-colors font-semibold ${
                activeTab === 'archived' 
                  ? 'border-[#003087] text-[#003087]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Archived
            </button>
          )}
        </div>

        {activeTab === 'feed' && (
          <>
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading posts...</div>
            ) : visiblePosts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No GiveBack posts available yet.</div>
            ) : (
              <>
                {/* Featured Section */}
                <section className="relative overflow-hidden rounded-[40px] bg-white border border-gray-100 shadow-lg">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 relative h-[450px] lg:h-auto overflow-hidden bg-gray-200">
                      <img 
                        src={featuredPost?.image_url || admissionsFair || PLACEHOLDER} 
                        alt={featuredPost?.title || "Featured Article"} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                      />
                      <div className="absolute top-6 left-6">
                        <span className="px-5 py-2 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-widest shadow-lg">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center text-left">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider w-fit mb-4">
                        {featuredPost?.category || "GiveBack"}
                      </span>
                      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {featuredPost?.title || "GiveBack Spotlight"}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-8">
                        {featuredPost?.excerpt || "Stay updated on GiveBack initiatives and community impact."}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                        <span className="text-sm text-gray-400 font-medium">
                          {featuredPost ? new Date(featuredPost.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        </span>
                        <button className="text-[#003087] font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                          Read More <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* News Feed */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">News Feed</h2>
                    <div className="h-[2px] flex-1 bg-gray-100"></div>
                  </div>
                  <div className="flex flex-col gap-8">
                    {visiblePosts.slice(1).map((article) => (
                      <div key={article.id} className="relative">
                        <NewsCard
                          category={article.category}
                          title={article.title}
                          excerpt={article.excerpt}
                          date={new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          image={article.image_url || PLACEHOLDER}
                        />
                        {userRole === 'admin' && (
                          <div className="absolute top-6 right-6 flex gap-2">
                            <button
                              onClick={() => handleArchive(article.id)}
                              className="p-2 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'create' && userRole === 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create News Post</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter article title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt/Summary *</label>
                <textarea 
                  rows={3}
                  placeholder="Brief summary that appears in the news feed"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Content *</label>
                <textarea 
                  rows={10}
                  placeholder="Write your full article here..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select 
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Giving">Giving</option>
                    <option value="Programs">Programs</option>
                    <option value="Community">Community</option>
                    <option value="Events">Events</option>
                    <option value="Achievements">Achievements</option>
                    <option value="Scholarship">Scholarship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="featured" 
                  checked={newPost.featured}
                  onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                  className="w-4 h-4 text-[#003087] border-gray-300 rounded focus:ring-[#003087]" 
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as featured article</label>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={handlePublish}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  Publish
                </button>
                <button 
                  onClick={() => {
                    setNewPost({
                      title: '',
                      excerpt: '',
                      content: '',
                      category: '',
                      image: '',
                      featured: false
                    });
                    setActiveTab('feed');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'archived' && userRole === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Archived Posts</h2>
              <div className="h-[2px] flex-1 bg-gray-100"></div>
            </div>
            {archivedPosts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No archived posts.</div>
            ) : (
              <div className="flex flex-col gap-8">
                {archivedPosts.map((article) => (
                  <div key={article.id} className="relative">
                    <NewsCard
                      category={article.category}
                      title={article.title}
                      excerpt={article.excerpt}
                      date={new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      image={article.image_url || PLACEHOLDER}
                    />
                    <div className="absolute top-6 right-6 flex gap-2">
                      <button
                        onClick={() => handleRestore(article.id)}
                        className="p-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer added at the bottom */}
      <Footer />
    </div>
  );
}