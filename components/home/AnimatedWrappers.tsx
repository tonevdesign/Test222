'use client';

import { motion } from 'framer-motion';
import React from 'react';

export const AnimatedSection = ({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedGrid = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, staggerChildren: 0.05 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedGridItem = ({ 
  children, 
  index = 0 
}: { 
  children: React.ReactNode;
  index?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};