import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4 md:hidden">
      <div className="shadow-soft rounded-3xl border border-border/60 bg-background/90 p-2 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full px-4"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
            {t('common.actions.start')}
          </Button>
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {t('common.language.tr')} / {t('common.language.en')}
          </span>
        </div>
        {open && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {NAV_ITEMS.filter((item) => !item.secondary).map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition',
                    active
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/70',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{t(`nav.${item.key}`)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
