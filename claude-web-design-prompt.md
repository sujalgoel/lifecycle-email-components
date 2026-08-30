You are a senior email design engineer at an agency that ships lifecycle email for premium consumer brands. Redesign the two MJML emails at the bottom of this prompt so they look like they came from a $200/hr studio, while staying 100% renderable in real email clients. Return BOTH files as complete, compilable MJML. No elided sections, no "rest stays the same".

BRAND AND CONTEXT
- Brand: Wavecrest Stays, a premium coastal vacation-rental company (Outer Banks, NC). Voice: calm, confident, warm. Think boutique hotel stationery, not SaaS marketing.
- Email 1 is a transactional booking confirmation with a full price breakdown. Email 2 is an abandoned-checkout reminder.
- These compile with MJML and the output is uploaded to Customer.io. Every Liquid token must survive EXACTLY as written: {{customer.first_name}}, {{event.property_name}}, {{event.check_in | date: "%b %-d"}}, {{event.total | money}}, {% if event.dates_high_demand %}...{% else %}...{% endif %}, {% unsubscribe_url %}, and all the others already present in the source. Do not rename, reformat, or drop a single one. Do not URL-encode the braces.

HARD TECHNICAL CONSTRAINTS (email, not web)
- Max content width 640px, single column. Everything must degrade to tables; write MJML, let MJML do the table soup.
- Outlook on Windows renders with Word: no CSS gradients, no reliable border-radius, no background images for anything essential, no flexbox/grid ever. Buttons must be MJML mj-button so the VML fallback is generated. Fallback appearance (squarer, flat fill) should be an intentional design, so pick button colors that look good flat.
- Fonts: web-safe stacks only. Serif display (Georgia stack) + sans support (Helvetica/Arial stack) is the current direction and works; refine the scale and spacing rather than adding webfonts. If you add a webfont, it must have a first-class web-safe fallback and nothing may depend on its metrics.
- No images at all in these two emails (they must be beautiful with typography, color and spacing alone). No emoji.
- All styling inline-able by MJML or inside mj-style. No external CSS, no <link>.

DARK MODE, READ CAREFULLY, THIS IS WHERE THE CURRENT VERSION IS BROKEN
- The current dark-mode block flips text colors but misses the backgrounds, because MJML writes inline background-color on the generated <table> and <td> elements, and puts mj-text content inside <div>, not <p> or <h1>. So selectors like .card p and .card h1 match nothing, and .card { background } does not repaint the inner tables. The rendered result in a dark-mode browser was near-white text sitting on a still-white card. Unacceptable.
- Requirements: a @media (prefers-color-scheme: dark) block whose selectors actually match MJML output. That means overriding backgrounds with BOTH the class AND its descendant tables/tds (.card, .card table, .card td { background-color: ... !important }) and text via .card div, .card td { color: ... !important }. Respect source order so inner surfaces (like a fact box) override the card, and the card overrides the body.
- The light palette must also survive Gmail's forced auto-invert (Gmail app ignores prefers-color-scheme and inverts on its own): avoid pure #000/#fff extremes, keep sufficient contrast either way.
- Include a dark palette that is designed, not just inverted: deep green-tinted neutrals, slightly desaturated accent, muted secondary text.

DESIGN DIRECTION
- Current palette: body #eef2ef, card white, deep green accent #1d5c45, ink #1f2a24, muted #5c6b62. Keep the deep green family but you may refine every value.
- The card must read as ONE seamless rounded surface. The current version stacks three mj-sections each with their own radius and it shows seams and stray rounded corners mid-card. Use one mj-wrapper as the card surface with inner sections transparent, or an equivalent seamless structure.
- Add a small uppercase kicker label above each headline (e.g. BOOKING CONFIRMED / YOUR STAY IS WAITING) in the accent color, letterspaced sans.
- Price breakdown: right-aligned amounts, quiet row separators, and a total row that is unmistakably the total (heavier weight, rule above, slightly larger). It currently reads as four equal grey lines.
- The abandoned-checkout fact box (Dates / Guests / Total) should feel like a boarding-pass style summary: contained surface, clear label column, generous padding.
- Hierarchy: kicker, serif headline (aim ~30px/38px), one short body paragraph, exhibit (table/fact box), single button, one quiet reassurance line, footer. Whitespace is the luxury cue; be generous and consistent (an 8px spacing system).
- Footers differ on purpose: the confirmation says booking emails always send (transactional), the reminder carries a plain unsubscribe (marketing). Keep that distinction, style it quietly.
- Buttons: full-bleed-ish width is fine (or generous 16px/40px padding), sans-serif label, sentence case as-is.

WHAT TO RETURN
1. booking-confirmation.mjml, complete file.
2. abandoned-checkout.mjml, complete file.
3. A short list (max 8 bullets) of the design decisions you made and why they survive Outlook and dark mode. No other commentary.

CURRENT SOURCE, EMAIL 1 (booking-confirmation.mjml):
[PASTE_BOOKING_CONFIRMATION_MJML]

CURRENT SOURCE, EMAIL 2 (abandoned-checkout.mjml):
[PASTE_ABANDONED_CHECKOUT_MJML]
