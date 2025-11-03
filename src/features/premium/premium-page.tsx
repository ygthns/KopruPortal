import { useTranslation } from 'react-i18next';
import { Crown, BarChart2 } from 'lucide-react';
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

export default function PremiumPage() {
  const { t } = useTranslation();
  const premiumGroups = useDemoStore((state) =>
    state.groups.filter((group) => group.isPremium),
  );
  const jobs = useDemoStore((state) => state.jobs.slice(0, 4));
  const leaderboard = useDemoStore((state) => state.leaderboard);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('premium.title')}
        </h1>
        <p className="text-muted-foreground">{t('premium.subtitle')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {premiumGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </div>
              <Badge variant="default">{t('premium.labels.membership')}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                {t('premium.labels.members', { count: group.memberCount })}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <Button className="rounded-full">
                {t('premium.actions.manage')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{t('premium.jobs.title')}</CardTitle>
              <CardDescription>{t('premium.jobs.subtitle')}</CardDescription>
            </div>
            <Crown className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-border/60 bg-muted/20 p-3"
              >
                <div className="text-sm font-semibold text-foreground">
                  {job.title}
                </div>
                <div className="text-xs">
                  {job.company} · {job.location}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{t('premium.stats.title')}</CardTitle>
              <CardDescription>{t('premium.stats.subtitle')}</CardDescription>
            </div>
            <BarChart2 className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm"
              >
                <span>
                  #{index + 1} · {entry.segment}
                </span>
                <Badge variant="secondary">{entry.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
