🚀 TinyLink — URL Shortener (Next.js + NeonDB)

TinyLink is a fast and modern URL Shortener built using Next.js App Router, Neon PostgreSQL, and TailwindCSS. Create short links, track clicks, view statistics, and manage everything from a dashboard.

✨ Features

🔗 Create short links (auto-generated or custom codes)

📊 Link stats: clicks, last clicked, created at

🔁 Smart redirects with click tracking

🧹 Clean dashboard UI

🗑 Delete links anytime

🩺 /healthz endpoint for system checks

🏗 Tech Stack

Next.js 14 (App Router)

Neon PostgreSQL

TailwindCSS

🚀 API Endpoints Method Endpoint Description POST /api/links Create new link GET /api/links List all links GET /api/links/:code Get single link DELETE /api/links/:code Delete link GET /:code Redirect + track click GET /healthz Health check

Code Structure
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
License
MIT