import { MoonStar, SunMedium, Monitor } from 'lucide-react';
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

const themeOptions = [
  { id: 'light', labelKey: 'common.theme.light', icon: SunMedium },
  { id: 'dark', labelKey: 'common.theme.dark', icon: MoonStar },
  { id: 'system', labelKey: 'common.theme.system', icon: Monitor },
] as const;

export function ThemeToggle() {
  const { t } = useTranslation();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const activeTheme =
    themeOptions.find((theme) => theme.id === themeMode) ?? themeOptions[0];
  const ActiveIcon = activeTheme.icon;
  const activeLabel = t(activeTheme.labelKey);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-full px-3"
          aria-label={t('common.theme.label')}
        >
          <ActiveIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{activeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t('common.theme.label')}</DropdownMenuLabel>
        {themeOptions.map(({ id, labelKey, icon: Icon }) => (
          <DropdownMenuItem key={id} onSelect={() => setThemeMode(id)}>
            <Icon className="mr-2 h-4 w-4" />
            {t(labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
