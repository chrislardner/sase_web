'use client';

import React from 'react';
import {DonutChart, type DonutDatum,} from './DonutChart';

const MAJOR_DATA: DonutDatum[] = [
    {code: 'EE', label: 'Electrical Engineering', value: 14},
    {code: 'MA', label: 'Mathematics', value: 0},
    {code: 'ME', label: 'Mechanical Engineering', value: 36},
    {code: 'BE', label: 'Biomedical Engineering', value: 14},
    {code: 'CHE', label: 'Chemical Engineering', value: 17},
    {code: 'CE', label: 'Civil Engineering', value: 4},
    {code: 'CS', label: 'Computer Science', value: 46},
    {code: 'ENGD', label: 'Engineering Design', value: 5},
    {code: 'BC', label: 'Biochemistry', value: 1},
    {code: 'SE', label: 'Software Engineering', value: 8},
    {code: 'CPE', label: 'Computer Engineering', value: 14},
    {code: 'EMGT', label: 'Engineering Management', value: 1},
    {code: 'NE', label: 'NanoEngineering', value: 0},
    {code: 'ICS', label: 'International CS', value: 0},
    {code: 'PH', label: 'Physics', value: 2},
    {code: 'CHEM', label: 'Chemistry', value: 4},
    {code: 'BIO', label: 'Biology', value: 2},
    {code: 'BMTH', label: 'Biomathematics', value: 0},
    {code: 'OE', label: 'Optical Engineering', value: 4},
];

export default function MajorsChart() {
    return (
        <DonutChart
            title="Member Majors Snapshot"
            subtitle="Represents self-reported majors across SASE@RHIT members."
            ariaLabel="Distribution of SASE members by major"
            data={MAJOR_DATA}
            valueUnit="members"
            totalLabel="Members by Major"
        />
    );
}
