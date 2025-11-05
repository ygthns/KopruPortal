import { useMemo } from 'react';
import { Bell, MoreHorizontal, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/shared/brand-logo';
import { LanguageToggle } from '@/components/shared/language-toggle';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDemoStore } from '@/store/use-demo-store';
import { useSettingsStore } from '@/store/use-settings';
import { cn, getInitials } from '@/lib/utils';

export function TopNav() {
  const { t } = useTranslation();
  const viewer = useDemoStore((state) =>
    state.users.find((user) => user.id === state.viewerId),
  );
  const language = useSettingsStore((state) => state.language);
  const initials = useMemo(
    () => (viewer ? getInitials(viewer.name) : 'KM'),
    [viewer],
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:gap-6">
        <BrandLogo />
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <div className="relative hidden w-full md:block">
            <Input
              type="search"
              placeholder={t('common.labels.search')}
              className="h-11 w-full rounded-full bg-muted/60 pl-11"
            />
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t('common.labels.search')}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Quick actions">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 space-y-3 p-3">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2">
                <div>
                  <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t('common.labels.language')}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {t(`common.language.${language}`)}
                  </span>
                </div>
                <LanguageToggle />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/profile"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary transition hover:bg-primary/20',
            )}
            aria-label="Profile"
          >
            {initials}
          </Link>
        </div>
      </div>
    </header>
  );
}
