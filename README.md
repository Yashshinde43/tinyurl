# TinyLink - URL Shortener

A simple and fast URL shortener service built with Next.js, similar to bit.ly.

## Features

- ✅ Create short links with optional custom codes (6-8 alphanumeric characters)
- ✅ Redirect short URLs to original URLs (HTTP 302)
- ✅ Track click statistics (total clicks, last clicked time)
- ✅ Delete links
- ✅ Dashboard with search/filter functionality
- ✅ Individual stats page for each link
- ✅ Health check endpoint
- ✅ Clean, responsive UI with proper error handling

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd shortener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
BASE_URL=
```

**Getting a Neon Database URL:**
1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it as `DATABASE_URL` in your `.env.local` file

### 4. Initialize the database

The database schema will be automatically created on first API call. Alternatively, you can run the initialization manually by making a request to any API endpoint.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## API Endpoints

### Create Link
```
POST /api/links
Body: { "target_url": "https://example.com", "code": "optional" }
Returns: 201 Created or 409 Conflict if code exists
```

### List Links
```
GET /api/links
Query params: ?search=term (optional)
Returns: Array of links
```

### Get Link Stats
```
GET /api/links/:code
Returns: Link details or 404
```

### Delete Link
```
DELETE /api/links/:code
Returns: 200 OK or 404 Not Found
```

### Health Check
```
GET /healthz
Returns: { "ok": true, "version": "1.0", "uptime": seconds }
```

## Routes

- `/` - Dashboard (list, add, delete links)
- `/code/:code` - Stats page for a specific link
- `/:code` - Redirect to original URL (302)
- `/healthz` - Health check endpoint

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the `DATABASE_URL` environment variable in Vercel settings
4. Deploy!

The database will be automatically initialized on first API call after deployment.

## Code Structure

```
src/
├── app/
│   ├── api/
│   │   ├── links/
│   │   │   ├── route.js          # POST /api/links, GET /api/links
│   │   │   └── [code]/route.js   # GET /api/links/:code, DELETE /api/links/:code
│   │   └── healthz/route.js       # GET /healthz
│   ├── code/[code]/page.js        # Stats page
│   ├── [code]/route.js            # Redirect handler
│   ├── page.js                    # Dashboard
│   └── layout.js                  # Root layout
├── lib/
│   ├── db.js                      # Database connection and initialization
│   └── utils.js                   # Utility functions (validation, code generation)
```

## Testing

The application follows the specified URL conventions for automated testing:

- All endpoints match the specification exactly
- Health check returns proper format
- Redirects use HTTP 302
- Error codes match specification (409 for duplicate codes, 404 for not found)

## License

MIT
