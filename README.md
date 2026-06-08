# Carefinder

Carefinder is a civic health directory for Nigeria. It helps public users find,
compare, share, and export hospital information and gives invited administrators
a protected curation workflow.

## Included

- Search by facility, city, LGA, and specialty
- Filters for state, ownership, specialty, and 24-hour emergency care
- Responsive list and map presentation with Google Maps directions
- Browser location flow
- Shareable filter URLs and configurable client-side CSV export
- Facility profiles with services, equipment, amenities, ratings, and cost level
- Emergency contacts and 24-hour hospital listings
- Plain-English common test result explanations with clinical safety notices
- General prescribed-medicine guidance
- Demo admin sign-in, dashboard, review queues, and validated hospital form
- Supabase PostGIS schema, radius RPC, storage bucket, and role-based RLS
- Vitest and React Testing Library coverage

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The app uses seeded data, so no service credentials
are required for the demo.

## Verification

```bash
npm test
npm run build
npm run test:e2e
```

## Production services

Copy `.env.example` to `.env.local` and fill in the required values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
VITE_MAPBOX_TOKEN=pk.your_mapbox_public_token
```

Carefinder uses Vite, not Next.js. Browser sessions are persisted and refreshed
by the Supabase JavaScript client in `src/lib/supabase.ts`; Next.js middleware
and `@supabase/ssr` are not used.

- Apply `supabase/migrations/001_initial_schema.sql` to a Supabase project.
- Create the invited administrator in Supabase Authentication, then promote the
  generated profile using the SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'admin@example.com'
);
```

- Replace seeded reads with the Supabase client and call
  `hospitals_within_radius` for live radius search.
- Use `VITE_MAPBOX_TOKEN` to replace the key-free map preview with Mapbox GL JS.
- Keep the Supabase service role and `RESEND_API_KEY` in server-side Vercel
  functions only. Never expose them through a `VITE_` variable.
- Add a server-side admin invite function that verifies `is_admin()` before
  calling the Supabase Admin API.
- Add a server-side Resend endpoint for curated-list email sharing.

The admin login uses Supabase Auth when the URL and publishable key are present.
Hospital reads and writes still need to be connected after applying the database
migration; the included RLS policies remain the authorization boundary.

## Medical safety

The result and medication tools provide general education, not diagnosis,
prescribing, or emergency triage. Production content should be reviewed and
versioned by licensed Nigerian clinicians and pharmacists.
