"use client";

type Props = {
    href?: string;
    title?: string;
    subtitle?: string;
};

const outlineBtn =
    "btn border bg-transparent hover:bg-black/5 text-black border-black/70 " +
    "dark:text-white dark:border-white/80 dark:hover:bg-white/10";

export default function SponsorshipPDFSection({
                                                  href = "/sponsorship/2025/SASE_Sponsorship_Document_2025_2026.pdf",
                                                  title = "Sponsorship Packet (PDF)",
                                                  subtitle = "Download or open our 2025–2026 sponsorship overview.",
                                              }: Props) {
    return (
        <section id="pdf">
            <div className="surface-contrast surface-pad text-center space-y-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{subtitle}</p>

                <div className="flex flex-wrap justify-center gap-3">
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-accent text-base md:text-lg px-6 py-3"
                        aria-label="Open sponsorship PDF in a new tab"
                    >
                        Open PDF
                    </a>

                    <a
                        href={href}
                        download
                        className={outlineBtn + " text-base md:text-lg px-6 py-3"}
                        aria-label="Download the sponsorship PDF"
                    >
                        Download
                    </a>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    PDF opens in a new tab; use the “Download” button for a local copy.
                </p>
            </div>
        </section>
    );
}
