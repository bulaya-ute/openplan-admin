# Architecture

## Stack

- **React 19**, TypeScript
- **Vite 8** + `@tailwindcss/vite` (Tailwind v4)
- **Zustand** for auth state
- **Axios** with JWT interceptor (redirects to `/login` on 401)
- **React Router v7** for routing

## Project Layout

```
src/
  api/
    client.ts       — Axios instance; attaches token from localStorage, handles 401
    auth.ts         — login()
    users.ts        — listUsers, grantAdmin, revokeAdmin
    settings.ts     — getSettings, setAccessMode, addEntry, removeEntry
    versions.ts     — getApiVersion, getAvailableVersions, switchVersion
    backups.ts      — listBackups, createBackup, restoreBackup, deleteBackup
  store/
    auth.ts         — Zustand auth store; persists to localStorage under openplan_admin_*
  types/
    index.ts        — All shared TypeScript types
  pages/
    Login.tsx       — Admin login; rejects non-admin accounts
    Users.tsx       — List users, grant/revoke admin
    AccessControl.tsx — Access mode toggle, manage entries
    Versions.tsx    — Current version, available releases, schema warning flow
    Backups.tsx     — Create, list, restore (with confirm), delete backups
  components/
    Layout/
      AppLayout.tsx — Auth guard (redirects to /login if unauthenticated or non-admin)
      Sidebar.tsx   — Nav links + sign out
```

## Auth

JWT is stored in `localStorage` under `openplan_admin_token` (separate key from the main web app to avoid collisions when both run on different subdomains — or the same browser). On login the user's `isAdmin` flag is checked client-side; a non-admin gets an error and is not stored.

`AppLayout` performs a second check: if `user.isAdmin` is false, it renders an access-denied message rather than redirecting to login (the token is still valid, just not privileged).

## Pages

| Route | Page | Purpose |
|---|---|---|
| `/login` | Login | Admin authentication |
| `/users` | Users | View all users, toggle admin status |
| `/access-control` | AccessControl | Switch whitelist/blacklist mode, manage entries |
| `/versions` | Versions | View current version, switch API version |
| `/backups` | Backups | Create/restore/delete database snapshots |

## Schema Change Warning Flow

On the Versions page, if `POST /admin/version/switch` returns `status: "schema_warning"`, the UI shows an amber warning with the option to proceed. A second click sends `acknowledgeSchemaChange: true`. This ensures admins consciously accept the risk of a schema-changing version switch.
