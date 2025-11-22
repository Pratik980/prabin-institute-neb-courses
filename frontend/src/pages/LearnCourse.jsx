import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const LearnCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, enrollmentsRes] = await Promise.all([
        axios.get(`/api/courses/${courseId}`),
        axios.get('/api/enrollments/my-courses')
      ]);

      const courseData = courseRes.data;
      const enrollmentData = enrollmentsRes.data.find(
        e => e.course._id === courseId && e.approvalStatus === 'approved'
      );

      if (!enrollmentData) {
        navigate('/my-courses');
        return;
      }

      setCourse(courseData);
      setEnrollment(enrollmentData);

      // Set current lesson to last watched or first
      if (enrollmentData.progress?.lastWatchedLesson) {
        const lessonIndex = courseData.lessons.findIndex(
          l => l._id.toString() === enrollmentData.progress.lastWatchedLesson.toString()
        );
        if (lessonIndex !== -1) {
          setCurrentLesson(lessonIndex);
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      navigate('/my-courses');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId, completed) => {
    try {
      await axios.put(`/api/enrollments/progress/${enrollment._id}`, {
        lessonId,
        completed
      });
      fetchCourseData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // If it's already just a video ID (11 characters, alphanumeric)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
      return url.trim();
    }

    // Try to extract video ID from various YouTube URL formats
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

    // If URL contains a valid-looking video ID anywhere
    const videoIdMatch = url.match(/([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return videoIdMatch[1];
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return null;
  }

  const lesson = course.lessons[currentLesson];
  const videoId = getYouTubeVideoId(lesson.youtubeUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">{course.title}</h2>
            <p className="text-sm text-gray-600">{course.lessons.length} lessons</p>
          </div>
          <div className="p-2">
            {course.lessons.map((lesson, idx) => {
              const isCompleted = enrollment.progress?.completedLessons?.includes(lesson._id.toString());
              const isCurrent = idx === currentLesson;
              
              return (
                <div
                  key={lesson._id}
                  onClick={() => setCurrentLesson(idx)}
                  className={`p-3 mb-2 rounded cursor-pointer transition ${
                    isCurrent ? 'bg-primary-100 border-l-4 border-primary-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">○</span>
                      )}
                      <span className={isCurrent ? 'font-semibold' : ''}>{lesson.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{lesson.duration} min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            
            {/* Video Player */}
            <div className="mb-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {videoId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Invalid YouTube URL
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Description */}
            {lesson.description && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="font-semibold mb-2">About this lesson</h3>
                <p className="text-gray-600">{lesson.description}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={() => handleLessonComplete(lesson._id, true)}
                className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
              >
                Mark as Complete
              </button>

              <button
                onClick={() => setCurrentLesson(Math.min(course.lessons.length - 1, currentLesson + 1))}
                disabled={currentLesson === course.lessons.length - 1}
                className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCourse;

