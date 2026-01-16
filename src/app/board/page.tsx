'use client';

import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {BoardCard} from './BoardCard';
import {boardMembers} from './boardMembers';

export default function ExecutiveBoardPage() {
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);

    return (
        <main className="">
            <section className="relative overflow-hidden bg-rhit-maroon-soft dark:bg-rhit-maroon">
                <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="text-center"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r text-gray-50 bg-clip-text">
                            Executive Board
                        </h1>

                        <div className="flex justify-center space-x-2">
                            <motion.div
                                className="mt-8 flex justify-center"
                                initial={{width: 0, opacity: 0}}
                                animate={{width: '36rem', opacity: 1}}
                                transition={{duration: 0.6, ease: 'easeOut'}}
                            >
                                <div className="h-1 w-full rounded-full bg-gray-50"/>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {boardMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 0.4, delay: index * 0.1}}
                                whileHover={{y: -8}}
                                onHoverStart={() => setHoveredRole(member.role)}
                                onHoverEnd={() => setHoveredRole(null)}
                            >
                                <BoardCard
                                    member={member}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    );
}