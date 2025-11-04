import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function SideNav() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border/60 bg-background/60 px-4 pb-8 pt-6 backdrop-blur-xl lg:block">
      <nav className="flex h-full flex-col gap-1 overflow-y-auto pr-2">
        {NAV_ITEMS.filter((item) => !item.secondary).map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname === item.path ||
            (item.path === '/feed' && location.pathname === '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-150',
                  'hover:bg-muted/80 hover:text-foreground',
                  (isActive || active) &&
                    'bg-primary/10 text-primary shadow-inner',
                )
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/60 transition group-hover:bg-primary/20">
                <Icon className="h-5 w-5" />
              </span>
              <span className="truncate">{t(`nav.${item.key}`)}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
