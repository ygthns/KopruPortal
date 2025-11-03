import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch } from '@/lib/api';
import { useDemoStore, type DemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';

type DemoBootstrapResponse = Partial<DemoStore>;

type DemoDataContextValue = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  refresh: () => Promise<void>;
};

const DemoDataContext = createContext<DemoDataContextValue | undefined>(
  undefined,
);

type DemoDataProviderProps = {
  children: ReactNode;
};

export function DemoDataProvider({ children }: DemoDataProviderProps) {
  const [status, setStatus] = useState<DemoDataContextValue['status']>('idle');
  const hydrate = useDemoStore((state) => state.hydrate);
  const viewerId = useDemoStore((state) => state.viewerId);
  const { toast } = useToast();

  const bootstrap = useCallback(async () => {
    try {
      setStatus('loading');
      const payload = await apiFetch<
        { data: DemoBootstrapResponse } | DemoBootstrapResponse
      >('/api/bootstrap', {
        mockDelay: 600,
      });
      const warning =
        typeof payload === 'object' && 'meta' in payload && payload.meta
          ? (payload.meta as { warning?: string }).warning
          : undefined;
      const data = 'data' in payload ? payload.data : payload;
      hydrate({
        ...data,
        viewerId: data.viewerId ?? viewerId ?? '',
      });
      if (warning) {
        toast({
          title: warning,
        });
      }
      setStatus('ready');
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast({
        title: 'Demo data failed to load',
        description: 'Please refresh to try again.',
        variant: 'destructive',
      });
    }
  }, [hydrate, viewerId, toast]);

  useEffect(() => {
    if (viewerId) {
      setStatus('ready');
      return;
    }
    void bootstrap();
  }, [viewerId, bootstrap]);

  const value = useMemo<DemoDataContextValue>(
    () => ({
      status,
      refresh: bootstrap,
    }),
    [status, bootstrap],
  );

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        <div className="space-y-3 text-center">
          <p className="text-lg font-semibold">
            Loading Koprumezun demo workspace...
          </p>
          <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-muted/60">
            <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-primary/80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoDataStatus() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoDataStatus must be used within DemoDataProvider');
  }
  return context;
}
