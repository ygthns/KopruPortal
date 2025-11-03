import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CalendarCheck,
  Coins,
  Compass,
  Flame,
  HandHeart,
  Home,
  Layers,
  ListChecks,
  MessageSquare,
  Podcast,
  ShieldCheck,
  Sparkles,
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
  { key: 'home', path: '/', icon: Home },
  { key: 'feed', path: '/feed', icon: Activity },
  { key: 'forums', path: '/forums', icon: MessageSquare },
  { key: 'messages', path: '/messages', icon: Users2 },
  { key: 'directory', path: '/directory', icon: Compass },
  { key: 'groups', path: '/groups', icon: Users },
  { key: 'mentoring', path: '/mentoring', icon: Brain },
  { key: 'careers', path: '/careers', icon: Building2 },
  { key: 'events', path: '/events', icon: CalendarCheck },
  { key: 'fundraising', path: '/fundraising', icon: Coins },
  { key: 'analytics', path: '/analytics', icon: BarChart3 },
  { key: 'admin', path: '/admin', icon: ShieldCheck },
  { key: 'premium', path: '/premium', icon: Sparkles },
  { key: 'perks', path: '/perks', icon: HandHeart },
  { key: 'podcast', path: '/podcast', icon: Podcast },
  { key: 'volunteer', path: '/volunteer', icon: ListChecks },
  { key: 'challenges', path: '/challenges', icon: Flame },
  { key: 'leaderboards', path: '/leaderboards', icon: Layers },
  { key: 'integrations', path: '/integrations', icon: Telescope },
  { key: 'auth', path: '/auth', icon: BookOpen, secondary: true },
];
