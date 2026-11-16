# Handmade by Charl

A local website demo for Charl’s South African woodworking business. React, TypeScript, Vite, Tailwind CSS, Motion for React, Lucide and React Router. No 3D renderer, backend, payments or external font/lighting requests.

## Run locally

Use Node.js 24 (Vite 8 requires Node 20.19+ or 22.12+).

```bash
cd /workspace/handmadecharl
npm ci --cache /workspace/.npm
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Open `http://localhost:5173` on the machine running Vite. The workbench is at `/demo-dashboard`. Use the same hostname and port throughout a demo: browser storage is specific to the origin.

```bash
npm run build       # Strict TypeScript check + production build
npm run lint        # Oxlint, including React hooks
npm test            # Six Chromium browser tests
npm run preview -- --host 0.0.0.0 --port 4173 --strictPort
```

The browser tests use `/usr/bin/chromium` in this cloud environment. Elsewhere, set `PLAYWRIGHT_CHROMIUM_PATH` to your Chromium executable. Tests use isolated browser contexts and do not change an existing user session’s demo data. Reports go to `playwright-report/`; failure traces and screenshots go to `test-results/`.

## The customer journey

- Three hero scenes with right-to-left composition wipes, masked word entrances, concentric thumbnail controls, pointer parallax, restrained perspective and scroll-linked movement. No autoplay.
- Three editorial featured cards, a decorative collection link, and a filterable archive of eight creations across six categories.
- Shared-image product detail transitions with alternate photographs, keyboard focus containment, Escape to close, and product-specific enquiry prefilling.
- An engraving studio with three illustrative product shapes, editable text, three locally served lettering styles and an optional live image reference.
- A validated quote form with quantity, notes, customisation details and optional reference image.
- A `/demo-dashboard` workbench with status filters, enquiry details, stored references, and four persistent enquiry statuses.
- Responsive mobile navigation, reduced-motion support, local fonts, and no remote runtime assets.

## What is simulated

Enquiries, status changes and uploaded reference images are saved in `localStorage` under `handmade-by-charl.enquiries.v1`. They are **not delivered to Charl**, shared across devices, authenticated, or stored on a server. Clearing browser site data removes them. Storage failures produce an error, not a success message; malformed saved data is preserved.

Reference uploads support JPG, PNG and WebP up to 2 MB. They stay in this browser. They are not production engraving files. The engraving preview is illustrative and subject to Charl’s approval; the example tag and plaque do not establish product availability.

WhatsApp links use **084 511 7007**, visible in the supplied catalogue. They open `wa.me/27845117007` with a prefilled message. The visitor must send the message and attach any image manually. The website never sends a WhatsApp message automatically.

The homepage clock illustration is reconstructed imagery from the supplied kit; actual product photography is used in the gallery and details. It is not the same design as the circular clock in the additional reference photograph. Historic prices visible in archive photos are not quoted as current prices. No stock, reviews, ratings, pricing or delivery commitments are invented.

This is a private concept. Confirm images, branding, product details, business contact details and permissions with Charl before any public release.

## Assets and references

See [docs/ASSETS-AND-REFERENCES.md](docs/ASSETS-AND-REFERENCES.md) for provenance, the inspected references and reference limitations. Original photographs remain recognisable. The hero PNG is also supplied as an optimised WebP, with no change to the pictured design. Font licences are in `public/fonts/`.

The existing isolated checkout is used directly; do not create a Git worktree unless requested. Future cloud tasks can reuse installed dependencies but must restart Vite. No secrets or backend services are required.
