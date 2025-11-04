import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Clock, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';

export default function MentoringPage() {
  const { t } = useTranslation();
  const mentors = useDemoStore((state) =>
    state.users.filter((user) => user.role === 'mentor'),
  );
  const mentorships = useDemoStore((state) => state.mentorships);
  const mentorRequests = useDemoStore((state) => state.mentorRequests);
  const flashSessions = useDemoStore((state) => state.flashSessions);
  const requestMentor = useDemoStore((state) => state.requestMentor);
  const completeMentorRequest = useDemoStore(
    (state) => state.completeMentorRequest,
  );
  const scheduleFlashSession = useDemoStore(
    (state) => state.scheduleFlashSession,
  );
  const [selectedMentor, setSelectedMentor] = useState<string>(
    mentors[0]?.id ?? '',
  );
  const { toast } = useToast();

  useEffect(() => {
    if (selectedMentor || mentors.length === 0) {
      return;
    }
    setSelectedMentor(mentors[0].id);
  }, [mentors, selectedMentor]);

  const pendingTimersRef = useRef(new Map<string, number>());
  const scheduledRequestsRef = useRef(new Set<string>());
  const notifiedRequestsRef = useRef(new Set<string>());

  useEffect(() => {
    mentorRequests.forEach((request) => {
      if (request.status === 'pending') {
        const existingTimer = pendingTimersRef.current.get(request.id);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
          pendingTimersRef.current.delete(request.id);
        }
        notifiedRequestsRef.current.delete(request.id);
        if (scheduledRequestsRef.current.has(request.id)) {
          return;
        }

        scheduledRequestsRef.current.add(request.id);
        const timer = window.setTimeout(() => {
          completeMentorRequest(request.id);
        }, 1500);
        pendingTimersRef.current.set(request.id, timer);
        return;
      }

      const timer = pendingTimersRef.current.get(request.id);
      if (timer) {
        window.clearTimeout(timer);
        pendingTimersRef.current.delete(request.id);
      }
      scheduledRequestsRef.current.delete(request.id);

      if (notifiedRequestsRef.current.has(request.id)) {
        return;
      }

      notifiedRequestsRef.current.add(request.id);
      if (request.status === 'accepted') {
        toast({
          variant: 'success',
          title: t('mentoring.toasts.matchConfirmed'),
        });
      } else if (request.status === 'scheduled') {
        toast({
          variant: 'success',
          title: t('mentoring.toasts.flashScheduled'),
        });
      }
    });
  }, [mentorRequests, completeMentorRequest, toast, t]);

  useEffect(() => {
    const timers = pendingTimersRef.current;
    const scheduled = scheduledRequestsRef.current;
    const notified = notifiedRequestsRef.current;

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      scheduled.clear();
      notified.clear();
    };
  }, []);

  const selectedMentorProfile = useMemo(
    () => mentors.find((mentor) => mentor.id === selectedMentor),
    [mentors, selectedMentor],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('mentoring.title')}
        </h1>
        <p className="text-muted-foreground">{t('mentoring.subtitle')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <Card className="space-y-4 p-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t('mentoring.labels.availableMentors')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('mentoring.labels.pickMentor')}
            </p>
          </div>
          <div className="space-y-3">
            {mentors.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => setSelectedMentor(mentor.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  mentor.id === selectedMentor
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 bg-muted/40 hover:border-primary/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{mentor.name}</span>
                  <Badge variant="secondary">{mentor.industry}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{mentor.title}</p>
              </button>
            ))}
          </div>
          <Button
            className="w-full rounded-full"
            onClick={() => {
              if (!selectedMentor) return;
              requestMentor(selectedMentor, ['Career growth', 'Leadership']);
              toast({
                variant: 'default',
                title: t('mentoring.toasts.requested'),
              });
            }}
          >
            {t('mentoring.actions.request')}
          </Button>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{t('mentoring.labels.matchOverview')}</CardTitle>
                <CardDescription>
                  {selectedMentorProfile?.name} ·{' '}
                  {selectedMentorProfile?.industry}
                </CardDescription>
              </div>
              <Badge variant="secondary">{t('mentoring.labels.flash15')}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {t('mentoring.labels.goals')}
                </p>
                <Progress value={mentorships[0]?.progress ?? 30} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['strategy', 'network', 'leadership'].map((key) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-border/60 bg-muted/30 p-3"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t(`mentoring.goals.${key}.title`)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t(`mentoring.goals.${key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                {t('mentoring.labels.smartSummary')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('mentoring.labels.requests')}</CardTitle>
              <CardDescription>{t('mentoring.labels.queue')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mentorRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                >
                  <span>{selectedMentorProfile?.name}</span>
                  <Badge
                    variant={
                      request.status === 'pending'
                        ? 'muted'
                        : request.status === 'accepted'
                          ? 'default'
                          : 'secondary'
                    }
                  >
                    {t(`mentoring.status.${request.status}`)}
                  </Badge>
                </div>
              ))}
              {mentorRequests.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('mentoring.emptyRequests')}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{t('mentoring.labels.flashTitle')}</CardTitle>
                <CardDescription>
                  {t('mentoring.labels.flashSubtitle')}
                </CardDescription>
              </div>
              <BrainCircuit className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {flashSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {session.topic}
                      </span>
                      <Badge variant="muted">
                        {session.durationMinutes} min
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('mentoring.labels.startsAt', {
                        time: session.startTime,
                      })}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  if (!selectedMentor) return;
                  const session = scheduleFlashSession(
                    selectedMentor,
                    'Career Sprint',
                  );
                  toast({
                    variant: 'success',
                    title: t('mentoring.toasts.flashScheduled'),
                    description: session.startTime,
                  });
                }}
              >
                <Clock className="mr-2 h-4 w-4" />
                {t('mentoring.actions.flash')}
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {mentorships.map((match) => (
              <Card key={match.id} className="border border-border/60">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('mentoring.labels.match')}
                  </CardTitle>
                  <CardDescription>{match.goals.join(' • ')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {t('mentoring.labels.progress', {
                      progress: match.progress,
                    })}
                  </div>
                  <Progress value={match.progress} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
