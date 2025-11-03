import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/use-settings';

export function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const handleChange = (lng: 'en' | 'tr') => {
    setLanguage(lng);
    void i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-full px-3">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium uppercase">
            {language === 'en' ? 'EN' : 'TR'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t('footer.language')}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => handleChange('en')}>
          🇺🇸 {t('common.language.en')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleChange('tr')}>
          🇹🇷 {t('common.language.tr')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
