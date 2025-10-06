import Image from "next/image";
import { FaSchool, FaInstagram, FaEnvelope, FaGithub } from "react-icons/fa";
import { Tooltip } from "@/components/Tooltip";
import saseFlask from "../../public/saseFlask.svg";
import rhitLogo from "../../public/rhit_logo.png";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer-root">
            <div className="footer-inner">
                <div className="footer-brand">
                    <Image src={saseFlask} alt="SASE Flask" width={64} className="h-auto" />
                    <Image src={rhitLogo} alt="RHIT Logo" width={220} className="h-auto" />
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-inner">
                    <div className="footer-legal">© {year} Society of Asian Scientists and Engineers at Rose-Hulman Institute of Technology</div>

                    <div className="footer-icons flex items-center gap-3">
                        <Tooltip label="Follow us on Instagram" side="top">
                            <a
                                href="https://www.instagram.com/saserhit"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="h-6 w-6 transition-transform hover:scale-110 focus:scale-110 outline-none"
                            >
                                <FaInstagram className="text-2xl" />
                            </a>
                        </Tooltip>

                        <Tooltip label="Join the CampusGroups" side="top">
                            <a
                                href="https://rosehulman.campusgroups.com/feeds?type=club&type_id=35480&tab=about"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="CampusGroups"
                                className="h-6 w-6 transition-transform hover:scale-110 focus:scale-110 outline-none"
                            >
                                <FaSchool className="text-2xl" />
                            </a>
                        </Tooltip>

                        <Tooltip label="Email us" side="top">
                            <a
                                href="mailto:rhit@saseconnect.org"
                                aria-label="Email"
                                className="h-6 w-6 transition-transform hover:scale-110 focus:scale-110 outline-none"
                            >
                                <FaEnvelope className="text-2xl" />
                            </a>
                        </Tooltip>

                        <Tooltip label="Contribute on GitHub" side="top">
                            <a
                                href="https://github.com/chrislardner/sase_web"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="h-6 w-6 transition-transform hover:scale-110 focus:scale-110 outline-none"
                            >
                                <FaGithub className="text-2xl" />
                            </a>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </footer>
    );
}
