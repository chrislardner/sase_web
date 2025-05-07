import React from 'react';
import Image from 'next/image';

const EventHighlights = () => {
    return (
        <section className="mb-12 fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Event Highlights</h2>
            <div className="space-y-12 dark:text-text-light">
                <div className="p-4 bg-primary-light dark:bg-primary-dark rounded-lg shadow-lg transform transition">
                    <h3 className="text-2xl font-bold mb-4 text-center text-white">National Conference</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <Image
                                src="https://placehold.co/800x600?text=National+1"
                                alt="National Conference Image 1"
                                width={800}
                                height={600}
                                className="object-cover rounded-lg w-full"
                            />
                        </div>
                        <div className="space-y-4">
                            <Image
                                src="https://placehold.co/400x300?text=National+2"
                                alt="National Conference Image 2"
                                width={400}
                                height={300}
                                className="object-cover rounded-lg w-full"
                            />
                            <Image
                                src="https://placehold.co/400x300?text=National+3"
                                alt="National Conference Image 3"
                                width={400}
                                height={300}
                                className="object-cover rounded-lg w-full"
                            />
                        </div>
                    </div>
                    <p className="mt-4 text-center text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                    </p>
                </div>

                <div
                    className="p-4 bg-secondary-light dark:bg-secondary-dark rounded-lg shadow-lg transform transition">
                    <h3 className="text-2xl font-bold mb-4 text-center text-white">Regional Conference</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Image
                            src="https://placehold.co/300x200?text=Regional+1"
                            alt="Regional Conference Image 1"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg w-full"
                        />
                        <Image
                            src="https://placehold.co/300x200?text=Regional+2"
                            alt="Regional Conference Image 2"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg w-full"
                        />
                        <Image
                            src="https://placehold.co/300x200?text=Regional+3"
                            alt="Regional Conference Image 3"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg w-full"
                        />
                        <Image
                            src="https://placehold.co/300x200?text=Regional+4"
                            alt="Regional Conference Image 4"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg w-full"
                        />
                    </div>
                    <p className="mt-4 text-center text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                    </p>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg shadow-lg transform transition">
                    <h3 className="text-2xl font-bold mb-4 text-center text-white">Professional Development</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex justify-center">
                            <Image
                                src="https://placehold.co/250?text=PD+1"
                                alt="Professional Development Image 1"
                                width={250}
                                height={250}
                                className="object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex justify-center">
                            <Image
                                src="https://placehold.co/250?text=PD+2"
                                alt="Professional Development Image 2"
                                width={250}
                                height={250}
                                className="object-cover rounded-lg"
                            />
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                            <p className="text-center text-white">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg transform transition">
                    <h3 className="text-2xl font-bold mb-4 text-center text-text-light dark:text-white">Cultural
                        Events</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Image
                            src="https://placehold.co/300x200?text=Cultural+1"
                            alt="Cultural Event Image 1"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg w-full"
                        />
                        <Image
                            src="https://placehold.co/300x200?text=Cultural+2"
                            alt="Cultural Event Image 2"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg w-full"
                        />
                        <Image
                            src="https://placehold.co/300x200?text=Cultural+3"
                            alt="Cultural Event Image 3"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg w-full"
                        />
                        <Image
                            src="https://placehold.co/300x200?text=Cultural+4"
                            alt="Cultural Event Image 4"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg w-full"
                        />
                    </div>
                    <p className="mt-4 text-center text-text-light dark:text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default EventHighlights;