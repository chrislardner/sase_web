import React from 'react';
import MajorsChart from "@/app/sponsorship/components/MajorsChart";
import YearChart from "@/app/sponsorship/components/YearsChart";

const Stats = () => {
    return (
        <section
            className="mb-12 p-8 rounded-lg shadow-xl transform transition-all fade-in">
            <div className=" gap-8">
                <MajorsChart />
                <YearChart />
            </div>
            <p className="mt-8 text-center text-xl">

            </p>
        </section>
    );
};

export default Stats;