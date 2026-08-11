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

Uses Meta's Customer Chat Plugin, tied to the merchant's existing Facebook Page.

**Manual prerequisite (user, not code):** grab the embed snippet from the Page's own settings (Meta Business Suite → Inbox → the Page → chat-plugin setup, wording varies by Meta's current UI) and register `saudiaddressfinder.com` as a whitelisted domain there. This can't be done from the codebase — it requires the user's own Facebook login.

**Once the snippet exists:** it gets pasted into `chat-widget.js`, which every page includes. No app-side code changes needed beyond that one file.

## Out of scope

- In-app "Plans"/"Support" sub-navigation inside the embedded Shopify admin — separate future project, not part of this spec.
- Any static-site tooling/generator — revisit only if the site's page count grows meaningfully.
- WhatsApp — explicitly ruled out (support number isn't a Saudi number).

## Testing

Visual check in a browser after implementation: page renders correctly matching site style, all internal links work, chat bubble appears once the Meta snippet is in place (bubble won't function until the user completes the manual Meta setup step — that's expected, not a bug).
