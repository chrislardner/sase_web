import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {

    return (
        <div
            className="min-h-screen flex flex-col text-center">
            <div>
                <h1 className="text-4xl font-bold mb-4">Welcome to SASE @ Rose-Hulman</h1>
                <p className="mb-8">Insert catchy tagline about how amazing SASE @ Rose-Hulman borrowed from RHIT page
                    or SASE page</p>
                <div className="space-x-4">
                    <Link href="/events"
                          className="px-4 py-2 hover:underline">
                        Upcoming Events
                    </Link>
                    <Link href="/news"
                          className="px-4 py-2 hover:underline">
                        Latest News
                    </Link>
                    <Link href="/sponsorship"
                          className="px-4 py-2 hover:underline">
                        Sponsorship
                    </Link>
                </div>
            </div>
            <div className="relative w-full h-96 mt-8">
                <Image
                    src="https://placehold.co/1200x1000?text=Cover+Image"
                    alt="Cover Image"
                    fill
                    className="rounded object-cover"
                />
            </div>
            <div className="mt-8 text-left">
                <h2 className="text-2xl font-bold mb-4">About SASE @ Rose-Hulman</h2>
                <p className="mb-4">SASE @ Rose-Hulman is dedicated to promoting the personal and professional
                    development of Asian heritage scientists and engineers. We strive to create a welcoming community
                    that fosters growth, leadership, and success.</p>
                <p className="mb-4">Check out our <Link href="/sponsorship"
                                                        className="text-primary-light dark:text-primary-dark hover:underline">Sponsorship</Link> page
                    to learn how you can support our mission.</p>
                <p>Explore our other pages to learn more about our events, initiatives, and how you can get
                    involved!</p>
            </div>
        </div>
    );
}
