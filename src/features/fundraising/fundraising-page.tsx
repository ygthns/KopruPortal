import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartHandshake, Plus, Share2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';
import type { FundraisingCampaign, LanguageCode } from '@/types';

const getLocale = (language: string): LanguageCode =>
  (language.slice(0, 2).toLowerCase() === 'tr' ? 'tr' : 'en') as LanguageCode;

const formatAmount = (
  amount: number,
  currency: FundraisingCampaign['currency'],
  locale: LanguageCode,
) =>
  new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency: currency ?? (locale === 'tr' ? 'TRY' : 'USD'),
    maximumFractionDigits: 0,
  }).format(amount);

const getCampaignContent = (
  campaign: FundraisingCampaign,
  locale: LanguageCode,
) => {
  const localized = campaign.translations?.[locale];
  return {
    name: localized?.name ?? campaign.name,
    description: localized?.description ?? campaign.description,
    impactHighlights: localized?.impactHighlights ?? campaign.impactHighlights,
  };
};

export default function FundraisingPage() {
  const { t, i18n } = useTranslation();
  const campaigns = useDemoStore((state) => state.campaigns);
  const donateToCampaign = useDemoStore((state) => state.donateToCampaign);
  const createCampaign = useDemoStore((state) => state.createCampaign);
  const { toast } = useToast();

  const locale = useMemo(() => getLocale(i18n.language), [i18n.language]);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState(250);
  const [adminOpen, setAdminOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    goal: 50000,
  });

  const activeCampaign = campaigns.find(
    (campaign) => campaign.id === activeCampaignId,
  );
  const activeCampaignContent = activeCampaign
    ? getCampaignContent(activeCampaign, locale)
    : undefined;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold">
            {t('fundraising.title')}
          </h1>
          <p className="text-muted-foreground">{t('fundraising.subtitle')}</p>
        </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => setAdminOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('fundraising.actions.launch')}
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {campaigns.map((campaign) => {
          const localized = getCampaignContent(campaign, locale);
          const raised = formatAmount(campaign.raised, campaign.currency, locale);
          const goal = formatAmount(campaign.goal, campaign.currency, locale);
          return (
            <Card key={campaign.id} className="flex h-full flex-col border-border/60">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{localized.name}</CardTitle>
                    <CardDescription>{localized.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {campaign.currency ?? (locale === 'tr' ? 'TRY' : 'USD')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                    <span>{t('fundraising.labels.raised', { amount: raised })}</span>
                    <span>{t('fundraising.labels.goal', { goal })}</span>
                  </div>
                  <Progress value={campaign.progress} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {campaign.donors} {t('fundraising.labels.donors')}
                    </span>
                    <span>{campaign.progress}%</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {localized.impactHighlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2">
                      <HeartHandshake className="h-3 w-3 text-primary" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveCampaignId(campaign.id)}
                  >
                    {t('fundraising.actions.donate')}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Share2 className="mr-2 h-3 w-3" />
                    {t('fundraising.actions.share') ?? 'Share'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={Boolean(activeCampaign)}
        onOpenChange={(open) => !open && setActiveCampaignId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('fundraising.dialog.title', { name: activeCampaignContent?.name })}
            </DialogTitle>
            <DialogDescription>{activeCampaignContent?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="number"
              min={50}
              step={50}
              value={donationAmount}
              onChange={(event) => setDonationAmount(Number(event.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              {t('fundraising.dialog.copy')}
            </p>
          </div>
          <DialogFooter>
            <Button
              className="rounded-full"
              onClick={() => {
                if (!activeCampaign) return;
                donateToCampaign(activeCampaign.id, donationAmount);
                toast({
                  variant: 'success',
                  title: t('fundraising.toasts.donated'),
                });
                setActiveCampaignId(null);
              }}
            >
              {t('fundraising.actions.confirmDonation')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('fundraising.admin.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder={t('fundraising.admin.name')}
              value={newCampaign.name}
              onChange={(event) =>
                setNewCampaign((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
            <Textarea
              placeholder={t('fundraising.admin.description') ?? ''}
              value={newCampaign.description}
              onChange={(event) =>
                setNewCampaign((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
            <Input
              type="number"
              placeholder={t('fundraising.admin.goal')}
              value={newCampaign.goal}
              onChange={(event) =>
                setNewCampaign((prev) => ({
                  ...prev,
                  goal: Number(event.target.value),
                }))
              }
            />
          </div>
          <DialogFooter>
            <Button
              className="rounded-full"
              onClick={() => {
                if (!newCampaign.name) return;
                createCampaign(newCampaign);
                toast({
                  variant: 'success',
                  title: t('fundraising.toasts.campaignCreated'),
                });
                setNewCampaign({
                  name: '',
                  description: '',
                  goal: 50000,
                });
                setAdminOpen(false);
              }}
            >
              {t('fundraising.admin.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
