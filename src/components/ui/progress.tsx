import * as React from 'react';
import { cn } from '@/lib/utils';

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
};

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-muted/70',
        className,
      )}
      {...props}
    >
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
