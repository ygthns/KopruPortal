import { useTranslation } from 'react-i18next';
import { Gift } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';

export default function PerksPage() {
  const { t } = useTranslation();
  const perks = useDemoStore((state) => state.perks);
  const claimPerk = useDemoStore((state) => state.claimPerk);
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('perks.title')}
        </h1>
        <p className="text-muted-foreground">{t('perks.subtitle')}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {perks.map((perk) => (
          <Card key={perk.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{perk.partner}</CardTitle>
                <CardDescription>{perk.category}</CardDescription>
              </div>
              <Badge variant="secondary">{perk.discountCode}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{perk.description}</p>
              <Button
                className="rounded-full"
                variant={perk.claimed ? 'secondary' : 'default'}
                onClick={() => {
                  if (perk.claimed) return;
                  claimPerk(perk.id);
                  toast({
                    variant: 'success',
                    title: t('perks.toasts.claimed'),
                  });
                }}
              >
                <Gift className="mr-2 h-4 w-4" />
                {perk.claimed
                  ? t('perks.actions.claimed')
                  : t('perks.actions.claim')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
