import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      const courseData = response.data || {};
      // Ensure array properties are arrays
      if (courseData.lessons && !Array.isArray(courseData.lessons)) {
        courseData.lessons = [];
      }
      if (courseData.learningOutcomes && !Array.isArray(courseData.learningOutcomes)) {
        courseData.learningOutcomes = [];
      }
      setCourse(courseData);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user is a student
    if (user.role !== 'student') {
      alert('Only students can enroll in courses. Please login with a student account.');
      return;
    }

    // Show eSewa payment modal with QR code
    setShowPaymentModal(true);
  };

  const handleEsewaPayment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to enroll in courses');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      alert('Only students can enroll in courses');
      return;
    }

    const formData = new FormData(e.target);
    const file = formData.get('screenshot');
    const transactionId = formData.get('transactionId');
    const studentName = formData.get('studentName');
    const contactNumber = formData.get('contactNumber');

    if (!transactionId || !transactionId.trim()) {
      alert('❌ Please enter your eSewa transaction ID');
      return;
    }

    if (!studentName || !studentName.trim()) {
      alert('❌ Please enter your full name');
      return;
    }

    if (!contactNumber || !contactNumber.trim()) {
      alert('❌ Please enter your contact number');
      return;
    }

    try {
      if (!id) {
        alert('❌ Error: Course ID is missing');
        return;
      }

      const enrollmentData = {
        courseId: id,
        paymentMethod: 'esewa',
        amount: course?.price || 0,
        transactionId: transactionId.trim(),
        studentName: studentName.trim(),
        contactNumber: contactNumber.trim()
      };

      // Convert file to base64 if provided
      if (file && file.size > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
          enrollmentData.paymentScreenshot = reader.result;
          submitEnrollment(enrollmentData);
        };
        reader.onerror = () => {
          alert('❌ Error reading file. Please try again.');
        };
        reader.readAsDataURL(file);
      } else {
        await submitEnrollment(enrollmentData);
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('❌ Error: ' + (error.message || 'Failed to process payment'));
    }
  };

  const submitEnrollment = async (enrollmentData) => {
    try {
      const response = await axios.post('/api/enrollments', enrollmentData);
      setShowPaymentModal(false);
      alert('✅ Enrollment created successfully! Waiting for admin approval.');
      navigate('/my-courses');
    } catch (error) {
      console.error('Enrollment failed:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create enrollment';
      
      if (error.response?.status === 401) {
        alert('❌ Please login to enroll in courses');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('❌ Only students can enroll in courses. Please login with a student account.');
      } else {
        alert(`❌ Error: ${errorMessage}\n\nPlease check:\n- You are logged in as a student\n- You are not already enrolled\n- Course exists`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={course.thumbnail || 'https://via.placeholder.com/600x400'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded">
                  {course.category}
                </span>
                <span className="text-gray-500">{course.difficulty}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">What you'll learn:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {course.learningOutcomes && Array.isArray(course.learningOutcomes) && course.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="text-gray-600">{outcome}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-primary-600 mb-4">Rs. {course.price}</p>
                
                <button
                  onClick={handlePurchase}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  {user ? 'Pay with eSewa' : 'Login to Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Course Content</h2>
          <div className="space-y-2">
            {course.lessons && Array.isArray(course.lessons) && course.lessons.map((lesson, idx) => (
              <div key={lesson._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-primary-600 font-semibold">{idx + 1}</span>
                  <span>{lesson.title}</span>
                </div>
                <span className="text-gray-500">{lesson.duration} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* eSewa Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Pay with eSewa</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEsewaPayment} className="p-6">
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">Amount to Pay:</p>
                <p className="text-3xl font-bold text-primary-600 mb-4">Rs. {course.price}</p>
              </div>

              {/* QR Code Section */}
              <div className="mb-6 bg-gray-900 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <img
                    src="/images/esewa-qr.jpg"
                    alt="eSewa QR Code"
                    className="mx-auto max-w-xs w-full h-auto rounded-lg"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div style={{ display: 'none' }} className="text-white">
                    <p className="mb-2">Please add your eSewa QR code image at:</p>
                    <p className="text-sm">frontend/public/images/esewa-qr.jpg</p>
                  </div>
                </div>
                
                {/* eSewa Account Info */}
                <div className="text-white space-y-2">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      e
                    </div>
                    <span className="text-xl font-semibold">eSewa</span>
                    <span className="text-xs">™</span>
                  </div>
                  <p className="text-lg font-semibold">Pratik Chaudhary</p>
                  <p className="text-lg">9762825200</p>
                  <p className="text-sm text-gray-300 mt-4">Scan QR code to receive money</p>
                </div>
              </div>

              {/* Student Information */}
              <div className="mb-6 bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      required
                      placeholder="Enter your full name"
                      defaultValue={user?.name || ''}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      required
                      placeholder="Enter your contact number"
                      defaultValue={user?.phone || ''}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This information will be used for enrollment and communication
                </p>
              </div>

              {/* Transaction ID Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  eSewa Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="transactionId"
                  required
                  placeholder="Enter your eSewa transaction ID"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  After payment, copy the transaction ID from your eSewa app
                </p>
              </div>

              {/* Payment Screenshot Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Screenshot (Optional but Recommended)
                </label>
                <input
                  type="file"
                  name="screenshot"
                  accept="image/*"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a screenshot of your payment confirmation
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

