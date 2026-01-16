'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardCard } from './BoardCard';
import { BoardModal } from './BoardModal';
import { boardMembers } from './boardMembers';
import type { BoardMember } from './boardMembers';

export default function ExecutiveBoardPage() {
    const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-red-600/10 dark:from-blue-600/20 dark:to-red-600/20" />

                <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rhit-maroon to-rhit-maroon-soft bg-clip-text text-transparent">
                            Executive Board
                        </h1>

                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Meet the leaders driving SASE@RHIT forward
                        </p>

                        <div className="mt-8 flex justify-center space-x-2">
                            <motion.div
                                className="mt-8 flex justify-center"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: '36rem', opacity: 1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <div className="h-1 w-full rounded-full bg-rhit-maroon" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {boardMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                onHoverStart={() => setHoveredRole(member.role)}
                                onHoverEnd={() => setHoveredRole(null)}
                            >
                                <BoardCard
                                    member={member}
                                    onClick={() => setSelectedMember(member)}
                                    isHovered={hoveredRole === member.role}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            <AnimatePresence>
                {selectedMember && (
                    <BoardModal
                        member={selectedMember}
                        onClose={() => setSelectedMember(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}