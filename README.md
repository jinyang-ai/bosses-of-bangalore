# Bosses of Bangalore

A single-page, invite-only lead-capture landing page for the **Bosses of Bangalore** private beta.

Live: https://bosses-of-bangalore.vercel.app

## What it does

- Fixed-viewport, zero-scroll landing page with a single call to action.
- Collects **Name**, **Phone**, and **Company** from each applicant.
- Submissions are appended to a Google Sheet via a Google Apps Script web app.
- Responsive: split artwork/form layout on desktop, stacked layout on mobile.

## Structure

```
index.html            # The entire page (HTML + CSS + JS, no build step)
assets/
  hero-desktop.jpg     # Landscape artwork (desktop)
  hero-mobile-art.jpg  # Cropped hands + lotus artwork (mobile)
apps-script.gs         # Google Apps Script that writes submissions to the Sheet
```

## Lead capture

The form `POST`s (in `no-cors` mode) to a Google Apps Script web-app endpoint, which
appends a row — `Timestamp · Name · Phone · Company` — to a Google Sheet.

To point it at a different Sheet:
1. Create a Sheet, then `Extensions → Apps Script` and paste [`apps-script.gs`](apps-script.gs).
2. `Deploy → New deployment → Web app` (Execute as: Me, Access: Anyone).
3. Copy the web-app URL and set it as the `<form action="...">` in `index.html`.

## Develop locally

```bash
python3 -m http.server 4789
# open http://localhost:4789
```

## Deploy

Hosted on Vercel as a static site:

```bash
vercel --prod
```
