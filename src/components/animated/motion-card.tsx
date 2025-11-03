import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MotionCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function MotionCard({
  children,
  className,
  delay = 0,
}: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn(
        'rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-card',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
