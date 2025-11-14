import EventHighlights from "./components/EventHighlights/index";
import Header from "@/app/sponsorship/components/HeaderSection";
import CoverSection from "@/app/sponsorship/components/CoverSection";
import MembersSection from "@/app/sponsorship/components/MembersSection";
import Stats from "@/app/sponsorship/components/Stats";
import SponsorshipPackages from "@/app/sponsorship/components/SponsorshipPackages";
import SectionPager from "./components/SectionPager";
import SponsorshipPDFSection from "@/app/sponsorship/components/SponsorshipPDFSection";

export default function SponsorshipPage() {
    return (
        <>
            <CoverSection />
            <SectionPager
                sections={[
                    { id: "intro", label: "Intro" },
                    { id: "members", label: "Members" },
                    { id: "events", label: "Events" },
                    { id: "packages", label: "Sponsorship" },
                    { id: "packages-pdf", label: "Sponsorship PDF" },
                ]}
                offset={72}
            />
            <div className="container mx-auto p-6">
                <section id="intro">
                    <Header />
                </section>

                <section id="members">
                    <MembersSection />
                    <Stats />
                </section>

                <EventHighlights />

                <section id="packages">
                    <SponsorshipPackages />
                </section>
                <section id="package-pdf">
                    <SponsorshipPDFSection />
                </section>
            </div>
        </>
    );
}
