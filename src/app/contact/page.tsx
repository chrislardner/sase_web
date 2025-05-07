'use client';

export default function ConnectPage() {
    return (
        <div className="max-w-lg mx-auto min-h-screen">
            <h2 className="text-3xl font-bold mb-4">Connect with Us</h2>
            <p className="mb-4">
                We would love to hear from you! Follow us on social media or reach out through the following channels:
            </p>
            <ul className="space-y-2">
                <li>
                    <a href="https://instagram.com/example" className="text-blue-500 hover:underline">
                        Instagram
                    </a>
                </li>
                <li>
                    <a href="https://discord.com/example" className="text-blue-500 hover:underline">
                        Discord
                    </a>
                </li>
                <li>
                    <a href="mailto:rhit@saseconnect.org" className="text-blue-500 hover:underline">
                        Email Us
                    </a>
                </li>
            </ul>
        </div>
    );
}
