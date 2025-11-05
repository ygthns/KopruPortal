import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDemoStore } from '@/store/use-demo-store';
import type { UserProfile } from '@/types';

const mockDirectoryMembers: UserProfile[] = [
  {
    id: 'mock-member-1',
    name: 'Ece Demir',
    role: 'alumni',
    title: 'Product Manager, TrendyTech',
    organization: 'TrendyTech',
    bio: 'Building community-centric product experiences across Türkiye.',
    classYear: '2015',
    location: 'Istanbul',
    industry: 'Technology',
    skills: ['Product Strategy', 'UX Research', 'Agile'],
    interests: ['Mentoring', 'Design Systems'],
    languages: ['tr', 'en'],
    badges: [],
  },
  {
    id: 'mock-member-2',
    name: 'Kerem Yıldız',
    role: 'alumni',
    title: 'Corporate Partnerships Lead, ImpactBridge',
    organization: 'ImpactBridge',
    bio: 'Connecting alumni founders with social impact opportunities.',
    classYear: '2012',
    location: 'Ankara',
    industry: 'Nonprofit',
    skills: ['Partnerships', 'Fundraising', 'Storytelling'],
    interests: ['Volunteerism', 'Sustainability'],
    languages: ['tr', 'en'],
    badges: [],
  },
  {
    id: 'mock-member-3',
    name: 'Selin Arslan',
    role: 'student',
    title: 'Data Science Intern, Anatolia Analytics',
    organization: 'Anatolia Analytics',
    bio: 'Student ambassador researching machine learning for civic tech.',
    classYear: '2024',
    location: 'Izmir',
    industry: 'Data & AI',
    skills: ['Python', 'Machine Learning', 'Data Storytelling'],
    interests: ['Hackathons', 'Career Mentoring'],
    languages: ['tr', 'en'],
    badges: [],
  },
  {
    id: 'mock-member-4',
    name: 'Mert Kaya',
    role: 'mentor',
    title: 'Engineering Director, Bosphorus Labs',
    organization: 'Bosphorus Labs',
    bio: 'Mentor supporting alumni and students with engineering leadership.',
    classYear: '2008',
    location: 'Bursa',
    industry: 'Manufacturing',
    skills: ['Leadership', 'Cloud Architecture', 'Operations'],
    interests: ['Mentoring', 'Operations'],
    languages: ['tr', 'en'],
    badges: [],
  },
  {
    id: 'mock-member-5',
    name: 'Aylin Karaca',
    role: 'alumni',
    title: 'Founder, Marmara Social Studio',
    organization: 'Marmara Social Studio',
    bio: 'Alumni founder scaling creative social enterprises across Istanbul and beyond.',
    classYear: '2010',
    location: 'Istanbul',
    industry: 'Creative',
    skills: ['Brand Strategy', 'Community Building', 'Workshops'],
    interests: ['Design Thinking', 'Startup Mentoring'],
    languages: ['tr', 'en'],
    badges: [],
  },
  {
    id: 'mock-member-6',
    name: 'Emre Taş',
    role: 'mentor',
    title: 'CTO, Kapadokya Robotics',
    organization: 'Kapadokya Robotics',
    bio: 'Mentor helping robotics and aerospace teams scale across Anatolia.',
    classYear: '2005',
    location: 'Kayseri',
    industry: 'Engineering',
    skills: ['Embedded Systems', 'Robotics', 'Team Leadership'],
    interests: ['Hardware', 'Mentoring'],
    languages: ['tr', 'en'],
    badges: [],
  },
  {
    id: 'mock-member-7',
    name: 'Leyla Öz',
    role: 'student',
    title: 'Marketing Chair, Aegean Alumni Club',
    organization: 'Aegean Alumni Club',
    bio: 'Student leader organizing hybrid programming for regional alumni.',
    classYear: '2026',
    location: 'Izmir',
    industry: 'Marketing',
    skills: ['Content Strategy', 'Event Planning', 'Public Speaking'],
    interests: ['Community Building', 'Volunteerism'],
    languages: ['tr', 'en'],
    badges: [],
  },
];

export default function DirectoryPage() {
  const { t } = useTranslation();
  const members = useDemoStore((state) => state.users);
  const directoryMembers = members.length > 0 ? members : mockDirectoryMembers;
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    classYear: 'all',
    location: 'all',
    industry: 'all',
    skill: 'all',
  });

  const updateFilter = (name: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const facets = useMemo(() => {
    const classYears = new Set<string>();
    const locations = new Set<string>();
    const industries = new Set<string>();
    const skills = new Set<string>();
    directoryMembers.forEach((member) => {
      classYears.add(member.classYear);
      locations.add(member.location);
      industries.add(member.industry);
      member.skills.forEach((skill) => skills.add(skill));
    });
    return {
      classYears: Array.from(classYears).sort((a, b) => Number(b) - Number(a)),
      locations: Array.from(locations).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
      industries: Array.from(industries).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
      skills: Array.from(skills).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
    };
  }, [directoryMembers]);

  const filteredMembers = useMemo(() => {
    return directoryMembers.filter((member) => {
      const matchesQuery =
        !query ||
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.skills.some((skill) =>
          skill.toLowerCase().includes(query.toLowerCase()),
        );
      const matchesClassYear =
        filters.classYear === 'all' || member.classYear === filters.classYear;
      const matchesLocation =
        filters.location === 'all' || member.location === filters.location;
      const matchesIndustry =
        filters.industry === 'all' || member.industry === filters.industry;
      const matchesSkill =
        filters.skill === 'all' || member.skills.includes(filters.skill);

      return (
        matchesQuery &&
        matchesClassYear &&
        matchesLocation &&
        matchesIndustry &&
        matchesSkill
      );
    });
  }, [directoryMembers, filters, query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
      <aside className="space-y-6 rounded-3xl border border-border/60 bg-muted/20 p-6">
        <div className="space-y-2">
          <h2 className="font-semibold text-foreground">
            {t('directory.filters.title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('directory.filters.subtitle')}
          </p>
        </div>
        <div className="space-y-4 text-sm">
          {(
            [
              ['classYear', facets.classYears, GraduationCap],
              ['location', facets.locations, MapPin],
              ['industry', facets.industries, Briefcase],
              ['skill', facets.skills, Search],
            ] as const
          ).map(([key, values, Icon]) => (
            <div key={key} className="space-y-2">
              <Label
                htmlFor={`${key}-filter`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <Icon className="h-4 w-4" />
                {t(`directory.filters.${key}`)}
              </Label>
              <div className="relative">
                <select
                  id={`${key}-filter`}
                  value={filters[key as keyof typeof filters]}
                  onChange={(event) => updateFilter(key, event.target.value)}
                  className="w-full appearance-none rounded-full border border-border/60 bg-background px-4 py-2 pr-10 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">{t('common.labels.all')}</option>
                  {values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-center rounded-full text-sm"
            onClick={() => {
              setFilters({
                classYear: 'all',
                location: 'all',
                industry: 'all',
                skill: 'all',
              });
              setQuery('');
            }}
          >
            {t('common.actions.clear')}
          </Button>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold">
              {t('directory.title')}
            </h1>
            <p className="text-muted-foreground">{t('directory.subtitle')}</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('directory.searchPlaceholder')}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="flex flex-col justify-between">
              <CardHeader className="flex-row items-center gap-3">
                <Avatar name={member.name} />
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.title}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{member.location}</Badge>
                  <Badge variant="secondary">{member.classYear}</Badge>
                  <Badge variant="secondary">{member.industry}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="muted">
                      #{skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardContent className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                      {t('directory.actions.viewProfile')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{member.name}</DialogTitle>
                      <DialogDescription>{member.title}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 md:grid-cols-[200px,1fr]">
                      <div className="space-y-4 rounded-2xl border border-border/60 p-4">
                        <Avatar name={member.name} className="h-24 w-24" />
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>{member.bio}</p>
                          <p>
                            <strong>{t('directory.labels.location')}:</strong>{' '}
                            {member.location}
                          </p>
                          <p>
                            <strong>{t('directory.labels.classYear')}:</strong>{' '}
                            {member.classYear}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {t('directory.labels.skills')}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {member.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {t('directory.labels.interests')}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {member.interests.map((interest) => (
                              <Badge key={interest} variant="muted">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button className="rounded-full">
                          {t('directory.actions.connect')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredMembers.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
            {t('directory.empty')}
          </div>
        )}
      </section>
    </div>
  );
}
