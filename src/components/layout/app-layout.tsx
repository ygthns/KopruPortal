import { Outlet } from 'react-router-dom';
import { TopNav } from './top-nav';
import { SideNav } from './side-nav';
import { AppFooter } from './footer';
import { MobileNav } from './mobile-nav';

type AppLayoutProps = {
  children?: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/60 to-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-primary focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <TopNav />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4">
        <SideNav />
        <main id="main" className="flex-1 pb-24 pt-8">
          {children ?? <Outlet />}
        </main>
      </div>
      <AppFooter />
      <MobileNav />
    </div>
  );
}
