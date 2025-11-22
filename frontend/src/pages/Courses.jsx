import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollReveal from '../components/ScrollReveal';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/api/courses?${params}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-16 relative overflow-hidden">
        {/* Animated Floating SVG Backgrounds for depth */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <svg className="absolute left-10 top-10 w-64 h-64 opacity-30 blur-2xl animate-float" style={{ fill: '#b6effb' }} viewBox="0 0 160 160"><circle cx="80" cy="80" r="80" /></svg>
          <svg className="absolute right-10 bottom-10 w-64 h-64 opacity-30 blur-2xl animate-float" style={{ animationDelay: '1s', fill: '#eadefa' }} viewBox="0 0 130 130"><ellipse cx="65" cy="65" rx="65" ry="54" /></svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal delay={0}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-gradient">
              NEB Video Courses
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of NEB video courses. Learn at your own pace with expert video instruction.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <ScrollReveal delay={0}>
          <div className="bg-white/70 glass border-2 border-white/30 rounded-xl p-6 mb-8 shadow-md hover-glow transition-all duration-300">
            {/* Category filter with pill/chip style */}
            <div className="flex flex-wrap gap-3 md:gap-6 justify-center mb-5 mt-2">
              {["", "Physics", "Chemistry", "Mathematics"].map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setFilters({ ...filters, category: cat })}
                  className={`px-4 py-2 rounded-full font-medium border transition transition-all duration-200 text-sm ${filters.category === cat ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white/80 border-gray-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300'}`}
                >
                  {cat || 'All Categories'}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            />
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </ScrollReveal>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <ScrollReveal key={course._id} delay={idx * 100}>
                <div className="card-hover bg-white/70 glass border-2 border-white/30 rounded-xl overflow-hidden flex flex-col h-full">
                  {/* Image Section - Fixed Height */}
                  <div className="relative w-full h-48">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <div className="text-6xl">📚</div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white text-primary-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Section - Flex Grow */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-3">
                      <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-grow">
                      {course.description || 'Comprehensive preparation program'}
                    </p>
                    {/* Bottom section with price and button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">Rs. {course.price}</span>
                      </div>
                      <Link
                        to={`/courses/${course._id}`}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
