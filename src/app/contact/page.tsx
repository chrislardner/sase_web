'use client';

import { FaSchool, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function ContactPage() {
    return (
        <main className="page-shell">
            <h1 className="h1-title text-center">Connect with Us</h1>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
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
                    href="https://instagram.com/saserhit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-icon w-full sm:w-auto inline-flex items-center gap-2"
                >
                    <FaInstagram /> <span>Instagram</span>
                </a>
            </div>
        </main>
    );
}
