import { useEffect, useState } from 'react';
import { RefreshCw, ArrowUpCircle } from 'lucide-react';
import { getApiVersion, getAvailableVersions, switchVersion } from '../api/versions';
import type { VersionInfo, AvailableRelease, SwitchVersionResponse } from '../types';
import { format } from 'date-fns';

export default function Versions() {
  const [current, setCurrent] = useState<VersionInfo | null>(null);
  const [releases, setReleases] = useState<AvailableRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [switching, setSwitching] = useState<string | null>(null);
  const [schemaWarning, setSchemaWarning] = useState<{ tag: string; response: SwitchVersionResponse } | null>(null);

  async function load() {
    try {
      const [v, r] = await Promise.all([getApiVersion(), getAvailableVersions()]);
      setCurrent(v);
      setReleases(r);
    } catch {
      setError('Failed to load version information.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSwitch(tag: string, acknowledged = false) {
    setSwitching(tag);
    setSchemaWarning(null);
    setError('');
    try {
      const res = await switchVersion({ targetVersion: tag, acknowledgeSchemaChange: acknowledged || undefined });
      if (res.status === 'schema_warning') {
        setSchemaWarning({ tag, response: res });
        setSwitching(null);
        return;
      }
      setError('');
      await load();
    } catch {
      setError(`Failed to switch to ${tag}.`);
    } finally {
      setSwitching(null);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Versions</h1>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Schema change warning */}
      {schemaWarning && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Schema change detected</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
            {schemaWarning.response.schemaWarning} Switching may require a database migration. Consider creating a backup first.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleSwitch(schemaWarning.tag, true)}
              disabled={switching === schemaWarning.tag}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              Proceed anyway
            </button>
            <button
              onClick={() => setSchemaWarning(null)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Current version */}
      {current && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Current API Version</h2>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{current.version}</p>
          <p className="text-xs text-gray-400 font-mono mt-1">Schema: {current.schemaHash.slice(0, 20)}…</p>
          <p className="text-xs text-gray-400 mt-0.5">{current.migrations.length} migration(s) applied</p>
        </div>
      )}

      {/* Available releases */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Releases</h2>
          <button onClick={load} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
        {releases.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No releases found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Tag</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Published</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {releases.map((r) => {
                const isCurrent = current?.version === r.tag.replace(/^v/, '');
                return (
                  <tr key={r.tag} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {r.tag}
                      {isCurrent && (
                        <span className="ml-2 text-xs text-indigo-500 dark:text-indigo-400 font-normal">current</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {format(new Date(r.publishedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isCurrent && (
                        <button
                          onClick={() => handleSwitch(r.tag)}
                          disabled={switching === r.tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          <ArrowUpCircle size={12} />
                          {switching === r.tag ? 'Switching…' : 'Switch'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
