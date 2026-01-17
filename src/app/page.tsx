'use client';

import Link from 'next/link';
import Image from 'next/image';
import {FaBriefcase, FaCalendarAlt, FaHandHoldingHeart, FaUsers,} from 'react-icons/fa';

export default function HomePage() {
    return (
        <main className="page-shell space-y-12">
            <header className="text-center space-y-2">
                <h1 className="h1-title">SASE @ RHIT</h1>
                <p className="lead">
                    Society of Asian Scientists &amp; Engineers at Rose-Hulman Institute of Technology
                </p>

                <nav className="cta-row justify-center pt-1">
                    <Link href="/calendar" className="btn btn-ghost">
                        Calendar
                    </Link>
                    <Link href="/contact" className="btn btn-ghost">
                        Contact Us
                    </Link>
                </nav>
            </header>

            <div className="overflow-hidden rounded-lg shadow">
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

                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <li className="flex items-start gap-3">
                        <FaBriefcase
                            className="mt-1 text-rhit-red-600 dark:text-rhit-red-400"
                            aria-hidden
                        />
                        <div>
                            <h3 className="font-semibold">Professional Development</h3>
                            <p className="card-subtle text-sm">
                                Workshops, mentorship, and career events.
                            </p>
                        </div>
                    </li>

                    <li className="flex items-start gap-3">
                        <FaUsers
                            className="mt-1 text-sase-blue-600 dark:text-sase-blue-400"
                            aria-hidden
                        />
                        <div>
                            <h3 className="font-semibold">Cultural Awareness</h3>
                            <p className="card-subtle text-sm">
                                Celebrate and share diverse experiences.
                            </p>
                        </div>
                    </li>

                    <li className="flex items-start gap-3">
                        <FaHandHoldingHeart
                            className="mt-1 text-sase-green-600 dark:text-sase-green-400"
                            aria-hidden
                        />
                        <div>
                            <h3 className="font-semibold">Community Service</h3>
                            <p className="card-subtle text-sm">
                                Give back through local service projects.
                            </p>
                        </div>
                    </li>
                </ul>
            </section>

            <section className="section">
                <h2 className="text-2xl font-bold mb-4">What We Do</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <li className="flex items-start gap-2">
                        <FaCalendarAlt
                            className="mt-0.5 text-rhit-red-600 dark:text-rhit-red-400"
                            aria-hidden
                        />
                        <span>Weekly meetings &amp; skill-building workshops.</span>
                    </li>

                    <li className="flex items-start gap-2">
                        <FaBriefcase
                            className="mt-0.5 text-sase-blue-600 dark:text-sase-blue-400"
                            aria-hidden
                        />
                        <span>
              Resume reviews, mock interviews, and industry nights.
            </span>
                    </li>

                    <li className="flex items-start gap-2">
                        <FaUsers
                            className="mt-0.5 text-sase-blue-600 dark:text-sase-blue-400"
                            aria-hidden
                        />
                        <span>
              Cultural socials, game nights, and mentorship.
            </span>
                    </li>

                    <li className="flex items-start gap-2">
                        <FaHandHoldingHeart
                            className="mt-0.5 text-sase-green-600 dark:text-sase-green-400"
                            aria-hidden
                        />
                        <span>
              Service projects and outreach in our local community.
            </span>
                    </li>
                </ul>
            </section>
        </main>
    );
}
