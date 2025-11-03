import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Briefcase, GraduationCap } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDemoStore } from '@/store/use-demo-store';

export default function DirectoryPage() {
  const { t } = useTranslation();
  const members = useDemoStore((state) => state.users);
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
    members.forEach((member) => {
      classYears.add(member.classYear);
      locations.add(member.location);
      industries.add(member.industry);
      member.skills.forEach((skill) => skills.add(skill));
    });
    return {
      classYears: Array.from(classYears),
      locations: Array.from(locations),
      industries: Array.from(industries),
      skills: Array.from(skills),
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
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
  }, [filters, members, query]);

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
          ).map(([key, values, Icon]) => {
            const current = filters[key as keyof typeof filters];
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  {t(`directory.filters.${key}`)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    key="all"
                    variant={current === 'all' ? 'default' : 'muted'}
                    className="cursor-pointer"
                    onClick={() => updateFilter(key, 'all')}
                  >
                    {t('common.labels.all')}
                  </Badge>
                  {values.map((value) => (
                    <Badge
                      key={value}
                      variant={current === value ? 'default' : 'muted'}
                      className="cursor-pointer"
                      onClick={() => updateFilter(key, value)}
                    >
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
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
