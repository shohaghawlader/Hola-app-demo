# Voxa 2.0 — Social Voice Community PWA

A deploy-ready, mobile-first community app demo inspired by the workflow of modern voice-room platforms, with original branding and interface design.

## What is included

### Accounts and profiles
- Login, registration and one-tap demo accounts
- Profile photo, username, bio, age, country, languages and interests
- Followers/following, verification and premium badges
- User level, XP, streak, achievements and profile views
- Block/unblock and safety controls

### Rooms and discovery
- Live, featured, following and scheduled room discovery
- Search and category filtering
- Public, private/password and followers-only rooms
- Schedule date/time, maximum audience and reminders
- Favorite and recently visited rooms
- Room share links and app deep-link structure
- Host transfer, moderators, co-hosts and room ending controls

### Seats and voice workflow simulation
- Eight speaker seats
- Mic request, host accept/reject and speaker invitation
- Seat locking, reservation and move-to-audience actions
- Host/moderator controls and active-speaker styling
- Real audio is intentionally not included; the workflow is ready for a future voice SDK

### Room chat
- Shared chat UI with system messages
- Reply, reaction, pin/unpin and delete controls
- Image attachment under 1.2 MB
- Spam rate limiting and blocked-word demo filtering
- Message reporting and moderator deletion
- Cross-tab browser sync through `BroadcastChannel`

### Virtual economy
- Gift catalogue, categories and ×5/×10 combos
- Coin balance, creator earnings and 70/30 commission simulation
- Recharge packages, promo codes and transaction history
- Withdrawal requests with pending/approved/rejected workflow
- Admin gift and withdrawal management
- No real payments or withdrawals are processed

### Engagement
- Daily check-in and streaks
- Daily missions, rewards and XP
- Achievements and badges
- Weekly, monthly and all-time leaderboard
- Notifications and room reminders

### Moderation and administration
- User, room and message reporting
- Blocked-user list and community-guideline screens
- User suspension and verification management
- Room close/reopen and feature/unfeature controls
- Reports, withdrawals, gifts, categories and announcements
- Platform metrics, activity chart and admin activity log

### PWA and deployment
- Installable PWA with service worker and offline app shell
- Responsive mobile and desktop layouts
- Light/dark mode and Bengali/English switch
- Vercel, Netlify and GitHub Pages configuration
- Optional Supabase shared-demo adapter

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Guest | `guest@voxa.demo` | `demo123` |
| Host | `host@voxa.demo` | `demo123` |
| Admin | `admin@voxa.demo` | `admin123` |

The login page also contains one-tap buttons for these accounts.

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy free on Vercel

1. Create a GitHub repository.
2. Upload all files from this folder to the repository root.
3. In Vercel, choose **Add New → Project**.
4. Import the repository.
5. Select **Framework Preset: Other**.
6. Leave the build command and output directory empty.
7. Deploy.

The default `config.js` uses local demo mode, so deployment works immediately without credentials.

## Optional shared Supabase demo mode

This is an optional way to let multiple browsers share one demo data object. It is not a production architecture.

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase-schema.sql`.
3. Open `config.js`.
4. Set:

```js
window.VOXA_CONFIG = {
  backend: 'supabase',
  supabaseUrl: 'YOUR_PROJECT_URL',
  supabaseAnonKey: 'YOUR_ANON_KEY',
  sharedStateId: 'main'
};
```

5. Redeploy.

The app loads the shared JSON state, saves changes with a short debounce and listens for realtime table updates.

## Security warning

The included Supabase policies intentionally allow anonymous access for a public demo. The demo account passwords are sample data and are not securely hashed. Do not collect real personal, identity, payment or withdrawal information with this version.

Before production launch, migrate to:
- Supabase Auth or another secure authentication system
- Normalized tables for profiles, rooms, seats, messages, follows, gifts, transactions, notifications, reports and withdrawals
- Restrictive row-level-security policies
- Server-side payment verification
- Secure moderation, logging, rate limits and privacy controls
- A proper voice provider such as Agora, ZEGOCLOUD or LiveKit

## Main files

- `index.html` — app entry
- `styles.css` — responsive design system
- `app.js` — UI, workflows and local database
- `config.js` — backend mode and credentials placeholder
- `backend.js` — optional Supabase shared-state adapter
- `supabase-schema.sql` — optional demo table and policies
- `manifest.webmanifest` and `sw.js` — PWA support
