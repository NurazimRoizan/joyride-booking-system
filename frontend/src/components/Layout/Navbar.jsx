import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Calendar, User, Plane } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-black border-b-2 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={28} />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Microlight Flying Club
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              {isAdmin() ? (
                <Link
                  to="/admin-dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] text-gray-900 dark:text-white hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary-dark)]/10 transition"
                >
                  <Calendar size={18} />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/bookings"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] text-gray-900 dark:text-white hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary-dark)]/10 transition"
                  >
                    <Calendar size={18} />
                    <span>Book</span>
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] text-gray-900 dark:text-white hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary-dark)]/10 transition"
                  >
                    <User size={18} />
                    <span>My Bookings</span>
                  </Link>
                </>
              )}
              
              <ThemeToggle />
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)] text-white dark:text-black hover:opacity-80 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;