import React from 'react';
import Image from 'next/image';
import {FaGraduationCap, FaUsers} from 'react-icons/fa';

const ImpactStatistics = () => {
    return (
        <section
            className="mb-12 p-8 rounded-lg shadow-xl transform transition-all fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-center">Our Impact in Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-3">
                    <Image
                        src="https://placehold.co/1200x600?text=Main+Chart"
                        alt="Main Chart"
                        width={1200}
                        height={600}
                        className="object-cover rounded-lg shadow-md"
                    />
                </div>
                <div
                    className="lg:col-span-1 flex flex-col items-center justify-center rounded-lg shadow-md p-8">
                    <FaUsers className="text-6xl mb-4"/>
                    <p className="text-4xl font-bold">25,500+</p>
                    <p className="text-xl">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="lg:col-span-2">
                    <Image
                        src="https://placehold.co/800x400?text=Chart+2"
                        alt="Chart 2"
                        width={800}
                        height={400}
                        className="object-cover rounded-lg shadow-md"
                    />
                </div>
                <div className="lg:col-span-2">
                    <Image
                        src="https://placehold.co/800x400?text=Chart+3"
                        alt="Chart 3"
                        width={800}
                        height={400}
                        className="object-cover rounded-lg shadow-md"
                    />
                </div>
                <div
                    className="lg:col-span-1 flex flex-col items-center justify-center rounded-lg shadow-md p-8">
                    <FaGraduationCap className="text-6xl mb-4"/>
                    <p className="text-4xl font-bold">3.99</p>
                    <p className="text-xl">Lorem ipsum dolor sit amet</p>
                </div>
            </div>
            <p className="mt-8 text-center text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus
                ante dapibus diam.
            </p>
        </section>
    );
};

export default ImpactStatistics;
