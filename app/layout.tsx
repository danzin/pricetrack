import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Provider from '@/components/Provider'

const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})
export const metadata: Metadata = {
  title: 'Price Tracker',
  description: 'Track product prices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
        <main className='max-w-10xl mx-auto'>
          <Navbar/>
          {children}

        </main>

        </Provider>
        </body>
    </html>
  )
}
