import { FaGithub, FaDiscord, FaLightbulb } from 'react-icons/fa'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import "./globals.css";
import './tailwind.css'
import { Providers } from "./providers";
import '@coinbase/onchainkit/styles.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'CDP Wallet Manager',
  description: 'Explore a web3 wallet manager built with CDP (Coinbase Developer Platform) SDK.',
  openGraph: {
    title: 'CDP Wallet Manager',
    description: 'Explore a web3 wallet manager built with CDP (Coinbase Developer Platform) SDK.',
    url: 'https://cdp-wallet-manager-self.vercel.app/',
    siteName: 'CDP Wallet Manager',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CDP Wallet Manager',
    description: 'Explore a web3 wallet manager built with CDP (Coinbase Developer Platform) SDK.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark:bg-gray-900">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="py-6 px-4 bg-white dark:bg-gray-800 shadow-md">
              <nav className="container mx-auto flex justify-between items-center">
                <Link href="/">
                  <Image src="/logo.png" alt="CDP SDK Logo" width={120} height={40} />
                </Link>
                <div className="flex items-center space-x-6">
                  <ul className="flex space-x-6 items-center">
                    <li>
                      <a href="https://docs.cdp.coinbase.com/cdp-sdk/docs/welcome" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        <FaLightbulb size={24} />
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/coinbase/coinbase-sdk-nodejs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={24} />
                      </a>
                    </li>
                    <li>
                      <a href="https://discord.gg/cdp" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        <FaDiscord size={24} />
                      </a>
                    </li>
                  </ul>
                  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcoinbase%2Fcdp-wallet-manager&env=CDP_API_KEY_NAME,CDP_API_KEY_SECRET,NEXT_PUBLIC_CDP_PROJECT_ID,ENCRYPTION_KEY&envDescription=Download%20CDP%20API%20key%20name%2C%20secret%2C%20project%20ID%20from%20CDP%20portal" target="_blank" rel="noopener noreferrer">
                    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
                  </a>
                </div>
              </nav>
            </header>
            <main>
              {children}
            </main>
            <footer className="py-10 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 mt-20 border-t border-lavender-200 dark:border-gray-700">
              <p>&copy; 2025 CDP SDK. All rights reserved.</p>
              <p>
                By using this app, you agree to the{' '}
                <a 
                  href="https://www.coinbase.com/legal/cloud/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Terms of Service
                </a>
              </p>
              <p>
                <a
                    href="https://www.coinbase.com/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Privacy Policy
                </a>
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
