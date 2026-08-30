# Lifecycle email components, MJML

Two emails from a consumer booking flow, built from shared pieces: the same header, card, button and footer patterns carry across both, so the 3rd through 40th email in the set is mostly composition.

- `src/booking-confirmation.mjml` -> `dist/booking-confirmation.html`
- `src/abandoned-checkout.mjml` -> `dist/abandoned-checkout.html`

Build: `npx mjml src/<file>.mjml -o dist/<file>.html`

## Decisions worth noticing

- **Outlook on Windows.** MJML compiles the buttons and layout down to table + VML (`v:roundrect`) with `mso` conditionals, so the rounded, padded button survives Word's renderer instead of collapsing to a bare link. No image buttons anywhere: they blur on retina and vanish with images off.
- **Dark mode is explicit, not accidental.** A `prefers-color-scheme` block flips the page, card and text tokens. Clients that force-invert (Gmail app) get colors chosen so the auto-invert stays legible rather than fighting it.
- **ESP placeholders survive the compile.** The templates carry Liquid (`{{customer.first_name}}`, `{% if %}`, `{% unsubscribe_url %}`) untouched through MJML, so the compiled HTML drops into Customer.io with personalization and conditionals intact. Source lives in git; what the ESP holds is a build artifact.
- **Transactional vs marketing footers differ.** The confirmation states that booking email always sends; the reminder carries a plain unsubscribe. Compliance is a template concern, not an afterthought.
