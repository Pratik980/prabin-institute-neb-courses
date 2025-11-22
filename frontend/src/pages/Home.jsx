import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollReveal from '../components/ScrollReveal';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    totalVideoLessons: 0,
    categoryStats: {
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/users/stats');
      setStats({
        totalStudents: response.data?.totalStudents || 0,
        totalVideoLessons: response.data?.totalVideoLessons || 0,
        categoryStats: response.data?.categoryStats || {
          Physics: 0,
          Chemistry: 0,
          Mathematics: 0
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ 
        totalStudents: 0, 
        totalVideoLessons: 0,
        categoryStats: {
          Physics: 0,
          Chemistry: 0,
          Mathematics: 0
        }
      });
    }
  };

  // Format number with K+ suffix
  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num >= 1000) {
      const k = Math.floor(num / 1000);
      return `${k}K+`;
    }
    return `${num}+`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-32 overflow-hidden">
        {/* Animated Floating SVG Backgrounds for depth */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <svg className="absolute left-10 top-20 w-72 h-72 opacity-40 blur-2xl animate-float" style={{ fill: '#b6effb' }} viewBox="0 0 160 160"><circle cx="80" cy="80" r="80" /></svg>
          <svg className="absolute right-10 top-40 w-72 h-72 opacity-30 blur-2xl animate-float" style={{ animationDelay: '1s', fill: '#fec7ef' }} viewBox="0 0 130 130"><rect width="130" height="130" rx="65" /></svg>
          <svg className="absolute left-1/2 -bottom-8 w-72 h-72 opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s', fill: '#eadefa' }} viewBox="0 0 120 120"><ellipse cx="60" cy="60" rx="60" ry="54" /></svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <ScrollReveal delay={0}>
              <div className="text-center lg:text-left">
                <div className="relative bg-white/50 glass rounded-3xl shadow-xl p-6 z-10 backdrop-blur-xl border border-white/40">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight animate-slideInLeft">
                    Prepare Smarter for<br />
                    <span className="text-gradient animate-gradient">NEB Examinations</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fadeIn">
                    Master NEB syllabus with our comprehensive video courses. Learn at your own pace with expert-designed video lessons.
                  </p>
                
                  {/* Support Section */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-8 animate-slideInUp">
                    <div className="flex -space-x-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-full border-2 border-white animate-bounceIn`}
                          style={{
                            background: i === 0 ? 'linear-gradient(to bottom right, #60a5fa, #3b82f6)' :
                                       i === 1 ? 'linear-gradient(to bottom right, #34d399, #10b981)' :
                                       'linear-gradient(to bottom right, #a78bfa, #8b5cf6)',
                            animationDelay: `${i * 0.2}s`
                          }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Access high-quality video lessons anytime, anywhere. Learn from expert instructors at your own pace.
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                    <Link
                      to="/register"
                      className="ripple px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover-scale relative overflow-hidden group"
                    >
                      <span className="relative z-10">Enroll Now</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                    <Link
                      to="/courses"
                      className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 shadow-md hover:shadow-lg hover-scale hover-glow"
                    >
                      Browse Courses
                    </Link>
                  </div>

                  {/* Statistics */}
                  <div className="flex gap-8 justify-center lg:justify-start">
                    <div className="animate-scaleIn" style={{ animationDelay: '0.3s' }}>
                      <div className="text-3xl font-bold text-primary-600 animate-pulse-slow">
                        {formatNumber(stats.totalStudents)}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="animate-scaleIn" style={{ animationDelay: '0.5s' }}>
                      <div className="text-3xl font-bold text-primary-600 animate-pulse-slow">
                        {formatNumber(stats.totalVideoLessons)}
                      </div>
                      <div className="text-sm text-gray-600">Video Lessons</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Content - Video Player Mockup */}
            <ScrollReveal delay={200}>
              <div className="relative hidden lg:block">
                <div className="relative mx-auto animate-float" style={{ maxWidth: '400px' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl transform rotate-6 opacity-20 animate-pulse-slow"></div>
                  <div className="relative bg-gray-900 rounded-3xl p-2 shadow-2xl card-hover">
                    <div className="bg-white rounded-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold">NEB Video Courses</h3>
                          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse-slow flex items-center justify-center">
                            ▶
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {['Physics', 'Chemistry', 'Mathematics'].map((subject, i) => {
                          const videoCount = stats.categoryStats?.[subject] || 0;
                          const displayCount = videoCount > 0 ? `${videoCount} videos` : '0 videos';
                          const progressWidth = videoCount > 0 ? Math.min(70 + (videoCount % 30), 100) : 0;
                          
                          return (
                            <div key={i} className="bg-gray-50 rounded-lg p-3 animate-slideInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">{subject}</span>
                                <span className="text-xs text-gray-500">{displayCount}</span>
                              </div>
                              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-1 bg-primary-600 rounded-full animate-shimmer" 
                                  style={{ width: `${progressWidth}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Current Courses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              NEB Video Courses
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Explore our comprehensive collection of NEB video courses covering all subjects and topics
            </p>
          </ScrollReveal>
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner w-12 h-12 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course, idx) => (
                <ScrollReveal key={course._id} delay={idx * 100}>
                  <div className="card-hover bg-white/70 glass border-2 border-white/30 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
                    {/* Image Section - Fixed Height */}
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden relative">
                      {course.thumbnail ? (
                        <>
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover hover-scale transition-transform duration-500"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <span className="text-2xl">▶</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-4xl animate-bounceIn">📹</div>
                      )}
                    </div>
                    
                    {/* Content Section - Flex Grow */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {course.description || 'Comprehensive NEB video course with expert instruction'}
                      </p>
                      {course.lessons && course.lessons.length > 0 && (
                        <p className="text-xs text-gray-500 mb-4">
                          📹 {course.lessons.length} Video Lessons
                        </p>
                      )}
                      {/* Button at bottom */}
                      <Link
                        to={`/courses/${course._id}`}
                        className="ripple block w-full text-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 relative overflow-hidden group mt-auto"
                      >
                        <span className="relative z-10">Watch Videos</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Why choose our NEB video courses?
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Learn at your own pace with our comprehensive video-based learning platform
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '📹',
                title: 'Expert Video Lessons',
                description: 'High-quality video content created by experienced NEB instructors'
              },
              {
                icon: '⏰',
                title: 'Learn Anytime',
                description: 'Access all video lessons 24/7 and learn at your own convenient time'
              },
              {
                icon: '🔄',
                title: 'Watch & Rewatch',
                description: 'Pause, rewind, and replay videos as many times as you need'
              },
              {
                icon: '📚',
                title: 'Complete Coverage',
                description: 'Comprehensive video courses covering the entire NEB syllabus'
              }
            ].map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="card-hover bg-white rounded-xl p-6 text-center">
                  <div className="text-5xl mb-4 animate-bounceIn" style={{ animationDelay: `${idx * 0.1}s` }}>{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Simple steps to start learning with our NEB video courses
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '1️⃣', title: 'Browse Courses', description: 'Explore our collection of NEB video courses' },
              { icon: '2️⃣', title: 'Purchase Course', description: 'Select and purchase the course you need' },
              { icon: '3️⃣', title: 'Watch Videos', description: 'Start watching high-quality video lessons immediately' },
              { icon: '4️⃣', title: 'Learn at Your Pace', description: 'Study whenever and wherever suits you' },
              { icon: '5️⃣', title: 'Track Progress', description: 'Monitor your learning progress as you go' },
              { icon: '6️⃣', title: 'Master NEB', description: 'Complete courses and excel in NEB examinations' }
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className="card-hover bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 text-center border-2 border-gray-100 hover:border-primary-300">
                  <div className="text-4xl mb-4 animate-bounceIn" style={{ animationDelay: `${idx * 0.1}s` }}>{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lower Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <ScrollReveal delay={0}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  NEB Preparation Made Easy
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Since our establishment, Prabin Institute has been dedicated to helping students excel in NEB examinations. Our comprehensive video courses provide everything you need to master the NEB syllabus.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  All our courses are video-based, allowing you to learn at your own pace, pause when needed, and review concepts as many times as required. Perfect for self-paced learning!
                </p>
              </div>
            </ScrollReveal>

            {/* Right Column */}
            <ScrollReveal delay={200}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What You Get
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our NEB video courses include comprehensive coverage of all subjects with expert instruction and clear explanations.
                </p>
                <div className="space-y-3">
                  {['Complete NEB Syllabus Coverage', 'Expert Video Instruction', 'Learn Anytime, Anywhere', 'Access on All Devices'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 animate-slideInLeft" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse-slow"></div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <ScrollReveal delay={0}>
              <div>
                <h3 className="text-xl font-bold mb-4">Prabin Institute</h3>
                <p className="text-gray-400 text-sm">
                  Your trusted partner for NEB preparation through comprehensive video courses. Learn at your own pace with expert instruction.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/" className="hover:text-white transition hover:translate-x-1 inline-block">Home</Link></li>
                  <li><Link to="/courses" className="hover:text-white transition hover:translate-x-1 inline-block">NEB Courses</Link></li>
                  <li><Link to="/about" className="hover:text-white transition hover:translate-x-1 inline-block">About</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition hover:translate-x-1 inline-block">Contact</Link></li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/courses" className="hover:text-white transition hover:translate-x-1 inline-block">All Video Courses</Link></li>
                  <li><span className="text-gray-500">Video-based Learning</span></li>
                  <li><span className="text-gray-500">Self-paced Study</span></li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Call Us: 981-777-1000</li>
                  <li>Email: prabininstitute@gmail.com</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Prabin Institute - NEB Video Courses. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
