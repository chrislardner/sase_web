import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaGlobe } from 'react-icons/fa';
import type { BoardMember } from './boardMembers';

interface BoardCardProps {
    member: BoardMember;
    onClick: () => void;
    isHovered: boolean;
}

export function BoardCard({ member, onClick, isHovered }: BoardCardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getRoleGradient = () => {
        return "from-rhit-maroon to-rhit-maroon-soft";
    };

    const displayBio = member.bio && member.bio !== "-" ? member.bio :
        `${member.name} serves as SASE's ${member.role}.`;

    const displayMajorYear = [member.major, member.year].filter(Boolean).join(' • ') ||
        "Rose-Hulman Student";

    const hasLinks = member.links && Object.keys(member.links).length > 0;

    return (
        <motion.div
            className="relative group cursor-pointer h-full"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${getRoleGradient()} rounded-2xl opacity-0 group-hover:opacity-60 blur transition duration-500 ${isHovered ? 'opacity-60' : ''}`} />

            <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className={`w-28 h-28 rounded-full bg-gradient-to-br ${getRoleGradient()} flex items-center justify-center text-white text-3xl font-bold shadow-xl`}                            whileHover={{ scale: 1.05 }}
                        >
                            {getInitials(member.name)}
                        </motion.div>
                    </div>

                    {member.image && (
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20" />

                    <div className="absolute top-4 right-4 z-30">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`bg-gradient-to-r ${getRoleGradient()} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg`}                        >
                            {member.role}
                        </motion.div>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {member.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {displayMajorYear}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1">
                        {displayBio}
                    </p>

                    {hasLinks && (
                        <div className="flex space-x-3 mb-3">
                            {member.links?.linkedin && (
                                <motion.a
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    href={member.links.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    <FaLinkedin size={20} />
                                </motion.a>
                            )}
                            {member.links?.github && (
                                <motion.a
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    href={member.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                >
                                    <FaGithub size={20} />
                                </motion.a>
                            )}
                            {member.links?.email && (
                                <motion.a
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    href={`mailto:${member.links.email}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                >
                                    <FaEnvelope size={20} />
                                </motion.a>
                            )}
                            {member.links?.portfolio && (
                                <motion.a
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    href={member.links.portfolio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                                >
                                    <FaGlobe size={20} />
                                </motion.a>
                            )}
                        </div>
                    )}

                    {member.bio|| member.whySASE || member.interests || member.hobbies ? (
                        <motion.div
                            className="mt-auto pt-2 text-center text-sm text-rhit-maroon font-medium"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Click to learn more →
                        </motion.div>
                    ) : (
                        <div className="mt-auto pt-2 text-center text-sm text-gray-400 dark:text-gray-500">
                            More info coming soon
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}