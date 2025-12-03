"use client";

type Tier = {
    id: "basic" | "premium";
    name: string;
    price: string;
    blurb?: string;
    perks: string[];
};

const TIERS: Tier[] = [
    {
        id: "basic",
        name: "Basic",
        price: "$300 / year",
        perks: [
            "Company name & logo on SASE RHIT website",
            "Access to SASE RHIT Resume Book",
            "Priority invite to host an information session or event for SASE members",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        price: "$500 / year",
        blurb: "Highest visibility & ongoing engagement.",
        perks: [
            "Everything in Basic",
            "Social media sponsorship highlight",
            "Company promoted weekly and at every event",
            "Recruiting materials distributed via weekly newsletter",
        ],
    },
];

const outlineBtn =
    "btn border bg-transparent hover:bg-black/5 text-black border-black/70 " +
    "dark:text-white dark:border-white/80 dark:hover:bg-white/10";

export default function SponsorshipPackages() {
    return (
        <section aria-labelledby="packages-title" className="surface-contrast surface-pad">
            <div className="mb-6 text-center">
                <h2 id="packages-title" className="text-3xl font-bold">Sponsorship Packages</h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                    One-year terms; recurring payments available. Instructions on how to donate are on our Sponsorship Packet (PDF).
                </p>
                <div className="mt-6 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    Sponsors are welcome to attend events and engage with students. Tax-deductible receipts can be issued via Rose-Hulman’s Business Office. For event-specific sponsorships, email <a className="underline" href="mailto:rhit@saseconnect.org">rhit@saseconnect.org</a>.
                </div>
            </div>

            <div role="table" aria-colcount={2} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {TIERS.map((t) => (
                    <div
                        key={t.id}
                        role="row"
                        className="rounded-2xl bg-white/80 dark:bg-neutral-900/70 border border-black/5 dark:border-white/10 shadow-lg p-5 md:p-6"
                    >
                        <div className="flex items-baseline justify-between gap-3">
                            <h3 role="columnheader" className="text-xl font-semibold">{t.name}</h3>
                            <span className="text-lg font-medium text-neutral-800 dark:text-neutral-200">{t.price}</span>
                        </div>
                        {t.blurb ? <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{t.blurb}</p> : null}

                        <ul className="mt-4 space-y-2">
                            {t.perks.map((p, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span aria-hidden className="mt-1">✓</span>
                                    <span className="leading-relaxed">{p}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <a
                                className={outlineBtn}
                                href="mailto:rhit@saseconnect.org"
                                aria-label={`Email SASE RHIT about the ${t.name} package`}
                            >
                                Email Us
                            </a>
                            <a
                                className={outlineBtn}
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.rose-hulman.edu/about-us/community-and-public-services/institutional-advancement/giving.html"
                                aria-label="Open Rose-Hulman giving page in a new tab"
                            >
                                Donate Online
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
