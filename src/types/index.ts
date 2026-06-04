export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
  adminAddedAt: string | null;
  adminAddedBy: string | null;
  createdAt: string;
}

export interface AuthUser {
  accessToken: string;
  userId: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
}

export type AccessMode = 'Whitelist' | 'Blacklist';
export type IdentifierType = 'UserId' | 'Email' | 'Username';
export type ListType = 'Whitelist' | 'Blacklist';

export interface AccessControlEntry {
  id: string;
  identifierType: IdentifierType;
  identifierValue: string;
  listType: ListType;
  addedAt: string;
  addedBy: string;
}

export interface AccessControlSettings {
  accessMode: AccessMode;
  entries: AccessControlEntry[];
}

export interface VersionInfo {
  version: string;
  schemaHash: string;
  migrations: string[];
}

export interface AvailableRelease {
  tag: string;
  publishedAt: string;
  notes: string;
}

export interface BackupRecord {
  id: string;
  filename: string;
  apiVersion: string;
  schemaHash: string;
  createdAt: string;
  sizeBytes: number;
}

export interface SwitchVersionRequest {
  targetVersion: string;
  acknowledgeSchemaChange?: boolean;
}

export interface SwitchVersionResponse {
  status: 'ok' | 'schema_warning';
  schemaWarning?: string;
  currentHash?: string;
  targetHash?: string;
}
