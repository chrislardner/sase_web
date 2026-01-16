'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import {FaEnvelope, FaGithub, FaGlobe, FaLinkedin, FaMapMarkerAlt} from 'react-icons/fa';
import type {BoardMember} from './boardMembers';
import {useState} from "react";

interface BoardCardProps {
    member: BoardMember;
}

export function BoardCard({member}: BoardCardProps) {
    const [imageError, setImageError] = useState(false);

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
        className="relative w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
    >
        <div className="relative h-80 bg-gradient-to-br from-sase-blue to-rhit-maroon">
            {!imageError && member.image ? (
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{
                        objectFit: "cover",
                        objectPosition: member.focus
                            ? `${member.focus.x * 100}% ${member.focus.y * 100}%`
                            : "50% 50%",
                    }}
                    onError={() => setImageError(true)}
                />
            ) : (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sase-blue/80 to-rhit-maroon/80">
                        <span className="text-white text-6xl md:text-7xl font-bold">
                            {getInitials(member.name)}
                        </span>
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.h2
                    initial={{x: -20, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{delay: 0.1}}
                    className="text-4xl md:text-5xl font-bold mb-2"
                >
                    {member.name}
                </motion.h2>
                <motion.div
                    initial={{x: -20, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{delay: 0.2}}
                    className="flex flex-wrap justify-start items-center text-white/90 space-x-2 text-md font-semibold"
                >
                    <span className="truncate">{member.role}</span>
                    {member.major && <span className="truncate">• {member.major}</span>}
                    {member.year && <span className="truncate">• {member.year}</span>}
                </motion.div>
            </div>
        </div>

        <div className="p-8 space-y-6">
            {member.hometown && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    <FaMapMarkerAlt className="text-red-500 dark:text-red-400"/>
                    <span>{member.hometown}</span>
                </div>)}

            <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.5}}
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    About {member.name.split(' ')[0]}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {member.bio || "More information about this board member will be added soon."}
                </p>
            </motion.div>

            {member.links && (<motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.7}}
                className="pt-6 border-t border-gray-200 dark:border-gray-700"
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
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
