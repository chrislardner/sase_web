'use client';

import React from 'react';
import {DonutChart, type DonutDatum,} from './DonutChart';

const YEAR_DATA: DonutDatum[] = [
    {code: 'SO', label: 'Sophomore', value: 59},
    {code: 'SR', label: 'Senior', value: 43},
    {code: 'JR', label: 'Junior', value: 43},
    {code: 'FR', label: 'Freshman', value: 27},
];

export default function YearChart() {
    return (
        <DonutChart
            title="Class Year Breakdown"
            subtitle="Freshman through Senior representation in SASE@RHIT."
            ariaLabel="Distribution of SASE members by class year"
            data={YEAR_DATA}
            valueUnit="members"
            totalLabel="Members by Class Year"
        />
    );
}