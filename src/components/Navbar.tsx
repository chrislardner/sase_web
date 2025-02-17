'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import fullSASElogo from '../../public/fullSASElogo.svg';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-surface-light dark:bg-surface-dark shadow mb-4 px-2 pt-3 pb-4">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image src={fullSASElogo} alt="SASE Logo" className="h-12 w-auto" />
        </Link>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="flex items-center ml-4 px-2 py-2 border-2 rounded">
            {isDark ? <FaMoon /> : <FaSun /> }
          </button>
          <Link href="/events" className="hover:underline">Events</Link>
          <Link href="/resources" className="hover:underline">Resources</Link>
          {/* <Link href="/news" className="hover:underline">News</Link> */}
          <Link href="/board" className="hover:underline">Board</Link>
          <Link href="/sponsorship" className="hover:underline">Sponsorship</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          {/* <Link href="/login" className="hover:underline">Login</Link> */}

        </div>
      </div>
    </nav>
  );
}
