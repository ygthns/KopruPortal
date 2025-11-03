import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartHandshake, PiggyBank } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';

export default function FundraisingPage() {
  const { t } = useTranslation();
  const campaigns = useDemoStore((state) => state.campaigns);
  const donateToCampaign = useDemoStore((state) => state.donateToCampaign);
  const createCampaign = useDemoStore((state) => state.createCampaign);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [amount, setAmount] = useState(250);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    goal: 50000,
  });
  const { toast } = useToast();

  const activeCampaign = campaigns.find(
    (campaign) => campaign.id === activeCampaignId,
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('fundraising.title')}
        </h1>
        <p className="text-muted-foreground">{t('fundraising.subtitle')}</p>
        <Button
          variant="outline"
          className="w-fit rounded-full"
          onClick={() => setAdminOpen(true)}
        >
          <PiggyBank className="mr-2 h-4 w-4" />
          {t('fundraising.actions.launch')}
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                <span>
                  {t('fundraising.labels.raised', { amount: campaign.raised })}
                </span>
                <span>
                  {t('fundraising.labels.goal', { goal: campaign.goal })}
                </span>
              </div>
              <Progress value={campaign.progress} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {campaign.donors} {t('fundraising.labels.donors')}
                </span>
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveCampaignId(campaign.id)}
                >
                  {t('fundraising.actions.donate')}
                </Button>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {campaign.impactHighlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2">
                    <HeartHandshake className="h-3 w-3 text-primary" />
                    {highlight}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={Boolean(activeCampaign)}
        onOpenChange={(open) => !open && setActiveCampaignId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('fundraising.dialog.title', { name: activeCampaign?.name })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="number"
              min={50}
              step={50}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
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
                donateToCampaign(activeCampaign.id, amount);
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
            <Input
              placeholder={t('fundraising.admin.description')}
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
