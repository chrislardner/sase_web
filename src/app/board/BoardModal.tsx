import {motion} from 'framer-motion';
import Image from 'next/image';
import {FaEnvelope, FaGithub, FaGlobe, FaLinkedin, FaMapMarkerAlt, FaTimes} from 'react-icons/fa';
import type {BoardMember} from './boardMembers';

interface BoardModalProps {
    member: BoardMember;
    onClose: () => void;
}

export function BoardModal({member, onClose}: BoardModalProps) {
    return (<motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.9, opacity: 0}}
                transition={{type: "spring", stiffness: 300, damping: 30}}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-300"/>
                </button>

                <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-600 to-red-600">
                    {member.image ? (<>
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                        </>) : (<div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-red-600/80"/>)}

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
                            className="flex items-center space-x-4 text-white/90"
                        >
                            <span className="text-xl font-semibold">{member.role}</span>
                            {(member.major && <><span>•</span><span>{member.major}</span></>)}
                            {(member.year && <><span>•</span><span>{member.year}</span></>)}
                        </motion.div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {(member.hometown && <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.3}}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4"
                        >
                            <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 mb-2"/>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Hometown</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{member.hometown}</p>
                        </motion.div>
                    </div>)}

                    <motion.div
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{delay: 0.6}}
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                            About {member.name.split(' ')[0]}
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {member.bio? member.bio : "More information about this board member will be added soon. Stay tuned!"}
                        </p>
                    </motion.div>

                    {(member.links && <motion.div
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{delay: 0.8}}
                        className="pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Connect with {member.name.split(' ')[0]}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {member.links?.linkedin && (<a
                                    href={member.links.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaLinkedin/>
                                    <span>LinkedIn</span>
                                </a>)}

                            {member.links?.github && (<a
                                    href={member.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                                >
                                    <FaGithub/>
                                    <span>GitHub</span>
                                </a>)}

                            {member.links?.portfolio && (<a
                                    href={member.links.portfolio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <FaGlobe/>
                                    <span>Portfolio</span>
                                </a>)}

                            {member.links?.email && (<a
                                    href={`mailto:${member.links.email}`}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <FaEnvelope/>
                                    <span>Email</span>
                                </a>)}
                        </div>

                    </motion.div>)}
                </div>
            </motion.div>
        </motion.div>);
}