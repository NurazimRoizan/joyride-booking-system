import { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const BookingDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadAvailableSlots();
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      const response = await bookingAPI.getAvailableSlots(selectedDate);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Failed to load slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotDateTime) => {
    try {
      await bookingAPI.createBooking({ bookingDateTime: slotDateTime });
      setMessage({ type: 'success', text: 'Booking created successfully!' });
      loadAvailableSlots();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Booking failed' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupSlotsByPeriod = (slots) => {
    const morning = slots.filter(s => {
      const hour = new Date(s).getHours();
      return hour >= 6 && hour < 12;
    });
    const evening = slots.filter(s => {
      const hour = new Date(s).getHours();
      return hour >= 17;
    });
    return { morning, evening };
  };

  const { morning, evening } = groupSlotsByPeriod(availableSlots);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-light)]/10 via-white to-[var(--color-primary-dark)]/10 dark:from-black dark:via-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-3xl mx-auto relative">
        {/* Decorative blurred background */}
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-[var(--color-primary-light)]/20 dark:bg-[var(--color-primary-dark)]/20 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[var(--color-primary-dark)]/20 dark:bg-[var(--color-primary-light)]/20 rounded-full blur-3xl z-0 animate-pulse" />

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-white flex items-center tracking-tight drop-shadow-lg">
            <Calendar className="mr-3 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={40} />
            Book Your Next Joyride
          </h1>

          {message && (
            <div className={`mb-8 p-4 rounded-xl border-2 flex items-center shadow-lg text-lg font-semibold ${
              message.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {message.type === 'success' ? <CheckCircle className="mr-2" /> : <AlertCircle className="mr-2" />}
              {message.text}
            </div>
          )}

          <div className="mb-10">
            <label className="block text-lg font-bold mb-2 text-gray-900 dark:text-white tracking-wide">
              Select Date
            </label>
            <div
              className="flex items-center gap-3 px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-black/70 text-gray-900 dark:text-white text-lg shadow-sm transition cursor-pointer hover:border-[var(--color-primary-light)] dark:hover:border-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary-dark)]/10"
              onClick={() => document.getElementById('date-picker').showPicker && document.getElementById('date-picker').showPicker()}
              tabIndex={0}
              role="button"
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && document.getElementById('date-picker').showPicker && document.getElementById('date-picker').showPicker()}
            >
              <Calendar className="text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" size={28} />
              <span className="flex-1 select-none">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                tabIndex={-1}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] border-t-transparent"></div>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-16 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <AlertCircle size={56} className="mx-auto mb-4 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" />
              <p className="text-2xl text-gray-600 dark:text-gray-400 font-semibold">No available slots for this date</p>
            </div>
          ) : (
            <div className="space-y-10">
              {morning.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-7">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center tracking-tight">
                    <Clock className="mr-2 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" />
                    Morning (6:00 AM - 7:30 AM)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {morning.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleBookSlot(slot)}
                        className="p-5 border-2 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] rounded-xl bg-white/80 dark:bg-black/70 text-gray-900 dark:text-white hover:bg-[var(--color-primary-light)] hover:text-white dark:hover:bg-[var(--color-primary-dark)] dark:hover:text-black font-bold text-lg shadow transition-all duration-150"
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {evening.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-7">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center tracking-tight">
                    <Clock className="mr-2 text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)]" />
                    Evening (5:00 PM - 6:30 PM)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {evening.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleBookSlot(slot)}
                        className="p-5 border-2 border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)] rounded-xl bg-white/80 dark:bg-black/70 text-gray-900 dark:text-white hover:bg-[var(--color-primary-light)] hover:text-white dark:hover:bg-[var(--color-primary-dark)] dark:hover:text-black font-bold text-lg shadow transition-all duration-150"
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;