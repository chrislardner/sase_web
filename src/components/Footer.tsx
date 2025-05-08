import Image from 'next/image';
import Link from 'next/link';
import {FaDiscord, FaInstagram} from 'react-icons/fa';
import saseFlask from '../../public/saseFlask.svg';
import rhitLogo from '../../public/rhitLogo.svg';

export default function Footer() {
    return (
        <footer className="mt-auto py-7 bg-gray-500 text-white">
            <div className="container mx-auto flex flex-col items-center justify-between md:flex-row px-4 md:px-8">
                <div className="mb-6 flex flex-col items-center md:mb-0">
                    <div className="mb-6 flex items-center">
                        <Image src={saseFlask} alt="Logo" width={64} className="h-auto"/>
                        <Image src={rhitLogo} alt="Logo" width={256} className="h-auto"/>
                    </div>
                    <div className="flex items-center justify-center gap-6">
                        <a href="www.instagram.com/saserhit" target="_blank" rel="noopener noreferrer"
                           className="h-6 w-6 transition-transform hover:scale-110">
                            <FaInstagram className="text-3xl"/>
                        </a>
                        <a href="https://discord.com/invite/cJZu2ERVyS" target="_blank" rel="noopener noreferrer"
                           className="h-6 w-6 transition-transform hover:scale-110">
                            <FaDiscord className="text-3xl"/>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-end">
                    <div className="mb-4 flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                        <Link href="/events"
                              className="transition-all hover:underline">Events</Link>
                        <Link href="/sponsorship"
                              className="transition-all hover:underline">Sponsorship</Link>
                        <Link href="/contact"
                              className="transition-all hover:underline">Contact
                            Us</Link>
                    </div>
                    <div className="flex flex-col items-center md:flex-row md:items-center">
                        <div className="h-0.5 w-[350px]"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
