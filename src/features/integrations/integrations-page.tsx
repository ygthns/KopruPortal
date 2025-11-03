import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const providers = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    descriptionKey: 'integrations.providers.linkedin',
  },
  {
    id: 'calendly',
    name: 'Calendly',
    descriptionKey: 'integrations.providers.calendly',
  },
  { id: 'zoom', name: 'Zoom', descriptionKey: 'integrations.providers.zoom' },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    descriptionKey: 'integrations.providers.google',
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    descriptionKey: 'integrations.providers.teams',
  },
  {
    id: 'university-sso',
    name: 'University SSO',
    descriptionKey: 'integrations.providers.sso',
  },
];

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [connected, setConnected] = useState<Record<string, boolean>>({
    linkedin: true,
    calendly: false,
    zoom: true,
    'google-calendar': false,
    'microsoft-teams': false,
    'university-sso': true,
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('integrations.title')}
        </h1>
        <p className="text-muted-foreground">{t('integrations.subtitle')}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{provider.name}</CardTitle>
                <CardDescription>{t(provider.descriptionKey)}</CardDescription>
              </div>
              <Badge variant={connected[provider.id] ? 'default' : 'muted'}>
                {connected[provider.id]
                  ? t('integrations.status.connected')
                  : t('integrations.status.available')}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="rounded-full"
                variant={connected[provider.id] ? 'outline' : 'default'}
                onClick={() => {
                  setConnected((prev) => ({
                    ...prev,
                    [provider.id]: !prev[provider.id],
                  }));
                  toast({
                    variant: 'success',
                    title: connected[provider.id]
                      ? t('integrations.toasts.disconnected', {
                          name: provider.name,
                        })
                      : t('integrations.toasts.connected', {
                          name: provider.name,
                        }),
                  });
                }}
              >
                {connected[provider.id]
                  ? t('integrations.actions.disconnect')
                  : t('integrations.actions.connect')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
