'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ProductDescriptionProps {
  text: string;
  maxHeight?: number;
}

export function ProductDescription({ text, maxHeight = 210 }: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const contentRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const fullHeight = contentRef.current.scrollHeight;
      setIsOverflowing(fullHeight > maxHeight);
    }
  }, [text, maxHeight]);

  return (
    <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-[#F5F5F5]">
      <motion.div
        initial={false}
        animate={{
          height: expanded || !isOverflowing ? 'auto' : maxHeight,
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p
          ref={contentRef}
          className="text-[#333333] text-sm sm:text-base leading-relaxed whitespace-pre-line"
        >
          {text}
        </p>
      </motion.div>

      {/* Only show fade if overflowing and not expanded */}
      {!expanded && isOverflowing && (
        <div className="h-12 sm:h-16 mt-[-3rem] sm:mt-[-4rem] pointer-events-none bg-gradient-to-t from-white to-transparent" />
      )}

      {/* Only show button if overflowing */}
      {isOverflowing && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 mt-3 sm:mt-4 font-semibold text-sm sm:text-base text-[#00BFA6] hover:text-[#009e8a] transition"
        >
          {expanded ? 'Покажи по-малко' : 'Покажи повече'}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={18} className="sm:w-5 sm:h-5" />
          </motion.div>
        </button>
      )}
    </div>
  );
}
