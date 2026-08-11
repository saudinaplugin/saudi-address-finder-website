# Help/FAQ page + Facebook Messenger chat — design

## Context

`saudiaddressfinder.com` (GitHub Pages, repo `saudi-address-finder-website`) currently has two pages: a coming-soon `index.html` and `privacy.html`. The app (Saudi Address Finder) is now approved on the Shopify App Store. Prospective merchants evaluating the app before installing have nowhere on the site to see how it works, get quick answers, or ask a question — they'd have to email `support@saudiaddressfinder.com` cold.

This is scoped to the **website only**. An equivalent in-app "Plans/Support" sub-navigation inside the embedded Shopify admin (the pattern seen in competitor app "Enwany," via App Bridge's `<ui-nav-menu>`) was discussed and deliberately deferred — it serves already-installed merchants, a different audience from a pre-install marketing site, and isn't justified yet without real signal that merchants are getting stuck in-app.

## Approach

Plain static HTML, matching the existing site exactly — no build tooling, no framework, no static-site generator. Two additions:

1. **`help.html`** — new page, styled like `privacy.html` (720px content column, left-aligned prose) rather than `index.html`'s centered coming-soon layout, since this is a content page.
2. **`chat-widget.js`** — one shared file holding the Meta Customer Chat plugin snippet, included via a single `<script src="chat-widget.js">` tag on all three pages (`index.html`, `privacy.html`, `help.html`). Keeps the widget logic in one place without introducing shared templating for a 3-page site.

Considered and rejected: a static-site generator (Eleventy/Jekyll) for shared header/footer — not justified at this size; revisit if the site grows well past a handful of pages ("later I will put more info on it" was the stated reason to eventually reconsider, not now).

## Page content — `help.html`

Two sections on one page, one nav entry.

**Getting Started** (numbered steps, written for a merchant who just installed):
1. Install the app on your store
2. Enable the "National Address Picker" app embed in your theme editor (Online Store → Themes → Customize → App embeds)
3. Turn on the widget in the app's Settings
4. What customers see at checkout — the map pin-drop flow
5. Where results show up — Resolved/Unresolved orders in the app's dashboard

**FAQ** (short Q&A, written for a prospect deciding whether to install):
- Does this cost anything? — Free / Growth ($12/mo) / Scale ($25/mo) plans, based on real `PLAN_LIMITS` in the app (`Shopify_Public/lib/planLimits.js`)
- Is customer data safe? — plain-language summary of the real controls already built (encryption at rest, access logging, 90-day PII retention) — no invented claims, only what's actually implemented (see `Shopify_Public/SECURITY.md`)
- Do I need my own Google Maps key? — no, a shared key is used by default; a merchant can bring their own to remove the map-view cap
- Will it work with my theme? — yes, ships as a Theme App Extension app block, works with any Online Store 2.0 theme
- What if a customer can't find their address? — checkout isn't blocked; the app retries automatically and surfaces it in the Unresolved orders table for manual follow-up
- How do I get support? — `support@saudiaddressfinder.com`, or the chat bubble on this site

Exact prose gets written during implementation, grounded in the current app behavior — no generic/marketing filler, consistent with how the App Store listing copy was written earlier.

## Facebook Messenger chat integration

Uses Meta's Customer Chat Plugin, tied to the merchant's existing Facebook Page. Ships in **two places**, both using the same snippet:

1. **Website** (`saudiaddressfinder-site` repo) — `chat-widget.js`, included on all three pages. This is the page where the widget is guaranteed to work correctly (runs as the top-level page, which is what Meta's widget is designed for).
2. **Embedded admin** (`Shopify_Public` repo) — the same script dropped directly into the existing single admin page (`routes/admin.js`). No new page or nav entry — just an addition to what's already there. This is **the priority placement** per the user (in-app first), but carries real, untested risk: the admin page runs nested inside Shopify's own iframe (Shopify Admin embeds our app), and Facebook's widget isn't built with that nesting in mind. It should work in principle (the widget script still executes at our own domain's origin regardless of nesting) but could hit sizing glitches or anti-clickjacking protections refusing to render — unverified until tested live.

**Manual prerequisite (user, not code):** grab the embed snippet from the Page's own settings (Meta Business Suite → Inbox → the Page → chat-plugin setup, wording varies by Meta's current UI) and register both `saudiaddressfinder.com` and `console.saudiaddressfinder.com` as whitelisted domains there. This can't be done from the codebase — it requires the user's own Facebook login.

**Fallback plan:** if the in-app placement renders badly once tested live with a real snippet, drop it and keep the website placement only — that one carries no equivalent risk.

## Out of scope

- A dedicated in-app "Support" page with its own left-sidebar nav entry (the full Enwany-style nav split) — separate future project. This spec only adds the chat bubble to the *existing* single admin page, not a new page.
- Any static-site tooling/generator — revisit only if the site's page count grows meaningfully.
- WhatsApp — explicitly ruled out (support number isn't a Saudi number).

## Testing

- Website: visual check in a browser — `help.html` renders correctly matching site style, all internal links work.
- Chat bubble on both placements only becomes testable once the user has a real Meta snippet (can't fake this). At that point: confirm it renders on the website first (expected to work), then confirm it renders inside the embedded admin (real Shopify install, genuinely unverified until tried) — drop the in-app placement if it doesn't render cleanly, per the fallback plan above.
