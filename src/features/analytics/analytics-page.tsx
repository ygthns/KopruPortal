import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDemoStore } from '@/store/use-demo-store';
import { formatNumber } from '@/lib/utils';

export default function AnalyticsPage() {
  const { t, i18n } = useTranslation();
  const metrics = useDemoStore((state) => state.analytics);

  const engagementTrend = useMemo(
    () =>
      metrics
        .find((metric) => metric.id === 'engagement')
        ?.trend?.map((value, index) => ({
          month: t(`analytics.months.${index}`),
          value,
        })) ?? [],
    [metrics, t],
  );

  const retentionTrend = useMemo(
    () =>
      metrics
        .find((metric) => metric.id === 'retention')
        ?.trend?.map((value, index) => ({
          month: t(`analytics.months.${index}`),
          value,
        })) ?? [],
    [metrics, t],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('analytics.title')}
        </h1>
        <p className="text-muted-foreground">{t('analytics.subtitle')}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.id} className="border border-border/60">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <CardDescription>{metric.unit}</CardDescription>
              </div>
              {metric.delta && (
                <Badge variant="secondary">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  {metric.delta}%
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {formatNumber(metric.value, i18n.language)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle>{t('analytics.charts.engagement.title')}</CardTitle>
            <CardDescription>
              {t('analytics.charts.engagement.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend}>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="rgba(148, 163, 184, 0.2)"
                />
                <XAxis dataKey="month" stroke="rgba(148, 163, 184, 0.6)" />
                <YAxis stroke="rgba(148, 163, 184, 0.6)" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle>{t('analytics.charts.retention.title')}</CardTitle>
            <CardDescription>
              {t('analytics.charts.retention.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionTrend}>
                <defs>
                  <linearGradient
                    id="colorRetention"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="rgba(148, 163, 184, 0.2)"
                />
                <XAxis dataKey="month" stroke="rgba(148, 163, 184, 0.6)" />
                <YAxis stroke="rgba(148, 163, 184, 0.6)" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorRetention)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
