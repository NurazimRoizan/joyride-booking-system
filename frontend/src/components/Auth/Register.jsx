import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Plane } from 'lucide-react';
import ThemeToggle from '../Layout/ThemeToggle';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(formData);
    if (result.success) {
      navigate('/bookings');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[var(--color-primary-light)]/10 via-white to-[var(--color-primary-dark)]/10 dark:from-black dark:via-gray-900 dark:to-gray-800" />
      <div className="fixed -top-10 -left-10 w-60 h-60 bg-[var(--color-primary-light)]/20 dark:bg-[var(--color-primary-dark)]/20 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="fixed -bottom-10 -right-10 w-60 h-60 bg-[var(--color-primary-dark)]/20 dark:bg-[var(--color-primary-light)]/20 rounded-full blur-3xl z-0 animate-pulse" />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="relative bg-white/90 dark:bg-gray-900/90 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[var(--color-primary-light)]/20 dark:bg-[var(--color-primary-dark)]/20 rounded-full p-4 mb-2 shadow-lg">
              <Plane className="text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={48} />
            </div>
            <h2 className="text-4xl font-extrabold text-center mb-2 text-gray-900 dark:text-white tracking-tight drop-shadow-lg">
              Create Account
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 text-base mb-2">Join now and book your next experience!</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100/80 border border-red-400 text-red-700 rounded shadow-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 dark:bg-black/40 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
              <div className="p-5 flex flex-col gap-1">
                <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-black/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] dark:focus:ring-[var(--color-primary-dark)] shadow-sm transition"
                  required
                  minLength={3}
                  placeholder="Your username"
                  autoComplete="username"
                />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-black/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] dark:focus:ring-[var(--color-primary-dark)] shadow-sm transition"
                  required
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-black/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] dark:focus:ring-[var(--color-primary-dark)] shadow-sm transition"
                  required
                  minLength={6}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white tracking-wide">
                  Phone Number <span className="text-xs text-gray-400">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-black/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] dark:focus:ring-[var(--color-primary-dark)] shadow-sm transition"
                  placeholder="e.g. 555-123-4567"
                  autoComplete="tel"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-dark)] text-white dark:text-black rounded-xl font-bold text-lg shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200"
            >
              <UserPlus size={22} />
              <span>Register</span>
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-base">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;