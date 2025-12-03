'use client';

import { FaSchool, FaInstagram, FaEnvelope, FaGithub } from 'react-icons/fa';

export default function ContactPage() {
    return (
        <main className="page-shell">
            <h1 className="h1-title text-center">Connect with Us</h1>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                    href="https://instagram.com/saserhit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-icon w-full sm:w-auto inline-flex items-center gap-2"
                >
                    <FaInstagram /> <span>Instagram</span>
                </a>
                <a
                    href="https://rosehulman.campusgroups.com/feeds?type=club&type_id=35480&tab=about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-icon w-full sm:w-auto inline-flex items-center gap-2"
                >
                    <FaSchool /> <span>Join On CampusGroups</span>
                </a>
                <a
                    href="mailto:rhit@saseconnect.org"
                    className="btn btn-icon w-full sm:w-auto inline-flex items-center gap-2"
                >
                    <FaEnvelope /> <span>Email Us</span>
                </a>
                <a
                    href="https://github.com/chrislardner/sase_web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-icon w-full sm:w-auto inline-flex items-center gap-2"
                >
                    <FaGithub /> <span>Contribute on GitHub</span>
                </a>
            </div>

            <section className="mt-16 max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-semibold">Give to SASE</h2>
                <p className="mt-3 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Your support helps us run social and cultural events, professional workshops, community
                    service projects, and national conference travel open to all of the Rose-Hulman campus.
                    Every contribution strengthens the SASE community at Rose-Hulman.
                </p>
                <a
                    href="https://www.rose-hulman.edu/about-us/community-and-public-services/institutional-advancement/giving.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 btn btn-primary w-full sm:w-auto inline-block"
                >
                    Donate to SASE RHIT
                </a>
            </section>
        </main>
    );
}
