import { useState, useEffect } from 'react';
import { adminAPI, bookingAPI } from '../../services/api';
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAvailability();
    loadBookings();
  }, [selectedDate]);

  const checkAvailability = async () => {
    try {
      const start = selectedDate;
      const end = selectedDate;
      const response = await adminAPI.getAvailability(start, end);
      const dayAvailability = response.data.find(a => a.availableDate === selectedDate);
      setIsAvailable(dayAvailability?.available || false);
    } catch (error) {
      console.error('Failed to check availability:', error);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDailyBookings(selectedDate);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      await adminAPI.setAvailability(selectedDate, !isAvailable);
      setIsAvailable(!isAvailable);
      loadBookings();
    } catch (error) {
      alert('Failed to update availability');
    }
  };

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-light)]/10 via-white to-[var(--color-primary-dark)]/10 dark:from-black dark:via-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-5xl mx-auto relative">
        {/* Decorative blurred background */}
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-[var(--color-primary-light)]/20 dark:bg-[var(--color-primary-dark)]/20 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[var(--color-primary-dark)]/20 dark:bg-[var(--color-primary-light)]/20 rounded-full blur-3xl z-0 animate-pulse" />

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-white flex items-center tracking-tight drop-shadow-lg">
            <Calendar className="mr-3 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={40} />
            Admin Dashboard
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="p-7 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
              <label className="block text-lg font-bold mb-3 text-gray-900 dark:text-white tracking-wide">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-black/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] dark:focus:ring-[var(--color-primary-dark)] shadow-sm transition"
              />
            </div>

            <div className="p-7 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-wide">
                    Availability Status
                  </h3>
                  <p className={`text-base font-semibold ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isAvailable ? 'Open for bookings' : 'Closed'}
                  </p>
                </div>
                <button
                  onClick={toggleAvailability}
                  className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-lg shadow transition-all duration-150 ${
                    isAvailable
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isAvailable ? <XCircle size={22} /> : <CheckCircle size={22} />}
                  <span>{isAvailable ? 'Close' : 'Open'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center tracking-tight">
              <Users className="mr-2 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" />
              Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] border-t-transparent"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-800">
                <p className="text-2xl text-gray-600 dark:text-gray-400 font-semibold">
                  No appointments scheduled for this day
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-6 bg-[var(--color-primary-light)]/10 dark:bg-[var(--color-primary-dark)]/10 rounded-xl border border-[var(--color-primary-light)]/20 dark:border-[var(--color-primary-dark)]/20 shadow group hover:scale-[1.01] hover:shadow-xl transition-all duration-150"
                  >
                    <div className="flex items-center gap-4">
                      <Clock className="text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={26} />
                      <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          {formatTime(booking.bookingDateTime)}
                        </p>
                        <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                          Customer: {booking.username}
                        </p>
                        {booking.notes && (
                          <p className="text-base text-gray-500 dark:text-gray-400 italic">
                            {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-green-500 text-white text-base rounded-full font-bold shadow">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;