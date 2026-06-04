import { useEffect, useState } from 'react';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import { listBackups, createBackup, restoreBackup, deleteBackup } from '../api/backups';
import type { BackupRecord } from '../types';
import { format } from 'date-fns';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Backups() {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<BackupRecord | null>(null);

  async function load() {
    try {
      setBackups(await listBackups());
    } catch {
      setError('Failed to load backups.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    setCreating(true);
    setError('');
    try {
      await createBackup();
      await load();
    } catch {
      setError('Failed to create backup.');
    } finally {
      setCreating(false);
    }
  }

  async function handleRestore(backup: BackupRecord) {
    setRestoring(backup.id);
    setConfirmRestore(null);
    setError('');
    try {
      await restoreBackup(backup.id);
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status;
      if (status === 409) {
        setError('Restore blocked: schema of the selected backup does not match the current API version.');
      } else {
        setError('Failed to restore backup.');
      }
    } finally {
      setRestoring(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBackup(id);
      await load();
    } catch {
      setError('Failed to delete backup.');
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Database Backups</h1>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} />
          {creating ? 'Creating…' : 'Create backup'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Restore confirmation */}
      {confirmRestore && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Confirm restore</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
            Restoring <strong>{confirmRestore.filename}</strong> will overwrite the current database. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleRestore(confirmRestore)}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
            >
              Restore
            </button>
            <button
              onClick={() => setConfirmRestore(null)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {backups.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No backups yet. Create one above.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">File</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">API Version</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Size</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{backup.filename}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{backup.apiVersion}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {format(new Date(backup.createdAt), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatBytes(backup.sizeBytes)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setConfirmRestore(backup)}
                        disabled={restoring === backup.id}
                        title="Restore"
                        className="p-1.5 text-gray-400 hover:text-indigo-500 disabled:opacity-50 transition-colors"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(backup.id)}
                        title="Delete"
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
