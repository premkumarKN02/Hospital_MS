import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  User,
  ArrowRight,
  X,
  Share2,
  Tag,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { BLOG_POSTS, CLINIC_CONFIG } from '../config/clinicData';
import { BlogPost, PageRoute } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderNotice } from '../components/common/PlaceholderNotice';

interface BlogPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = [
    'All',
    'Cardiovascular Health',
    'Diabetes Care',
    'General Health',
    'Lifestyle & Wellness',
    'Preventive Care',
    'Digestive Health'
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs currentTitle="Health Resources & Blog" onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#041628] rounded-3xl p-8 sm:p-14 text-white shadow-soft-xl">
          {/* Authentic Clinical Education Backdrop — Vivid & Recognizable */}
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />
          <div className="canva-hero-frame" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 text-tealAccent-300 text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Patient Education &amp; Wellness Insights</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              Health Articles &amp; Clinical Insights
            </h1>
            <p className="text-sm sm:text-base text-white leading-relaxed font-medium drop-shadow-md">
              Evidence-based medical knowledge written to help you and your family understand symptoms, cultivate sustainable wellness habits, and take control of your health.
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaceholderNotice />
      </div>

      {/* Featured Article Banner */}
      {selectedCategory === 'All' && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-container">
          <div className="perspective-card relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/25 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px]">
            {/* Real Background Clinical Photograph */}
            <img
              src={featuredPost.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'}
              alt={featuredPost.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              loading="lazy"
            />

            {/* Dark Scrim Overlay */}
            <div className="full-bleed-card-scrim bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-brand-950/85" />

            {/* Canva Inset Border Line */}
            <div className="canva-frame" />

            <div className="relative z-10 lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-tealAccent-500/30 text-tealAccent-200 border border-tealAccent-400/40 backdrop-blur-md">
                  Featured Article
                </span>
                <span className="text-white/60">&bull;</span>
                <span className="text-white font-medium drop-shadow-sm">{featuredPost.readTime}</span>
                <span className="text-white/60">&bull;</span>
                <span className="text-white font-medium drop-shadow-sm">{featuredPost.publishedDate}</span>
              </div>

              <h2
                className="text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] hover:text-tealAccent-200 transition-colors cursor-pointer"
                onClick={() => setActiveArticle(featuredPost)}
              >
                {featuredPost.title}
              </h2>

              <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {featuredPost.summary}
              </p>

              <div className="pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/90 font-medium drop-shadow-sm">
                  <User className="w-3.5 h-3.5 text-tealAccent-300" />
                  <span>By {featuredPost.author}</span>
                </div>

                <button
                  onClick={() => setActiveArticle(featuredPost)}
                  className="btn-teal text-xs sm:text-sm py-2.5 px-5 font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            <div className="relative z-10 lg:col-span-5 bg-slate-900/85 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl space-y-3">
              <h4 className="font-bold text-sm text-tealAccent-300 uppercase tracking-wider">Article Highlights:</h4>
              <ul className="space-y-2.5 text-xs text-white">
                {featuredPost.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-tealAccent-300 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium drop-shadow-sm">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Search & Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slateSubtle-200 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'bg-slateSubtle-100 text-slateSubtle-700 hover:bg-slateSubtle-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slateSubtle-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search health topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slateSubtle-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>

        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="perspective-card relative overflow-hidden rounded-3xl p-7 min-h-[420px] shadow-xl border border-white/20 group flex flex-col justify-between hover:-translate-y-2 transition-all duration-300"
            >
              {/* Real Background Clinical Photograph */}
              <img
                src={post.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />

              {/* Dark Scrim Overlay */}
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />

              {/* Canva Inset Border Line */}
              <div className="canva-frame" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-tealAccent-200 bg-tealAccent-950/70 border border-tealAccent-400/40 px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider text-[10px]">
                    {post.category}
                  </span>
                  <span className="text-white/90 font-medium flex items-center gap-1 drop-shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-tealAccent-300" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h3
                  onClick={() => setActiveArticle(post)}
                  className="font-bold text-lg sm:text-xl text-white leading-snug hover:text-tealAccent-200 transition-colors cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]"
                >
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/95 font-medium line-clamp-3 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {post.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-tealAccent-200 bg-slate-950/80 border border-teal-400/30 px-2.5 py-0.5 rounded-md backdrop-blur-sm font-bold shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs mt-4">
                <span className="text-white/90 font-medium drop-shadow-sm">By {post.author}</span>
                <button
                  onClick={() => setActiveArticle(post)}
                  className="font-bold text-tealAccent-300 hover:text-white flex items-center gap-1 transition-colors drop-shadow-sm"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slateSubtle-200 space-y-3">
            <BookOpen className="w-10 h-10 text-slateSubtle-400 mx-auto" />
            <p className="font-semibold text-slateSubtle-700">No articles match your query.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="btn-outline text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slateSubtle-900/60 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-soft-xl border border-slateSubtle-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header with Hero Photography & Canva Frame */}
            <div className="relative p-6 sm:p-8 overflow-hidden min-h-[160px] border-b border-white/20 flex items-start justify-between gap-4">
              {/* Background Photo */}
              <img
                src={activeArticle.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Dark Scrim */}
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/98 via-slate-900/85 to-slate-950/70" />
              {/* Canva Inset Line */}
              <div className="canva-hero-frame" />

              <div className="relative z-10 space-y-1.5 max-w-[85%]">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-tealAccent-500/30 text-tealAccent-200 border border-tealAccent-400/40 backdrop-blur-md">
                  {activeArticle.category}
                </span>
                <h3 className="font-extrabold text-white text-lg sm:text-2xl leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  {activeArticle.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-white/90 pt-1 drop-shadow-sm font-medium">
                  <span>Author: {activeArticle.author}</span>
                  <span>&bull;</span>
                  <span>{activeArticle.publishedDate}</span>
                  <span>&bull;</span>
                  <span>{activeArticle.readTime}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                aria-label="Close reader"
                className="relative z-10 p-2.5 rounded-xl text-white bg-slate-950/85 hover:bg-slate-900 backdrop-blur-md border border-white/30 transition-all flex-shrink-0 shadow-lg"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slateSubtle-700 leading-relaxed">
              {activeArticle.contentParagraphs.map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {para}
                </p>
              ))}

              {/* Key Takeaways Box */}
              <div className="p-4 rounded-2xl bg-tealAccent-50 border border-tealAccent-200/70 space-y-2 mt-4">
                <h4 className="font-bold text-tealAccent-950 text-xs sm:text-sm">
                  Clinical Key Takeaways:
                </h4>
                <ul className="space-y-1 text-xs text-tealAccent-900">
                  {activeArticle.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tealAccent-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medical Disclaimer */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2 mt-4">
                <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Educational Notice:</strong> This article is for informational purposes only. Do not use this content to self-diagnose or self-medicate. Always consult a qualified physician for personalized clinical care.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slateSubtle-100 bg-slateSubtle-50 flex items-center justify-between">
              <button
                onClick={() => setActiveArticle(null)}
                className="btn-outline text-xs py-2 px-4"
              >
                Close Article
              </button>
              <button
                onClick={() => {
                  setActiveArticle(null);
                  onNavigate('appointments');
                }}
                className="btn-primary text-xs py-2 px-4 font-bold"
              >
                Book Consultation With Author
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
