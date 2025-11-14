"use client";

import { useEffect, useMemo, useState } from "react";

export default function SectionPager({
                                         sections = [
                                             { id: "intro", label: "Intro" },
                                             { id: "members", label: "Members" },
                                             { id: "events", label: "Events" },
                                             { id: "packages", label: "Sponsorship" },
                                             { id: "packages-pdf", label: "Sponsorship PDF" },

                                         ],
                                         offset = 72,
                                     }: {
    sections?: { id: string; label: string }[];
    offset?: number;
}) {
    const [active, setActive] = useState<string>(sections[0]?.id ?? "");
    const index = useMemo(
        () => Math.max(0, sections.findIndex((s) => s.id === active)),
        [active, sections]
    );

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            {
                rootMargin: `${-offset}px 0px -70% 0px`,
                threshold: 0.01,
            }
        );
        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [sections, offset]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - offset - 8;
        window.scrollTo({ top: y, behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
    };

    const goUp = () => {
        if (index <= 0) return;
        scrollTo(sections[index - 1].id);
    };
    const goDown = () => {
        if (index >= sections.length - 1) return;
        scrollTo(sections[index + 1].id);
    };

    const isTop = index <= 0;
    const isBottom = index >= sections.length - 1;

    return (
        <div
            className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40 pointer-events-none"
            aria-label="Section pager"
        >
            <div className="flex flex-col gap-2 pointer-events-auto">
                <button
                    type="button"
                    onClick={goUp}
                    disabled={isTop}
                    aria-label="Previous section"
                    aria-current={isTop ? "page" : undefined}
                    className={`btn btn-icon rounded-full shadow-lg ${
                        isTop ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    title={isTop ? "Top" : `Go to ${sections[index - 1]?.label ?? ""}`}
                >
                    ↑
                </button>

                <button
                    type="button"
                    onClick={goDown}
                    disabled={isBottom}
                    aria-label="Next section"
                    className={`btn btn-icon rounded-full shadow-lg ${
                        isBottom ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    title={isBottom ? "Bottom" : `Go to ${sections[index + 1]?.label ?? ""}`}
                >
                    ↓
                </button>
            </div>
        </div>
    );
}
