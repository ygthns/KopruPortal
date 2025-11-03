import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDemoStore } from '@/store/use-demo-store';
import { useSettingsStore } from '@/store/use-settings';
import { THEME_PRESETS } from '@/lib/theme';
import { useToast } from '@/components/ui/use-toast';

export default function AdminPage() {
  const { t } = useTranslation();
  const users = useDemoStore((state) => state.users);
  const exportUserData = useDemoStore((state) => state.exportUserData);
  const deleteDemoUser = useDemoStore((state) => state.deleteDemoUser);
  const themePresetId = useSettingsStore((state) => state.themePresetId);
  const setThemePreset = useSettingsStore((state) => state.setThemePreset);
  const [flaggedContent, setFlaggedContent] = useState('');
  const { toast } = useToast();

  const handleExport = () => {
    const blob = exportUserData();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'koprumezun-demo.json';
    anchor.click();
    URL.revokeObjectURL(url);
    toast({
      variant: 'success',
      title: t('admin.toasts.exported'),
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold">
          {t('admin.title')}
        </h1>
        <p className="text-muted-foreground">{t('admin.subtitle')}</p>
      </header>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">{t('admin.tabs.users')}</TabsTrigger>
          <TabsTrigger value="branding">{t('admin.tabs.branding')}</TabsTrigger>
          <TabsTrigger value="privacy">{t('admin.tabs.privacy')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.users.title')}</CardTitle>
              <CardDescription>{t('admin.users.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3"
                >
                  <div>
                    <div className="font-semibold text-foreground">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{user.role}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        useDemoStore.setState((state) => ({
                          users: state.users.map((item) =>
                            item.id === user.id
                              ? {
                                  ...item,
                                  role:
                                    item.role === 'alumni'
                                      ? 'mentor'
                                      : 'alumni',
                                }
                              : item,
                          ),
                        }));
                        toast({
                          variant: 'success',
                          title: t('admin.toasts.roleUpdated'),
                        });
                      }}
                    >
                      {t('admin.users.actions.upgrade')}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.moderation.title')}</CardTitle>
              <CardDescription>
                {t('admin.moderation.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                placeholder={t('admin.moderation.placeholder')}
                value={flaggedContent}
                onChange={(event) => setFlaggedContent(event.target.value)}
              />
              <Button
                className="rounded-full"
                onClick={() => {
                  setFlaggedContent('');
                  toast({
                    variant: 'success',
                    title: t('admin.toasts.flagResolved'),
                  });
                }}
              >
                {t('admin.moderation.actions.resolve')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.branding.title')}</CardTitle>
              <CardDescription>{t('admin.branding.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setThemePreset(preset.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    themePresetId === preset.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border/60 bg-muted/30'
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">
                    {preset.label}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {preset.description}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {Object.entries(preset.cssVars).map(([key, value]) => (
                      <span
                        key={key}
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: `hsl(${value})` }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.privacy.title')}</CardTitle>
              <CardDescription>{t('admin.privacy.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button className="rounded-full" onClick={handleExport}>
                {t('admin.privacy.actions.export')}
              </Button>
              <Button
                variant="destructive"
                className="rounded-full"
                onClick={() => {
                  deleteDemoUser();
                  toast({
                    variant: 'warning',
                    title: t('admin.toasts.userDeleted'),
                  });
                }}
              >
                {t('admin.privacy.actions.delete')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
