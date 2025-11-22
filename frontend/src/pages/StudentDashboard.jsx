import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollReveal from '../components/ScrollReveal';
import axios from 'axios';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('/api/enrollments/my-courses');
      // Filter out rejected enrollments (backend should already do this, but this is a safety check)
      const filteredEnrollments = response.data.filter(
        enrollment => enrollment.approvalStatus !== 'rejected'
      );
      setEnrollments(filteredEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gamification stats panel */}
        <ScrollReveal delay={0}>
          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass bg-white/70 rounded-xl shadow-lg p-6 text-center border-b-4 border-primary-500 animate-pulse-slow">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-lg font-bold text-primary-700">5 Trophies</div>
              <div className="text-sm text-gray-600">Course Completion</div>
            </div>
            <div className="glass bg-white/70 rounded-xl shadow-lg p-6 text-center border-b-4 border-green-500 animate-pulse-slow">
              <div className="text-2xl mb-2">🥇</div>
              <div className="text-lg font-bold text-green-700">3 Badges</div>
              <div className="text-sm text-gray-600">Quiz Mastery</div>
            </div>
            <div className="glass bg-white/70 rounded-xl shadow-lg p-6 text-center border-b-4 border-yellow-500 animate-pulse-slow">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-lg font-bold text-yellow-600">7 Day Streak!</div>
              <div className="text-sm text-gray-600">Consistent Learning</div>
            </div>
            <div className="glass bg-white/70 rounded-xl shadow-lg p-6 text-center border-b-4 border-blue-400 animate-pulse-slow">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-lg font-bold text-blue-700">Progress Up</div>
              <div className="text-sm text-gray-600">Keep Going!</div>
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Manage your NEB video courses and track your learning progress</p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center py-20">
            <div className="spinner w-12 h-12 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your courses...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <ScrollReveal delay={0}>
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
              <p className="text-gray-600 mb-6">You haven't enrolled in any NEB video courses yet.</p>
              <Link 
                to="/courses" 
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover-scale ripple"
              >
                Browse NEB Courses
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div>
            <ScrollReveal delay={0}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-600">
                  <div className="text-sm text-gray-600 mb-1">Total Courses</div>
                  <div className="text-3xl font-bold text-primary-600">{enrollments.length}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                  <div className="text-sm text-gray-600 mb-1">Approved</div>
                  <div className="text-3xl font-bold text-green-600">
                    {enrollments.filter(e => e.approvalStatus === 'approved').length}
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
                  <div className="text-sm text-gray-600 mb-1">Pending</div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {enrollments.filter(e => e.approvalStatus === 'pending').length}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment, idx) => (
                <ScrollReveal key={enrollment._id} delay={idx * 100}>
                  <div className="card-hover bg-white/80 glass rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 flex flex-col h-full">
                    {/* Image Section - Fixed Height */}
                    <div className="relative w-full h-48">
                      <img
                        src={enrollment.course?.thumbnail || 'https://via.placeholder.com/400x250'}
                        alt={enrollment.course?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusBadge(enrollment.approvalStatus)}`}>
                          {enrollment.approvalStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Section - Flex Grow */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{enrollment.course?.title}</h3>
                      
                      {enrollment.approvalStatus === 'approved' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span className="font-medium">Learning Progress</span>
                            <span className="font-bold">{enrollment.progress?.completionPercentage || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${enrollment.progress?.completionPercentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {enrollment.approvalStatus === 'pending' && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            ⏳ Waiting for admin approval. You'll get access once approved.
                          </p>
                        </div>
                      )}

                      {/* Button at bottom */}
                      <div className="flex gap-2 mt-auto">
                        {enrollment.approvalStatus === 'approved' ? (
                          <Link
                            to={`/learn/${enrollment.course?._id}`}
                            className="flex-1 text-center px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover-scale ripple"
                          >
                            Watch Videos
                          </Link>
                        ) : (
                          <div className="flex-1 text-center px-4 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold cursor-not-allowed">
                            Not Available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
