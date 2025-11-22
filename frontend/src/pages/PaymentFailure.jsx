import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="text-6xl mb-4">✗</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-4">Something went wrong with your payment.</p>
          <Link
            to="/courses"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;

