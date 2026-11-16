# Handmade by Charl

A local website demo for Charl’s South African woodworking business. React, TypeScript, Vite, Tailwind CSS, Motion for React, Lucide and React Router. No 3D renderer, backend, payments or external font/lighting requests.

## Run locally

Use Node.js 24 (Vite 8 requires Node 20.19+ or 22.12+).

```bash
cd /workspace/handmadecharl
npm ci --cache /workspace/.npm
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Open `http://localhost:5173` on the machine running Vite. Open **Workshop CRM** from the main navigation, or visit `/demo-dashboard`. Use the same hostname and port throughout a demo: browser storage is specific to the origin.

```bash
npm run build       # Strict TypeScript check + production build
npm run lint        # Oxlint, including React hooks
npm test            # Chromium customer journey + CRM browser tests
npm run preview -- --host 0.0.0.0 --port 4173 --strictPort
```

The browser tests use `/usr/bin/chromium` in this cloud environment. Elsewhere, set `PLAYWRIGHT_CHROMIUM_PATH` to your Chromium executable. Tests use isolated browser contexts and do not change an existing user session’s demo data. Reports go to `playwright-report/`; failure traces and screenshots go to `test-results/`.

## The customer journey

- Three full-bleed walnut, moss and copper hero scenes with a 1.25-second, broad soft gradient-mask wipe. Images, giant gradient-filled titles and scene copy change together. Animated concentric thumbnail rings, perspective parallax and scroll-linked movement. No autoplay.
- Three tactile collection cards with restrained pointer tilt, image zoom, an opening cue and shared-image flights into full-screen product studies. A filterable gallery of eight creations across six categories.
- Product details offer regenerated **Studio view** imagery and preserved **Original photos**, alternate views, keyboard focus containment, Escape to close and product-specific enquiry prefilling.
- An engraving studio with three illustrative product shapes, editable text, three locally served lettering styles and an optional live image reference.
- A validated quote form with quantity, notes, customisation details and optional reference image.
- A professional `/demo-dashboard` CRM with a sidebar, overview widgets, enquiry list, search, sorting, pagination, filtered CSV export, drag-and-drop four-stage pipeline, derived contacts, detail drawers, local internal notes, activity history, stored references and persistent statuses. Clearly marked fictional samples can be loaded and removed without deleting user enquiries.
- Responsive mobile navigation, reduced-motion support, local fonts, and no remote runtime assets.

## What is simulated

Enquiries, status changes, workshop notes, activity history and uploaded reference images are saved in `localStorage` under `handmade-by-charl.enquiries.v1`. They are **not delivered to Charl**, shared across devices, authenticated, or stored on a server. Clearing browser site data removes them. Storage failures produce an error, not a success message; malformed saved data is preserved.

Reference uploads support JPG, PNG and WebP up to 2 MB. They stay in this browser. They are not production engraving files. The engraving preview is illustrative and subject to Charl’s approval; the example tag and plaque do not establish product availability.

WhatsApp links use **084 511 7007**, visible in the supplied catalogue. They open `wa.me/27845117007` with a prefilled message. The visitor must send the message and attach any image manually. CRM sample contacts are fictional; they are not actual customers. The website never sends a WhatsApp message automatically. In the CRM, **Message customer** opens a manual follow-up draft to the saved customer number (South African local numbers are normalised to +27). Messaging is disabled for fictional sample contacts.

Eleven source product photographs have been reconstructed as consistent AI studio visualisations. The hero, collection and gallery use these labelled studio views. Original photographs remain available through **Original photos** in every product detail. AI reconstruction can change small details and is not proof of an exact manufactured product. It is not the same design as the circular clock in the additional reference photograph. Historic prices visible in archive photos are not quoted as current prices. No stock, reviews, ratings, pricing or delivery commitments are invented.

This is a private concept. Confirm images, branding, product details, business contact details and permissions with Charl before any public release.

## Assets and references

See [docs/ASSETS-AND-REFERENCES.md](docs/ASSETS-AND-REFERENCES.md) for provenance, the inspected references and reference limitations. Original photographs remain recognisable. The original hero PNG is retained as supplied. New studio imagery is served as optimised WebP files; `public/images/studio/provenance.json` identifies generated assets. Font licences are in `public/fonts/`.

The existing isolated checkout is used directly; do not create a Git worktree unless requested. Future cloud tasks can reuse installed dependencies but must restart Vite. No secrets or backend services are required.
