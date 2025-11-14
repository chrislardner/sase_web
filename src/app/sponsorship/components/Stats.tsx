import React from 'react';
import Image from 'next/image';

const Stats = () => {
    return (
        <section
            className="mb-12 p-8 rounded-lg shadow-xl transform transition-all fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-center">Our Impact in Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-3">
                    <Image
                        src="/sponsorship/2025/charts/Majors_F25.png"
                        alt="Main Chart"
                        width={1200}
                        height={600}
                        className="object-cover rounded-lg shadow-md"
                    />
                </div>
            </div>
            <p className="mt-8 text-center text-xl">

            </p>
        </section>
    );
};

export default Stats;
