import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDemoStore } from '@/store/use-demo-store';

export default function LeaderboardsPage() {
  const { t } = useTranslation();
  const leaderboard = useDemoStore((state) => state.leaderboard);
  const badges = useDemoStore((state) => state.badges);
  const users = useDemoStore((state) => state.users);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('leaderboards.title')}
        </h1>
        <p className="text-muted-foreground">{t('leaderboards.subtitle')}</p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{t('leaderboards.labels.topMembers')}</CardTitle>
            <CardDescription>
              {t('leaderboards.labels.engagement')}
            </CardDescription>
          </div>
          <Award className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {leaderboard.map((entry, index) => {
            const user = users.find((item) => item.id === entry.userId);
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-3 py-2"
              >
                <div>
                  <span className="font-semibold text-foreground">
                    #{index + 1} · {user?.name ?? entry.userId}
                  </span>
                  <div className="text-xs">{entry.segment}</div>
                </div>
                <Badge variant="secondary">{entry.score}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('leaderboards.labels.badges')}</CardTitle>
          <CardDescription>
            {t('leaderboards.labels.badgesSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  {badge.name}
                </span>
                <Badge variant="muted">{badge.tier}</Badge>
              </div>
              <p>{badge.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
