"use client";

import React from 'react';
import Head from 'next/head';
import CoverSection from './components/CoverSection';
import Header from './components/HeaderSection';
import PresidentsMessage from './components/PresidentsMessage';
import EBoardSection from './components/EBoardSection';
import ImpactStatistics from './components/ImpactStatistics';
import EventHighlights from './components/EventHighlights';
import SponsorshipPackages from './components/SponsorshipPackages';

const SponsorshipPage = () => {
    return (
        <>
            <Head>
                <title>SASE Sponsorship - Rose-Hulman</title>
                <meta name="description"
                      content="Learn about sponsorship opportunities with SASE at Rose-Hulman and help empower the next generation of engineers."/>
            </Head>
            <div
                className="min-h-screen">
                <CoverSection/>
                <div className="container mx-auto p-6">
                    <Header/>
                    <PresidentsMessage/>
                    <EBoardSection/>
                    <ImpactStatistics/>
                    <EventHighlights/>
                    <SponsorshipPackages/>
                </div>
            </div>
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
};

export default SponsorshipPage;
