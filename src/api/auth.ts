import client from './client';
import type { AuthUser } from '../types';

export async function login(username: string, password: string): Promise<AuthUser> {
  const res = await client.post<AuthUser>('/auth/login', { username, password });
  return res.data;
}
