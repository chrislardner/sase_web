import EventHighlights from "./components/EventHighlights/index";
import Header from "@/app/sponsorship/components/HeaderSection";
import CoverSection from "@/app/sponsorship/components/CoverSection";
import EBoardSection from "@/app/sponsorship/components/EBoardSection";
import ImpactStatistics from "@/app/sponsorship/components/ImpactStatistics";
import SponsorshipPackages from "@/app/sponsorship/components/SponsorshipPackages";
import SectionPager from "./components/SectionPager";

export default function SponsorshipPage() {
    return (
        <>
            <CoverSection />
            <SectionPager
                // optional: customize IDs if you named them differently
                sections={[
                    { id: "intro", label: "Intro" },
                    { id: "eboard-impact", label: "E-Board & Impact" },
                    { id: "events", label: "Events" },
                    { id: "packages", label: "Sponsorship" },
                ]}
                offset={72}
            />
            <div className="container mx-auto p-6">
                <section id="intro">
                    <Header />
                </section>

                <section id="eboard-impact">
                    <EBoardSection />
                    <ImpactStatistics />
                </section>

                <EventHighlights />

                <section id="packages">
                    <SponsorshipPackages />
                </section>
            </div>
        </>
    );
}
