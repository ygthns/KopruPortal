import { useMemo } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  UserPlus,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useDemoStore } from '@/store/use-demo-store';

interface ProfileQuickLink {
  label: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

interface ProfilePost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  highlights: string[];
}

interface ProfileEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  role: string;
}

interface ProfileCampaign {
  id: string;
  name: string;
  goal: string;
  progress: string;
  summary: string;
}

type ProfileExperienceType = 'work' | 'education';

interface ProfileExperience {
  id: string;
  type: ProfileExperienceType;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

type QuickLinkKey = 'linkedin' | 'mentorPortfolio' | 'calendly' | 'personalSite';

const quickLinkIconMap: Record<QuickLinkKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  linkedin: LinkIcon,
  mentorPortfolio: ExternalLink,
  calendly: ExternalLink,
  personalSite: ExternalLink,
};

const experienceIconMap: Record<ProfileExperienceType, ComponentType<SVGProps<SVGSVGElement>>> = {
  work: Briefcase,
  education: GraduationCap,
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const viewer = useDemoStore((state) =>
    state.users.find((user) => user.id === state.viewerId),
  );

  const profile = useMemo(
    () => {
      const header = t('profile.page.header', {
        returnObjects: true,
      }) as {
        name: string;
        headline: string;
        location: string;
        gradYear: string;
        school: string;
        company: string;
        role: string;
        photo: string;
      };
      const summary = t('profile.page.summary');
      const resume = t('profile.page.resume', {
        returnObjects: true,
      }) as {
        uploadedLabel: string;
        fileName: string;
        updatedAt: string;
        download: string;
        highlights: string[];
      };
      const quickLinksContent = t('profile.page.quickLinks', {
        returnObjects: true,
      }) as Array<
        Omit<ProfileQuickLink, 'icon'> & { iconKey?: QuickLinkKey }
      >;
      const snapshot = t('profile.page.snapshot', {
        returnObjects: true,
      }) as {
        labels: {
          interests: string;
          certifications: string;
          skills: string;
        };
        interests: string[];
        certifications: string[];
        skills: string[];
      };
      const timeline = t('profile.page.timeline', {
        returnObjects: true,
      }) as {
        tabs: {
          posts: string;
          events: string;
          campaigns: string;
        };
        posts: ProfilePost[];
        events: ProfileEvent[];
        campaigns: ProfileCampaign[];
      };
      const about = t('profile.page.about.content', {
        returnObjects: true,
      }) as string[];
      const experience = t('profile.page.experience', {
        returnObjects: true,
      }) as ProfileExperience[];
      const actions = t('profile.page.actions', {
        returnObjects: true,
      }) as {
        sendMessage: string;
        connect: string;
      };
      const cards = t('profile.page.cards', {
        returnObjects: true,
      }) as {
        aboutMe: string;
        resumeHighlights: string;
        quickLinks: string;
        professionalSnapshot: string;
        experience: string;
        engagementTimeline: string;
      };

      return {
        name: viewer?.name ?? header.name,
        headline: viewer?.title ?? header.headline,
        location: viewer?.location ?? header.location,
        gradYear: viewer?.classYear ?? header.gradYear,
        school: header.school,
        company: viewer?.organization ?? header.company,
        role: viewer?.title ?? header.role,
        photo:
          viewer?.avatar ??
          header.photo ??
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=240&q=80',
        summary,
        resume,
        quickLinks: quickLinksContent.map(({ iconKey, ...link }) => ({
          ...link,
          icon: iconKey ? quickLinkIconMap[iconKey] : undefined,
        })),
        snapshot,
        timeline,
        about,
        experience,
        actions,
        cards,
      };
    },
    [t, viewer],
  );

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-8 shadow-card">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Avatar
              src={profile.photo}
              name={profile.name}
              className="h-24 w-24 border-4 border-background/80 shadow-xl"
            />
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold text-foreground">
                {profile.name}
              </h1>
              <p className="text-base text-muted-foreground">{profile.headline}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
                <span className="hidden h-4 w-px bg-border/60 md:block" />
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {profile.gradYear} · {profile.school}
                </span>
                <span className="hidden h-4 w-px bg-border/60 md:block" />
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {profile.role} @ {profile.company}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:ml-auto md:flex-row">
            <Button className="rounded-full px-6 py-5">
              <MessageCircle className="mr-2 h-4 w-4" />
              {profile.actions.sendMessage}
            </Button>
            <Button variant="outline" className="rounded-full px-6 py-5">
              <UserPlus className="mr-2 h-4 w-4" />
              {profile.actions.connect}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{profile.cards.aboutMe}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.about.map((paragraph) => (
                <p key={paragraph} className="text-sm text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{profile.cards.resumeHighlights}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{profile.summary}</p>
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {profile.resume.uploadedLabel}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profile.resume.fileName}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    {profile.resume.download}
                  </Button>
                </div>
                <Separator className="my-4" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {profile.resume.updatedAt}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {profile.resume.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{profile.cards.quickLinks}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.quickLinks.map(({ label, href, icon: Icon }) => (
                <Button
                  key={label}
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full justify-start rounded-2xl border-border/60"
                >
                  <a href={href} target="_blank" rel="noreferrer">
                    <span className="inline-flex items-center gap-2">
                      {Icon ? <Icon className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                      {label}
                    </span>
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{profile.cards.professionalSnapshot}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <h3 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <BrainCircuit className="h-4 w-4" />
                  {profile.snapshot.labels.interests}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.snapshot.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="rounded-full">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {profile.snapshot.labels.certifications}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {profile.snapshot.certifications.map((cert) => (
                    <li key={cert} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {profile.snapshot.labels.skills}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.snapshot.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-full border-border/50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{profile.cards.experience}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {profile.experience.map((item) => {
                const Icon = experienceIconMap[item.type] ?? Briefcase;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {item.role}
                          </h3>
                          <p className="text-sm text-muted-foreground">{item.company}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <span>{item.period}</span>
                          <span className="hidden h-3 w-px bg-border/60 sm:block" />
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {item.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {item.achievements.map((achievement) => (
                          <li key={achievement} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{profile.cards.engagementTimeline}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="posts" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/60 p-1">
                  <TabsTrigger value="posts" className="rounded-full">
                    {profile.timeline.tabs.posts}
                  </TabsTrigger>
                  <TabsTrigger value="events" className="rounded-full">
                    {profile.timeline.tabs.events}
                  </TabsTrigger>
                  <TabsTrigger value="campaigns" className="rounded-full">
                    {profile.timeline.tabs.campaigns}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts">
                  <div className="space-y-4">
                    {profile.timeline.posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm"
                      >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {post.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {post.date}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        {post.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="events">
                  <div className="space-y-4">
                    {profile.timeline.events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm"
                      >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {event.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{event.role}</p>
                        </div>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {event.date}
                        </div>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="campaigns">
                  <div className="space-y-4">
                    {profile.timeline.campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm"
                      >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {campaign.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {campaign.summary}
                          </p>
                        </div>
                        <div className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {campaign.goal}
                          <br />
                          {campaign.progress}
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
