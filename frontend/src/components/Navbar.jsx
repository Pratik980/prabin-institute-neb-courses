import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Nav link component with smooth animations
  const NavLink = ({ to, children, className = '' }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`
          relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out
          ${active 
            ? 'text-primary-600 font-semibold' 
            : 'text-gray-700 hover:text-primary-600'
          }
          ${className}
        `}
      >
        <span className="relative z-10">{children}</span>
        {active && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 transform transition-all duration-300 ease-in-out"></span>
        )}
      </Link>
    );
  };

  return (
    <>
      <nav 
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          ${scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md' 
            : 'bg-white shadow-sm'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center group"
            >
              <div className="relative">
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-primary-600">@</span>Prabin Institute
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/courses">Courses</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/about">About</NavLink>
              
              {user && user.role === 'student' && (
                <NavLink to="/my-courses">My Courses</NavLink>
              )}
              {user && user.role === 'admin' && (
                <NavLink to="/admin/dashboard">Admin</NavLink>
              )}
            </div>

            {/* Right Side - Contact & Auth */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {/* Contact Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">Call Us: 981-777-1000</span>
              </div>

              {/* Auth Buttons */}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{user.name?.split(' ')[0] || 'User'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="px-5 py-2">
                    Sign In
                  </NavLink>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-4">
              {/* Mobile Contact */}
              <div className="flex items-center space-x-1 text-xs text-gray-700">
                <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden sm:inline">981-777-1000</span>
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary-600 focus:outline-none transition-colors duration-300"
                aria-label="Toggle menu"
              >
                <div className="absolute w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`
                      block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out
                      ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}
                    `}
                  ></span>
                  <span
                    className={`
                      block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out
                      ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                    `}
                  ></span>
                  <span
                    className={`
                      block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out
                      ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}
                    `}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu with smooth slide animation */}
        <div
          className={`
            lg:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="px-4 pt-2 pb-6 space-y-1 bg-white border-t border-gray-200">
            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)} active={isActive('/')}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)} active={isActive('/about')}>
              About
            </MobileNavLink>
            <MobileNavLink to="/courses" onClick={() => setMobileMenuOpen(false)} active={isActive('/courses')}>
              Courses
            </MobileNavLink>
            <MobileNavLink to="/contact" onClick={() => setMobileMenuOpen(false)} active={isActive('/contact')}>
              Contact
            </MobileNavLink>
            
            {user && user.role === 'student' && (
              <MobileNavLink to="/my-courses" onClick={() => setMobileMenuOpen(false)} active={isActive('/my-courses')}>
                My Courses
              </MobileNavLink>
            )}
            {user && user.role === 'admin' && (
              <MobileNavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} active={isActive('/admin')}>
                Admin Dashboard
              </MobileNavLink>
            )}
            
            {user ? (
              <>
                <div className="pt-4 border-t border-gray-200 mt-2">
                  <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)} active={isActive('/profile')}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span>Profile</span>
                    </div>
                  </MobileNavLink>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-200 mt-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg text-center transition-all duration-300 font-semibold shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

// Mobile Nav Link Component
const MobileNavLink = ({ to, children, onClick, active }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        block px-4 py-3 rounded-lg transition-all duration-300 ease-in-out
        ${active
          ? 'bg-primary-50 text-primary-600 font-semibold border-l-4 border-primary-600'
          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
        }
      `}
    >
      {children}
    </Link>
  );
};

export default Navbar;
