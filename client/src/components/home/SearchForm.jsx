import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeftRight, Search } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SearchForm({ compact = false, initialValues = {} }) {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    from: initialValues.from || '',
    to: initialValues.to || '',
    date: initialValues.date || new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    api.get('/routes/cities').then(res => setCities(res.data.data || [])).catch(() => {});
  }, []);

  const swap = () => setForm(prev => ({ ...prev, from: prev.to, to: prev.from }));

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.date) return toast.error('Please fill all fields');
    if (form.from.toLowerCase() === form.to.toLowerCase()) return toast.error('Origin and destination cannot be the same');
    navigate(`/buses?from=${encodeURIComponent(form.from)}&to=${encodeURIComponent(form.to)}&date=${form.date}`);
  };

  const inputClass = compact
    ? 'w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white'
    : 'w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white';

  return (
    <form onSubmit={handleSearch} className={compact ? '' : 'bg-white rounded-2xl shadow-xl p-6 md:p-8'}>
      {!compact && <h2 className="text-xl font-display font-bold text-gray-800 mb-5">Book Your Bus Ticket</h2>}
      <div className={`flex flex-col md:flex-row gap-3 ${compact ? '' : 'md:items-end'}`}>
        {/* From */}
        <div className="flex-1">
          {!compact && <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">From</label>}
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              list="cities-from"
              className={inputClass + ' pl-9'}
              placeholder="Departure city"
              value={form.from}
              onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
              required
            />
            <datalist id="cities-from">{cities.map(c => <option key={c} value={c} />)}</datalist>
          </div>
        </div>

        {/* Swap button */}
        <button type="button" onClick={swap} title="Swap cities"
          className="self-center md:self-end mb-0 md:mb-0 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-primary-500 hover:text-primary-600 transition-colors bg-white flex-shrink-0">
          <ArrowLeftRight size={16} />
        </button>

        {/* To */}
        <div className="flex-1">
          {!compact && <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">To</label>}
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" />
            <input
              list="cities-to"
              className={inputClass + ' pl-9'}
              placeholder="Destination city"
              value={form.to}
              onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
              required
            />
            <datalist id="cities-to">{cities.map(c => <option key={c} value={c} />)}</datalist>
          </div>
        </div>

        {/* Date */}
        <div className={compact ? 'w-full md:w-44' : 'md:w-52'}>
          {!compact && <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Travel Date</label>}
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="date"
              className={inputClass + ' pl-9'}
              value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Search button */}
        <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap md:self-end">
          <Search size={16} />
          {compact ? 'Search' : 'Search Buses'}
        </button>
      </div>
    </form>
  );
}
