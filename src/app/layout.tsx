import './globals.css';
import {Inter} from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import React from "react";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SASE@RHIT',
  description: 'Society of Asian Scientists and Engineers at Rose-Hulman Institute of Technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}>
        <Navbar />
        <main className="container mx-auto p-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
