import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  Building,
  MapPin,
  UploadCloud,
  CheckCircle,
} from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

export default function CareersPage() {
  const { t } = useTranslation();
  const jobs = useDemoStore((state) => state.jobs);
  const jobApplications = useDemoStore((state) => state.jobApplications);
  const resumeAnalyses = useDemoStore((state) => state.resumeAnalyses);
  const applyToJob = useDemoStore((state) => state.applyToJob);
  const toggleSaveJob = useDemoStore((state) => state.toggleSaveJob);
  const analyzeResume = useDemoStore((state) => state.analyzeResume);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id ?? '');
  const { toast } = useToast();

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId),
    [jobs, selectedJobId],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('careers.title')}
        </h1>
        <p className="text-muted-foreground">{t('careers.subtitle')}</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <Card className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t('careers.labels.openRoles')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('careers.labels.openRolesSubtitle')}
              </p>
            </div>
            <Badge variant="secondary">
              {jobs.length} {t('careers.labels.roles')}
            </Badge>
          </div>
          <div className="grid gap-3">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  job.id === selectedJobId
                    ? 'border-primary bg-primary/10'
                    : 'border-border/60 bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {job.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      {job.company}
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                  </div>
                  <Badge variant="muted">{job.type}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t('careers.labels.resume')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('careers.labels.resumeSubtitle')}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-2xl border-dashed"
            onClick={() => {
              analyzeResume({
                highlights: [
                  t('careers.resume.highlights.impact'),
                  t('careers.resume.highlights.community'),
                ],
                suggestions: [
                  t('careers.resume.suggestions.metrics'),
                  t('careers.resume.suggestions.keywords'),
                ],
              });
              toast({
                variant: 'success',
                title: t('careers.toasts.resumeAnalyzed'),
              });
            }}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            {t('careers.actions.uploadResume')}
          </Button>
          <div className="space-y-3">
            {resumeAnalyses.slice(0, 1).map((analysis) => (
              <div
                key={analysis.id}
                className="space-y-2 rounded-2xl border border-border/60 bg-muted/30 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-foreground">
                    {t('careers.resume.score')}
                  </div>
                  <Badge variant="default">{analysis.score}/100</Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {t('careers.resume.highlights.title')}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {analysis.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {t('careers.resume.suggestions.title')}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {analysis.suggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            {resumeAnalyses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                {t('careers.resume.empty')}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{selectedJob?.title}</CardTitle>
              <CardDescription>{selectedJob?.company}</CardDescription>
            </div>
            <Button
              variant="ghost"
              onClick={() => selectedJob && toggleSaveJob(selectedJob.id)}
            >
              <Bookmark
                className={`h-5 w-5 ${selectedJob?.saved ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
              />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{selectedJob?.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedJob?.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                className="rounded-full"
                onClick={() => {
                  if (!selectedJob) return;
                  applyToJob(selectedJob.id);
                  toast({
                    variant: 'success',
                    title: t('careers.toasts.applicationSent'),
                  });
                }}
              >
                {t('careers.actions.apply')}
              </Button>
              <Button variant="outline" className="rounded-full">
                {t('careers.actions.share')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('careers.labels.tracker')}</CardTitle>
            <CardDescription>
              {t('careers.labels.trackerSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobApplications.map((application) => {
              const job = jobs.find((item) => item.id === application.jobId);
              if (!job) return null;
              const progress =
                application.status === 'applied'
                  ? 30
                  : application.status === 'review'
                    ? 55
                    : application.status === 'interview'
                      ? 80
                      : 100;
              return (
                <div
                  key={application.id}
                  className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {job.title}
                    </span>
                    <Badge variant="default">
                      {t(`careers.status.${application.status}`)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                  <Progress className="mt-2" value={progress} />
                </div>
              );
            })}
            {jobApplications.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                {t('careers.tracker.empty')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
