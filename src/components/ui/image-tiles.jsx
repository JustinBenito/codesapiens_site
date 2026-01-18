import React from 'react';
import { motion } from 'framer-motion';

/**
 * ImageTiles component - Displays multiple images in a tiled, animated layout
 * @param {Array} images - Array of image objects with { url, name, link }
 */
export default function ImageTiles({ images = [] }) {
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                delay: 0.1,
                staggerChildren: 0.08,
            }
        }
    };

    const getTileVariants = (index) => {
        // Create varied animations for different tiles
        const row = Math.floor(index / 7);
        const col = index % 7;
        const isEven = index % 2 === 0;
        
        return {
            initial: { 
                rotate: 0, 
                scale: 0.8,
                opacity: 0,
                y: 20
            },
            animate: {
                rotate: isEven ? Math.random() * 4 - 2 : Math.random() * -4 + 2,
                scale: 1,
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.03
                }
            },
            hover: {
                rotate: 0,
                scale: 1.05,
                y: -8,
                zIndex: 50,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }
            }
        };
    };

    return (
        <motion.div
            className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            style={{ gap: 0, marginTop: '-1rem', marginRight: '-1rem' }}
        >
            {images.map((item, index) => (
                <motion.div
                    key={index}
                    className="relative group"
                    variants={getTileVariants(index)}
                    whileHover="hover"
                    animate="animate"
                    style={{ 
                        padding: '0.5rem',
                        marginTop: '-2rem',
                        marginLeft: '-1rem'

                    }}
                >
                    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-1 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
                            <img
                                src={item.photo || item.url}
                                alt={item.name || `Image ${index + 1}`}
                                className={`w-full h-full object-cover transition-all duration-500 ${
                                    item.role ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
                                }`}
                            />
                        </div>
                        
                        {item.name && (
                            <div className="mt-1 text-center px-1">
                                <h3 className="font-bold text-[10px] md:text-xs text-gray-900 dark:text-white truncate">
                                    {item.name}
                                </h3>
                                {item.role && (
                                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#FA5D00] mt-0.5">
                                        {item.role}
                                    </p>
                                )}
                            </div>
                        )}
                        
                        {item.link && (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-zinc-800 p-1 rounded-full shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg 
                                    className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 dark:text-blue-400" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
