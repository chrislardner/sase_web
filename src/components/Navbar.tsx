'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';

const LINKS = [
    { href: '/', label: 'Home' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/sponsorship', label: 'Sponsorship' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => setMounted(true), []);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 2);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleTheme = () => {
        if (!mounted) return;
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className={`nav-root ${scrolled ? 'has-shadow' : ''}`} aria-label="Main">
            <div className="nav-inner">
                <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
                    <span className="sr-only">SASE Home</span>

                    <Image
                        src="/logos/sase_dual_logo.png"
                        alt="SASE @ RHIT"
                        width={144}
                        height={40}
                        priority
                        className="h-10 w-auto"
                    />

                    <span
                        aria-hidden
                        className="hidden sm:block h-6 w-px bg-neutral-200 dark:bg-neutral-800"
                    />

                    <Image
                        src="/logos/R_logo_light.png"
                        alt="Rose-Hulman"
                        width={160}
                        height={40}
                        className="h-8 w-auto inline dark:hidden"
                    />
                    <Image
                        src="/logos/R_logo_dark.png"
                        alt="Rose-Hulman"
                        width={160}
                        height={40}
                        className="h-8 w-auto hidden dark:inline"
                    />
                </Link>

                <div className="nav-links">
                    {LINKS.map(({ href, label }) => {
                        const active = pathname === href || pathname?.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={active ? 'nav-link nav-link--active' : 'nav-link'}
                            >
                                {label}
                            </Link>
                        );
                    })}

                    <button type="button" onClick={toggleTheme} className="btn-icon" aria-label="Toggle dark mode">
                        {mounted && resolvedTheme === 'dark' ? <FaSun /> : <FaMoon />}
                    </button>
                </div>

                <div className="md:hidden">
                    <button
                        type="button"
                        onClick={() => setIsOpen(v => !v)}
                        className="nav-mobile-trigger"
                        aria-label="Toggle menu"
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            <div id="mobile-menu" className={`nav-mobile-panel ${isOpen ? 'block' : 'hidden'}`}>
                <div className="nav-mobile-list">
                    {LINKS.map(({ href, label }) => {
                        const active = pathname === href || pathname?.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={closeMenu}
                                className={active ? 'nav-mobile-link nav-mobile-link--active' : 'nav-mobile-link'}
                            >
                                {label}
                            </Link>
                        );
                    })}

                    <button
                        type="button"
                        onClick={() => {
                            toggleTheme();
                            closeMenu();
                        }}
                        className="btn-icon mt-1 w-full"
                        aria-label="Toggle dark mode"
                    >
                        {mounted && resolvedTheme === 'dark' ? <FaSun /> : <FaMoon />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
