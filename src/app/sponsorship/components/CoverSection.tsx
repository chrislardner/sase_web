import React from 'react';
import Image from 'next/image';

const CoverSection = () => {
    return (
        <section className="w-full h-[60vh] relative fade-in">
            <Image 
                src="https://placehold.co/1200x600?text=Cover+Image"
                alt="Cover Image"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white">SASE Sponsorship</h1>
                <p className="mt-4 text-xl md:text-2xl text-white">Empowering future leaders in engineering</p>
            </div>
        </section>
    );
};

export default CoverSection;
