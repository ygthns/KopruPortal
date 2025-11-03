import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './theme-provider';
import { DemoDataProvider } from './demo-data-provider';
import { useSettingsStore } from '@/store/use-settings';
import { Toaster } from '@/components/ui/use-toast';
import { enableMocking } from '@/lib/msw-client';
import i18n from '@/i18n/i18n';

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const language = useSettingsStore((state) => state.language);

  useEffect(() => {
    void enableMocking();
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('koprumezun.lang', language);
    }
  }, [language]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
              KöprüMezun is loading…
            </div>
          }
        >
          <DemoDataProvider>{children}</DemoDataProvider>
        </Suspense>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}
