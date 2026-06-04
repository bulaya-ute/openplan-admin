# Setup & Deployment

## Local Development

### Prerequisites

- Node.js 20+
- A running [OpenPlan API](https://github.com/bulaya-ute/openplan-api)

### Run

```bash
npm install
npm run dev      # http://localhost:5174
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Production Build

```bash
VITE_API_URL=https://api.yourdomain.com/api/v1 npm run build
```

Output is in `dist/`. Serve as a static SPA.

### Nginx Example

```nginx
server {
    listen 443 ssl;
    server_name admin.yourdomain.com;

    root /var/www/openplan-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

The admin panel should be deployed on a **separate subdomain** from the main web app (e.g. `admin.yourdomain.com`). This isolates admin functionality and allows independent deployments.

---

## CORS

Add `https://admin.yourdomain.com` to the `Cors__Origins` environment variable on the API server:

```
Cors__Origins=https://app.yourdomain.com,https://admin.yourdomain.com
```
