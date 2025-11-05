import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, MonitorSmartphone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function EventsPage() {
  const { t } = useTranslation();
  const events = useDemoStore((state) => state.events);
  const registerEvent = useDemoStore((state) => state.registerEvent);
  const [activeIntegration, setActiveIntegration] = useState<string | null>(
    null,
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { toast } = useToast();

  const groupedByDate = useMemo(() => {
    return events.reduce<Record<string, typeof events>>((acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    }, {});
  }, [events]);

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('events.title')}
        </h1>
        <p className="text-muted-foreground">{t('events.subtitle')}</p>
      </header>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">{t('events.views.list')}</TabsTrigger>
          <TabsTrigger value="calendar">
            {t('events.views.calendar')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>
                    {event.date} · {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{event.type}</Badge>
                    <Badge variant="secondary">
                      <MapPin className="mr-1 inline h-3 w-3" />
                      {event.location}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="rounded-full"
                      onClick={() => {
                        registerEvent(event.id);
                        toast({
                          variant: 'success',
                          title: t('events.toasts.registered'),
                          description: event.title,
                        });
                      }}
                    >
                      {event.registered
                        ? t('events.actions.registered')
                        : t('events.actions.register')}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setActiveIntegration('calendly')}
                    >
                      {t('events.actions.schedule')}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setSelectedEventId(event.id)}
                    >
                      {t('events.actions.viewDetails')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4 rounded-3xl border border-border/60 bg-muted/20 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              {t('events.integrations.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('events.integrations.subtitle')}
            </p>
            {[
              { key: 'zoom', label: 'Zoom' },
              { key: 'teams', label: 'Microsoft Teams' },
              { key: 'calendly', label: 'Calendly' },
            ].map((integration) => (
              <Button
                key={integration.key}
                variant="outline"
                className="w-full justify-between rounded-2xl"
                onClick={() => setActiveIntegration(integration.key)}
              >
                <span>{integration.label}</span>
                <MonitorSmartphone className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid gap-4 rounded-3xl border border-border/60 bg-muted/20 p-6 md:grid-cols-2">
            {Object.entries(groupedByDate).map(([date, items]) => (
              <div
                key={date}
                className="rounded-2xl border border-border/60 bg-background/80 p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  {date}
                </div>
                <div className="mt-3 space-y-3">
                  {items.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id)}
                      className="w-full rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-left text-sm hover:border-primary/60"
                    >
                      <div className="font-semibold text-foreground">
                        {event.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.time}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={Boolean(activeIntegration)}
        onOpenChange={(open) => !open && setActiveIntegration(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('events.integrations.connectTitle')}</DialogTitle>
            <DialogDescription>
              {t('events.integrations.connectSubtitle')}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
            {t('events.integrations.placeholder', {
              provider: activeIntegration,
            })}
          </div>
          <DialogFooter>
            <Button
              className="rounded-full"
              onClick={() => setActiveIntegration(null)}
            >
              {t('common.actions.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedEventId)}
        onOpenChange={(open) => !open && setSelectedEventId(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.date} · {selectedEvent?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{selectedEvent?.description}</p>
            <p>
              <strong>{t('events.labels.location')}:</strong>{' '}
              {selectedEvent?.location}
            </p>
          </div>
          <DialogFooter>
            <Button
              className="rounded-full"
              onClick={() => {
                if (selectedEvent) {
                  registerEvent(selectedEvent.id);
                  toast({
                    variant: 'success',
                    title: t('events.toasts.registered'),
                    description: selectedEvent.title,
                  });
                }
              }}
            >
              {t('events.actions.register')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
