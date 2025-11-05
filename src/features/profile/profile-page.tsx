import { useMemo } from 'react';
import type { ComponentType, SVGProps } from 'react';
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

export default function ProfilePage() {
  const viewer = useDemoStore((state) =>
    state.users.find((user) => user.id === state.viewerId),
  );

  const profile = useMemo(
    () => ({
      name: viewer?.name ?? 'Ece Korkmaz',
      headline:
        viewer?.title ?? 'Director of Alumni Relations · Community Builder',
      location: viewer?.location ?? 'Istanbul, Türkiye',
      gradYear: viewer?.classYear ?? '2008',
      school: 'KöprüMezun University',
      department: 'Communications & Media Studies',
      company: viewer?.organization ?? 'KöprüMezun University',
      role: viewer?.title ?? 'Director of Alumni Relations',
      photo:
        viewer?.avatar ??
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80',
      summary:
        'Designing alumni experiences that unite graduates, students, and mentors around real outcomes.',
      resume: {
        fileName: 'ece-korkmaz-resume.pdf',
        updatedAt: 'Updated Apr 2, 2025',
        highlights: [
          '15+ years leading advancement and mentoring programs',
          'Scaled alumni-led fundraising campaigns by 34%',
          'Certified ScrumMaster® · CASE Executive Leadership Cohort alumnus',
        ],
      },
      interests: [
        'Mentorship design',
        'Hybrid events',
        'Storytelling',
        'Impact analytics',
      ],
      certifications: [
        'CASE Alumni Relations Leadership Certificate',
        'Scrum Alliance Certified ScrumMaster®',
        'Diversity, Equity & Inclusion for Leaders (2024)',
      ],
      skills: [
        'Community Strategy',
        'Stakeholder Engagement',
        'Program Operations',
        'Data Storytelling',
        'Fundraising Campaigns',
      ],
      quickLinks: [
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/ecekorkmaz',
          icon: LinkIcon,
        },
        {
          label: 'Mentor Portfolio',
          href: 'https://mentorhub.koprumezun.com/ece',
          icon: ExternalLink,
        },
        {
          label: 'Calendly',
          href: 'https://calendly.com/ecekorkmaz',
          icon: ExternalLink,
        },
        {
          label: 'Personal Site',
          href: 'https://ece.community',
          icon: ExternalLink,
        },
      ] as ProfileQuickLink[],
      posts: [
        {
          id: 'post-mentorship',
          title: 'Launching the 2025 Flash Mentorship Sprint',
          excerpt:
            'We now match alumni and students in under four minutes with opt-in sprint coaching windows.',
          date: 'April 10, 2025',
          highlights: [
            'Introduced matching dashboards for alumni mentors',
            'Piloted 10-minute calendar slots with Calendly + Teams integration',
            'Target: 150 mentor conversations in the first month',
          ],
        },
        {
          id: 'post-fundraising',
          title: 'KöprüMezun Alumni Impact Fund hits ₺1.2M',
          excerpt:
            'Thank you to everyone who contributed stories, video shout-outs, and micro-pledges.',
          date: 'March 27, 2025',
          highlights: [
            'Activated 42 volunteer ambassadors in three cities',
            'Produced bilingual video updates for donor stewardship',
          ],
        },
      ] as ProfilePost[],
      events: [
        {
          id: 'event-1',
          name: 'Alumni Leadership Forum – Spring Summit',
          date: 'May 16, 2025 · Hybrid',
          location: 'KöprüMezun Innovation Hub',
          role: 'Host & Moderator',
        },
        {
          id: 'event-2',
          name: 'Mentor Speed Networking Evening',
          date: 'June 4, 2025 · Virtual',
          location: 'Microsoft Teams',
          role: 'Facilitator',
        },
      ] as ProfileEvent[],
      campaigns: [
        {
          id: 'campaign-1',
          name: 'Alumni Mentorship Access Fund',
          goal: 'Goal ₺500K · Raised ₺340K',
          progress: '68% to goal',
          summary:
            'Expanding travel grants and diagnostic tools so every mentee can access professional coaching.',
        },
        {
          id: 'campaign-2',
          name: 'Media Lab Podcast Studio Upgrade',
          goal: 'Goal ₺250K · Raised ₺198K',
          progress: '79% to goal',
          summary:
            'Co-leading alumni storytelling infrastructure with real-time captioning and bilingual workflows.',
        },
      ] as ProfileCampaign[],
    }),
    [viewer],
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
              Send Message
            </Button>
            <Button variant="outline" className="rounded-full px-6 py-5">
              <UserPlus className="mr-2 h-4 w-4" />
              Connect
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Résumé Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{profile.summary}</p>
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Uploaded résumé</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.resume.fileName}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Download
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
              <CardTitle>Quick Links</CardTitle>
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
              <CardTitle>Professional Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <h3 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <BrainCircuit className="h-4 w-4" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="rounded-full">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Certifications
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {profile.certifications.map((cert) => (
                    <li key={cert} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-full border-border/50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Engagement Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/60 p-1">
                <TabsTrigger value="posts" className="rounded-full">Posts</TabsTrigger>
                <TabsTrigger value="events" className="rounded-full">Events</TabsTrigger>
                <TabsTrigger value="campaigns" className="rounded-full">Campaigns</TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                <div className="space-y-4">
                  {profile.posts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {post.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {post.excerpt}
                          </p>
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
                  {profile.events.map((event) => (
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
                  {profile.campaigns.map((campaign) => (
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
  );
}
