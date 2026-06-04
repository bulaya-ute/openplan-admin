import client from './client';
import type { BackupRecord } from '../types';

export async function listBackups(): Promise<BackupRecord[]> {
  const res = await client.get<BackupRecord[]>('/admin/backups');
  return res.data;
}

export async function createBackup(): Promise<BackupRecord> {
  const res = await client.post<BackupRecord>('/admin/backups');
  return res.data;
}

export async function restoreBackup(id: string): Promise<void> {
  await client.post(`/admin/backups/${id}/restore`);
}

export async function deleteBackup(id: string): Promise<void> {
  await client.delete(`/admin/backups/${id}`);
}
