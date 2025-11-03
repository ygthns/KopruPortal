import { useTranslation } from 'react-i18next';
import { Flame, Medal } from 'lucide-react';
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

export default function ChallengesPage() {
  const { t } = useTranslation();
  const challenges = useDemoStore((state) => state.challenges);
  const submitChallengeProof = useDemoStore(
    (state) => state.submitChallengeProof,
  );
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('challenges.title')}
        </h1>
        <p className="text-muted-foreground">{t('challenges.subtitle')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{challenge.title}</CardTitle>
                <CardDescription>
                  {challenge.theme} · {challenge.month}
                </CardDescription>
              </div>
              <Badge variant="default">
                <Flame className="mr-1 h-4 w-4" />
                {t('challenges.labels.participants', {
                  count: challenge.participants,
                })}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                {t('challenges.labels.goal', { prize: challenge.prize })}
              </div>
              <Button
                className="rounded-full"
                onClick={() => {
                  submitChallengeProof(challenge.id, 12);
                  toast({
                    variant: 'success',
                    title: t('challenges.toasts.submitted'),
                  });
                }}
              >
                {t('challenges.actions.submit')}
              </Button>
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Medal className="h-4 w-4" />
                  {t('challenges.labels.leaderboard')}
                </h3>
                {challenge.leaderboard.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-sm"
                  >
                    <span>
                      #{index + 1} · {entry.segment}
                    </span>
                    <Badge variant="secondary">{entry.score}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
