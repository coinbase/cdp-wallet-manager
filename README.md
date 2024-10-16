# CDP Wallet Manager

The CDP Wallet Manager is a comprehensive web application that showcases the capabilities of the Coinbase Developer Platform (CDP) SDK. This project serves as a powerful demonstration of how developers can leverage CDP to build robust, user-friendly blockchain applications.
To learn more about CDP, check out the [developer docs](https://docs.cdp.coinbase.com/cdp-apis/docs/welcome).

## Key Features:

1. **Wallet Management**: Create, view, and manage MPC wallets across different networks.

2. **Address Handling**: Generate and manage addresses within each wallet, supporting various blockchain networks.

3. **Balance Tracking**: Real-time balance display for each address, supporting multiple cryptocurrencies.

4. **Faucet Integration**: Easy access to testnet faucets for quick funding of addresses during development and testing.

5. **Transfer Functionality**: Seamless creation and execution of cryptocurrency transfers between addresses.

6. **Onramp Support**: Integration with Coinbase's onramp feature, allowing users to buy cryptocurrencies directly within the application.

7. **Network Flexibility**: Support for both mainnet and testnet environments, with easy switching between networks.

8. **Responsive Design**: A clean, intuitive user interface that works across desktop and mobile devices.

9. **Dark Mode**: Built-in dark mode support for enhanced user experience in different lighting conditions.

This project is ideal for developers looking to understand the implementation of blockchain wallet functionalities using the CDP SDK. It provides a solid foundation that can be extended and customized for various blockchain-based applications.

By exploring and using the CDP Wallet Manager, developers can gain hands-on experience with key blockchain operations, security best practices, and user interface design for crypto applications.

Whether you're building a DeFi platform, a crypto portfolio tracker, or any other blockchain-based service, the CDP Wallet Manager offers valuable insights and a practical starting point for your development journey with the Coinbase Developer Platform.

***The application does not have built-in authentication. Ensure that you add an authentication layer before deploying it to production.***

## Getting Started
### Get your API keys
Go to https://portal.cdp.coinbase.com/ and create an API key if you don't already have one.

### Create an encryption key

This encryption key is used to secure your private keys stored in vercel postgres. You can generate one using the following command:

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
NEXT_PUBLIC_CDP_PROJECT_ID="your-cdp-project-id"
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
npm install
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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcoinbase%2Fcdp-wallet-manager&env=CDP_API_KEY_NAME,CDP_API_KEY_SECRET,NEXT_PUBLIC_CDP_PROJECT_ID,ENCRYPTION_KEY&envDescription=Download%20CDP%20API%20key%20name%2C%20secret%2C%20project%20ID%20from%20CDP%20portal)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Desired features 
- Tagging wallets with display name; more generally, metadata.
