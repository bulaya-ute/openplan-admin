import { useEffect, useState, type FormEvent } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { getSettings, setAccessMode, addEntry, removeEntry } from '../api/settings';
import type { AccessControlSettings, AccessMode, IdentifierType, ListType } from '../types';

export default function AccessControl() {
  const [settings, setSettings] = useState<AccessControlSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newType, setNewType] = useState<IdentifierType>('Email');
  const [newValue, setNewValue] = useState('');
  const [newList, setNewList] = useState<ListType>('Whitelist');
  const [adding, setAdding] = useState(false);

  async function load() {
    try {
      setSettings(await getSettings());
    } catch {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleModeChange(mode: AccessMode) {
    try {
      await setAccessMode(mode);
      await load();
    } catch {
      setError('Failed to update access mode.');
    }
  }

  async function handleAddEntry(e: FormEvent) {
    e.preventDefault();
    if (!newValue.trim()) return;
    setAdding(true);
    try {
      await addEntry(newType, newValue.trim(), newList);
      setNewValue('');
      await load();
    } catch {
      setError('Failed to add entry.');
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeEntry(id);
      await load();
    } catch {
      setError('Failed to remove entry.');
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;
  if (!settings) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Access Control</h1>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Mode toggle */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Access Mode</h2>
        <div className="flex gap-3">
          {(['Whitelist', 'Blacklist'] as AccessMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                settings.accessMode === mode
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {settings.accessMode === 'Whitelist'
            ? 'Only users whose identifier appears in the whitelist can register and access the app.'
            : 'All users can access the app unless their identifier appears in the blacklist.'}
        </p>
      </div>

      {/* Add entry */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add Entry</h2>
        <form onSubmit={handleAddEntry} className="flex gap-2 flex-wrap">
          <select
            value={newList}
            onChange={(e) => setNewList(e.target.value as ListType)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
          >
            <option value="Whitelist">Whitelist</option>
            <option value="Blacklist">Blacklist</option>
          </select>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as IdentifierType)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
          >
            <option value="Email">Email</option>
            <option value="Username">Username</option>
            <option value="UserId">User ID</option>
          </select>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            required
            className="flex-1 min-w-48 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={adding}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </form>
        {newType === 'UserId' && newList === 'Whitelist' && (
          <p className="text-xs text-amber-500 mt-2">
            User ID entries only match existing users and cannot pre-approve registrations.
          </p>
        )}
      </div>

      {/* Entries list */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Entries ({settings.entries.length})</h2>
        </div>
        {settings.entries.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No entries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">List</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Value</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {settings.entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      entry.listType === 'Whitelist'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}>
                      {entry.listType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{entry.identifierType}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-mono text-xs">{entry.identifierValue}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemove(entry.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
