import React from 'react';

const SponsorshipPackages = () => {
    return (
        <section
            className="mb-12 p-8 rounded-lg shadow-xl transform transition hover:scale-105 fade-in">
            <h2 className="text-3xl font-bold mb-4 text-center">How to Contribute & Sponsorship Packages</h2>
            <p className="text-lg mb-6 text-center">
                Your sponsorship makes a significant impact. Choose from our exclusive packages:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg shadow hover:shadow-xl transition">
                    <h3 className="text-2xl font-bold mb-2 text-center">Bronze Package</h3>
                    <p className="mt-2 text-center">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
                <div className="p-4 rounded-lg shadow hover:shadow-xl transition">
                    <h3 className="text-2xl font-bold mb-2 text-center">Silver Package</h3>
                    <p className="mt-2 text-center">
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>
                <div className="p-4 rounded-lg shadow hover:shadow-xl transition">
                    <h3 className="text-2xl font-bold mb-2 text-center">Gold Package</h3>
                    <p className="mt-2 text-center">
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </div>
            </div>
            <div
                className="mt-12 p-8 rounded-lg shadow hover:shadow-xl transform transition hover:scale-105">
                <h3 className="text-4xl font-bold mb-4 text-center">Diamond Package</h3>
                <p className="mt-2 text-center text-lg">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur.
                </p>
            </div>
            <p className="mt-6 text-center">Thank you for your support!</p>
        </section>
    );
};

export default SponsorshipPackages;
