# 🚍 TransitLive — AI-Powered Multi-Day Public Transit Architect

An AI-powered full-stack travel planning application that helps users generate multi-day, geographically optimized city itineraries with real subway, bus, and light rail transit legs built-in, backed by serverless PostgreSQL storage.

---

## 🌐 Live Demo

- **Live Web App:** https://transit-live-six.vercel.app
- **GitHub Repository:** https://github.com/nushka08/TransitLive

---

## ✨ Features

### Authentication & User State
- User registration and login flow
- Direct database verification against Neon PostgreSQL
- Client-side persistence for seamless session maintenance
- User-friendly auth modal dialog with fast toggling
- Logout functionality

### Transit Itinerary Management
- Create custom multi-day itineraries for any global city
- Real-time persistence of generated trips into PostgreSQL
- Instant retrieval of recently saved itineraries from Neon DB
- Dynamic shareable links (`/trips/[id]`) for mobile routing on the road
- Clipboard one-click link sharing with visual status feedback

### AI-Powered Transit Routing
- Multi-day itinerary generation powered by Google Gemini (`gemini-3.1-flash-lite`)
- Real public transit line instructions (metro lines, tram stops, bus routes)
- Geographic sequencing to eliminate cross-city backtracking
- Robust JSON response sanitation that strips markdown fences and catches trailing characters
- Built-in local transit tips tailored to the chosen city and budget profile

---

## 🛠️ Tech Stack

### Frontend & Full-Stack Framework
- Next.js (App Router, React 19)
- Tailwind CSS
- Lucide React Icons

### Backend & Database
- Next.js Route Handlers (Edge & Node runtime)
- Neon Serverless PostgreSQL (HTTPS driver via `@neondatabase/serverless`)
- Google Gen AI SDK (`@google/genai`)

### Deployment
- Application hosted on Vercel
- Database hosted on Neon Serverless Cloud

---

## 🏗️ High-Level Architecture

```text
User Browser
     │
     ▼
Next.js App Router (Vercel)
     │
     ├── Server Actions & Route Handlers (`/api/*`)
     │     │
     │     ├── Neon Serverless PostgreSQL (HTTPS)
     │     │     ├── `users` table (auth records)
     │     │     └── `trips` table (itinerary JSONB & metadata)
     │     │
     │     └── Google Gemini API (`gemini-3.1-flash-lite`)
     │           └── Structured transit JSON generation
     │
     └── Dynamic Public View (`/trips/[id]`)
## 📁 Project Structure
TransitLive/
└── transit-ai/
    ├── src/
    │   ├── app/
    │   │   ├── api/
    │   │   │   ├── auth/
    │   │   │   │   ├── login/route.ts       # User authentication endpoint
    │   │   │   │   └── signup/route.ts      # User registration endpoint
    │   │   │   ├── generate-trip/route.ts   # Gemini itinerary generation & Neon save
    │   │   │   └── trips/route.ts           # Saved trips retrieval endpoint
    │   │   ├── trips/[id]/page.tsx          # Dynamic public shareable trip page
    │   │   ├── globals.css                  # Global Tailwind styles
    │   │   ├── layout.tsx                   # Root HTML shell
    │   │   └── page.tsx                     # Landing page & itinerary interface
    │   ├── components/
    │   │   └── AuthModal.tsx                # Modal for user Sign In and Sign Up
    │   └── lib/
    │       └── db.ts                        # Neon serverless HTTP database client
    ├── .env                                 # Secrets & connection strings
    ├── package.json
    └── tsconfig.json

    🚀 Run Locally
1. Clone the repository
git clone [https://github.com/nushka08/TransitLive.git](https://github.com/nushka08/TransitLive.git)
cd TransitLive/transit-ai
2. Backend setup
cd server
npm install


Your server/.env should contain:

3. Frontend setup
Open a new terminal:

cd client
npm install
npm run dev
Open:

http://localhost:3000
🔐 Authentication and Authorization
TravelAI uses JWT-based authentication.

A user registers or logs in.
The backend creates a JWT token.
The token is stored in an HTTP-only cookie.
Protected backend routes use authentication middleware to verify the token.
Every trip query includes the logged-in user ID, so users can only access, edit, regenerate, or delete their own trips.
This ensures strict data isolation between users.

🤖 AI Agent Design
Google Gemini (gemini-2.0-flash) is instructed via a strict system prompt targeting public transit routing:

Inputs: Destination city, duration in days, budget category, transit preference (metro, buses, walking mix).

Constraints: Enforces JSON-only schema outputs with no markdown backticks, natural language preludes, or postscripts.

Parsing Guardrail: A custom boundary extractor (cleanAndParseJSON) scans for brace boundaries ({ ... }), ensuring parser resilience against trailing LLM chatter.

💡 Custom Feature: AI-Resilient Manual Planning
The custom feature in TravelAI is an AI-resilient planning fallback.

If Gemini is temporarily unavailable or its free-tier quota is exceeded:

The trip remains saved.
Users see a clear AI-unavailable message.
Users can build a manual day-wise itinerary.
Users can add, edit, and remove activities.
The manual itinerary is saved to the same trip.
Users can try AI generation again later.
Why this feature was added
AI APIs can have temporary outages, high demand, or quota limits. Without a fallback, users would be blocked from planning their trip. This feature keeps the core planning workflow usable even when the AI provider is unavailable.

⚖️ Key Design Decisions and Trade-Offs
HTTP-only cookies for JWT storage
JWT tokens are stored in HTTP-only cookies instead of local storage to reduce exposure to JavaScript-based token theft.

Separate frontend and backend deployment
The frontend is deployed on Vercel and the backend on Render. This keeps the frontend fast and makes backend scaling or changes independent.

Gemini JSON responses
The Gemini prompt requests JSON output so the backend can save and render structured itinerary data more reliably.

Manual fallback instead of repeated AI retries
The application retries temporary AI busy errors, but does not repeatedly retry quota errors. Repeated quota requests waste API calls, so users are given a manual planning option instead.


⚠️ Known Limitations
Real-time transit delays, maintenance strikes, and live vehicle locations are not reflected (requires regional GTFS-RT integrations).

Gemini free-tier quota limits can lead to temporary 503 or 429 errors under rapid regeneration.

Passwords are currently stored directly without a cryptographic hash function in the starter schema.
🔌 API Endpoints
AuthenticationMethodEndpointDescriptionPOST/api/auth/signupRegister a new user accountPOST/api/auth/loginAuthenticate an existing user
Trips
MethodEndpointDescriptionPOST/api/generate-tripGenerate transit itinerary via Gemini and store in NeonGET/api/tripsFetch the 6 most recent itineraries from the databaseGET/trips/:idDynamic server-rendered page for a specific trip UUID

👩‍💻 Author
Anushka Mishra

GitHub: https://github.com/nushka08
LinkedIn: https://www.linkedin.com/in/anushka-mishra-