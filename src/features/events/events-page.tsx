import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Ticket,
  Users,
  Clock,
  Tag,
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';
import type { Event, LanguageCode } from '@/types';

const getLocale = (language: string): LanguageCode =>
  (language.slice(0, 2).toLowerCase() === 'tr' ? 'tr' : 'en') as LanguageCode;

const formatCurrency = (
  value: number,
  currency: Event['currency'],
  locale: LanguageCode,
) =>
  new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency: currency ?? (locale === 'tr' ? 'TRY' : 'USD'),
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string, locale: LanguageCode) => {
  try {
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

type CreateEventForm = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: Event['type'];
  ticketPrice: string;
  currency: Event['currency'];
  tags: string;
  category: string;
};

const initialForm: CreateEventForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  type: 'in-person',
  ticketPrice: '',
  currency: 'TRY',
  tags: '',
  category: '',
};

const getEventContent = (event: Event, locale: LanguageCode) => {
  const localized = event.translations?.[locale];
  return {
    title: localized?.title ?? event.title,
    description: localized?.description ?? event.description,
    location: localized?.location ?? event.location,
    category: localized?.category ?? event.category,
  };
};

export default function EventsPage() {
  const { t, i18n } = useTranslation();
  const events = useDemoStore((state) => state.events);
  const registerEvent = useDemoStore((state) => state.registerEvent);
  const createEvent = useDemoStore((state) => state.createEvent);
  const { toast } = useToast();

  const locale = useMemo(() => getLocale(i18n.language), [i18n.language]);
  const [createForm, setCreateForm] = useState<CreateEventForm>(initialForm);

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) =>
        a.date.localeCompare(b.date, undefined, { sensitivity: 'base' }),
      ),
    [events],
  );

  const registeredEvents = useMemo(
    () => sortedEvents.filter((event) => event.registered),
    [sortedEvents],
  );

  const handleRegister = (event: Event) => {
    if (event.ticketStatus === 'sold_out') {
      toast({
        variant: 'warning',
        title: t('events.actions.ticketSoldOut'),
      });
      return;
    }
    registerEvent(event.id);
    toast({
      variant: 'success',
      title: t('events.toasts.registered'),
    });
  };

  const submitCreateEvent = () => {
    if (!createForm.title || !createForm.date || !createForm.time) {
      return;
    }
    const tags = createForm.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    createEvent({
      title: createForm.title,
      description: createForm.description,
      date: createForm.date,
      time: createForm.time,
      location: createForm.location,
      type: createForm.type,
      tags,
      capacity: 150,
      currency: createForm.currency,
      ticketPrice: createForm.ticketPrice ? Number(createForm.ticketPrice) : undefined,
      category: createForm.category,
      translations: {
        en: {
          title: createForm.title,
          description: createForm.description,
          location: createForm.location,
          category: createForm.category,
        },
        tr: {
          title: createForm.title,
          description: createForm.description,
          location: createForm.location,
          category: createForm.category,
        },
      },
    });

    setCreateForm(initialForm);
    toast({
      variant: 'success',
      title: t('events.form.success'),
    });
  };

  const renderEventCard = (event: Event) => {
    const localized = getEventContent(event, locale);
    const priceLabel =
      event.ticketPrice && event.ticketPrice > 0
        ? formatCurrency(event.ticketPrice, event.currency, locale)
        : t('events.labels.free');

    return (
      <Card key={event.id} className="flex h-full flex-col justify-between border-border/60">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{localized.title}</CardTitle>
              <CardDescription>
                {formatDate(event.date, locale)} · {event.time}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {priceLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{localized.description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="rounded-full">
              <Calendar className="mr-1 h-3 w-3" />
              {event.type}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              <MapPin className="mr-1 h-3 w-3" />
              {localized.location}
            </Badge>
            {localized.category && (
              <Badge variant="outline" className="rounded-full">
                <Tag className="mr-1 h-3 w-3" />
                {localized.category}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {t('events.labels.attending', { count: event.attendees })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.time}
            </span>
            <span className="inline-flex items-center gap-1">
              <Ticket className="h-3 w-3" />
              {t(`events.ticketStatus.${event.ticketStatus ?? 'available'}`)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-full"
              disabled={event.ticketStatus === 'sold_out'}
              onClick={() => handleRegister(event)}
            >
              {event.registered
                ? t('events.actions.registered')
                : event.ticketStatus === 'purchased'
                  ? t('events.actions.ticketPurchased')
                  : event.ticketPrice && event.ticketPrice > 0
                    ? t('events.actions.buyTicket')
                    : t('events.actions.register')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('events.title')}
        </h1>
        <p className="text-muted-foreground">{t('events.subtitle')}</p>
      </header>

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList className="rounded-full bg-muted/20 p-1">
          <TabsTrigger value="discover" className="rounded-full px-6 py-2">
            {t('events.tabs.discover')}
          </TabsTrigger>
          <TabsTrigger value="registered" className="rounded-full px-6 py-2">
            {t('events.tabs.registered')}
          </TabsTrigger>
          <TabsTrigger value="create" className="rounded-full px-6 py-2">
            {t('events.tabs.create')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="grid gap-4 lg:grid-cols-2">
          {sortedEvents.map((event) => renderEventCard(event))}
          {sortedEvents.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                {t('events.empty')}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="registered" className="grid gap-4 lg:grid-cols-2">
          {registeredEvents.map((event) => renderEventCard(event))}
          {registeredEvents.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                {t('events.emptyRegistered')}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card className="max-w-3xl border-border/60">
            <CardHeader>
              <CardTitle>{t('events.tabs.create')}</CardTitle>
              <CardDescription>{t('events.form.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    value={createForm.title}
                    onChange={(event) =>
                      setCreateForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    placeholder={t('events.form.title') ?? ''}
                  />
                  <Input
                    type="date"
                    value={createForm.date}
                    onChange={(event) =>
                      setCreateForm((prev) => ({ ...prev, date: event.target.value }))
                    }
                    placeholder={t('events.form.date') ?? ''}
                  />
                  <Input
                    type="time"
                    value={createForm.time}
                    onChange={(event) =>
                      setCreateForm((prev) => ({ ...prev, time: event.target.value }))
                    }
                    placeholder={t('events.form.time') ?? ''}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    value={createForm.location}
                    onChange={(event) =>
                      setCreateForm((prev) => ({ ...prev, location: event.target.value }))
                    }
                    placeholder={t('events.form.location') ?? ''}
                  />
                  <select
                    className="w-full rounded-2xl border border-border/60 bg-background px-3 py-2 text-sm"
                    value={createForm.type}
                    onChange={(event) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        type: event.target.value as Event['type'],
                      }))
                    }
                  >
                    <option value="in-person">{t('events.form.type')} · In-person</option>
                    <option value="virtual">{t('events.form.type')} · Virtual</option>
                    <option value="hybrid">{t('events.form.type')} · Hybrid</option>
                  </select>
                  <Input
                    value={createForm.category}
                    onChange={(event) =>
                      setCreateForm((prev) => ({ ...prev, category: event.target.value }))
                    }
                    placeholder={t('events.labels.category') ?? ''}
                  />
                </div>
              </div>

              <Textarea
                value={createForm.description}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder={t('events.form.description') ?? ''}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={createForm.tags}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, tags: event.target.value }))
                  }
                  placeholder={t('events.form.tags') ?? ''}
                />
                <div className="flex gap-2">
                  <select
                    className="w-32 rounded-2xl border border-border/60 bg-background px-3 py-2 text-sm"
                    value={createForm.currency}
                    onChange={(event) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        currency: event.target.value as Event['currency'],
                      }))
                    }
                  >
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <Input
                    type="number"
                    min={0}
                    value={createForm.ticketPrice}
                    onChange={(event) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        ticketPrice: event.target.value,
                      }))
                    }
                    placeholder={t('events.form.ticket') ?? ''}
                  />
                </div>
              </div>

              <Button className="rounded-full" onClick={submitCreateEvent}>
                {t('events.form.submit')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
