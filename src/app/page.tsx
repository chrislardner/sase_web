'use client';

import Link from 'next/link';
import Image from 'next/image';
import {FaBriefcase, FaCalendarAlt, FaHandHoldingHeart, FaUsers,} from 'react-icons/fa';

export default function HomePage() {
    return (<main className="page-shell">
        <header className="text-center">
            <h1 className="h1-title">SASE @ RHIT</h1>
            <p className="lead mt-2">Society of Asian Scientists &amp; Engineers at Rose-Hulman Institute of Technology</p>
            <div className="mt-0.5 flex items-center justify-center">
                <nav className="cta-row">
                    <Link href="/calendar" className="btn btn-ghost">Calendar</Link>
                    <Link href="/contact" className="btn btn-ghost">Contact Us</Link>
                    <Link href="/puzzle" className="btn btn-ghost">Word Puzzle</Link>
                </nav>
            </div>
        </header>


        <div className="mt-6 overflow-hidden rounded-lg shadow">
            <Image
                src="/images/Speed_Lake_2.webp"
                alt="SASE at Rose-Hulman"
                width={1920}
                height={1080}
                priority
                sizes="100vw"
                className="w-full h-[20rem] md:h-[26rem] lg:h-[30rem] object-cover"
            />
        </div>

        <section className="section">
            <h2 className="text-2xl font-bold mb-4">Our Pillars</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <li className="flex items-start gap-3">
                    <FaBriefcase className="mt-1" aria-hidden/>
                    <div>
                        <h3 className="font-semibold">Professional Development</h3>
                        <p className="card-subtle text-sm">Workshops, mentorship, and career events.</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <FaUsers className="mt-1" aria-hidden/>
                    <div>
                        <h3 className="font-semibold">Cultural Awareness</h3>
                        <p className="card-subtle text-sm">Celebrate and share diverse experiences.</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <FaHandHoldingHeart className="mt-1" aria-hidden/>
                    <div>
                        <h3 className="font-semibold">Community Service</h3>
                        <p className="card-subtle text-sm">Give back through local service projects.</p>
                    </div>
                </li>
            </ul>
        </section>

        <section className="section">
            <h2 className="text-2xl font-bold mb-4">What We Do</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-2">
                    <FaCalendarAlt className="mt-0.5" aria-hidden/>
                    <span>Weekly meetings & skill-building workshops.</span>
                </li>
                <li className="flex items-start gap-2">
                    <FaBriefcase className="mt-0.5" aria-hidden/>
                    <span>Resume reviews, mock interviews, and industry nights.</span>
                </li>
                <li className="flex items-start gap-2">
                    <FaUsers className="mt-0.5" aria-hidden/>
                    <span>Cultural socials, game nights, and mentorship.</span>
                </li>
                <li className="flex items-start gap-2">
                    <FaHandHoldingHeart className="mt-0.5" aria-hidden/>
                    <span>Service projects and outreach in our local community.</span>
                </li>
            </ul>
        </section>
    </main>);
}
