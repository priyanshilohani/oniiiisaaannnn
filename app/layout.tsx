import React from "react"
import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito'
});

export const metadata: Metadata = {
  title: 'A Surprise For You!',
  description: 'A cute little birthday surprise',
}

export const viewport: Viewport = {
  themeColor: '#fce7f3',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
