import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollReveal from '../components/ScrollReveal';
import api from '../config/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollmentFilter, setEnrollmentFilter] = useState('all');
  const [lessonForm, setLessonForm] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    duration: '',
    order: ''
  });
  const [editingLesson, setEditingLesson] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    difficulty: 'Beginner',
    thumbnail: '',
    learningOutcomes: [],
    tags: [],
    lessons: []
  });
  const [newLesson, setNewLesson] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    duration: '',
    order: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, enrollmentFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const response = await api.get('/api/users/dashboard');
        const statsData = response.data || {};
        // Ensure array properties are arrays
        if (statsData.courseViews && !Array.isArray(statsData.courseViews)) {
          statsData.courseViews = [];
        }
        if (statsData.monthlySales && !Array.isArray(statsData.monthlySales)) {
          statsData.monthlySales = [];
        }
        setStats(statsData);
      } else if (activeTab === 'enrollments') {
        const status = enrollmentFilter === 'all' ? '' : enrollmentFilter;
        const response = await api.get(`/api/enrollments/all${status ? `?status=${status}` : ''}`);
        const enrollmentsData = Array.isArray(response.data) ? response.data : [];
        setEnrollments(enrollmentsData);
      } else if (activeTab === 'courses') {
        const response = await api.get('/api/courses');
        const coursesData = Array.isArray(response.data) ? response.data : [];
        setCourses(coursesData);
      } else if (activeTab === 'users') {
        const response = await api.get('/api/users/all');
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error
      if (activeTab === 'enrollments') setEnrollments([]);
      if (activeTab === 'courses') setCourses([]);
      if (activeTab === 'users') setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, skipReceiptCheck = false) => {
    try {
      // Find the enrollment to check if it has a receipt
      const enrollment = enrollments.find(e => e._id === id);
      
      // If enrollment has a receipt and we haven't skipped the check, show it first
      if (!skipReceiptCheck && enrollment && enrollment.paymentScreenshot) {
        setPendingApproval(enrollment);
        setShowApprovalModal(true);
        return;
      }
      
      // Proceed with approval
      await api.put(`/api/enrollments/approve/${id}`);
      setShowApprovalModal(false);
      setPendingApproval(null);
      fetchData();
    } catch (error) {
      console.error('Error approving enrollment:', error);
      alert('Error approving enrollment');
    }
  };

  const confirmApprove = async () => {
    if (pendingApproval) {
      await handleApprove(pendingApproval._id, true);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this enrollment?')) {
      return;
    }
    try {
      await api.put(`/api/enrollments/reject/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error rejecting enrollment:', error);
      alert('Error rejecting enrollment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/api/enrollments/${id}`);
      fetchData();
      alert('Enrollment deleted successfully');
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      alert('Error deleting enrollment');
    }
  };

  const handleViewReceipt = (enrollment) => {
    setSelectedReceipt(enrollment);
    setShowReceiptModal(true);
  };

  const validateYouTubeUrl = (url) => {
    if (!url) return false;
    
    // Check if it's a valid YouTube URL pattern
    const youtubePatterns = [
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
      /^[a-zA-Z0-9_-]{11}$/ // Just video ID
    ];
    
    return youtubePatterns.some(pattern => pattern.test(url.trim()));
  };

  const extractYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // If it's already just a video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
      return url.trim();
    }

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/,
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/,
      /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }

    const videoIdMatch = url.match(/([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return videoIdMatch[1];
    }

    return null;
  };

  const handleAddLessonToCourse = () => {
    if (!newLesson.title || !newLesson.youtubeUrl) {
      alert('Please fill in at least Title and YouTube URL');
      return;
    }

    // Validate YouTube URL
    const videoId = extractYouTubeVideoId(newLesson.youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL. Please use a valid YouTube video URL.\n\nExamples:\n- https://www.youtube.com/watch?v=VIDEO_ID\n- https://youtu.be/VIDEO_ID\n- Or just the video ID');
      return;
    }

    // Normalize the URL to use the embed format
    const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const lesson = {
      title: newLesson.title,
      youtubeUrl: normalizedUrl,
      description: newLesson.description || '',
      duration: parseInt(newLesson.duration) || 0,
      order: parseInt(newLesson.order) || (courseForm.lessons.length + 1)
    };

    setCourseForm({
      ...courseForm,
      lessons: [...courseForm.lessons, lesson]
    });

    // Reset form
    setNewLesson({
      title: '',
      youtubeUrl: '',
      description: '',
      duration: '',
      order: ''
    });
  };

  const handleRemoveLessonFromCourse = (index) => {
    const updatedLessons = courseForm.lessons.filter((_, i) => i !== index);
    setCourseForm({
      ...courseForm,
      lessons: updatedLessons
    });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...courseForm,
        price: parseFloat(courseForm.price),
        learningOutcomes: courseForm.learningOutcomes.filter(o => o.trim()),
        tags: courseForm.tags.filter(t => t.trim()),
        lessons: courseForm.lessons.map((lesson, index) => ({
          ...lesson,
          order: lesson.order || (index + 1)
        }))
      };

      if (editingCourse) {
        await api.put(`/api/courses/${editingCourse._id}`, courseData);
      } else {
        await api.post('/api/courses', courseData);
      }
      
      setShowCourseModal(false);
      setEditingCourse(null);
      setCourseForm({
        title: '',
        description: '',
        price: '',
        category: '',
        difficulty: 'Beginner',
        thumbnail: '',
        learningOutcomes: [],
        tags: [],
        lessons: []
      });
      setNewLesson({
        title: '',
        youtubeUrl: '',
        description: '',
        duration: '',
        order: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      price: course.price || '',
      category: course.category || '',
      difficulty: course.difficulty || 'Beginner',
      thumbnail: course.thumbnail || '',
      learningOutcomes: course.learningOutcomes || [],
      tags: course.tags || [],
      lessons: course.lessons || []
    });
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    try {
      await api.delete(`/api/courses/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course');
    }
  };

  const handleManageLessons = async (course) => {
    try {
      const response = await api.get(`/api/courses/${course._id}`);
      setSelectedCourse(response.data);
      setShowLessonModal(true);
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Error loading course details');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const lessonData = {
        ...lessonForm,
        duration: parseInt(lessonForm.duration) || 0,
        order: parseInt(lessonForm.order) || (selectedCourse.lessons.length + 1)
      };

      if (editingLesson) {
        await api.put(`/api/courses/${selectedCourse._id}/lessons/${editingLesson._id}`, lessonData);
      } else {
        await api.post(`/api/courses/${selectedCourse._id}/lessons`, lessonData);
      }
      
      // Refresh course data
      const response = await api.get(`/api/courses/${selectedCourse._id}`);
      setSelectedCourse(response.data);
      setLessonForm({
        title: '',
        youtubeUrl: '',
        description: '',
        duration: '',
        order: ''
      });
      setEditingLesson(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Error saving lesson: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title || '',
      youtubeUrl: lesson.youtubeUrl || '',
      description: lesson.description || '',
      duration: lesson.duration || '',
      order: lesson.order || ''
    });
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }
    try {
      await api.delete(`/api/courses/${selectedCourse._id}/lessons/${lessonId}`);
      const response = await api.get(`/api/courses/${selectedCourse._id}`);
      setSelectedCourse(response.data);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error deleting lesson');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/api/users/${userId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + (error.response?.data?.message || error.message));
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'enrollments', label: 'Enrollments', icon: '⏳' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ScrollReveal delay={0}>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Control Panel
                </h1>
                <p className="text-gray-600">Full control and management of Prabin Institute platform</p>
              </div>
              {activeTab === 'courses' && (
                <button
                  onClick={() => {
                    setEditingCourse(null);
                    setCourseForm({
                      title: '',
                      description: '',
                      price: '',
                      category: '',
                      difficulty: 'Beginner',
                      thumbnail: '',
                      learningOutcomes: [],
                      tags: [],
                      lessons: []
                    });
                    setNewLesson({
                      title: '',
                      youtubeUrl: '',
                      description: '',
                      duration: '',
                      order: ''
                    });
                    setShowCourseModal(true);
                  }}
                  className="ripple px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover-scale shadow-lg"
                >
                  ➕ Create Course
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Tabs Navigation */}
        <ScrollReveal delay={100}>
          <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border-2 border-gray-100">
            <div className="flex flex-wrap border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition-all duration-300 relative group ${
                    activeTab === tab.id
                      ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{tab.icon}</span>
                    <span className="hidden md:inline">{tab.label}</span>
                    <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                  </span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 animate-slideInUp"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="spinner w-12 h-12 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
              </div>
            ) : stats ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <ScrollReveal delay={0}>
                    <div className="card-hover bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-xl border-l-4 border-blue-700">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-blue-100 text-sm font-medium">Total Students</h3>
                        <span className="text-3xl animate-bounceIn">👥</span>
                      </div>
                      <p className="text-4xl font-bold">{stats.totalStudents}</p>
                      <p className="text-blue-100 text-xs mt-2">Active learners</p>
                    </div>
                  </ScrollReveal>
                  <ScrollReveal delay={100}>
                    <div className="card-hover bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-xl border-l-4 border-green-700">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-green-100 text-sm font-medium">Total Revenue</h3>
                        <span className="text-3xl animate-bounceIn">💰</span>
                      </div>
                      <p className="text-4xl font-bold">Rs. {stats.totalRevenue?.toLocaleString() || 0}</p>
                      <p className="text-green-100 text-xs mt-2">All time earnings</p>
                    </div>
                  </ScrollReveal>
                  <ScrollReveal delay={200}>
                    <div className="card-hover bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-xl border-l-4 border-purple-700">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-purple-100 text-sm font-medium">Approved</h3>
                        <span className="text-3xl animate-bounceIn">✅</span>
                      </div>
                      <p className="text-4xl font-bold">{stats.approvedEnrollments}</p>
                      <p className="text-purple-100 text-xs mt-2">Active enrollments</p>
                    </div>
                  </ScrollReveal>
                  <ScrollReveal delay={300}>
                    <div className="card-hover bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-xl border-l-4 border-yellow-700">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-yellow-100 text-sm font-medium">Pending</h3>
                        <span className="text-3xl animate-bounceIn">⏳</span>
                      </div>
                      <p className="text-4xl font-bold">{stats.pendingEnrollments}</p>
                      <p className="text-yellow-100 text-xs mt-2">Awaiting approval</p>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {stats.mostSellingCourse && (
                    <ScrollReveal delay={400}>
                      <div className="card-hover bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span>🏆</span> Most Popular Course
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center text-3xl">
                            📚
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{stats.mostSellingCourse.title}</h4>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">📊 Sales: <span className="font-bold text-primary-600">{stats.mostSellingCourse.sales}</span></p>
                              <p className="text-sm text-gray-600">💰 Revenue: <span className="font-bold text-green-600">Rs. {stats.mostSellingCourse.revenue}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  )}

                  <ScrollReveal delay={500}>
                    <div className="card-hover bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>📚</span> Total Courses
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-4xl font-bold text-primary-600">{stats.totalCourses}</p>
                          <p className="text-sm text-gray-600 mt-1">Active courses</p>
                        </div>
                        <div className="text-5xl animate-float">📖</div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Top Courses by Views */}
                {stats.courseViews && Array.isArray(stats.courseViews) && stats.courseViews.length > 0 && (
                  <ScrollReveal delay={600}>
                    <div className="card-hover bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">🔥 Top Courses by Views</h3>
                      <div className="space-y-3">
                        {stats.courseViews.map((course, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-primary-600 w-8">#{idx + 1}</span>
                              <span className="text-gray-900 font-medium">{course.title}</span>
                            </div>
                            <span className="text-primary-600 font-semibold">{course.totalViews} views</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* Courses Management Tab */}
        {activeTab === 'courses' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="spinner w-12 h-12 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading courses...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, idx) => (
                  <ScrollReveal key={course._id} delay={idx * 100}>
                    <div className="card-hover bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100">
                      <div className="relative">
                        <img
                          src={course.thumbnail || 'https://via.placeholder.com/400x250'}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <span className="bg-white text-primary-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="mb-3">
                          <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                            {course.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary-600">Rs. {course.price}</span>
                          <span className="text-sm text-gray-500">{course.lessons?.length || 0} lessons</span>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => handleManageLessons(course)}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 hover-scale ripple"
                          >
                            📹 Manage Lessons ({course.lessons?.length || 0})
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover-scale ripple"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 hover-scale ripple"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && (
          <div>
            <ScrollReveal delay={0}>
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setEnrollmentFilter(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        enrollmentFilter === status
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {loading ? (
              <div className="text-center py-20">
                <div className="spinner w-12 h-12 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading enrollments...</p>
              </div>
            ) : enrollments.length === 0 ? (
              <ScrollReveal delay={0}>
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4 animate-bounceIn">✅</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Enrollments Found</h3>
                  <p className="text-gray-600">No enrollments match the selected filter.</p>
                </div>
              </ScrollReveal>
            ) : (
              <ScrollReveal delay={0}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
                    <h3 className="text-xl font-bold text-gray-900">Enrollment Management</h3>
                    <p className="text-sm text-gray-600 mt-1">Total: {enrollments.length} enrollments</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Student</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Course</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {enrollments.map((enrollment, idx) => (
                          <tr key={enrollment._id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.studentName || enrollment.student?.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">{enrollment.student?.email}</div>
                              {enrollment.contactNumber && (
                                <div className="text-xs text-gray-400 mt-1">📞 {enrollment.contactNumber}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{enrollment.course?.title}</div>
                              <div className="text-xs text-gray-500">{enrollment.paymentMethod?.toUpperCase()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              Rs. {enrollment.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  enrollment.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                  enrollment.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {enrollment.approvalStatus}
                                </span>
                                {enrollment.approvalStatus === 'pending' && enrollment.paymentScreenshot && (
                                  <span className="text-xs text-blue-600 font-semibold" title="Payment receipt available">
                                    📄 Receipt
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(enrollment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <div className="flex flex-wrap gap-2">
                                {enrollment.approvalStatus === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(enrollment._id)}
                                      className="ripple px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover-scale text-sm"
                                      title="Approve"
                                    >
                                      ✅
                                    </button>
                                    <button
                                      onClick={() => handleReject(enrollment._id)}
                                      className="ripple px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover-scale text-sm"
                                      title="Reject"
                                    >
                                      ❌
                                    </button>
                                  </>
                                )}
                                {enrollment.approvalStatus === 'approved' && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to reject this approved enrollment?')) {
                                        handleReject(enrollment._id);
                                      }
                                    }}
                                    className="ripple px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover-scale text-sm"
                                    title="Reject enrollment"
                                  >
                                    ❌
                                  </button>
                                )}
                                {enrollment.approvalStatus === 'rejected' && (
                                  <button
                                    onClick={() => handleApprove(enrollment._id)}
                                    className="ripple px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover-scale text-sm"
                                    title="Approve enrollment"
                                  >
                                    ✅
                                  </button>
                                )}
                                {enrollment.paymentScreenshot && (
                                  <button
                                    onClick={() => handleViewReceipt(enrollment)}
                                    className="ripple px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover-scale text-sm"
                                    title="View Receipt"
                                  >
                                    📄
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(enrollment._id)}
                                  className="ripple px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 hover-scale text-sm"
                                  title="Delete enrollment"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="spinner w-12 h-12 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            ) : (
              <ScrollReveal delay={0}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
                    <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-600 mt-1">Total: {users.length} users</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Joined</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, idx) => (
                          <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                                  {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="ripple px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover-scale"
                                >
                                  🗑️ Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="spinner w-12 h-12 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading analytics...</p>
              </div>
            ) : stats ? (
              <>
                <ScrollReveal delay={0}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="card-hover bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Revenue</h3>
                      {stats.monthlySales && Array.isArray(stats.monthlySales) && stats.monthlySales.length > 0 ? (
                        <div className="space-y-3">
                          {stats.monthlySales.map((month, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                {new Date(2000, month._id.month - 1).toLocaleString('default', { month: 'long' })} {month._id.year}
                              </span>
                              <div className="flex items-center gap-3">
                                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                    style={{ width: `${(month.revenue / (stats.totalRevenue || 1)) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                                  Rs. {month.revenue}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No revenue data available</p>
                      )}
                    </div>

                    <div className="card-hover bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Statistics</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Total Courses</span>
                          <span className="text-2xl font-bold text-primary-600">{stats.totalCourses}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Total Students</span>
                          <span className="text-2xl font-bold text-blue-600">{stats.totalStudents}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Total Revenue</span>
                          <span className="text-2xl font-bold text-green-600">Rs. {stats.totalRevenue}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Approval Rate</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {stats.totalStudents > 0 
                              ? Math.round((stats.approvedEnrollments / (stats.approvedEnrollments + stats.pendingEnrollments || 1)) * 100)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </>
            ) : null}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <ScrollReveal delay={0}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-hover bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">⚙️ Platform Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="Prabin Institute"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="prabininstitute@gmail.com"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      defaultValue="981-777-1000"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <button className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover-scale ripple">
                    💾 Save Settings
                  </button>
                </div>
              </div>

              <div className="card-hover bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🔔 Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">WhatsApp Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Course Modal */}
        {showCourseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCourse ? '✏️ Edit Course' : '➕ Create New Course'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCourseModal(false);
                      setEditingCourse(null);
                      setCourseForm({
                        title: '',
                        description: '',
                        price: '',
                        category: '',
                        difficulty: 'Beginner',
                        thumbnail: '',
                        learningOutcomes: [],
                        tags: [],
                        lessons: []
                      });
                      setNewLesson({
                        title: '',
                        youtubeUrl: '',
                        description: '',
                        duration: '',
                        order: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Enter course description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
                    <select
                      required
                      value={courseForm.difficulty}
                      onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="e.g., NEB Physics, NEB Chemistry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes (one per line)</label>
                  <textarea
                    value={courseForm.learningOutcomes.join('\n')}
                    onChange={(e) => setCourseForm({ ...courseForm, learningOutcomes: e.target.value.split('\n') })}
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Master key concepts&#10;Apply knowledge practically"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={courseForm.tags.join(', ')}
                    onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="NEB, Physics, Grade 12"
                  />
                </div>

                {/* YouTube Videos Section */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">📹 Course Videos (Lessons)</h3>
                    <span className="text-sm text-gray-600 bg-primary-100 px-3 py-1 rounded-full">
                      {courseForm.lessons.length} video{courseForm.lessons.length !== 1 ? 's' : ''} added
                    </span>
                  </div>

                  {/* Add Video Form */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video Title *</label>
                        <input
                          type="text"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          placeholder="e.g., Introduction to Physics"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <input
                          type="number"
                          min="1"
                          value={newLesson.order}
                          onChange={(e) => setNewLesson({ ...newLesson, order: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          placeholder="Auto"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL *</label>
                      <input
                        type="text"
                        value={newLesson.youtubeUrl}
                        onChange={(e) => setNewLesson({ ...newLesson, youtubeUrl: e.target.value })}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                          newLesson.youtubeUrl && !extractYouTubeVideoId(newLesson.youtubeUrl)
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-300 focus:border-primary-500'
                        }`}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Paste the full YouTube video URL or just the video ID
                      </p>
                      {newLesson.youtubeUrl && !extractYouTubeVideoId(newLesson.youtubeUrl) && (
                        <p className="text-xs text-red-600 mt-1">
                          ⚠️ Invalid YouTube URL format
                        </p>
                      )}
                      {newLesson.youtubeUrl && extractYouTubeVideoId(newLesson.youtubeUrl) && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Valid YouTube URL
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={newLesson.description}
                          onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                          rows="2"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          placeholder="Brief description of this video"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                        <input
                          type="number"
                          min="0"
                          value={newLesson.duration}
                          onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLessonToCourse}
                      className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover-scale ripple"
                    >
                      ➕ Add Video to Course
                    </button>
                  </div>

                  {/* List of Added Videos */}
                  {courseForm.lessons.length > 0 && (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Added Videos:</h4>
                      {courseForm.lessons
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((lesson, index) => (
                          <div
                            key={index}
                            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-1 rounded">
                                    #{lesson.order || index + 1}
                                  </span>
                                  <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                                </div>
                                {lesson.description && (
                                  <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <span>🎥</span>
                                    <a
                                      href={lesson.youtubeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary-600 hover:underline"
                                    >
                                      {lesson.youtubeUrl.length > 50 ? lesson.youtubeUrl.substring(0, 50) + '...' : lesson.youtubeUrl}
                                    </a>
                                  </span>
                                  {lesson.duration > 0 && <span>⏱️ {lesson.duration} min</span>}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveLessonFromCourse(index)}
                                className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all duration-300 hover-scale ripple"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {courseForm.lessons.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No videos added yet. Add your first video above!</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover-scale ripple"
                  >
                    {editingCourse ? '💾 Update Course' : '➕ Create Course'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCourseModal(false);
                      setEditingCourse(null);
                      setCourseForm({
                        title: '',
                        description: '',
                        price: '',
                        category: '',
                        difficulty: 'Beginner',
                        thumbnail: '',
                        learningOutcomes: [],
                        tags: [],
                        lessons: []
                      });
                      setNewLesson({
                        title: '',
                        youtubeUrl: '',
                        description: '',
                        duration: '',
                        order: ''
                      });
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lesson Management Modal */}
        {showLessonModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">📹 Manage Lessons</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedCourse.title}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowLessonModal(false);
                      setSelectedCourse(null);
                      setEditingLesson(null);
                      setLessonForm({
                        title: '',
                        youtubeUrl: '',
                        description: '',
                        duration: '',
                        order: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Add/Edit Lesson Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingLesson ? '✏️ Edit Lesson' : '➕ Add New Lesson'}
                  </h3>
                  <form onSubmit={handleAddLesson} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                        <input
                          type="text"
                          required
                          value={lessonForm.title}
                          onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          placeholder="Enter lesson title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <input
                          type="number"
                          min="1"
                          value={lessonForm.order}
                          onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          placeholder="Auto"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL *</label>
                      <input
                        type="url"
                        required
                        value={lessonForm.youtubeUrl}
                        onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={lessonForm.description}
                        onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                        placeholder="Enter lesson description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover-scale ripple"
                      >
                        {editingLesson ? '💾 Update Lesson' : '➕ Add Lesson'}
                      </button>
                      {editingLesson && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLesson(null);
                            setLessonForm({
                              title: '',
                              youtubeUrl: '',
                              description: '',
                              duration: '',
                              order: ''
                            });
                          }}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Lessons List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📚 Lessons ({selectedCourse.lessons?.length || 0})
                  </h3>
                  {selectedCourse.lessons && selectedCourse.lessons.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCourse.lessons
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((lesson, idx) => (
                          <div
                            key={lesson._id}
                            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-1 rounded">
                                    #{lesson.order || idx + 1}
                                  </span>
                                  <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                                </div>
                                {lesson.description && (
                                  <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>🎥 {lesson.youtubeUrl ? 'YouTube' : 'No URL'}</span>
                                  {lesson.duration && <span>⏱️ {lesson.duration} min</span>}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleEditLesson(lesson)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-300 hover-scale ripple"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson._id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all duration-300 hover-scale ripple"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No lessons added yet. Add your first lesson above!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal with Receipt Preview */}
        {showApprovalModal && pendingApproval && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Review Payment Before Approval</h2>
                  <button
                    onClick={() => {
                      setShowApprovalModal(false);
                      setPendingApproval(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Enrollment Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 mb-3">Enrollment Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Student Name:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {pendingApproval.studentName || pendingApproval.student?.name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Contact Number:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {pendingApproval.contactNumber || pendingApproval.student?.phone || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium text-gray-900">{pendingApproval.student?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Course:</span>
                      <span className="ml-2 font-medium text-gray-900">{pendingApproval.course?.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-medium text-gray-900">Rs. {pendingApproval.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="ml-2 font-medium text-gray-900">{pendingApproval.paymentMethod?.toUpperCase()}</span>
                    </div>
                    {pendingApproval.transactionId && (
                      <div>
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="ml-2 font-medium text-gray-900">{pendingApproval.transactionId}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Enrolled Date:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(pendingApproval.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot */}
                {pendingApproval.paymentScreenshot ? (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Receipt</h3>
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={pendingApproval.paymentScreenshot}
                        alt="Payment Receipt"
                        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                        }}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <a
                        href={pendingApproval.paymentScreenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Open in new tab
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm font-semibold">⚠️ No payment receipt uploaded</p>
                    <p className="text-yellow-700 text-xs mt-1">Student has not uploaded a payment screenshot. Please verify payment manually before approving.</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setPendingApproval(null);
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reject this enrollment?')) {
                      handleReject(pendingApproval._id);
                      setShowApprovalModal(false);
                      setPendingApproval(null);
                    }
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
                >
                  Reject
                </button>
                <button
                  onClick={confirmApprove}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                >
                  Approve Enrollment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceiptModal && selectedReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">📄 Payment Receipt</h2>
                  <button
                    onClick={() => {
                      setShowReceiptModal(false);
                      setSelectedReceipt(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Enrollment Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 mb-3">Enrollment Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Student Name:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedReceipt.studentName || selectedReceipt.student?.name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Contact Number:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedReceipt.contactNumber || selectedReceipt.student?.phone || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedReceipt.student?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Course:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedReceipt.course?.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-medium text-gray-900">Rs. {selectedReceipt.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedReceipt.paymentMethod?.toUpperCase()}</span>
                    </div>
                    {selectedReceipt.transactionId && (
                      <div>
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedReceipt.transactionId}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedReceipt.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        selectedReceipt.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedReceipt.approvalStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Enrolled Date:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(selectedReceipt.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot */}
                {selectedReceipt.paymentScreenshot ? (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Screenshot</h3>
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={selectedReceipt.paymentScreenshot}
                        alt="Payment Receipt"
                        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                        }}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <a
                        href={selectedReceipt.paymentScreenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Open in new tab
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">No payment screenshot available for this enrollment.</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => {
                    setShowReceiptModal(false);
                    setSelectedReceipt(null);
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
