This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
### Get your API keys
Go to https://portal.cdp.coinbase.com/ and create an API key if you don't already have one.

### Create an encryption key

```bash
openssl rand -hex 32
```

### Setup your environment variables

Create a `.env` file in the root of the project with the following:

```bash
CDP_API_KEY_NAME="your-api-key-name"
CDP_API_KEY_SECRET="your-api-key-secret"
ENCRYPTION_KEY="your-encryption-key"
POSTGRES_URL="postgresql://admin:password@localhost:5432/seeds"
```

### Run the Postgres DB

```bash
npm run db:up
```

If you don't see database logs, double check Postgres is installed:

```bash
docker run --name test-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=seeds -e POSTGRES_USER=admin -p 5432:5432 postgres:14
```

Set up the Prisma schema in the DB

```bash
npm run db:setup
```

### Run the app

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

[![Deploy CDP Wallet Manager with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcoinbase%2Fcdp-wallet-manager&env=CDP_API_KEY_NAME,CDP_API_KEY_SECRET&envDescription=Generate%20CDP%20API%20keys%20from%20https%3A%2F%2Fportal.cdp.coinbase.com%2Faccess%2Fapi)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Desired features 
- Tagging wallets with display name; more generally, metadata.
