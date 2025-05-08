import React from 'react';
import Image from 'next/image';

const PresidentsMessage = () => {
    return (
        <section className="mb-12 p-8 rounded-lg shadow-xl transform transition fade-in">
            <h2 className="text-3xl font-bold mb-4">Message from the President</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Image
                    src="https://placehold.co/400x450?text=President+Portrait"
                    alt="President Portrait"
                    width={400}
                    height={450}
                    className="rounded-lg"
                />
                <p className="text-lg leading-relaxed md:col-span-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                    vestibulum.
                    Cras venenatis euismod malesuada. Nullam ac erat ante. Sed vel urna at dui iaculis consequat.
                    Curabitur nec nisl odio. Mauris vehicula at nunc id posuere. Praesent non nisi sed eros tincidunt
                    tempor.
                    Donec sit amet eros sit amet risus ultricies gravida. Integer ac sem vel ex vehicula lacinia.
                    Suspendisse potenti. Proin ut dui sed metus pharetra hendrerit. Ut id lorem at libero malesuada
                    feugiat.
                    Nulla facilisi. Donec fringilla, lorem at fermentum egestas, felis leo scelerisque mauris, sit amet
                    ultricies velit magna nec lorem. Sed ac magna sit amet risus tristique interdum. Integer nec libero
                    venenatis, aliquam mauris quis, blandit nulla. Nulla facilisi. Duis aliquet egestas purus in
                    blandit.
                    Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna
                    sit
                    amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                    himenaeos.
                </p>
            </div>
        </section>
    );
};

export default PresidentsMessage;
