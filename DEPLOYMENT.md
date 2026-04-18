# Deploying Nour Academy to Railway

This guide deploys the full stack — React frontend, Express API, and PostgreSQL database — to [Railway](https://railway.app) as a single, self-hosted service. No Replit required.

## Prerequisites

- A [Railway account](https://railway.app)
- Your project pushed to a GitHub repository

## Step 1 — Create a Railway project

1. Log into [railway.app](https://railway.app) and click **New Project**
2. Choose **Deploy from GitHub repo** and select this repository
3. Railway will detect the `Dockerfile` automatically and configure the build

## Step 2 — Add a PostgreSQL database

1. Inside your Railway project, click **+ New** → **Database** → **Add PostgreSQL**
2. Railway creates a PostgreSQL instance and automatically injects `DATABASE_URL` into your service environment — no manual copy-paste needed

## Step 3 — Set environment variables

In your Railway service, go to **Variables** and add:

| Variable | Value | Required |
|---|---|---|
| `NODE_ENV` | `production` | Yes |
| `ADMIN_PASSWORD` | Choose a strong password | Yes |
| `PORT` | *(leave blank — Railway sets this automatically)* | — |
| `DATABASE_URL` | *(set automatically by the PostgreSQL plugin)* | — |

## Step 4 — Deploy

1. Click **Deploy** (Railway builds the Dockerfile automatically on every push to your default branch)
2. Watch the build logs — the Dockerfile builds the frontend, bundles the API, and starts the server
3. On first startup the server automatically:
   - Applies the Drizzle database migrations (creates all tables)
   - Seeds initial course and contact data

## Step 5 — Access your site

Once the deployment is healthy, Railway gives you a public URL like `https://your-project.up.railway.app`. That's your live site.

To use a custom domain, go to your service **Settings → Domains → Add Custom Domain** and follow Railway's instructions.

## How it works

- **Single service**: The Express server serves both the API (`/api/*`) and the React frontend (static files from `artifacts/nour-academy/dist/public`)
- **Database**: PostgreSQL is managed by Railway; schema is applied automatically on every startup via Drizzle migrations in `lib/db/drizzle/`
- **Admin panel**: Available at `https://your-domain/admin` using the `ADMIN_PASSWORD` you set

## Environment variables reference

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-set by Railway PostgreSQL plugin) |
| `NODE_ENV` | Set to `production` |
| `ADMIN_PASSWORD` | Password for the `/admin` panel |
| `PORT` | HTTP port (auto-set by Railway at runtime — **do not set manually**) |
| `CORS_ORIGIN` | Optional. Set to your domain (e.g. `https://yourdomain.com`) if you call the API from a different origin. In production without this set, only same-origin requests are accepted. |
| `LOG_LEVEL` | Optional. Logging level: `info`, `debug`, `warn` (default: `info`) |
| `GOOGLE_SCRIPT_URL` | Optional. Google Apps Script URL for student registration form |

## Migrating existing content from Replit to Railway

After the first deploy your Railway database is populated with the built-in seed data, but any content you added through the admin panel (extra courses, FAQ items, contact info changes) lives only in the Replit database. Follow these steps to move it across.

### Step 1 — Export from the Replit database

Run the export script from your Replit shell, pointing it at your Replit `DATABASE_URL`:

```bash
DATABASE_URL="<your-replit-DATABASE_URL>" pnpm --filter @workspace/scripts export-data
```

This creates **`data-export.json`** in the project root containing every row from the `courses`, `faq_items`, `contact_info`, and `contact_messages` tables.

> **Where to find your Replit DATABASE_URL:** open the **Secrets** panel in Replit (the padlock icon) and copy the `DATABASE_URL` value.

### Step 2 — Import into the Railway database

Get your Railway database connection string from the Railway dashboard:

1. Open your Railway project → click the **PostgreSQL** service
2. Go to **Connect** → copy the **Database URL** (`postgresql://…`)

Then run the import script, pointing it at the Railway URL:

```bash
DATABASE_URL="<your-railway-DATABASE_URL>" pnpm --filter @workspace/scripts import-data
```

The script uses `ON CONFLICT … DO UPDATE` / `DO NOTHING` so it is safe to run multiple times — it will never create duplicates.

> **Note:** Make sure your Railway service has started at least once before importing. The first startup applies the Drizzle migrations that create all the tables.

### Optional: skip contact messages

If you don't want to copy over visitor enquiries, set `SKIP_CONTACT_MESSAGES=true`:

```bash
DATABASE_URL="<railway-url>" SKIP_CONTACT_MESSAGES=true pnpm --filter @workspace/scripts import-data
```

### Step 3 — Verify

Open your deployed Railway URL, go to `/admin`, and confirm that your custom content (courses, FAQ items, contact details) appears correctly.

### Security note

`data-export.json` may contain visitor messages with personal information (names and phone numbers). Delete it from your project directory once the migration is complete and **do not commit it to your repository** (it is already listed in `.gitignore`).

---

## Updating the site

Push to your GitHub repository's default branch — Railway automatically rebuilds and redeploys.

## Local production test

To test the production build locally before deploying:

```bash
# Build and run with Docker
docker build -t nour-academy .
docker run -p 3000:3000 \
  -e DATABASE_URL="your_postgres_url" \
  -e ADMIN_PASSWORD="your_password" \
  -e NODE_ENV="production" \
  nour-academy
```

Then open `http://localhost:3000`.
