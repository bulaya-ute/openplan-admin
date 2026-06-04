import client from './client';
import type { VersionInfo, AvailableRelease, SwitchVersionRequest, SwitchVersionResponse } from '../types';

export async function getApiVersion(): Promise<VersionInfo> {
  const res = await client.get<VersionInfo>('/admin/version');
  return res.data;
}

export async function getAvailableVersions(): Promise<AvailableRelease[]> {
  const res = await client.get<AvailableRelease[]>('/admin/version/available');
  return res.data;
}

export async function switchVersion(req: SwitchVersionRequest): Promise<SwitchVersionResponse> {
  const res = await client.post<SwitchVersionResponse>('/admin/version/switch', req);
  return res.data;
}
