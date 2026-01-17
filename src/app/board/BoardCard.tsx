'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import {FaEnvelope, FaGithub, FaGlobe, FaLinkedin, FaMapMarkerAlt} from 'react-icons/fa';
import type {BoardMember} from './boardMembers';
import {useEffect, useState} from "react";

interface BoardCardProps {
    member: BoardMember;
}

export function BoardCard({member}: BoardCardProps) {
    const [imageError, setImageError] = useState(false);
    const [overlayStrength, setOverlayStrength] = useState(0.55);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (!member.image || !imageLoaded) return;

        const img = new window.Image();
        img.src = member.image;
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 20;
            canvas.height = 20;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(img, 0, 0, 20, 20);
            const data = ctx.getImageData(0, 0, 20, 20).data;

            let total = 0;
            for (let i = 0; i < data.length; i += 4) {
                total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }

            const avg = total / (data.length / 4);

            if (avg > 200) setOverlayStrength(0.82);
            else if (avg > 150) setOverlayStrength(0.68);
            else if (avg > 110) setOverlayStrength(0.55);
            else setOverlayStrength(0.45);
        };
    }, [member.image, imageLoaded]);


    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (<motion.div
        initial={{opacity: 0, scale: 0.95, y: 20}}
        animate={{opacity: 1, scale: 1, y: 0}}
        transition={{type: 'spring', stiffness: 300, damping: 30}}
        className="rrelative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden"
    >
        <div className="relative h-80 bg-gradient-to-br from-sase-blue to-rhit-maroon">
            <div className="relative h-80 overflow-hidden">
                {!imageError && member.image ? (<motion.div
                    className="absolute inset-0"
                    animate={{scale: 1.03}}
                    transition={{duration: 12, ease: "easeInOut"}}
                >
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        priority
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        style={{
                            objectFit: "cover",
                            objectPosition: member.focus ? `${member.focus.x * 100}% ${member.focus.y * 100}%` : "50% 40%",
                        }}
                    />
                </motion.div>) : (<div className="absolute inset-0 flex items-center justify-center">
                                          <span className="text-white text-7xl font-bold">
                                            {getInitials(member.name)}
                                          </span>
                </div>)}

                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{opacity: overlayStrength}}
                    animate={{opacity: overlayStrength}}
                    whileHover={{
                        opacity: Math.max(overlayStrength - 0.08, 0.4),
                    }}
                    transition={{duration: 0.4, ease: "easeOut"}}
                    style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.35), transparent)",
                    }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h2 className="text-4xl font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                        {member.name}
                    </h2>
                    <div className="text-md font-semibold text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                        {member.role}
                        {member.major && ` · ${member.major}`}
                        {member.year && ` · ${member.year}`}
                    </div>
                    {member.minors && (<div className="mt-1 text-sm font-semibold text-white/95
                                                       drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
                        {member.minors}
                    </div>)}
                </div>
            </div>
        </div>

        <div className="p-8 space-y-6 bg-neutral-100 dark:bg-neutral-900">
            {member.hometown && (
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 text-sm md:text-base">
                    <FaMapMarkerAlt className="text-red-500 dark:text-red-400"/>
                    <span>{member.hometown}</span>
                </div>)}

            <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.5}}
            >
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    About {member.name.split(' ')[0]}
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {member.bio || "More information about this board member will be added soon."}
                </p>
            </motion.div>

            <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.5}}
            >
                {member.whySASE && (<section>
                    <h3 className="text-xl font-bold mb-2">Why SASE</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {member.whySASE}
                    </p>
                </section>)}
            </motion.div>

            {member.interests && (<section>

                    <div>
                        <h4 className="font-semibold mb-1">Professional Interest(s)</h4>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            {member.interests.join(', ')}
                        </p>
                    </div>
                </section>

            )}

            {member.previousRoles && (<section>
                <h4 className="font-semibold mb-1">Previous Roles</h4>
                <p className="text-neutral-700 dark:text-neutral-300">
                    {member.previousRoles.join(', ')}
                </p>
            </section>)}

            {member.links && (<motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.7}}
                className="pt-6 border-t border-neutral-200 dark:border-neutral-700"
            >
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                    Connect with {member.name.split(' ')[0]}
                </h3>
                <div className="flex flex-wrap gap-3">
                    {member.links.linkedin && (<a
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaLinkedin/>
                        <span>LinkedIn</span>
                    </a>)}
                    {member.links.github && (<a
                        href={member.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-900 transition-colors"
                    >
                        <FaGithub/>
                        <span>GitHub</span>
                    </a>)}
                    {member.links.portfolio && (<a
                        href={member.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <FaGlobe/>
                        <span>Portfolio</span>
                    </a>)}
                    {member.links.email && (<a
                        href={`mailto:${member.links.email}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <FaEnvelope/>
                        <span>Email</span>
                    </a>)}
                </div>
            </motion.div>)}
        </div>
    </motion.div>);
}
