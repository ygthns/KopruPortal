import { Mail, Shield, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/shared/brand-logo';

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/60 bg-background/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-3">
          <BrandLogo compact />
          <h3 className="font-display text-lg font-semibold text-foreground">
            {t('footer.aboutTitle')}
          </h3>
          <p className="text-sm text-muted-foreground">{t('footer.about')}</p>
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground">
          <Link
            to="/contact"
            className="flex items-center gap-2 hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            {t('footer.contact')}
          </Link>
          <Link
            to="/privacy"
            className="flex items-center gap-2 hover:text-foreground"
          >
            <Shield className="h-4 w-4" />
            {t('footer.privacy')}
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-2 hover:text-foreground"
          >
            <Info className="h-4 w-4" />
            {t('footer.terms')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
