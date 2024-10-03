import { FaGithub, FaDiscord, FaLightbulb } from 'react-icons/fa'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import "./globals.css";
import './tailwind.css'
import { Providers } from "./providers";

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
              </nav>
            </header>
            <main>
              {children}
            </main>
            <footer className="py-10 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 mt-20 border-t border-lavender-200 dark:border-gray-700">
              <p>&copy; 2024 CDP SDK. All rights reserved.</p>
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
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
