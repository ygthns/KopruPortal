import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FadeIn } from '@/components/animated/fade-in';
import { MotionCard } from '@/components/animated/motion-card';
import { NAV_ITEMS } from '@/lib/navigation';

export default function HomePage() {
  const { t } = useTranslation();

  const hero = t('home.hero', { returnObjects: true }) as {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    trust: string[];
    badges: string[];
  };

  const metrics = useMemo(
    () =>
      t('home.metrics', { returnObjects: true }) as {
        value: string;
        label: string;
      }[],
    [t],
  );

  const features = useMemo(
    () =>
      t('home.featureHighlights', { returnObjects: true }) as {
        key: string;
        title: string;
        description: string;
      }[],
    [t],
  );

  const workflows = useMemo(
    () =>
      t('home.workflows', { returnObjects: true }) as {
        title: string;
        description: string;
        cta: string;
        href: string;
      }[],
    [t],
  );

  const testimonials = useMemo(
    () =>
      t('home.testimonials', { returnObjects: true }) as {
        quote: string;
        author: string;
        role: string;
      }[],
    [t],
  );

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[3rem] border border-border/60 bg-background/80 p-8 shadow-card">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex flex-wrap gap-2">
              {hero.badges?.map((badge) => (
                <Badge key={badge} variant="muted">
                  {badge}
                </Badge>
              ))}
            </div>
            <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
              {hero.title}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full px-6" asChild>
                <Link to="/auth">{hero.primaryCta}</Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-6"
                asChild
              >
                <Link to="/demo">{hero.secondaryCta}</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-success" />
              {hero.trust?.map((item) => (
                <span key={item} className="rounded-full bg-muted px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 p-6"
          >
            <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="grid gap-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </span>
                  <span className="text-2xl font-semibold text-foreground">
                    {metric.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <MotionCard key={feature.key} delay={index * 0.05}>
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="w-fit">
                {t(`nav.${feature.key}`, feature.title)}
              </Badge>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <Link
                to={
                  NAV_ITEMS.find((item) => item.key === feature.key)?.path ??
                  '/'
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                {t('common.actions.learnMore')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Sparkles className="h-6 w-6 text-primary/70" />
            </CardContent>
          </MotionCard>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {workflows.map((workflow, index) => (
          <FadeIn key={workflow.title} delay={index * 0.1}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{workflow.title}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="px-0">
                  <Link to={workflow.href}>
                    {workflow.cta}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </section>

      <section className="rounded-3xl border border-border/60 bg-muted/30 p-8">
        <h2 className="font-display text-2xl font-semibold">
          {t('home.testimonialsHeading')}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.author} delay={index * 0.1}>
              <blockquote className="rounded-2xl border border-border/70 bg-background/80 p-6 text-sm text-muted-foreground">
                <p className="text-base text-foreground">{testimonial.quote}</p>
                <footer className="mt-4">
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div>{testimonial.role}</div>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
