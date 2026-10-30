This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Dependency baseline (October 2026)

Use Node.js 24 (`nvm use`) and npm. Install the checked-in dependency set with
`npm ci`, then run `npm run typecheck`, `npm run lint`, and `npm run build`.
Configure the environment variables referenced in `lib/config.ts` and `AUTH_SECRET`
in `.env.local` before building or running against real services.

The app uses Next.js 16.4, React 19.3, Tailwind CSS 4.3, Zod 4, and the maintained
`@imagekit/next` and `@imagekit/nodejs` SDKs. The upgrade follows the
[Next.js 16 migration guide](https://nextjs.org/docs/app/guides/upgrading/version-16),
[Tailwind CSS 4 migration guide](https://tailwindcss.com/docs/upgrade-guide), and
[ImageKit integration guide](https://imagekit.io/docs/integration/nextjs).
Tailwind 4 requires Safari 16.4+, Chrome 111+, or Firefox 128+.

Compatibility exceptions:

- NextAuth stays on `5.0.0-beta.32` because the app uses its v5 API; the npm
  `latest` tag still points to v4.
- TypeScript 6.0.3 and ESLint 9.39.5 satisfy the current Next.js lint plugins;
  their peer ranges exclude TypeScript 7 and ESLint 10 respectively.
- Form resolvers stay on 5.9.2 because v6's optional Effect/TypeSchema peers
  could not resolve together with npm. Zod 4 remains supported on v5.
- Node types follow the Node 24 runtime.

`npm audit` reports four moderate development-only findings in Drizzle Kit's
legacy esbuild loader chain. The offered automatic fix downgrades Drizzle Kit to
0.18.1, so it is not applied. No production dependency findings remain.

Verification: a clean `npm ci --ignore-scripts`, type checking, validation-schema
regression checks, and the Turbopack production build passed. Lint has no errors
and five existing unused-variable warnings. The build and HTTP smoke checks used
temporary local test environment values, not live credentials. Sign-in, sign-up,
and rate-limit pages served HTML/CSS successfully; unauthenticated admin requests
redirected to sign-in. Browser appearance, live authentication, database access,
ImageKit uploads, and email/workflow delivery still require real-service testing.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
