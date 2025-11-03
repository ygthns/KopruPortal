import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className, compact }: BrandLogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 font-display font-semibold text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <span className="shadow-soft inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-sky-500 to-accent text-sm font-bold text-primary-foreground">
        KM
      </span>
      {!compact && (
        <span className="text-base leading-tight md:text-lg">
          Köprü<span className="text-primary">Mezun</span>
        </span>
      )}
    </Link>
  );
}
