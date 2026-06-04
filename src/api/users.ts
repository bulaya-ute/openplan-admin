import client from './client';
import type { AdminUser } from '../types';

export async function listUsers(): Promise<AdminUser[]> {
  const res = await client.get<AdminUser[]>('/admin/users');
  return res.data;
}

export async function grantAdmin(userId: string): Promise<void> {
  await client.post(`/admin/users/${userId}/grant-admin`);
}

export async function revokeAdmin(userId: string): Promise<void> {
  await client.delete(`/admin/users/${userId}/revoke-admin`);
}
