import type { RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import HomePage from '@/features/home/home-page';
import FeedPage from '@/features/feed/feed-page';
import ForumsPage from '@/features/forums/forums-page';
import MessagesPage from '@/features/messages/messages-page';
import DirectoryPage from '@/features/directory/directory-page';
import GroupsPage from '@/features/groups/groups-page';
import MentoringPage from '@/features/mentoring/mentoring-page';
import CareersPage from '@/features/careers/careers-page';
import EventsPage from '@/features/events/events-page';
import FundraisingPage from '@/features/fundraising/fundraising-page';
import AnalyticsPage from '@/features/analytics/analytics-page';
import AdminPage from '@/features/admin/admin-page';
import PremiumPage from '@/features/premium/premium-page';
import PerksPage from '@/features/perks/perks-page';
import PodcastPage from '@/features/podcast/podcast-page';
import VolunteerPage from '@/features/volunteer/volunteer-page';
import ChallengesPage from '@/features/challenges/challenges-page';
import LeaderboardsPage from '@/features/leaderboards/leaderboards-page';
import IntegrationsPage from '@/features/integrations/integrations-page';
import AuthPage from '@/features/auth/auth-page';
import StaticContentPage from '@/pages/static-content-page';

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/feed', element: <FeedPage /> },
      { path: '/forums', element: <ForumsPage /> },
      { path: '/messages', element: <MessagesPage /> },
      { path: '/directory', element: <DirectoryPage /> },
      { path: '/groups', element: <GroupsPage /> },
      { path: '/mentoring', element: <MentoringPage /> },
      { path: '/careers', element: <CareersPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/fundraising', element: <FundraisingPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/admin', element: <AdminPage /> },
      { path: '/premium', element: <PremiumPage /> },
      { path: '/perks', element: <PerksPage /> },
      { path: '/podcast', element: <PodcastPage /> },
      { path: '/volunteer', element: <VolunteerPage /> },
      { path: '/challenges', element: <ChallengesPage /> },
      { path: '/leaderboards', element: <LeaderboardsPage /> },
      { path: '/integrations', element: <IntegrationsPage /> },
      { path: '/auth', element: <AuthPage /> },
      {
        path: '/contact',
        element: (
          <StaticContentPage
            titleKey="footer.contact"
            bodyKey="static.contact"
          />
        ),
      },
      {
        path: '/privacy',
        element: (
          <StaticContentPage
            titleKey="footer.privacy"
            bodyKey="static.privacy"
          />
        ),
      },
      {
        path: '/about',
        element: (
          <StaticContentPage titleKey="footer.terms" bodyKey="static.terms" />
        ),
      },
    ],
  },
];
