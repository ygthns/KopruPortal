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

const languageOptions = [
  { id: 'en', labelKey: 'common.language.en' },
  { id: 'tr', labelKey: 'common.language.tr' },
] as const;

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
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t('footer.language')}</DropdownMenuLabel>
        {languageOptions.map(({ id, labelKey }) => (
          <DropdownMenuItem
            key={id}
            onSelect={() => handleChange(id)}
            aria-label={t(labelKey)}
          >
            <span className="text-sm font-semibold uppercase">
              {id.toUpperCase()}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
