import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useDemoStore } from '@/store/use-demo-store';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const viewer = useDemoStore((state) =>
    state.users.find((user) => user.id === state.viewerId),
  );
  const updateViewer = useDemoStore((state) => state.updateViewer);
  const [formState, setFormState] = useState({
    name: '',
    title: '',
    location: '',
    classYear: '',
    industry: '',
    bio: '',
    skills: '',
    interests: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!viewer) return;
    setFormState({
      name: viewer.name,
      title: viewer.title,
      location: viewer.location,
      classYear: viewer.classYear,
      industry: viewer.industry,
      bio: viewer.bio,
      skills: viewer.skills.join(', '),
      interests: viewer.interests.join(', '),
    });
    setAvatarPreview(viewer.avatar);
  }, [viewer]);

  const initials = useMemo(
    () => (viewer ? getInitials(viewer.name) : 'KM'),
    [viewer],
  );

  if (!viewer) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {t('profile.missing')}
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateViewer({
      name: formState.name,
      title: formState.title,
      location: formState.location,
      classYear: formState.classYear,
      industry: formState.industry,
      bio: formState.bio,
      skills: formState.skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      interests: formState.interests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });
    toast({
      variant: 'success',
      title: t('profile.updated'),
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      updateViewer({ avatar: result });
      toast({
        variant: 'success',
        title: t('profile.avatarUpdated'),
      });
    };
    reader.readAsDataURL(file);
  };

  const renderBadgeList = (items: string[]) =>
    items.length === 0 ? (
      <span className="text-sm text-muted-foreground/80">
        {t('profile.empty')}
      </span>
    ) : (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.summary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={viewer.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <Avatar name={viewer.name} className="h-24 w-24 text-2xl">
                  {initials}
                </Avatar>
              )}
            </div>
            <label className="inline-flex cursor-pointer flex-col items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('profile.actions.changePhoto')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-semibold text-foreground">{viewer.name}</div>
            <div className="text-muted-foreground">{viewer.title}</div>
            <div className="text-muted-foreground">
              {viewer.location} · {viewer.classYear}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('profile.labels.skills')}
            </h3>
            <div className="mt-3">{renderBadgeList(viewer.skills)}</div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('profile.labels.interests')}
            </h3>
            <div className="mt-3">{renderBadgeList(viewer.interests)}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.editTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder={t('profile.placeholders.name')}
              />
              <Input
                value={formState.title}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                placeholder={t('profile.placeholders.title')}
              />
              <Input
                value={formState.location}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    location: event.target.value,
                  }))
                }
                placeholder={t('profile.placeholders.location')}
              />
              <Input
                value={formState.classYear}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    classYear: event.target.value,
                  }))
                }
                placeholder={t('profile.placeholders.classYear')}
              />
              <Input
                value={formState.industry}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    industry: event.target.value,
                  }))
                }
                placeholder={t('profile.placeholders.industry')}
              />
            </div>
            <Textarea
              value={formState.bio}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, bio: event.target.value }))
              }
              placeholder={t('profile.placeholders.bio')}
            />
            <Textarea
              value={formState.skills}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  skills: event.target.value,
                }))
              }
              placeholder={t('profile.placeholders.skills')}
            />
            <Textarea
              value={formState.interests}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  interests: event.target.value,
                }))
              }
              placeholder={t('profile.placeholders.interests')}
            />
            <div className="flex justify-end">
              <Button type="submit" className="rounded-full px-6">
                {t('profile.actions.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
