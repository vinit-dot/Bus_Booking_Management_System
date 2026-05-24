import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Bus } from 'lucide-react';
import { PageSpinner } from '../../components/common/Spinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY = { busName: '', busNumber: '', busType: 'AC', totalSeats: 40, amenities: [], operator: { name: '', contact: '', email: '' } };
const BUS_TYPES = ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Volvo'];
const AMENITIES_LIST = ['WiFi', 'USB Charging', 'AC', 'Meals', 'Blanket', 'Reading Light', 'Entertainment'];

export default function AdminBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchBuses = () => {
    setLoading(true);
    api.get('/buses').then(r => setBuses(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(fetchBuses, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (bus) => {
    setForm({ ...bus, operator: bus.operator || { name: '', contact: '', email: '' }, amenities: bus.amenities || [] });
    setEditing(bus._id);
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/buses/${editing}`, form);
        setBuses(prev => prev.map(b => b._id === editing ? res.data.data : b));
        toast.success('Bus updated!');
      } else {
        const res = await api.post('/buses', form);
        setBuses(prev => [...prev, res.data.data]);
        toast.success('Bus added!');
      }
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bus');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bus?')) return;
    try {
      await api.delete(`/buses/${id}`);
      setBuses(prev => prev.filter(b => b._id !== id));
      toast.success('Bus deleted');
    } catch { toast.error('Failed to delete bus'); }
  };

  const toggleAmenity = (a) => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Buses</h1>
          <p className="text-gray-500 text-sm">{buses.length} buses registered</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Bus
        </button>
      </div>

      {loading ? <PageSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Bus Name', 'Number', 'Type', 'Seats', 'Operator', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buses.length ? buses.map(bus => (
                  <tr key={bus._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 flex items-center gap-2">
                      <Bus size={15} className="text-primary-500" /> {bus.busName}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{bus.busNumber}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-blue-100 text-blue-700">{bus.busType}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{bus.totalSeats}</td>
                    <td className="px-4 py-3 text-gray-600">{bus.operator?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{bus.rating > 0 ? `⭐ ${Number(bus.rating).toFixed(1)}` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${bus.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {bus.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(bus)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(bus._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No buses found. Add one!</td></tr>
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
              <h3 className="font-display font-bold text-gray-900 text-lg">{editing ? 'Edit Bus' : 'Add New Bus'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bus Name *</label>
                  <input type="text" required value={form.busName} onChange={e => setForm(p => ({ ...p, busName: e.target.value }))} className="input-field text-sm" placeholder="e.g. Volvo Gold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bus Number *</label>
                  <input type="text" required value={form.busNumber} onChange={e => setForm(p => ({ ...p, busNumber: e.target.value }))} className="input-field text-sm" placeholder="e.g. HR-26-1234" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bus Type *</label>
                  <select value={form.busType} onChange={e => setForm(p => ({ ...p, busType: e.target.value }))} className="input-field text-sm">
                    {BUS_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Total Seats *</label>
                  <input type="number" required min="10" max="60" value={form.totalSeats} onChange={e => setForm(p => ({ ...p, totalSeats: Number(e.target.value) }))} className="input-field text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Operator Name</label>
                <input type="text" value={form.operator?.name} onChange={e => setForm(p => ({ ...p, operator: { ...p.operator, name: e.target.value } }))} className="input-field text-sm" placeholder="Operator name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Operator Contact</label>
                  <input type="text" value={form.operator?.contact} onChange={e => setForm(p => ({ ...p, operator: { ...p.operator, contact: e.target.value } }))} className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Operator Email</label>
                  <input type="email" value={form.operator?.email} onChange={e => setForm(p => ({ ...p, operator: { ...p.operator, email: e.target.value } }))} className="input-field text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map(a => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors
                        ${form.amenities?.includes(a) ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.isActive !== false} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="rounded" />
                  Active (available for booking)
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : null}
                  {saving ? 'Saving...' : editing ? 'Update Bus' : 'Add Bus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
