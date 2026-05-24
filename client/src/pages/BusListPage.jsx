import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import SearchForm from '../components/home/SearchForm';
import BusCard from '../components/booking/BusCard';
import { PageSpinner } from '../components/common/Spinner';
import { Filter, SlidersHorizontal, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function BusListPage() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ busType: 'all', maxPrice: '', minSeats: '' });
  const [sortBy, setSortBy] = useState('departure');

  useEffect(() => {
    if (!from || !to || !date) { setLoading(false); return; }
    setLoading(true);
    setError('');
    api.get(`/buses/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`)
      .then(res => { setResults(res.data.data || []); })
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch buses'))
      .finally(() => setLoading(false));
  }, [from, to, date]);

  useEffect(() => {
    let list = [...results];
    if (filters.busType !== 'all') list = list.filter(r => r.bus.busType === filters.busType);
    if (filters.maxPrice) list = list.filter(r => r.route.basePrice <= Number(filters.maxPrice));
    if (filters.minSeats) list = list.filter(r => r.availableSeats >= Number(filters.minSeats));

    if (sortBy === 'price_asc') list.sort((a, b) => a.route.basePrice - b.route.basePrice);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.route.basePrice - a.route.basePrice);
    else if (sortBy === 'seats') list.sort((a, b) => b.availableSeats - a.availableSeats);
    else if (sortBy === 'rating') list.sort((a, b) => b.bus.rating - a.bus.rating);
    else list.sort((a, b) => a.route.departureTime?.localeCompare(b.route.departureTime));

    setFiltered(list);
  }, [results, filters, sortBy]);

  const busTypes = ['all', ...new Set(results.map(r => r.bus.busType))];

  return (
    <Layout>
      {/* Search bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <SearchForm compact initialValues={{ from, to, date }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Heading */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900">
              {from} → {to}
            </h1>
            <p className="text-sm text-gray-500">{date} · {filtered.length} buses found</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="card p-5 sticky top-20">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </h3>

              {/* Bus Type */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bus Type</p>
                <div className="flex flex-wrap gap-2">
                  {busTypes.map(t => (
                    <button key={t} onClick={() => setFilters(p => ({ ...p, busType: t }))}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize
                        ${filters.busType === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                      {t === 'all' ? 'All' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price (₹)</p>
                <input type="number" placeholder="e.g. 1000" value={filters.maxPrice}
                  onChange={e => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
                  className="input-field text-sm py-2" />
              </div>

              {/* Min Seats */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Available Seats</p>
                <input type="number" placeholder="e.g. 5" value={filters.minSeats}
                  onChange={e => setFilters(p => ({ ...p, minSeats: e.target.value }))}
                  className="input-field text-sm py-2" />
              </div>

              <button onClick={() => setFilters({ busType: 'all', maxPrice: '', minSeats: '' })}
                className="w-full text-sm text-gray-500 hover:text-primary-600 transition-colors py-1">
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{filtered.length} results</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="departure">Earliest Departure</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="seats">Most Seats</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {loading ? (
              <PageSpinner />
            ) : error ? (
              <div className="card p-8 text-center">
                <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
                <p className="text-gray-600">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="card p-12 text-center">
                <Filter size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No buses found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search for a different date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((result, idx) => (
                  <BusCard key={idx} result={result} travelDate={date} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
