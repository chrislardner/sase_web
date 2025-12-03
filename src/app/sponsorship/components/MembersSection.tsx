import React from 'react';
import Image from 'next/image';
import { SECTION_IMAGES } from '@/app/lib/images';

const MembersSection = () => {
    return (
        <section className="mb-12 fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">Meet Our SASE Community</h2>
            <div className="flex justify-center">
                <Image
                    src={SECTION_IMAGES.members}
                    alt="SASE Members Photo"
                    width={800}
                    height={400}
                    className="rounded-lg shadow-xl object-cover"
                />
            </div>
        </section>
    );
};

export default MembersSection;