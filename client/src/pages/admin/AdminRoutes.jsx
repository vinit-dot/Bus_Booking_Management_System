import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Route } from 'lucide-react';
import { PageSpinner } from '../../components/common/Spinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY = { bus: '', fromCity: '', toCity: '', departureTime: '', arrivalTime: '', duration: '', distance: '', basePrice: '', isActive: true };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY, travelDays: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/routes'), api.get('/buses')])
      .then(([r, b]) => { setRoutes(r.data.data); setBuses(b.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm({ ...EMPTY, travelDays: [] }); setEditing(null); setModal(true); };
  const openEdit = (route) => {
    setForm({ ...route, bus: route.bus?._id || route.bus, travelDays: route.travelDays || [] });
    setEditing(route._id);
    setModal(true);
  };

  const toggleDay = (d) => setForm(p => ({
    ...p, travelDays: p.travelDays.includes(d) ? p.travelDays.filter(x => x !== d) : [...p.travelDays, d]
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/routes/${editing}`, form);
        setRoutes(prev => prev.map(r => r._id === editing ? res.data.data : r));
        toast.success('Route updated!');
      } else {
        const res = await api.post('/routes', form);
        setRoutes(prev => [...prev, res.data.data]);
        toast.success('Route added!');
      }
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save route');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this route?')) return;
    try {
      await api.delete(`/routes/${id}`);
      setRoutes(prev => prev.filter(r => r._id !== id));
      toast.success('Route deleted');
    } catch { toast.error('Failed to delete route'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Routes</h1>
          <p className="text-gray-500 text-sm">{routes.length} routes configured</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Route
        </button>
      </div>

      {loading ? <PageSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Route', 'Bus', 'Departure', 'Arrival', 'Duration', 'Distance', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {routes.length ? routes.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{r.fromCity} → {r.toCity}</td>
                    <td className="px-4 py-3 text-gray-600">{r.bus?.busName || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.departureTime}</td>
                    <td className="px-4 py-3 text-gray-600">{r.arrivalTime}</td>
                    <td className="px-4 py-3 text-gray-600">{r.duration}</td>
                    <td className="px-4 py-3 text-gray-600">{r.distance ? `${r.distance} km` : '—'}</td>
                    <td className="px-4 py-3 font-semibold text-primary-600">₹{r.basePrice}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(r)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(r._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No routes found. Add one!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-display font-bold text-gray-900 text-lg">{editing ? 'Edit Route' : 'Add New Route'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Assign Bus *</label>
                <select required value={form.bus} onChange={e => setForm(p => ({ ...p, bus: e.target.value }))} className="input-field text-sm">
                  <option value="">Select a bus</option>
                  {buses.map(b => <option key={b._id} value={b._id}>{b.busName} ({b.busNumber})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">From City *</label>
                  <input type="text" required value={form.fromCity} onChange={e => setForm(p => ({ ...p, fromCity: e.target.value }))} className="input-field text-sm" placeholder="e.g. Delhi" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">To City *</label>
                  <input type="text" required value={form.toCity} onChange={e => setForm(p => ({ ...p, toCity: e.target.value }))} className="input-field text-sm" placeholder="e.g. Chandigarh" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Departure Time *</label>
                  <input type="text" required value={form.departureTime} onChange={e => setForm(p => ({ ...p, departureTime: e.target.value }))} className="input-field text-sm" placeholder="e.g. 08:00 AM" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Arrival Time *</label>
                  <input type="text" required value={form.arrivalTime} onChange={e => setForm(p => ({ ...p, arrivalTime: e.target.value }))} className="input-field text-sm" placeholder="e.g. 12:00 PM" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Duration *</label>
                  <input type="text" required value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} className="input-field text-sm" placeholder="e.g. 4h 30m" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Distance (km)</label>
                  <input type="number" value={form.distance} onChange={e => setForm(p => ({ ...p, distance: e.target.value }))} className="input-field text-sm" placeholder="250" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Base Price (₹) *</label>
                  <input type="number" required value={form.basePrice} onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))} className="input-field text-sm" placeholder="500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Operates on Days (leave empty = all days)</label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((d, i) => (
                    <button key={d} type="button" onClick={() => toggleDay(i)}
                      className={`w-10 h-10 rounded-full text-xs font-semibold border-2 transition-colors
                        ${form.travelDays?.includes(i) ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.isActive !== false} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="rounded" />
                Active (available for search)
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : null}
                  {saving ? 'Saving...' : editing ? 'Update Route' : 'Add Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
