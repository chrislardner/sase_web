'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import fullSASElogo from '../../public/fullSASElogo.svg';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/events" className="hover:underline">Events</Link>
          <Link href="/resources" className="hover:underline">Resources</Link>
          <Link href="/board" className="hover:underline">Board</Link>
          <Link href="/sponsorship" className="hover:underline">Sponsorship</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <button onClick={toggleDarkMode} className="px-2 py-2 border-2 rounded">
            {isDark ? <FaMoon /> : <FaSun />}
          </button>
        </div>
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-2">
          <Link href="/events" className="block px-2 py-1 hover:underline">Events</Link>
          <Link href="/resources" className="block px-2 py-1 hover:underline">Resources</Link>
          <Link href="/board" className="block px-2 py-1 hover:underline">Board</Link>
          <Link href="/sponsorship" className="block px-2 py-1 hover:underline">Sponsorship</Link>
          <Link href="/contact" className="block px-2 py-1 hover:underline">Contact</Link>
          <button onClick={toggleDarkMode} className="px-2 py-2 border-2 rounded">
            {isDark ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      )}
    </nav>
  );
}
