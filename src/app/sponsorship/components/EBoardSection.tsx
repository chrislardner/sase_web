import React from 'react';
import Image from 'next/image';

const EBoardSection = () => {
    return (
        <section className="mb-12 fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">Meet Our Executive Board</h2>
            <div className="flex justify-center">
                <Image
                    src="https://placehold.co/800x400?text=EBOARD+Group+Photo"
                    alt="Board Photo"
                    width={800}
                    height={400}
                    className="rounded-lg shadow-xl"
                />
            </div>
        </section>
    );
};

export default EBoardSection;
