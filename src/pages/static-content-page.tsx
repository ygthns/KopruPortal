import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StaticContentPageProps = {
  titleKey: string;
  bodyKey: string;
};

export default function StaticContentPage({
  titleKey,
  bodyKey,
}: StaticContentPageProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.actions.viewAll')}
      </Link>
      <Card className="backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-3xl">{t(titleKey)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          {(t(bodyKey) as string)
            .split('\n')
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </CardContent>
      </Card>
      <Button asChild size="lg" className="rounded-full px-6">
        <Link to="/">{t('common.actions.start')}</Link>
      </Button>
    </div>
  );
}
