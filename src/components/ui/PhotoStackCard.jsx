import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

// --- FRAMER MOTION VARIANTS ---
const imageContainerVariants = {
  initial: {},
  hover: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const imageVariants = {
  initial: { scale: 1, rotate: 0, y: 0 },
  hover: (i) => ({
    scale: 1.05,
    rotate: (i - 1) * 10,
    y: -20,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  }),
};

const cardVariants = {
  inactive: {
    scale: 1,
    y: 0,
    zIndex: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  active: {
    scale: 1.05,
    y: -15,
    zIndex: 10,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export const PhotoStackCard = forwardRef(
  ({ className, images, category, title, subtitle, isActive, ...props }, ref) => {
    const displayImages = images.slice(0, 3);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex cursor-pointer flex-col justify-start rounded-2xl bg-white dark:bg-black p-8 shadow-xl",
          "transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-zinc-900",
          "border-2 border-gray-200 dark:border-zinc-800",
          className
        )}
        variants={cardVariants}
        animate={isActive ? "active" : "inactive"}
        {...props}
      >
        {/* Text Content */}
        <div className="z-10">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
            {category}
          </p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{subtitle}</p>
        </div>

        {/* Image Stack */}
        <motion.div
          className="absolute bottom-0 right-0 h-56 md:h-64 w-full"
          variants={imageContainerVariants}
          initial="initial"
          whileHover="hover"
        >
          <AnimatePresence>
            {displayImages.map((src, i) => (
              <motion.img
                key={src}
                src={src}
                alt={`${title} memory image ${i + 1}`}
                custom={i}
                variants={imageVariants}
                className="absolute bottom-[-20px] right-8 h-48 md:h-56 w-auto origin-bottom-center rounded-xl border-4 border-white dark:border-black object-cover shadow-lg"
                style={{
                  transform: `rotate(${(i - 1) * 4}deg)`,
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  }
);

PhotoStackCard.displayName = "PhotoStackCard";
