# Assets and references

## Supplied kit

Inspected `README_FIRST.md`, `ASSET_MANIFEST.md`, the product contact sheet, `references/homepage-visual-direction.png`, and the actual image files in `handmade-by-charl-codex-kit.zip`. The separately pasted final master brief governs this implementation; the kit’s older master prompt does not override it.

The visual direction informed the warm cream/copper palette, large editorial serif, product presence and handmade personality. It is a layout reference and is never displayed on the website. Product inventory is drawn from the supplied photographs.

- `charl-clock-hero.png`: original reconstructed transparent illustration, retained as supplied. The current hero uses a new full-bleed studio visualisation based on the actual clock photograph.
- `charl-clock-real.jpg`: actual ornamental clock, preserved in the Original photos detail mode.
- Fairy houses, engraved spoons, miniature furniture/model, decorative insect, Christmas kits and practical woodwork: actual supplied archive photographs. These are limited-resolution screenshot crops. Some contain historic prices; the site explicitly says to request a current quote.
- The separately attached circular wall-clock photograph is an additional user reference. It is visually different from the ornate clock in the kit; the site does not claim the hero is an exact photograph of that circular clock.

At the user’s explicit request, eleven product photographs were regenerated with image generation, using each original photograph as the visual reference. The new studio views retain recognisable construction and engraving but may differ in small details. They are labelled AI visualisations; originals remain available in each detail view. The Christmas and practical woodwork collages were re-presented as coherent product-group images, with price labels and screenshot clutter removed. Generated source PNGs remain outside the checkout in `/workspace/generated_images`; optimised WebP versions are in `public/images/studio/`. The illustrative engraving shapes are CSS drawings, clearly labelled. The interface uses a typographic business name rather than inventing a brand logo.

## Reference inspection — 16 November 2026

### Krung Travel

The user subsequently supplied the full Krung Travel landing-page specification. It has been read, including full-bleed scene layering, 35%-wide soft mask transitions, animated thumbnail sizing and concentric rings, giant gradient-filled title masks, parallax, and card-to-detail shared-image flights. Those interaction principles now inform the workshop hero and collection. Bangkok imagery, booking controls, cloud assets, reviews and prices are not included. No live Krung site or runnable source was supplied, so the supplied specification is the inspected reference.

### Cycle 3D

Inspected the existing source checkout (including `Scene.jsx` and camera movement) and the GitHub README and package manifest at <https://github.com/umesh-dev31/Cycle-3D>. Its layered composition, stable product framing and restrained interpolation informed the new 2.5D approach. The README states MIT, but a root LICENSE was not available at the inspected URL. No Cycle 3D source is copied into the new website. Legacy bike assets, components and renderer dependencies were removed from the active demo.

### Open Product Designer

Inspected the README, MIT licence, root and React package manifests, playground `App.tsx` and React package exports at <https://github.com/OdiriTeddie/open-product-designer>. Its product-template, editable-text, image-reference and serialisation concepts informed a much smaller implementation. Its Fabric.js canvas, Zustand store and complex editor are not included. The customiser and local enquiry persistence were implemented independently; no reference-repository source was copied.

## Fonts

Cormorant Garamond, DM Sans and Allura were retrieved from the Google Fonts source repository using HTTPS and subset to locally served WOFF2 files. Each family’s SIL Open Font License is retained in `public/fonts/`. No Google Fonts request is needed at runtime.

## Before public release

Charl should approve use of photographs and brand presentation, confirm the business number, and confirm current specifications/availability/prices. Production enquiry delivery, secure storage, authentication, file handling and privacy information would be a separate task. This demo has no backend, commerce or public deployment.

## CRM dashboard reference

The user supplied the Lauberhorn Ridge dashboard prompt as visual inspiration. Its photo-led hero, calm cream widgets, precise monospace labels, staggered UI entrances and progress-gauge composition inform the Workshop CRM. Alpine scenery, the fictional hiker, weather, trail information and fixed hiking statistics are not reused. The CRM uses actual local enquiry counts and dates, a workshop product image, a real stage pipeline, search, derived contacts, notes and activity. Sample data is fictional, explicitly marked and opt-in.
