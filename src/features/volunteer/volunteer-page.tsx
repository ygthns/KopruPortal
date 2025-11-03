import { useTranslation } from 'react-i18next';
import { HandHeart, Users } from 'lucide-react';
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

export default function VolunteerPage() {
  const { t } = useTranslation();
  const opportunities = useDemoStore((state) => state.volunteer);
  const { toast } = useToast();

  const totalHours = opportunities.reduce((acc, item) => acc + item.hours, 0);
  const totalParticipants = opportunities.reduce(
    (acc, item) => acc + item.participants,
    0,
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('volunteer.title')}
        </h1>
        <p className="text-muted-foreground">{t('volunteer.subtitle')}</p>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <Badge variant="secondary">
            <HandHeart className="mr-1 h-3 w-3" />
            {t('volunteer.labels.hours', { count: totalHours })}
          </Badge>
          <Badge variant="secondary">
            <Users className="mr-1 h-3 w-3" />
            {t('volunteer.labels.participants', { count: totalParticipants })}
          </Badge>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id}>
            <CardHeader>
              <CardTitle>{opportunity.title}</CardTitle>
              <CardDescription>{opportunity.organization}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{opportunity.impact}</p>
              <div className="flex gap-2 text-xs">
                <Badge variant="muted">{opportunity.category}</Badge>
                <Badge variant="muted">
                  {t('volunteer.labels.hoursShort', {
                    count: opportunity.hours,
                  })}
                </Badge>
              </div>
              <Button
                className="rounded-full"
                variant={opportunity.registered ? 'secondary' : 'default'}
                onClick={() => {
                  useDemoStore.setState((state) => ({
                    volunteer: state.volunteer.map((item) =>
                      item.id === opportunity.id
                        ? { ...item, registered: true }
                        : item,
                    ),
                  }));
                  toast({
                    variant: 'success',
                    title: t('volunteer.toasts.registered'),
                  });
                }}
              >
                {opportunity.registered
                  ? t('volunteer.actions.joined')
                  : t('volunteer.actions.join')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
