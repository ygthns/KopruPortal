import { Bell, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/shared/brand-logo';
import { LanguageToggle } from '@/components/shared/language-toggle';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useDemoStore } from '@/store/use-demo-store';

export function TopNav() {
  const { t } = useTranslation();
  const viewer = useDemoStore((state) =>
    state.users.find((user) => user.id === state.viewerId),
  );

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <div className="hidden md:block">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('common.tagline')}
              </span>
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="relative w-full max-w-xl">
              <Input
                type="search"
                placeholder={t('common.labels.search')}
                className="pl-10"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                ⌘K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden h-10 w-10 rounded-full md:inline-flex"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('home.notifications')}</TooltipContent>
            </Tooltip>
            <LanguageToggle />
            <ThemeToggle />
            <Button
              variant="secondary"
              className="hidden items-center gap-2 rounded-full px-4 md:inline-flex"
            >
              <Video className="h-4 w-4" />
              {t('common.actions.bookDemo')}
            </Button>
            {viewer && (
              <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-3 py-1.5 md:flex">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {viewer.role}
                </span>
                <span className="text-sm font-medium">{viewer.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="block border-t border-border/60 px-4 py-2 md:hidden">
          <Input
            type="search"
            placeholder={t('common.labels.search')}
            className="pl-10"
          />
        </div>
      </header>
    </TooltipProvider>
  );
}
