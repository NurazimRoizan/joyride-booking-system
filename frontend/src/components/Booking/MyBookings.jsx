import { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import { Calendar, Trash2, Clock, AlertCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      const confirmedBookings = response.data.filter(b => b.status === 'CONFIRMED');
      setBookings(confirmedBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingAPI.cancelBooking(id);
      loadBookings();
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-light)]/10 via-white to-[var(--color-primary-dark)]/10 dark:from-black dark:via-gray-900 dark:to-gray-800">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-light)]/10 via-white to-[var(--color-primary-dark)]/10 dark:from-black dark:via-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-3xl mx-auto relative">
        {/* Decorative blurred background */}
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-[var(--color-primary-light)]/20 dark:bg-[var(--color-primary-dark)]/20 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[var(--color-primary-dark)]/20 dark:bg-[var(--color-primary-light)]/20 rounded-full blur-3xl z-0 animate-pulse" />

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-white flex items-center tracking-tight drop-shadow-lg">
            <Calendar className="mr-3 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={40} />
            My Bookings
          </h1>

          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <AlertCircle size={56} className="mx-auto mb-4 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" />
              <p className="text-2xl text-gray-600 dark:text-gray-400 font-semibold">You have no upcoming bookings</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const { date, time } = formatDateTime(booking.bookingDateTime);
                return (
                  <div
                    key={booking.id}
                    className="group p-7 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white/90 dark:bg-gray-900/90 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg hover:shadow-2xl transition-all duration-200 backdrop-blur-xl relative overflow-hidden"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Calendar className="mr-2 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={22} />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{date}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Clock className="mr-2 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={20} />
                        <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">{time}</span>
                      </div>
                      {booking.notes && (
                        <p className="mt-2 text-base text-gray-600 dark:text-gray-400 italic">
                          Note: {booking.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="ml-0 md:ml-4 p-3 border-2 border-red-500 text-red-500 rounded-xl bg-white/70 dark:bg-gray-900/70 hover:bg-red-500 hover:text-white transition font-bold flex items-center gap-2 shadow group-hover:scale-105 group-hover:shadow-xl"
                    >
                      <Trash2 size={22} />
                      <span className="hidden md:inline">Cancel</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;