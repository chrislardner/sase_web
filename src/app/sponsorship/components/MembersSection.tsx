import React from 'react';
import Image from 'next/image';

const MembersSection = () => {
    return (
        <section className="mb-12 fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">Meet Our SASE Community</h2>
            <div className="flex justify-center">
                <Image
                    src="/event_images/2024/social/Graduation_S24_1.jpg"
                    alt="Members Photo"
                    width={800}
                    height={400}
                    className="rounded-lg shadow-xl"
                />
            </div>
        </section>
    );
};

export default MembersSection;
