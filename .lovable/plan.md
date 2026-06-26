## BKL Sharks — v2: Auth, Community, Detail Pages, Admin

### 1. Lovable Cloud + Auth
- Enable Cloud (Postgres + Auth).
- Email/password + Google OAuth.
- `/auth` page (sign in / sign up tabs), `_authenticated/` layout managed by integration.
- `profiles` (auto-created on signup via trigger), `user_roles` (`app_role` enum: `admin`, `moderator`, `user`) with `has_role()` security-definer.

### 2. Schema (all RLS + GRANTs)
- `episodes` (slug, title, city, air_date, runtime, recap, hero_img, video_url, status)
- `panelists` (slug, name, firm, bio, headshot, record_wins, record_kos, signature_move)
- `founders` (slug, name, startup, sector, city, stage, traction, ask, valuation, position, status, headshot)
- `episode_panelists`, `episode_founders` (join tables with verdict, investment_amount, equity)
- `community_posts` (author_id, episode_id?, body, media_url, status: live/removed, like_count)
- `post_comments` (post_id, author_id, body, status)
- `post_reactions` (post_id, user_id, kind: fire/roast/clap)
- `reports` (target_type, target_id, reporter_id, reason, status: open/resolved/dismissed)
- `applications` (founder pitch form), `ticket_inquiries`, `sponsor_inquiries`
- `user_bans` (user_id, reason, expires_at)

Public reads (anon) on episodes/panelists/founders/live posts/comments. Auth-only writes. Moderator/admin policies via `has_role()`.

### 3. Seed migration
- Migrate the existing hardcoded mocks (3 episodes, 3 panelists, 6 founders) into rows so detail routes render real data immediately.

### 4. New public routes
- `/episodes/$slug` — recap, race-control timeline, panelist shots, video embed, linked community thread.
- `/panelists/$slug` — bio, verdict stats, past breakdowns, episode match history.
- `/founders/$slug` — sector tags, pitch history, investor feedback, leaderboard position card.
- `/community` (rewrite) — live feed of `community_posts`, filter by episode, react/comment when signed in, report button, "sign in to post" CTA when anonymous.
- `/auth` — email + Google.

### 5. Server functions (`src/lib/*.functions.ts`)
- Public reads: `getEpisode`, `getPanelist`, `getFounder`, `listPosts`.
- Authed: `createPost`, `createComment`, `togglePostReaction`, `submitReport`, `submitApplication`, `submitTicketInquiry`, `submitSponsorInquiry` — all zod-validated.
- Admin: `adminListPosts/Reports/Applications/Inquiries/Users`, `adminUpdatePostStatus`, `adminResolveReport`, `adminBanUser`, `adminGrantRole`, `adminUpsertEpisode/Panelist/Founder`, `adminDelete*`.
- Apply form pages (`/apply`, `/tickets`, `/sponsors`) get real submission wiring with zod validation + toast feedback.

### 6. Admin panel (`/_authenticated/admin/*`, gated by `admin` or `moderator` role)
- Sidebar layout, sections:
  - **Dashboard** — counts (posts/reports/applications/users).
  - **Content** — CRUD tables for Episodes, Panelists, Founders (dialog forms, zod validation).
  - **Moderation** — open reports queue, post/comment review (remove / dismiss), banned users.
  - **Submissions** — applications, ticket inquiries, sponsor inquiries with status workflow.
  - **Users & roles** — list users, grant/revoke moderator/admin (admin-only).

### 7. UI/UX
- Keep racing/editorial language (Race Radio, Grid Position, Paddock).
- Reuse existing tokens; add `Tabs`, `Dialog`, `Sidebar`, `Table`, `Toast` shadcn primitives.
- Auth/avatar chip in `site-nav.tsx`; show "Admin" link when role allows.

### 8. Validation rules
- Posts ≤ 1000 chars, comments ≤ 500, body trimmed/non-empty.
- All slugs `^[a-z0-9-]+$`.
- Application: email, phone (E.164 loose), MRR ≥ 0, ask numeric.
- Server-side zod parsing inside every mutation; client uses react-hook-form + same schemas.

### 9. Out of scope (this turn)
- Realtime subscriptions, image uploads to Storage, payment flows, AI moderation.

### Implementation order
1. Enable Cloud, run migration (schema + seed + roles).
2. Auth page + nav avatar + `_authenticated` gate (integration-managed).
3. Server functions (public reads, authed mutations, admin ops).
4. Detail routes (`/episodes/$slug`, `/panelists/$slug`, `/founders/$slug`).
5. Community feed rewrite.
6. Form wiring on apply / tickets / sponsors.
7. Admin panel.
8. Verify with build + targeted smoke test.

This will be a large multi-step build. Approve and I'll execute end-to-end.
