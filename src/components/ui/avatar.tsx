import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  name?: string;
};

export function Avatar({ src, alt, name, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground',
        className,
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{name ? getInitials(name) : 'KM'}</span>
      )}
    </div>
  );
}
