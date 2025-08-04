'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -20 }
};

export default function PageTransition({ children }) {
  const pathname = usePathname();
  
  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: 'easeInOut', duration: 0.4 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}