# Help/FAQ Page + Facebook Messenger Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `help.html` page (getting-started guide + FAQ) to `saudiaddressfinder.com`, and a Facebook Messenger chat bubble on both the website and the existing Shopify embedded admin page.

**Architecture:** Plain static HTML/CSS/JS, no build tooling, matching the existing two-page site exactly. One new content page, one shared JS file for the chat widget included via a plain `<script>` tag everywhere it's needed (across two separate repos: the website and the Shopify app).

**Tech Stack:** Static HTML/CSS (GitHub Pages, no framework), vanilla JS, Meta Customer Chat Plugin SDK.

## Global Constraints

- No build tooling, no framework, no static-site generator — plain HTML files, consistent with the existing site (spec: "Approach").
- FAQ/Getting Started copy must describe only real, currently-implemented app behavior — no invented claims (spec: "Page content").
- The Messenger snippet is a genuine external dependency the user must obtain from Facebook (Meta Business Suite) before the chat tasks can be completed live — this cannot be fabricated (spec: "Facebook Messenger chat integration").
- Two repos are touched: `C:\Projects\SaudiNA_Finder\saudiaddressfinder-site` (website) and `C:\Projects\SaudiNA_Finder\Shopify_Public` (the app's embedded admin).

---

### Task 1: Build `help.html`

**Files:**
- Create: `saudiaddressfinder-site/help.html`

**Interfaces:**
- Produces: a page at `/help.html`, styled like `privacy.html` (720px content column), linked from later tasks.

- [ ] **Step 1: Create the file with this exact content**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Help &amp; FAQ — Saudi Address Finder</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #ffffff;
    color: #334155;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.65;
  }
  .wrap {
    max-width: 720px;
    margin: 0 auto;
    padding: 56px 24px 96px;
  }
  h1 {
    font-size: 30px;
    margin: 0 0 4px;
    color: #1e293b;
  }
  .subtitle {
    color: #94a3b8;
    font-size: 13px;
    margin-bottom: 36px;
  }
  h2 {
    font-size: 20px;
    margin: 40px 0 14px;
    color: #1e293b;
  }
  h3 {
    font-size: 15px;
    margin: 20px 0 4px;
    color: #1e293b;
  }
  p, li {
    color: #475569;
    font-size: 15px;
  }
  ol, ul { padding-left: 20px; }
  ol li { margin-bottom: 10px; }
  a { color: #059669; }
  .back {
    display: inline-block;
    margin-bottom: 24px;
    font-size: 13px;
  }
  .faq-item { margin-bottom: 20px; }
</style>
</head>
<body>
  <div class="wrap">
    <a class="back" href="/">&larr; Saudi Address Finder</a>
    <h1>Help &amp; FAQ</h1>
    <div class="subtitle">Getting started, and answers to common questions.</div>

    <h2>Getting Started</h2>
    <ol>
      <li>Install the app on your store from the Shopify App Store.</li>
      <li>Open <strong>Online Store &rarr; Themes &rarr; Customize &rarr; App embeds</strong>, and turn on "National Address Picker."</li>
      <li>In the app's admin, under <strong>Settings</strong>, confirm "Enable National Address widget on storefront" is turned on.</li>
      <li>Customers will now see a "Please Select Your Delivery Location" prompt in their cart. They drop a pin on the map, and the app resolves it into a National Address code automatically.</li>
      <li>In the app's dashboard, the <strong>Resolved orders</strong> table shows every order with a National Address found, and how it was found. The <strong>Unresolved orders</strong> table shows any orders that still need one, with quick links to follow up by email or WhatsApp.</li>
    </ol>

    <h2>FAQ</h2>

    <div class="faq-item">
      <h3>Does this cost anything?</h3>
      <p>There's a free plan (25 orders/month), and two paid plans for higher volume: Growth ($12/mo) and Scale ($25/mo). You can upgrade any time from the app's Plan &amp; Usage section.</p>
    </div>

    <div class="faq-item">
      <h3>Is customer data safe?</h3>
      <p>Yes. The database is encrypted at rest, every access to customer contact info is logged, and that info is automatically deleted 90 days after an order is processed. We don't sell or share customer data with anyone.</p>
    </div>

    <div class="faq-item">
      <h3>Do I need my own Google Maps key?</h3>
      <p>No — a shared key is used by default and just works. If you have your own Google Cloud project, you can add your own key in Settings to remove the monthly map-view cap.</p>
    </div>

    <div class="faq-item">
      <h3>Will it work with my theme?</h3>
      <p>Yes, as long as your theme supports Online Store 2.0 app embeds (most current Shopify themes do). The widget installs as a standard app block — no manual theme code editing required.</p>
    </div>

    <div class="faq-item">
      <h3>What if a customer can't find their address?</h3>
      <p>Checkout is never blocked. If a customer doesn't complete the map step, the order still goes through, and the app automatically retries recovering the address afterward. If it still can't find one, the order shows up in the app's Unresolved orders table so you can follow up directly.</p>
    </div>

    <div class="faq-item">
      <h3>How do I get support?</h3>
      <p>Email <a href="mailto:support@saudiaddressfinder.com">support@saudiaddressfinder.com</a>, or use the chat bubble on this site.</p>
    </div>
  </div>
</body>
</html>
```

- [ ] **Step 2: Verify it locally**

Open `saudiaddressfinder-site/help.html` directly in a browser (double-click the file, or `start help.html` on Windows) and confirm: page renders with no visual breakage, matches `privacy.html`'s look, the "&larr; Saudi Address Finder" link goes back to the homepage.

- [ ] **Step 3: Commit**

```bash
cd saudiaddressfinder-site
git add help.html
git commit -m "Add Help & FAQ page"
```

---

### Task 2: Cross-link all three pages

**Files:**
- Modify: `saudiaddressfinder-site/index.html`
- Modify: `saudiaddressfinder-site/privacy.html`

**Interfaces:**
- Consumes: `help.html` from Task 1 (must exist at `/help.html`).

- [ ] **Step 1: Add a Help link to `index.html`'s footer**

In `saudiaddressfinder-site/index.html`, find this line:

```html
      Questions? <a href="mailto:support@saudiaddressfinder.com">support@saudiaddressfinder.com</a> · <a href="/privacy.html">Privacy Policy</a>
```

Replace it with:

```html
      Questions? <a href="mailto:support@saudiaddressfinder.com">support@saudiaddressfinder.com</a> · <a href="/help.html">Help &amp; FAQ</a> · <a href="/privacy.html">Privacy Policy</a>
```

- [ ] **Step 2: Add a Help link to `privacy.html`**

In `saudiaddressfinder-site/privacy.html`, find this line:

```html
    <a class="back" href="/">&larr; Saudi Address Finder</a>
```

Replace it with:

```html
    <a class="back" href="/">&larr; Saudi Address Finder</a> &nbsp;&middot;&nbsp; <a class="back" href="/help.html">Help &amp; FAQ</a>
```

- [ ] **Step 3: Verify locally**

Open `index.html` and `privacy.html` in a browser, confirm both new links are visible and navigate to `/help.html` correctly.

- [ ] **Step 4: Commit**

```bash
cd saudiaddressfinder-site
git add index.html privacy.html
git commit -m "Cross-link Help & FAQ page from homepage and privacy policy"
```

---

### Task 3: Create the shared chat widget file and include it on all three website pages

**Files:**
- Create: `saudiaddressfinder-site/chat-widget.js`
- Modify: `saudiaddressfinder-site/index.html`
- Modify: `saudiaddressfinder-site/privacy.html`
- Modify: `saudiaddressfinder-site/help.html`

**Interfaces:**
- Produces: a `chat-widget.js` file that is safe to include everywhere even before the real Meta snippet exists (it does nothing until Task 5 fills it in) — later tasks (4, 5) depend on this file existing at this exact path.

- [ ] **Step 1: Create `chat-widget.js` with this placeholder-safe content**

```js
// Facebook Messenger "Customer Chat" widget.
//
// This file is intentionally inert until MESSENGER_PAGE_ID below is filled
// in with a real Facebook Page ID (see Task 5 of
// docs/superpowers/plans/2026-08-12-help-faq-messenger-chat.md). Loading
// this script with no Page ID configured is a silent no-op — safe to
// include on every page ahead of time.

const MESSENGER_PAGE_ID = ""; // TODO(Task 5): fill in with the real Facebook Page ID

if (MESSENGER_PAGE_ID) {
  window.fbAsyncInit = function () {
    FB.init({
      xfbml: true,
      version: "v20.0",
    });
  };

  (function (d, s, id) {
    if (d.getElementById(id)) return;
    const js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    d.body.appendChild(js);
  })(document, "script", "facebook-jssdk");

  const chatDiv = document.createElement("div");
  chatDiv.id = "fb-customer-chat";
  chatDiv.className = "fb-customerchat";
  chatDiv.setAttribute("page_id", MESSENGER_PAGE_ID);
  document.body.appendChild(chatDiv);
}
```

- [ ] **Step 2: Add the Facebook SDK root div and script include to `index.html`**

In `saudiaddressfinder-site/index.html`, immediately after the opening `<body>` tag, add:

```html
<body>
  <div id="fb-root"></div>
```

Immediately before the closing `</body>` tag, add:

```html
  <script src="/chat-widget.js"></script>
</body>
```

- [ ] **Step 3: Repeat Step 2 for `privacy.html` and `help.html`**

Same two additions (`<div id="fb-root"></div>` right after `<body>`, `<script src="/chat-widget.js"></script>` right before `</body>`) in both `saudiaddressfinder-site/privacy.html` and `saudiaddressfinder-site/help.html`.

- [ ] **Step 4: Verify locally**

Open each of the three pages in a browser, open the browser console, confirm no JavaScript errors. Since `MESSENGER_PAGE_ID` is still empty, no chat bubble should appear yet — that's expected.

- [ ] **Step 5: Commit**

```bash
cd saudiaddressfinder-site
git add chat-widget.js index.html privacy.html help.html
git commit -m "Add inert Facebook Messenger chat widget scaffold to all pages"
```

- [ ] **Step 6: Push and confirm live**

```bash
git push origin main
```

Wait ~1 minute for GitHub Pages to redeploy, then visit `https://saudiaddressfinder.com/help.html` and confirm the page loads with no console errors.

---

### Task 4: Add the same chat widget to the embedded Shopify admin page

**Files:**
- Modify: `Shopify_Public/routes/admin.js`

**Interfaces:**
- Consumes: nothing new — this duplicates the same inert-until-configured pattern from Task 3, but as a separate file since this is a different repo/deployment (the Shopify app, not the website).

**Note:** this is the placement flagged as higher-risk in the spec (nested inside Shopify's own iframe when embedded). It's still safe to ship inert (no Page ID yet) — the live-render risk only becomes relevant in Task 5 once a real Page ID is added.

- [ ] **Step 1: Add the Facebook SDK root div**

In `Shopify_Public/routes/admin.js`, find this line (the opening of the rendered HTML body):

```js
<body>
  <s-page heading="${t.pageHeading}">
```

Replace it with:

```js
<body>
  <div id="fb-root"></div>
  <s-page heading="${t.pageHeading}">
```

- [ ] **Step 2: Add the chat widget script inline, right after the existing admin script include**

Find this line:

```js
  <script src="/admin-assets/admin.js"></script>
```

Replace it with:

```js
  <script src="/admin-assets/admin.js"></script>
  <script src="/admin-assets/chat-widget.js"></script>
```

- [ ] **Step 3: Create `Shopify_Public/public/admin-assets/chat-widget.js` with the same inert-safe content as Task 3**

```js
// Facebook Messenger "Customer Chat" widget, embedded admin placement.
//
// Same inert-until-configured pattern as the website's chat-widget.js (see
// docs/superpowers/plans/2026-08-12-help-faq-messenger-chat.md, Task 4/5 in
// the saudiaddressfinder-site repo). This placement is HIGHER RISK: the
// admin page runs nested inside Shopify's own iframe when embedded, and
// Facebook's widget isn't built with that nesting in mind. Test live once
// MESSENGER_PAGE_ID is filled in (Task 5) — if it renders badly, remove
// this file's inclusion from routes/admin.js and rely on the website
// placement only.

const MESSENGER_PAGE_ID = ""; // TODO(Task 5): fill in with the real Facebook Page ID

if (MESSENGER_PAGE_ID) {
  window.fbAsyncInit = function () {
    FB.init({
      xfbml: true,
      version: "v20.0",
    });
  };

  (function (d, s, id) {
    if (d.getElementById(id)) return;
    const js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    d.body.appendChild(js);
  })(document, "script", "facebook-jssdk");

  const chatDiv = document.createElement("div");
  chatDiv.id = "fb-customer-chat";
  chatDiv.className = "fb-customerchat";
  chatDiv.setAttribute("page_id", MESSENGER_PAGE_ID);
  document.body.appendChild(chatDiv);
}
```

- [ ] **Step 4: Syntax-check the modified route file**

Run: `cd Shopify_Public && node -c routes/admin.js`
Expected: no output (success). If it errors, stop and fix before continuing — this file has broken production before from an unclosed template literal; re-check carefully for stray backticks near the edit.

- [ ] **Step 5: Smoke-test the module actually loads**

Run: `cd Shopify_Public && node -e "require('dotenv').config(); require('./routes/admin.js'); console.log('loads OK')"`
Expected: prints `loads OK`

- [ ] **Step 6: Commit**

```bash
cd Shopify_Public
git add routes/admin.js public/admin-assets/chat-widget.js
git commit -m "Add inert Facebook Messenger chat widget scaffold to embedded admin"
```

- [ ] **Step 7: Deploy and verify stability**

```bash
git push origin main
```

Then, on the droplet:
```bash
ssh deploy@104.248.242.243 "cd /home/deploy/saudi-address-finder-public && git checkout -- package-lock.json 2>/dev/null; git pull origin main && pm2 restart saudi-na-public-app saudi-na-demo"
```

Wait 5 seconds, then verify both processes are still online and not crash-looping:
```bash
ssh deploy@104.248.242.243 "pm2 list && curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://console.saudiaddressfinder.com/"
```
Expected: both processes `online` with unchanged restart counts (`↺`) after the wait, and `HTTP 200`. If the restart count keeps climbing or HTTP fails, check `ssh deploy@104.248.242.243 "tail -30 /home/deploy/.pm2/logs/saudi-na-public-app-error.log"` before doing anything else.

---

### Task 5: Wire up the real Facebook Page ID (blocked on user action)

**This task cannot be completed until the user provides a real Facebook Page ID and has whitelisted both domains in Meta Business Suite.** It's included here so the work isn't forgotten, not because it can be executed unblocked.

**Files:**
- Modify: `saudiaddressfinder-site/chat-widget.js`
- Modify: `Shopify_Public/public/admin-assets/chat-widget.js`

**Interfaces:**
- Consumes: a real Facebook Page ID (numeric string) from the user, obtained via Meta Business Suite → Inbox → the Page → chat-plugin setup. The user must also add `saudiaddressfinder.com` and `console.saudiaddressfinder.com` as whitelisted domains in that same Meta settings area — without this, the widget will silently fail to render regardless of a correct Page ID.

- [ ] **Step 1: Get the Page ID and whitelist both domains**

Ask the user for the numeric Facebook Page ID and confirm they've added both `saudiaddressfinder.com` and `console.saudiaddressfinder.com` to Meta's whitelisted domains for that Page's Messenger chat plugin.

- [ ] **Step 2: Fill in the website's widget**

In `saudiaddressfinder-site/chat-widget.js`, change:
```js
const MESSENGER_PAGE_ID = "";
```
to:
```js
const MESSENGER_PAGE_ID = "<the real numeric Page ID>";
```

- [ ] **Step 3: Commit and deploy the website change**

```bash
cd saudiaddressfinder-site
git add chat-widget.js
git commit -m "Enable Facebook Messenger chat widget with real Page ID"
git push origin main
```

- [ ] **Step 4: Verify the website placement live**

Wait ~1 minute for GitHub Pages to redeploy, then visit `https://saudiaddressfinder.com/` in a real browser (not just curl — this needs to render JS) and confirm the Messenger chat bubble appears in the bottom-right corner and opens when clicked. This placement is expected to work per the spec.

- [ ] **Step 5: Fill in the embedded admin's widget with the same Page ID**

In `Shopify_Public/public/admin-assets/chat-widget.js`, change:
```js
const MESSENGER_PAGE_ID = "";
```
to:
```js
const MESSENGER_PAGE_ID = "<the same numeric Page ID>";
```

- [ ] **Step 6: Commit and deploy the app change**

```bash
cd Shopify_Public
git add public/admin-assets/chat-widget.js
git commit -m "Enable Facebook Messenger chat widget with real Page ID"
git push origin main
```

Then deploy to the droplet the same way as Task 4 Step 7 (git pull + pm2 restart + verify HTTP 200 and stable restart counts).

- [ ] **Step 7: Verify the embedded admin placement live — this is the untested, higher-risk placement**

Open the real Shopify embedded admin (inside Shopify Admin, not a direct browser tab) and check whether the Messenger bubble renders correctly in the bottom-right corner and opens when clicked.

- **If it renders and works cleanly:** done, both placements are live.
- **If it renders badly (broken layout, doesn't open, console errors) or doesn't appear at all:** revert the in-app placement per the spec's fallback plan — remove the `<script src="/admin-assets/chat-widget.js"></script>` line and the `<div id="fb-root"></div>` line added in Task 4 from `Shopify_Public/routes/admin.js`, commit, and redeploy (same deploy steps as Task 4 Step 7). Keep the website placement, which is unaffected either way.

---

## Self-Review Notes

- **Spec coverage:** Getting Started + FAQ content (Task 1) ✓, cross-linking (Task 2) ✓, chat widget on website (Task 3) ✓, chat widget in embedded admin (Task 4) ✓, real snippet wiring + fallback plan (Task 5) ✓, out-of-scope items (in-app nav split, static-site generator, WhatsApp) — correctly not included as tasks ✓.
- **Type/interface consistency:** both `chat-widget.js` files (website and admin) use the identical `MESSENGER_PAGE_ID` constant name and identical widget-injection logic, so Task 5's two edits are truly parallel and easy to keep in sync.
- **No fabricated content:** Task 5 is explicitly marked blocked-pending-user-input rather than inventing a fake Page ID; this is a real external constraint, not a lazy placeholder.
