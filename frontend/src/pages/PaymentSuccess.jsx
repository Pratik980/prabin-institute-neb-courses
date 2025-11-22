import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');

  useEffect(() => {
    // Handle payment verification here
    setTimeout(() => {
      navigate('/my-courses');
    }, 3000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">Your enrollment is pending admin approval.</p>
          <p className="text-sm text-gray-500">Redirecting to your courses...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

