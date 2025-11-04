import {
  Activity,
  Brain,
  Building2,
  CalendarCheck,
  Coins,
  Compass,
  HandHeart,
  BookOpen,
  Telescope,
  Users,
  Users2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  key: string;
  path: string;
  icon: LucideIcon;
  secondary?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { key: 'feed', path: '/feed', icon: Activity },
  { key: 'messages', path: '/messages', icon: Users2 },
  { key: 'directory', path: '/directory', icon: Compass },
  { key: 'groups', path: '/groups', icon: Users },
  { key: 'mentoring', path: '/mentoring', icon: Brain },
  { key: 'careers', path: '/careers', icon: Building2 },
  { key: 'events', path: '/events', icon: CalendarCheck },
  { key: 'fundraising', path: '/fundraising', icon: Coins },
  { key: 'integrations', path: '/integrations', icon: Telescope },
  { key: 'perks', path: '/perks', icon: HandHeart, secondary: true },
  { key: 'auth', path: '/auth', icon: BookOpen, secondary: true },
];
