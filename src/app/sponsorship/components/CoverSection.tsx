import React from 'react';
import Image from 'next/image';
import { HERO_IMAGES } from '@/app/lib/images';

const CoverSection = () => {
    return (
        <section className="w-full h-[60vh] relative fade-in">
            <Image
                src={HERO_IMAGES.cover}
                alt="SASE RHIT Cover Image"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute text-white inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
                    SASE Sponsorship
                </h1>
                <p className="mt-4 text-xl md:text-2xl drop-shadow-md">
                    Empowering future leaders in engineering
                </p>
            </div>
        </section>
    );
};

export default CoverSection;