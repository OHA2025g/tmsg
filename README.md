# TMSG corporate motion website

A corporate group website and five child business destinations built from the supplied TMSG content document and crest. The current edition reorganises the experience around clear business information and visitor journeys inspired by Mahindra, Tata, Brookfield and Virgin brand principles. See DESIGN_DECISIONS.md for references and access limitations.

The visual palette is midnight navy (#101D35), warm ivory (#F6F3ED), champagne gold (#C3A46B) and charcoal (#263244). All five child destinations share these colours while retaining their distinct layouts, typography and imagery. The supplied crest is preserved.

## Pages

42 content routes:
- 10 corporate pages: Home, About, Businesses, Leadership, Global Outlook, Sustainability, Careers, Perspectives, Partner With Us and Contact.
- 4 full editorial articles explaining the corporate and business visions.
- 5 child sites with 5 routes each: Overview, Story, Focus, Approach and Contact.
- Privacy notice, draft terms and disclaimer.

Child destinations: Zustmed, Omviraa, Shahi Estate, Shahi World and Emerging Ventures. The source names four brands; Emerging Ventures is the fifth destination for future business interests. Child sites share this deployment under distinct routes. Separate domains require configuration and domain ownership.

## Source structure

- components/CorporateSite.tsx: homepage compositions, hero highlights, legal pages and root motion settings.
- components/InnerPages.tsx: distinct corporate pages, business landing pages and business interior routes.
- components/InstitutionalBlocks.tsx: photographic page covers, accessible purpose tabs, development stages and partnership invitations.
- components/CorporateEditorial.tsx: business directory, editorial mastheads, business approach, founder profile, market priorities, group briefs and specific enquiry routes.
- components/CorporateNavigation.tsx: corporate/brand headers, mega menus, responsive dialog navigation, search index and search dialog, footer.
- components/EnquiryForm.tsx: enquiry, partnership and career forms.
- components/Website.tsx: stable entry point.
- content/site.ts: editable corporate and business descriptions, values and focus areas.
- content/stories.ts: editable editorial articles.
- app/corporate.css: complete responsive design and motion system. app/fonts.css and public/fonts/: locally hosted typography.
- app/editorial.css: homepage editorial components.
- app/inner-pages.css: responsive interior layouts, business identities and compact footer.
- app/api/enquiries/route.ts: validated database submissions.
- db/schema.ts and drizzle/: database schema and migrations.
- tests/verify.mjs: rendering, routing, assets, search and enquiry checks.

## Motion and accessibility

Hero image transitions, pause/manual controls and restrained scroll reveals. OS reduced-motion settings and a saved site preference are respected. Uses semantic navigation, labelled controls, native dialogs, visible business principles and a skip link. Core content remains readable before JavaScript runs.

## Run locally

Node 24 recommended for the included SQLite-backed test runner; Node 22.13+ for the website. Use pnpm 11+.

1. pnpm install --frozen-lockfile
2. pnpm run build
3. Apply drizzle/0000_enquiries.sql once to the local D1 DB using the starter README command.
4. pnpm run dev

Check with pnpm exec tsc --noEmit and node tests/verify.mjs. Generate a new schema-only migration with pnpm run db:generate only after changing the database schema. Preserve applied migrations and the Site identity in .openai/hosting.json.

## Enquiry handling

POST /api/enquiries checks fields, consent, origin, payload size, honeypot and an hourly network rate limit. Submissions are saved with a reference, source route and business. There is no public record-list endpoint. Email delivery is not configured; the interface accurately says the enquiry is saved and no email confirmation is sent. Career submissions are expressions of interest, not applications to invented vacancies; profile links can be included in the message and file uploads are not collected.

## Content and launch

The deployment remains owner-private. Robots disallows indexing. Confirm the legal operator, address, operating statuses, approved contact channels, privacy contacts, retention policy and terms before public release. All imagery is illustrative; no employee portraits, owned properties, financial results, offices, testimonials, completed impact or partner endorsements are fabricated. There is no marketing analytics or visual CMS editor; update content in the source files.

## Verification limit

Automated checks cover all 42 content routes, internal links, local images, search and enquiry behaviour. The interior refresh was reviewed in the browser at desktop, phone and tablet widths. Checks covered purpose tabs, values, development stages, business-sector filters, market selection, partnership options and the mobile navigation dialog. Responsive samples were checked for horizontal overflow. The earlier browser preview restriction no longer blocked this review. Enquiry storage was validated through automated tests rather than live test submissions. All authored website text and titles use normal hyphens in place of em dashes.
