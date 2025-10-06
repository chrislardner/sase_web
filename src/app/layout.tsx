import '@/app/globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import React from 'react';
import {Metadata} from "next";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SASE@RHIT',
    description:
        'Society of Asian Scientists and Engineers at Rose-Hulman Institute of Technology',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased min-h-dvh flex flex-col`}>
        <Providers>
            <Navbar />
            <main id="content" className="flex-1">
                {children}
            </main>
            <SpeedInsights />
            <Analytics />
            <Footer />
        </Providers>
        </body>
        </html>
    );
}
