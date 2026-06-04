import client from './client';
import type { AccessControlSettings, AccessMode, AccessControlEntry, IdentifierType, ListType } from '../types';

export async function getSettings(): Promise<AccessControlSettings> {
  const res = await client.get<AccessControlSettings>('/admin/settings');
  return res.data;
}

export async function setAccessMode(accessMode: AccessMode): Promise<void> {
  await client.put('/admin/settings/mode', { accessMode });
}

export async function addEntry(
  identifierType: IdentifierType,
  identifierValue: string,
  listType: ListType
): Promise<AccessControlEntry> {
  const res = await client.post<AccessControlEntry>('/admin/access-control', {
    identifierType,
    identifierValue,
    listType,
  });
  return res.data;
}

export async function removeEntry(id: string): Promise<void> {
  await client.delete(`/admin/access-control/${id}`);
}
