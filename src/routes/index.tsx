import type { RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import FeedPage from '@/features/feed/feed-page';
import MessagesPage from '@/features/messages/messages-page';
import DirectoryPage from '@/features/directory/directory-page';
import GroupsPage from '@/features/groups/groups-page';
import MentoringPage from '@/features/mentoring/mentoring-page';
import CareersPage from '@/features/careers/careers-page';
import EventsPage from '@/features/events/events-page';
import FundraisingPage from '@/features/fundraising/fundraising-page';
import PerksPage from '@/features/perks/perks-page';
import IntegrationsPage from '@/features/integrations/integrations-page';
import AuthPage from '@/features/auth/auth-page';
import ProfilePage from '@/features/profile/profile-page';
import StaticContentPage from '@/pages/static-content-page';

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: '/feed', element: <FeedPage /> },
      { path: '/messages', element: <MessagesPage /> },
      { path: '/directory', element: <DirectoryPage /> },
      { path: '/groups', element: <GroupsPage /> },
      { path: '/mentoring', element: <MentoringPage /> },
      { path: '/careers', element: <CareersPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/fundraising', element: <FundraisingPage /> },
      { path: '/perks', element: <PerksPage /> },
      { path: '/integrations', element: <IntegrationsPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/profile', element: <ProfilePage /> },
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
