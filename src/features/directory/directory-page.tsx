import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Briefcase, GraduationCap, Mail, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import type { LanguageCode } from '@/types';

type DirectoryLocaleContent = {
  name: string;
  title: string;
  department: string;
  company: string;
  location: string;
  bio: string;
  industryLabel: string;
  skills: string[];
  interests: string[];
};

type DirectoryEntry = {
  id: string;
  avatar: string;
  classYear: number;
  industryKey: string;
  locationKey: string;
  locales: Record<LanguageCode, DirectoryLocaleContent>;
};

const DIRECTORY_ENTRIES: DirectoryEntry[] = [
  {
    id: 'elif-kaya',
    avatar:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=240&q=80',
    classYear: 2012,
    industryKey: 'technology',
    locationKey: 'istanbul',
    locales: {
      en: {
        name: 'Elif Kaya',
        title: 'Head of Product · Bridge AI',
        department: 'Computer Engineering',
        company: 'Bridge AI',
        location: 'Istanbul, Türkiye',
        bio: 'Product leader pairing alumni mentors with venture-backed founders.',
        industryLabel: 'Technology',
        skills: ['Product Strategy', 'Mentorship', 'OKRs'],
        interests: ['Flash mentoring', 'Community sprints'],
      },
      tr: {
        name: 'Elif Kaya',
        title: 'Bridge AI · Ürün Direktörü',
        department: 'Bilgisayar Mühendisliği',
        company: 'Bridge AI',
        location: 'İstanbul, Türkiye',
        bio: 'Mezun mentorları girişimci kurucularla buluşturan ürün lideri.',
        industryLabel: 'Teknoloji',
        skills: ['Ürün Stratejisi', 'Mentorluk', 'OKR'],
        interests: ['Hızlı mentorluk', 'Topluluk sprintleri'],
      },
    },
  },
  {
    id: 'john-anderson',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80',
    classYear: 2011,
    industryKey: 'design',
    locationKey: 'berlin',
    locales: {
      en: {
        name: 'John Anderson',
        title: 'Design Director · Atlas Labs',
        department: 'Industrial Design',
        company: 'Atlas Labs',
        location: 'Berlin, Germany',
        bio: 'Guides distributed design squads creating alumni engagement tools.',
        industryLabel: 'Design',
        skills: ['Design Systems', 'Hiring', 'Workshop Facilitation'],
        interests: ['Remote culture', 'Design critiques'],
      },
      tr: {
        name: 'John Anderson',
        title: 'Atlas Labs · Tasarım Direktörü',
        department: 'Endüstriyel Tasarım',
        company: 'Atlas Labs',
        location: 'Berlin, Almanya',
        bio: 'Dağıtık tasarım ekiplerini mezun etkileşimi araçları üretirken yönlendiriyor.',
        industryLabel: 'Tasarım',
        skills: ['Tasarım Sistemleri', 'Ekip Kurma', 'Atölye Kolaylaştırma'],
        interests: ['Uzaktan kültür', 'Tasarım kritikleri'],
      },
    },
  },
  {
    id: 'sinem-aydin',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
    classYear: 2013,
    industryKey: 'creative',
    locationKey: 'istanbul',
    locales: {
      en: {
        name: 'Sinem Aydın',
        title: 'Creative Strategist · Salt Galata',
        department: 'Visual Communication',
        company: 'Salt Galata',
        location: 'Istanbul, Türkiye',
        bio: 'Curates alumni design circles and experiential learning labs.',
        industryLabel: 'Creative',
        skills: ['Brand Strategy', 'Community Design', 'Workshop Design'],
        interests: ['Art walks', 'Design storytelling'],
      },
      tr: {
        name: 'Sinem Aydın',
        title: 'Salt Galata · Kreatif Stratejist',
        department: 'Görsel İletişim',
        company: 'Salt Galata',
        location: 'İstanbul, Türkiye',
        bio: 'Mezun tasarım çemberleri ve deneyimsel öğrenme laboratuvarları kurgular.',
        industryLabel: 'Kreatif',
        skills: ['Marka Stratejisi', 'Topluluk Tasarımı', 'Atölye Tasarımı'],
        interests: ['Sanat yürüyüşleri', 'Tasarım hikayeleri'],
      },
    },
  },
  {
    id: 'ahmet-demir',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80',
    classYear: 2015,
    industryKey: 'software',
    locationKey: 'ankara',
    locales: {
      en: {
        name: 'Ahmet Demir',
        title: 'Senior Software Engineer · Trendyol',
        department: 'Computer Engineering',
        company: 'Trendyol',
        location: 'Ankara, Türkiye',
        bio: 'Builds large-scale marketplace services and mentors campus teams.',
        industryLabel: 'Software',
        skills: ['Java', 'Microservices', 'Tech Mentoring'],
        interests: ['Scalable architecture', 'Student mentoring'],
      },
      tr: {
        name: 'Ahmet Demir',
        title: 'Kıdemli Yazılım Mühendisi · Trendyol',
        department: 'Bilgisayar Mühendisliği',
        company: 'Trendyol',
        location: 'Ankara, Türkiye',
        bio: 'Büyük ölçekli pazar yeri servisleri geliştiriyor, kampüs ekiplerine mentorluk yapıyor.',
        industryLabel: 'Yazılım',
        skills: ['Java', 'Mikroservisler', 'Teknik Mentorluk'],
        interests: ['Ölçeklenebilir mimari', 'Öğrenci mentorlukları'],
      },
    },
  },
  {
    id: 'emily-carter',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    classYear: 2018,
    industryKey: 'technology',
    locationKey: 'london',
    locales: {
      en: {
        name: 'Emily Carter',
        title: 'Software Engineer · Google',
        department: 'Computer Science',
        company: 'Google',
        location: 'London, United Kingdom',
        bio: 'Focuses on privacy-first infrastructure and alumni-led ERGs.',
        industryLabel: 'Technology',
        skills: ['Python', 'GCP', 'Security'],
        interests: ['ERGs', 'Public speaking'],
      },
      tr: {
        name: 'Emily Carter',
        title: 'Yazılım Mühendisi · Google',
        department: 'Bilgisayar Bilimleri',
        company: 'Google',
        location: 'Londra, Birleşik Krallık',
        bio: 'Gizlilik odaklı altyapı projelerinde çalışıyor, mezun liderli ERG’leri destekliyor.',
        industryLabel: 'Teknoloji',
        skills: ['Python', 'GCP', 'Güvenlik'],
        interests: ['ERG toplulukları', 'Konuşmacılık'],
      },
    },
  },
  {
    id: 'david-martinez',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    classYear: 2009,
    industryKey: 'events',
    locationKey: 'new-york',
    locales: {
      en: {
        name: 'David Martinez',
        title: 'Global Alumni Engagement Lead · KöprüMezun International',
        department: 'Public Relations',
        company: 'KöprüMezun International',
        location: 'New York, USA',
        bio: 'Designs reunion experiences for global alumni chapters.',
        industryLabel: 'Events',
        skills: ['Event Design', 'Sponsorship', 'Storytelling'],
        interests: ['Hybrid formats', 'City chapters'],
      },
      tr: {
        name: 'David Martinez',
        title: 'Küresel Alumni Etkileşim Lideri · KöprüMezun International',
        department: 'Halkla İlişkiler',
        company: 'KöprüMezun International',
        location: 'New York, ABD',
        bio: 'Küresel mezun toplulukları için buluşmalar tasarlıyor.',
        industryLabel: 'Etkinlik',
        skills: ['Etkinlik Tasarımı', 'Sponsorluk', 'Hikaye Anlatımı'],
        interests: ['Hibrit formatlar', 'Şehir toplulukları'],
      },
    },
  },
  {
    id: 'sarah-uzun',
    avatar:
      'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=240&q=80',
    classYear: 2023,
    industryKey: 'marketing',
    locationKey: 'izmir',
    locales: {
      en: {
        name: 'Sarah Uzun',
        title: 'Marketing Associate · Aegean Alumni Club',
        department: 'Business Administration',
        company: 'Aegean Alumni Club',
        location: 'Izmir, Türkiye',
        bio: 'Student leader organising bilingual programming and newsletters.',
        industryLabel: 'Marketing',
        skills: ['Content Strategy', 'Event Ops', 'Email Marketing'],
        interests: ['Volunteer coordination', 'Hybrid events'],
      },
      tr: {
        name: 'Sarah Uzun',
        title: 'Pazarlama Uzmanı · Ege Alumni Club',
        department: 'İşletme',
        company: 'Ege Alumni Club',
        location: 'İzmir, Türkiye',
        bio: 'İki dilli etkinlikler ve bültenler yöneten öğrenci lideri.',
        industryLabel: 'Pazarlama',
        skills: ['İçerik Stratejisi', 'Etkinlik Operasyonları', 'E-posta Pazarlama'],
        interests: ['Gönüllü koordinasyonu', 'Hibrit etkinlikler'],
      },
    },
  },
  {
    id: 'maria-gonzalez',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=240&q=80',
    classYear: 2016,
    industryKey: 'finance',
    locationKey: 'madrid',
    locales: {
      en: {
        name: 'María González',
        title: 'Investment Associate · Horizon Impact Fund',
        department: 'Economics',
        company: 'Horizon Impact Fund',
        location: 'Madrid, Spain',
        bio: 'Supports alumni social enterprises with catalytic funding.',
        industryLabel: 'Finance',
        skills: ['Impact Investing', 'Due Diligence', 'Stakeholder Management'],
        interests: ['Social enterprises', 'Cross-border mentoring'],
      },
      tr: {
        name: 'María González',
        title: 'Yatırım Uzmanı · Horizon Impact Fund',
        department: 'Ekonomi',
        company: 'Horizon Impact Fund',
        location: 'Madrid, İspanya',
        bio: 'Mezun sosyal girişimlerini katalitik fonlarla destekliyor.',
        industryLabel: 'Finans',
        skills: ['Etki Yatırımı', 'Durum Tespiti', 'Paydaş Yönetimi'],
        interests: ['Sosyal girişimler', 'Ülke çapı mentorluk'],
      },
    },
  },
];

const YEAR_OPTIONS = Array.from({ length: 46 }, (_, index) => (1980 + index).toString());

const getLocale = (language: string): LanguageCode =>
  (language.slice(0, 2).toLowerCase() === 'tr' ? 'tr' : 'en') as LanguageCode;

export default function DirectoryPage() {
  const { t, i18n } = useTranslation();
  const locale = useMemo(() => getLocale(i18n.language), [i18n.language]);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    classYear: 'all',
    location: 'all',
    industry: 'all',
    skill: 'all',
  });

  const locationOptions = useMemo(() => {
    const map = new Map<string, { en: string; tr: string }>();
    DIRECTORY_ENTRIES.forEach((entry) => {
      const { locationKey, locales } = entry;
      map.set(locationKey, {
        en: locales.en.location,
        tr: locales.tr.location,
      });
    });
    return Array.from(map.entries());
  }, []);

  const industryOptions = useMemo(() => {
    const map = new Map<string, { en: string; tr: string }>();
    DIRECTORY_ENTRIES.forEach((entry) => {
      const { industryKey, locales } = entry;
      map.set(industryKey, {
        en: locales.en.industryLabel,
        tr: locales.tr.industryLabel,
      });
    });
    return Array.from(map.entries());
  }, []);

  const skillOptions = useMemo(() => {
    const set = new Set<string>();
    DIRECTORY_ENTRIES.forEach((entry) => {
      entry.locales.en.skills.forEach((skill) => set.add(skill));
      entry.locales.tr.skills.forEach((skill) => set.add(skill));
    });
    return Array.from(set);
  }, []);

  const filteredEntries = useMemo(() => {
    return DIRECTORY_ENTRIES.filter((entry) => {
      const localized = entry.locales[locale] ?? entry.locales.en;
      const localizedEn = entry.locales.en;
      const searchSpace = [
        localized.name,
        localized.title,
        localized.department,
        localized.company,
        localized.bio,
        ...localized.skills,
        ...localized.interests,
        localizedEn.name,
        localizedEn.title,
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = !query || searchSpace.includes(query.toLowerCase());
      const matchesYear =
        filters.classYear === 'all' || entry.classYear.toString() === filters.classYear;
      const matchesLocation =
        filters.location === 'all' || entry.locationKey === filters.location;
      const matchesIndustry =
        filters.industry === 'all' || entry.industryKey === filters.industry;
      const matchesSkill =
        filters.skill === 'all' ||
        localized.skills.some((skill) => skill.toLowerCase() === filters.skill.toLowerCase()) ||
        localizedEn.skills.some((skill) => skill.toLowerCase() === filters.skill.toLowerCase());

      return (
        matchesQuery &&
        matchesYear &&
        matchesLocation &&
        matchesIndustry &&
        matchesSkill
      );
    });
  }, [filters, locale, query]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('directory.title')}
        </h1>
        <p className="text-muted-foreground">{t('directory.subtitle')}</p>
      </header>

      <Card className="border-border/60 bg-muted/20">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[240px] flex-1 space-y-2">
              <Label htmlFor="directory-search" className="text-xs font-semibold uppercase tracking-wide">
                {t('directory.searchPlaceholder')}
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="directory-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('directory.searchPlaceholder') ?? ''}
                  className="h-11 rounded-2xl border-border/60 pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="min-w-[140px] space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide">
                  {t('directory.filters.classYear')}
                </Label>
                <select
                  className="w-full rounded-2xl border border-border/60 bg-background px-3 py-2 text-sm"
                  value={filters.classYear}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, classYear: event.target.value }))
                  }
                >
                  <option value="all">{t('directory.filters.any')}</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[140px] space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide">
                  {t('directory.filters.location')}
                </Label>
                <select
                  className="w-full rounded-2xl border border-border/60 bg-background px-3 py-2 text-sm"
                  value={filters.location}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, location: event.target.value }))
                  }
                >
                  <option value="all">{t('directory.filters.any')}</option>
                  {locationOptions.map(([key, label]) => (
                    <option key={key} value={key}>
                      {locale === 'tr' ? label.tr : label.en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[140px] space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide">
                  {t('directory.filters.industry')}
                </Label>
                <select
                  className="w-full rounded-2xl border border-border/60 bg-background px-3 py-2 text-sm"
                  value={filters.industry}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, industry: event.target.value }))
                  }
                >
                  <option value="all">{t('directory.filters.any')}</option>
                  {industryOptions.map(([key, label]) => (
                    <option key={key} value={key}>
                      {locale === 'tr' ? label.tr : label.en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[140px] space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide">
                  {t('directory.filters.skill')}
                </Label>
                <select
                  className="w-full rounded-2xl border border-border/60 bg-background px-3 py-2 text-sm"
                  value={filters.skill}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, skill: event.target.value }))
                  }
                >
                  <option value="all">{t('directory.filters.any')}</option>
                  {skillOptions.map((skill) => (
                    <option key={skill} value={skill.toLowerCase()}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full whitespace-nowrap"
              onClick={() => {
                setQuery('');
                setFilters({ classYear: 'all', location: 'all', industry: 'all', skill: 'all' });
              }}
            >
              {t('directory.filters.clear')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredEntries.map((entry) => {
          const localized = entry.locales[locale] ?? entry.locales.en;
          return (
            <Card key={entry.id} className="flex flex-col gap-4 border-border/60 p-5">
              <div className="flex items-start gap-4">
                <Avatar src={entry.avatar} name={localized.name} className="h-16 w-16" />
                <div className="space-y-1">
                  <CardTitle className="text-lg">{localized.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {localized.title}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {localized.department} · {entry.classYear}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {localized.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {localized.location}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{localized.bio}</p>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('directory.labels.skills')}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {localized.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="rounded-full">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('directory.labels.interests')}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {localized.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="rounded-full">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="default" className="rounded-full px-4">
                  <Mail className="mr-2 h-4 w-4" />
                  {t('directory.actions.message')}
                </Button>
                <Button variant="outline" className="rounded-full px-4">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('directory.actions.connect')}
                </Button>
                <Badge variant="secondary" className="rounded-full">
                  {localized.industryLabel}
                </Badge>
              </div>
            </Card>
          );
        })}
        {filteredEntries.length === 0 && (
          <Card className="col-span-full border-dashed">
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              {t('directory.empty')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
