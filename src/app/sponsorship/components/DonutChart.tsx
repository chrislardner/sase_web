'use client';

import React, {useState} from 'react';

export type DonutDatum = {
    code: string;
    label: string;
    value: number;
};

export interface DonutChartProps {
    title: string;
    subtitle?: string;
    ariaLabel: string;
    data: DonutDatum[];
    valueUnit?: string;
    totalLabel?: string;
}

const CHART_COLORS = [
    '#2563EB', // blue
    '#16A34A', // green
    '#F97316', // orange
    '#DC2626', // red
    '#7C3AED', // purple
    '#0D9488', // teal
    '#F59E0B', // amber
    '#EC4899', // pink
    '#0891B2', // light teal
    '#6366F1', // indigo
    '#22C55E', // emerald
    '#FB7185', // rose
    '#84CC16', // lime
    '#A855F7', // violet
    '#14B8A6', // cyan
    '#4B5563', // gray
];

const RADIUS = 115;
const THICKNESS = 60;
const CX = 150;
const CY = 150;
const CIRC = 2 * Math.PI * RADIUS;
const INNER_RADIUS = RADIUS - THICKNESS + 6;

export function DonutChart(props: DonutChartProps) {
    const {
        title,
        subtitle,
        ariaLabel,
        data,
        valueUnit = 'members',
        totalLabel = 'Total',
    } = props;

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const DATA = data
        .filter((d) => d.value > 0)
        .sort((a, b) => b.value - a.value);

    const total = DATA.reduce((sum, d) => sum + d.value, 0);

    if (total === 0 || DATA.length === 0) {
        return (
            <section className="card h-full">
                <div className="card-body flex flex-col items-center justify-center gap-1 text-center">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {subtitle && <p className="card-subtle text-sm">{subtitle}</p>}
                    <p className="card-subtle text-sm mt-2">
                        No data available yet.
                    </p>
                </div>
            </section>
        );
    }

    const active = activeIndex != null ? DATA[activeIndex] : null;
    const activePct = active ? (active.value / total) * 100 : null;

    let offset = 0;

    return (
        <section className="card h-full">
            <div className="card-body flex flex-col gap-6 md:flex-row">
                <div className="flex items-center justify-center md:basis-1/2">
                    <svg
                        viewBox="0 0 300 300"
                        role="img"
                        aria-label={ariaLabel}
                        className="w-full max-w-xs md:max-w-sm"
                    >
                        <circle
                            cx={CX}
                            cy={CY}
                            r={RADIUS}
                            fill="none"
                            stroke="rgba(148, 163, 184, 0.20)"
                            strokeWidth={THICKNESS}
                        />

                        {DATA.map((d, i) => {
                            const fraction = d.value / total;
                            const length = fraction * CIRC;
                            const dashArray = `${length} ${CIRC}`;
                            const dashOffset = -offset;
                            offset += length;

                            const isActive = i === activeIndex;

                            return (
                                <circle
                                    key={d.code}
                                    cx={CX}
                                    cy={CY}
                                    r={RADIUS}
                                    fill="none"
                                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                                    strokeWidth={isActive ? THICKNESS + 6 : THICKNESS}
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={dashOffset}
                                    strokeLinecap="butt"
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'stroke-width 120ms ease, opacity 120ms ease',
                                        opacity: activeIndex == null || isActive ? 1 : 0.6,
                                    }}
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    <title>
                                        {`${d.label} (${d.code}): ${d.value} ${valueUnit} (${(
                                            fraction * 100
                                        ).toFixed(1)}%)`}
                                    </title>
                                </circle>
                            );
                        })}

                        <circle
                            cx={CX}
                            cy={CY}
                            r={INNER_RADIUS}
                            fill="var(--bg-page)"
                        />

                        <g
                            transform={`translate(${CX}, ${CY})`}
                            textAnchor="middle"
                            className="fill-current"
                        >
                            {active ? (
                                <>
                                    <text
                                        y={-16}
                                        style={{fontSize: '15px', fontWeight: 600}}
                                    >
                                        {active.label}
                                    </text>
                                    <text
                                        y={2}
                                        style={{fontSize: '11px', opacity: 0.85}}
                                    >
                                        {active.value} {valueUnit}
                                    </text>
                                    <text
                                        y={20}
                                        style={{fontSize: '11px', opacity: 0.85}}
                                    >
                                        {activePct!.toFixed(1)}%
                                    </text>
                                </>
                            ) : (
                                <>
                                    <text
                                        y={-6}
                                        style={{fontSize: '18px', fontWeight: 600}}
                                    >
                                        {total}
                                    </text>
                                    <text
                                        y={14}
                                        style={{fontSize: '11px', opacity: 0.8}}
                                    >
                                        {totalLabel}
                                    </text>
                                </>
                            )}
                        </g>
                    </svg>
                </div>

                <div className="md:basis-1/2 flex flex-col justify-center gap-3">
                    <h3 className="text-lg font-semibold mb-1">{title}</h3>
                    {subtitle && (
                        <p className="card-subtle text-sm mb-2">
                            {subtitle}
                        </p>
                    )}

                    <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1 text-sm">
                        {DATA.map((d, i) => {
                            const pct = (d.value / total) * 100;
                            const isActive = i === activeIndex;
                            return (
                                <li
                                    key={d.code}
                                    className="flex items-center justify-between gap-3"
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                    style={{cursor: 'default'}}
                                >
                                    <div className="flex items-center gap-2">
                    <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                            backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                            boxShadow: isActive
                                ? '0 0 0 2px rgba(0,0,0,0.25)'
                                : 'none',
                        }}
                    />
                                        <span className="font-medium">{d.code}</span>
                                        <span className="card-subtle text-xs">
                      {d.label}
                    </span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold tabular-nums">
                      {d.value}
                    </span>
                                        <span className="card-subtle text-xs tabular-nums">
                      {pct.toFixed(1)}%
                    </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}
