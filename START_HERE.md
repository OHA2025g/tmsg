# TMSG complete project

This package contains the latest published TMSG website, including all 42 routes and the five child business destinations: Zustmed, Omviraa, Shahi Estate, Shahi World and Emerging Ventures. The interior redesign and normal-hyphen replacements are included.

## Requirements

- Node.js 24, recommended for both the application and the SQLite-backed test runner.
- pnpm 11 (the package declares pnpm 11.25.0).
- An internet connection for the first dependency installation.

The existing local website features do not require a ChatGPT subscription or an OpenAI API key.

## Install and run

Extract the ZIP, open a terminal in the TMSG_Complete_Project folder, and run:

```bash
pnpm install --frozen-lockfile
pnpm run build
```

Initialize the local enquiry database once, after building:

```bash
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_enquiries.sql
```

Start the built application:

```bash
pnpm start
```

Open the local address printed by Wrangler, normally http://127.0.0.1:8787. Local enquiries are written to the local D1 database. Apply the initial migration only once to each new database.

For development with automatic reload:

```bash
pnpm run dev
```

The portable development command uses port 5173; use the exact URL printed by the terminal. Production-style local preview through pnpm start explicitly uses .wrangler/state.

## Verify the project

```bash
pnpm exec tsc --noEmit --incremental false
node tests/verify.mjs
pnpm run build
```

The route and enquiry tests use an in-memory SQLite database. They do not write test records into the hosted website.

## What is included

- React/TypeScript frontend and responsive CSS for all 42 content routes.
- Five business landing pages and their story, focus, approach and contact routes.
- Corporate navigation, menus, search, motion preferences and reusable components.
- Enquiry, partnership and career forms and their server API.
- D1 schema, migration and validation tests.
- Image, logo, font and video assets with the existing asset credits.
- Dependency manifest, exact lockfile, build scripts and Worker integration.
- Original corporate website content PDF in docs/source.
- README.md and DESIGN_DECISIONS.md for architecture and design context.
- PROJECT_MANIFEST.json with source version and per-file SHA-256 hashes.

Installed dependencies and generated runtime/build folders are recreated by the install and build commands. The database is initialized from its schema; this package contains no live enquiry records.

## Editing

- Corporate and portfolio content: content/site.ts.
- Group and business briefs: content/stories.ts.
- Group pages and child-site layouts: components/InnerPages.tsx.
- Covers, purpose tabs and approach sections: components/InstitutionalBlocks.tsx.
- Homepage and motion settings: components/CorporateSite.tsx.
- Navigation, search and footer: components/CorporateNavigation.tsx.
- Forms and submission handling: components/EnquiryForm.tsx and app/api/enquiries/route.ts.
- Styling: app/corporate.css, app/editorial.css and app/inner-pages.css.

The child websites use separate routes in one application. Separate custom domains require hosting configuration. Email notifications and a visual CMS editor are not currently implemented.

## Hosting

The server runs on the Cloudflare Workers runtime and uses a D1 binding named DB. Independent deployment needs your hosting account, a real D1 database and a matching database binding in the deployment configuration. The placeholder database ID in vite.config.ts supports local development; an independent hosting setup must supply its own production database configuration and apply the migration there.

.openai/hosting.json retains the identity of the existing TMSG Site and is not an authentication credential. Preserve it when updating that same Site. No account tokens, secret environment files, Git history or live database records are part of this export.

## Current content status

Business descriptions and international regions are presented as visions or strategic interests. Photographs are illustrative. Confirm operating details, contact channels, legal policies and public-launch settings before making a public release. The existing private publication and website data remain separate from this downloadable source package.
