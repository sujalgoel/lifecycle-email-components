# Wavecrest Stays, lifecycle email components

Two production-shaped lifecycle emails for a consumer booking brand, built in [MJML](https://mjml.io): a **booking confirmation** with a full price breakdown, and an **abandoned checkout** reminder. They share one visual system (brand mark, card surface, kicker label, serif display type, button, footer), so the 3rd through 40th email in the set is composition, not design work.

The source carries [Customer.io](https://customer.io) Liquid untouched (`{{customer.first_name}}`, `{{event.total | money}}`, `{% if %}` conditionals, `{% unsubscribe_url %}`), so the compiled HTML drops into the ESP with personalization intact.

## Live previews

**Live site: https://sujalgoel.github.io/lifecycle-email-components/**

| Email | Rendered with sample data | Compiled, Liquid intact |
| --- | --- | --- |
| Booking confirmation | [preview](https://rawcdn.githack.com/sujalgoel/lifecycle-email-components/e63bae9b4116/preview/booking-confirmation.html) | [dist](https://rawcdn.githack.com/sujalgoel/lifecycle-email-components/e63bae9b4116/dist/booking-confirmation.html) |
| Abandoned checkout | [preview](https://rawcdn.githack.com/sujalgoel/lifecycle-email-components/e63bae9b4116/preview/abandoned-checkout.html) | [dist](https://rawcdn.githack.com/sujalgoel/lifecycle-email-components/e63bae9b4116/dist/abandoned-checkout.html) |

Both respond to your OS appearance: view them with the system in dark mode to see the designed dark palette, not an auto-inversion.

## Structure

```
src/       MJML source, the single source of truth (this is what gets reviewed and versioned)
dist/      compiled HTML, the artifact the ESP receives
preview/   dist with sample data substituted for the Liquid tokens, for design review
```

## Build

```bash
npm install
npm run build      # src/*.mjml -> dist/*.html
npm run preview    # dist/*.html -> preview/*.html with sample data
```

`build-preview.mjs` fails the build if any Liquid token is left unsubstituted, which doubles as a check that no token got mangled in the compile.

## Design decisions

- **One seamless card.** The card is a single `mj-section` surface with one radius. Stacking multiple rounded sections shows seams and stray corners mid-card; this build avoids that structurally instead of patching it.
- **Typography does the luxury work.** No images anywhere. Serif display (Georgia stack) for headlines and money, letterspaced sans (Helvetica stack) for kickers, labels and metadata. Web-safe stacks only, so nothing depends on a webfont loading.
- **The total row is unmistakable.** Right-aligned amounts, quiet row separators, and a heavier, larger total row sitting on a brand-color rule. A price breakdown where every row weighs the same reads as noise.
- **Buttons are real MJML buttons.** `mj-button` compiles to the VML fallback Outlook on Windows needs. The flat, slightly squarer Outlook rendering is an intentional design, with a fill that works without the gradient-era tricks.
- **Transactional and marketing footers differ on purpose.** The confirmation states that booking emails always send; the reminder carries a plain unsubscribe. Compliance is part of the template, not an afterthought.

## Dark mode, done against MJML's actual output

Most email dark-mode CSS fails because it targets the markup the author imagines, not the markup MJML emits. Three gotchas this build handles:

1. **Backgrounds are inline on generated tables.** `.card { background !important }` repaints the wrapper div but not the inner `<table>`/`<td>` that carry inline `background-color`. Overrides therefore target `.card, .card table, .card td` together, with source order deciding which surface wins (body, then card, then inner surfaces).
2. **`mj-text` renders into a `<div>`, not `<p>` or `<h1>`.** Text color overrides target `.card div, .card td`. Selectors like `.card p` silently match nothing.
3. **A component's `css-class` lands on its container cell.** For `mj-button`, the class sits on the outer `<td>` that also carries the component's padding, so painting `td.btn` floods the whole padded area. The override paints only the button's own cell and link: `.btn table td` and `.btn a`.

The light palette also avoids pure `#000`/`#fff` extremes so Gmail's forced auto-invert (which ignores `prefers-color-scheme`) lands legible instead of being fought with hacks.

## Customer.io workflow this assumes

Git is the source of truth; the ESP holds a build artifact. Source is reviewed and versioned here, `dist/` is uploaded through the Customer.io API rather than pasted, and a change to any shared visual element is one commit that rebuilds every email consistently. Rollback is `git revert` plus a re-upload, not archaeology inside an ESP editor.
