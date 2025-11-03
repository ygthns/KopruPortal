import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function AuthPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if ([...form.entries()].some(([, value]) => `${value}`.trim() === '')) {
      toast({ variant: 'warning', title: t('auth.toasts.missing') });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ variant: 'success', title: t('auth.toasts.success') });
    }, 800);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="text-center">
        <h1 className="font-display text-3xl font-semibold">
          {t('auth.title')}
        </h1>
        <p className="text-muted-foreground">{t('auth.subtitle')}</p>
      </header>

      <Tabs defaultValue="signin" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signin">{t('auth.tabs.signin')}</TabsTrigger>
          <TabsTrigger value="signup">{t('auth.tabs.signup')}</TabsTrigger>
          <TabsTrigger value="forgot">{t('auth.tabs.forgot')}</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>{t('auth.signin.title')}</CardTitle>
              <CardDescription>{t('auth.signin.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder={t('auth.labels.password')}
                />
                <div className="flex flex-col gap-2">
                  <Button disabled={loading} className="rounded-full">
                    {t('auth.actions.signin')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                  >
                    {t('auth.actions.google')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>{t('auth.signup.title')}</CardTitle>
              <CardDescription>{t('auth.signup.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <Input name="name" placeholder={t('auth.labels.fullName')} />
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder={t('auth.labels.password')}
                />
                <Button disabled={loading} className="w-full rounded-full">
                  {t('auth.actions.signup')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forgot">
          <Card>
            <CardHeader>
              <CardTitle>{t('auth.forgot.title')}</CardTitle>
              <CardDescription>{t('auth.forgot.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
                <Button disabled={loading} className="w-full rounded-full">
                  {t('auth.actions.reset')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
