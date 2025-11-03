import { MoonStar, SunMedium, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/use-settings';

const themes = [
  { id: 'light', label: 'Light', icon: SunMedium },
  { id: 'dark', label: 'Dark', icon: MoonStar },
  { id: 'system', label: 'System', icon: Monitor },
] as const;

export function ThemeToggle() {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const ActiveIcon =
    themes.find((theme) => theme.id === themeMode)?.icon ?? SunMedium;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-full px-3"
          aria-label="Toggle theme"
        >
          <ActiveIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{themeMode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {themes.map(({ id, label, icon: Icon }) => (
          <DropdownMenuItem key={id} onSelect={() => setThemeMode(id)}>
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
