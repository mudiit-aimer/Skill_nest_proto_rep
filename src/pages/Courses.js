import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { filterSampleCourses } from '../data/sampleCourses';
import './Courses.css';

const CATEGORIES = ['All', 'Development', 'Design', 'Data Science', 'Marketing', 'Business', 'Photography', 'Music'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'All';
  const level = searchParams.get('level') || 'All';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (category !== 'All') params.set('category', category);
      if (level !== 'All') params.set('level', level);
      if (search) params.set('search', search);
      const res = await fetch(`/api/courses?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCourses(data.courses);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      const fallback = filterSampleCourses({ category, level, search, page, limit: 9 });
      setCourses(fallback.courses);
      setTotal(fallback.total);
      setPages(fallback.pages);
    } finally {
      setLoading(false);
    }
  }, [category, level, search, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const set = (key, val) => {
    const p = new URLSearchParams(searchParams);
    p.set(key, val);
    p.set('page', '1');
    setSearchParams(p);
  };

  const handleSearch = e => {
    e.preventDefault();
    set('search', searchInput);
  };

  return (
    <main className="courses-page">
      <div className="courses-hero">
        <div className="container">
          <span className="t-label anim-fade-up">all disciplines</span>
          <h1 className="t-display anim-fade-up anim-delay-1" style={{ marginTop: 12 }}>
            find your next<br /><em>obsession.</em>
          </h1>
          <form className="courses-search anim-fade-up anim-delay-2" onSubmit={handleSearch}>
            <span className="courses-search__icon">⌕</span>
            <input
              type="text"
              className="courses-search__input"
              placeholder="search courses, topics, instructors…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button type="button" className="courses-search__clear"
                onClick={() => { setSearchInput(''); set('search', ''); }}>×</button>
            )}
          </form>
        </div>
      </div>

      <div className="courses-body container">
        <aside className="courses-sidebar">
          <div className="filter-group">
            <h4 className="t-label">category</h4>
            <div className="filter-list">
              {CATEGORIES.map(c => (
                <button key={c}
                  className={`filter-btn ${category === c ? 'filter-btn--active' : ''}`}
                  onClick={() => set('category', c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-divider" />
          <div className="filter-group">
            <h4 className="t-label">level</h4>
            <div className="filter-list">
              {LEVELS.map(l => (
                <button key={l}
                  className={`filter-btn ${level === l ? 'filter-btn--active' : ''}`}
                  onClick={() => set('level', l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="courses-main">
          <div className="courses-meta">
            <p className="t-small">{loading ? 'loading…' : `${total} course${total !== 1 ? 's' : ''} found`}</p>
            {(category !== 'All' || level !== 'All' || search) && (
              <button className="clear-filters" onClick={() => {
                setSearchInput('');
                setSearchParams({});
              }}>clear filters ×</button>
            )}
          </div>

          {loading ? (
            <div className="courses-loading">
              <div className="spinner" />
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <div className="icon">◎</div>
              <h3>nothing found</h3>
              <p>try different filters or search terms</p>
            </div>
          ) : (
            <div className="grid-3">
              {courses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          )}

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p}
                  className={`page-btn ${page === p ? 'page-btn--active' : ''}`}
                  onClick={() => {
                    const np = new URLSearchParams(searchParams);
                    np.set('page', p);
                    setSearchParams(np);
                  }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
