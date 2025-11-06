import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import {
  type AdminTask,
  type AnalyticsMetric,
  type Badge,
  type Challenge,
  type GroupApplication,
  type DigitalCard,
  type Event,
  type FeedPost,
  type FlashSession,
  type ForumThread,
  type ForumTopic,
  type FundraisingCampaign,
  type Group,
  type IntegrationStub,
  type MembershipStatus,
  type JobPosting,
  type LeaderboardEntry,
  type Comment,
  type MentorshipMatch,
  type MessageThread,
  type Perk,
  type PodcastEpisode,
  type ResumeAnalysis,
  type UserProfile,
  type VolunteerOpportunity,
} from '@/types';
import { booleanRandom, randomItem } from '@/lib/utils';

type JobApplication = {
  id: string;
  jobId: string;
  status: 'applied' | 'review' | 'interview' | 'offer';
  updatedAt: string;
};

type MentorRequest = {
  id: string;
  mentorId: string;
  goals: string[];
  status: 'pending' | 'accepted' | 'scheduled';
  createdAt: string;
};

type DemoDataState = {
  viewerId: string;
  users: UserProfile[];
  posts: FeedPost[];
  topics: ForumTopic[];
  threads: ForumThread[];
  messageThreads: MessageThread[];
  groups: Group[];
  mentorships: MentorshipMatch[];
  mentorRequests: MentorRequest[];
  flashSessions: FlashSession[];
  groupApplications: GroupApplication[];
  jobs: JobPosting[];
  resumeAnalyses: ResumeAnalysis[];
  jobApplications: JobApplication[];
  events: Event[];
  campaigns: FundraisingCampaign[];
  analytics: AnalyticsMetric[];
  adminTasks: AdminTask[];
  badges: Badge[];
  integrations: IntegrationStub[];
  leaderboard: LeaderboardEntry[];
  challenges: Challenge[];
  volunteer: VolunteerOpportunity[];
  perks: Perk[];
  podcastEpisodes: PodcastEpisode[];
  digitalCards: DigitalCard[];
};

const defaultState: DemoDataState = {
  viewerId: '',
  users: [],
  posts: [],
  topics: [],
  threads: [],
  messageThreads: [],
  groups: [],
  mentorships: [],
  mentorRequests: [],
  flashSessions: [],
  groupApplications: [],
  jobs: [],
  resumeAnalyses: [],
  jobApplications: [],
  events: [],
  campaigns: [],
  analytics: [],
  adminTasks: [],
  badges: [],
  integrations: [],
  leaderboard: [],
  challenges: [],
  volunteer: [],
  perks: [],
  podcastEpisodes: [],
  digitalCards: [],
};

type DemoActions = {
  hydrate: (data: Partial<DemoDataState>) => void;
  reset: (data?: Partial<DemoDataState>) => void;
  createPost: (payload: {
    content: string;
    tags: string[];
    media?: FeedPost['media'];
  }) => FeedPost;
  reactToPost: (
    postId: string,
    reaction: keyof NonNullable<FeedPost['reactions']>,
  ) => void;
  addComment: (
    postId: string,
    comment: Omit<
      DemoDataState['posts'][number]['comments'][number],
      'id' | 'createdAt'
    >,
  ) => void;
  joinGroup: (groupId: string) => Group | undefined;
  leaveGroup: (groupId: string) => Group | undefined;
  submitGroupApplication: (payload: {
    groupId: string;
    name: string;
    email: string;
    phone: string;
  }) => GroupApplication | undefined;
  approveGroupApplication: (
    applicationId: string,
  ) => GroupApplication | undefined;
  requestMentor: (mentorId: string, goals: string[]) => MentorRequest;
  completeMentorRequest: (requestId: string) => MentorRequest | undefined;
  scheduleFlashSession: (mentorId: string, topic: string) => FlashSession;
  applyToJob: (jobId: string) => JobApplication;
  toggleSaveJob: (jobId: string) => void;
  analyzeResume: (payload: {
    highlights: string[];
    suggestions: string[];
  }) => ResumeAnalysis;
  createEvent: (payload: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: Event['type'];
    tags: string[];
    capacity?: number;
    currency?: Event['currency'];
    ticketPrice?: number;
    ticketStatus?: Event['ticketStatus'];
    category?: string;
    translations?: Event['translations'];
  }) => Event;
  registerEvent: (eventId: string) => Event | undefined;
  donateToCampaign: (
    campaignId: string,
    amount: number,
  ) => FundraisingCampaign | undefined;
  createCampaign: (
    payload: Pick<FundraisingCampaign, 'name' | 'description' | 'goal'>,
  ) => FundraisingCampaign;
  earnBadge: (badge: Omit<Badge, 'id' | 'earnedAt'>) => Badge;
  submitChallengeProof: (
    challengeId: string,
    scoreBoost: number,
  ) => Challenge | undefined;
  claimPerk: (perkId: string) => Perk | undefined;
  replyToThread: (
    threadId: string,
    reply: Omit<Comment, 'id' | 'createdAt'>,
  ) => void;
  exportUserData: () => Blob;
  deleteDemoUser: () => void;
  updateViewer: (updates: Partial<UserProfile>) => void;
};

export type DemoStore = DemoDataState & DemoActions;

const fallbackStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  length: 0,
} as unknown as Storage;

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      hydrate: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
      reset: (data) =>
        set(() => ({
          ...defaultState,
          ...data,
        })),
      createPost: ({ content, tags, media }) => {
        const viewerId = get().viewerId;
        const newPost: FeedPost = {
          id: nanoid(),
          authorId: viewerId,
          content,
          translatedContent: undefined,
          createdAt: new Date().toISOString(),
          audience: ['all'],
          tags,
          media,
          comments: [],
          reactions: { like: 1 },
          reposts: 0,
        };
        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
        return newPost;
      },
      reactToPost: (postId, reaction) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  reactions: {
                    ...post.reactions,
                    [reaction]: (post.reactions?.[reaction] ?? 0) + 1,
                  },
                }
              : post,
          ),
        })),
      addComment: (postId, comment) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    {
                      ...comment,
                      id: nanoid(),
                      createdAt: new Date().toISOString(),
                    },
                    ...post.comments,
                  ],
                }
              : post,
          ),
        })),
      joinGroup: (groupId) => {
        let updated: Group | undefined;
        set((state) => ({
          groups: state.groups.map((group) => {
            if (group.id !== groupId) return group;
            if (group.membershipStatus === 'member') {
              updated = group;
              return group;
            }
            updated = {
              ...group,
              membershipStatus: 'member' as MembershipStatus,
              memberCount: group.memberCount + 1,
            };
            return updated;
          }),
        }));
        return updated;
      },
      leaveGroup: (groupId) => {
        let updated: Group | undefined;
        set((state) => ({
          groups: state.groups.map((group) => {
            if (group.id !== groupId) return group;
            updated = {
              ...group,
              membershipStatus: 'invited' as MembershipStatus,
              memberCount: Math.max(0, group.memberCount - 1),
            };
            return updated;
          }),
          groupApplications: state.groupApplications.filter(
            (application) => application.groupId !== groupId,
          ),
        }));
        return updated;
      },
      submitGroupApplication: ({ groupId, name, email, phone }) => {
        const targetGroup = get().groups.find((group) => group.id === groupId);
        if (!targetGroup) return undefined;

        const application: GroupApplication = {
          id: nanoid(),
          groupId,
          name,
          email,
          phone,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };

        set((state) => ({
          groupApplications: [
            application,
            ...state.groupApplications.filter(
              (item) => !(item.groupId === groupId && item.status === 'pending'),
            ),
          ],
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  membershipStatus:
                    group.membershipStatus === 'member'
                      ? ('member' as MembershipStatus)
                      : ('pending' as MembershipStatus),
                }
              : group,
          ),
        }));

        if (typeof window !== 'undefined') {
          window.setTimeout(() => {
            const current = get().groupApplications.find(
              (item) => item.id === application.id,
            );
            if (current?.status === 'pending') {
              get().approveGroupApplication(application.id);
            }
          }, 2000);
        }

        return application;
      },
      approveGroupApplication: (applicationId) => {
        let approvedApplication: GroupApplication | undefined;
        set((state) => {
          const groupApplications = state.groupApplications.map(
            (application) => {
              if (application.id !== applicationId) return application;
              approvedApplication = {
                ...application,
                status: 'approved',
              };
              return approvedApplication;
            },
          );

          if (!approvedApplication) {
            return { groupApplications };
          }

          const groups = state.groups.map((group) => {
            if (group.id !== approvedApplication!.groupId) return group;
            if (group.membershipStatus === 'member') {
              return { ...group, membershipStatus: 'member' as MembershipStatus };
            }
            return {
              ...group,
              membershipStatus: 'member' as MembershipStatus,
              memberCount: group.memberCount + 1,
            };
          });

          return {
            groupApplications,
            groups,
          };
        });

        return approvedApplication;
      },
      requestMentor: (mentorId, goals) => {
        const request: MentorRequest = {
          id: nanoid(),
          mentorId,
          goals,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          mentorRequests: [request, ...state.mentorRequests],
        }));
        if (typeof window !== 'undefined') {
          window.setTimeout(() => {
            get().completeMentorRequest(request.id);
          }, 1500);
        }
        return request;
      },
      completeMentorRequest: (requestId) => {
        let updatedRequest: MentorRequest | undefined;
        const nextStatus: MentorRequest['status'] = booleanRandom(0.8)
          ? 'accepted'
          : 'scheduled';

        set((state) => {
          const mentorRequests = state.mentorRequests.map((request) => {
            if (request.id !== requestId) {
              return request;
            }

            updatedRequest = {
              ...request,
              status: nextStatus,
            };

            return updatedRequest;
          });

          if (!updatedRequest) {
            return { mentorRequests };
          }

          const mentorships =
            nextStatus === 'accepted'
              ? [
                  {
                    id: nanoid(),
                    mentorId: updatedRequest.mentorId,
                    menteeId: state.viewerId,
                    goals: updatedRequest.goals,
                    progress: 32,
                    status: 'in_progress' as const,
                  },
                  ...state.mentorships,
                ]
              : state.mentorships;

          return {
            mentorRequests,
            mentorships,
          };
        });

        return updatedRequest;
      },
      scheduleFlashSession: (mentorId, topic) => {
        const session: FlashSession = {
          id: nanoid(),
          mentorId,
          topic,
          startTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
          durationMinutes: 10,
          status: 'upcoming',
        };
        set((state) => ({
          flashSessions: [session, ...state.flashSessions],
        }));
        return session;
      },
      applyToJob: (jobId) => {
        const existing = get().jobApplications.find(
          (item) => item.jobId === jobId,
        );
        if (existing) {
          return existing;
        }
        const application: JobApplication = {
          id: nanoid(),
          jobId,
          status: 'applied',
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          jobApplications: [application, ...state.jobApplications],
        }));
        return application;
      },
      toggleSaveJob: (jobId) =>
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === jobId ? { ...job, saved: !job.saved } : job,
          ),
        })),
      analyzeResume: ({ highlights, suggestions }) => {
        const analysis: ResumeAnalysis = {
          id: nanoid(),
          score: Math.floor(70 + Math.random() * 25),
          highlights,
          suggestions,
          recommendedAlumni: get()
            .users.filter((user) => user.role === 'alumni')
            .slice(0, 3)
            .map((user) => user.id),
        };
        set((state) => ({
          resumeAnalyses: [analysis, ...state.resumeAnalyses],
        }));
        return analysis;
      },
      createEvent: ({
        title,
        description,
        date,
        time,
        location,
        type,
        tags,
        capacity,
        currency,
        ticketPrice,
        ticketStatus,
        category,
        translations,
      }) => {
        const event: Event = {
          id: nanoid(),
          title,
          description,
          date,
          time,
          location,
          type,
          tags,
          registered: false,
          capacity: capacity ?? 100,
          attendees: 0,
          organizerId: get().viewerId || 'user-1',
          currency: currency ?? 'TRY',
          ticketPrice,
          ticketStatus:
            ticketStatus ?? (ticketPrice && ticketPrice > 0 ? 'available' : 'available'),
          category,
          translations,
        };
        set((state) => ({
          events: [event, ...state.events],
        }));
        return event;
      },
      registerEvent: (eventId) => {
        let updated: Event | undefined;
        set((state) => ({
          events: state.events.map((event) => {
            if (event.id !== eventId) return event;
            if (event.ticketStatus === 'sold_out') return event;
            const alreadyRegistered = event.registered;
            const attendees = alreadyRegistered
              ? event.attendees
              : Math.min(event.capacity, event.attendees + 1);
            updated = {
              ...event,
              registered: true,
              attendees,
              ticketStatus:
                event.ticketStatus === 'available'
                  ? 'purchased'
                  : event.ticketStatus,
            };
            return updated;
          }),
        }));
        return updated;
      },
      donateToCampaign: (campaignId, amount) => {
        let updated: FundraisingCampaign | undefined;
        set((state) => ({
          campaigns: state.campaigns.map((campaign) => {
            if (campaign.id !== campaignId) return campaign;
            const raised = campaign.raised + amount;
            updated = {
              ...campaign,
              raised,
              donors: campaign.donors + 1,
              progress: Math.min(
                100,
                Math.round((raised / campaign.goal) * 100),
              ),
            };
            return updated;
          }),
        }));
        return updated;
      },
      createCampaign: ({ name, description, goal }) => {
        const campaign: FundraisingCampaign = {
          id: nanoid(),
          name,
          description,
          goal,
          raised: 0,
          donors: 0,
          progress: 0,
          impactHighlights: [],
        };
        set((state) => ({
          campaigns: [campaign, ...state.campaigns],
        }));
        return campaign;
      },
      earnBadge: (badge) => {
        const newBadge: Badge = {
          id: nanoid(),
          earnedAt: new Date().toISOString(),
          ...badge,
        };
        set((state) => ({
          badges: [newBadge, ...state.badges],
        }));
        return newBadge;
      },
      submitChallengeProof: (challengeId, scoreBoost) => {
        let updated: Challenge | undefined;
        set((state) => ({
          challenges: state.challenges.map((challenge) => {
            if (challenge.id !== challengeId) return challenge;
            const leaderboard = challenge.leaderboard.map((entry, index) =>
              index === 0
                ? {
                    ...entry,
                    score: entry.score + scoreBoost,
                  }
                : entry,
            );
            updated = {
              ...challenge,
              submissions: challenge.submissions + 1,
              leaderboard,
            };
            return updated;
          }),
        }));
        return updated;
      },
      replyToThread: (threadId, reply) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  replies: [
                    {
                      ...reply,
                      id: nanoid(),
                      createdAt: new Date().toISOString(),
                    },
                    ...thread.replies,
                  ],
                }
              : thread,
          ),
        }));
      },
      claimPerk: (perkId) => {
        let updated: Perk | undefined;
        set((state) => ({
          perks: state.perks.map((perk) => {
            if (perk.id !== perkId) return perk;
            updated = { ...perk, claimed: true };
            return updated;
          }),
        }));
        return updated;
      },
      exportUserData: () => {
        const data = JSON.stringify(get(), null, 2);
        return new Blob([data], { type: 'application/json' });
      },
      deleteDemoUser: () => {
        const users = get().users;
        const viewer = users.find((user) => user.id === get().viewerId);
        if (!viewer) return;
        const anonymised = {
          ...viewer,
          name: 'Demo User',
          title: 'Community Member',
          bio: 'Reset for demo',
        };
        set((state) => ({
          users: state.users.map((user) =>
            user.id === anonymised.id ? anonymised : user,
          ),
        }));
      },
      updateViewer: (updates) => {
        set((state) => {
          const viewerIndex = state.users.findIndex(
            (user) => user.id === state.viewerId,
          );
          if (viewerIndex === -1) {
            return state;
          }
          const updatedUser = {
            ...state.users[viewerIndex],
            ...updates,
          };
          const users = [...state.users];
          users[viewerIndex] = updatedUser;
          return { users };
        });
      },
    }),
    {
      name: 'koprumezun.demo',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? fallbackStorage : window.localStorage,
      ),
      version: 1,
      partialize: (state) =>
        ({
          viewerId: state.viewerId,
          posts: state.posts,
          groups: state.groups,
          mentorships: state.mentorships,
          mentorRequests: state.mentorRequests,
          jobApplications: state.jobApplications,
          resumeAnalyses: state.resumeAnalyses,
          events: state.events,
          campaigns: state.campaigns,
          badges: state.badges,
          leaderboard: state.leaderboard,
          challenges: state.challenges,
          perks: state.perks,
        }) as Partial<DemoDataState>,
      migrate: (persistedState) => ({
        ...defaultState,
        ...(persistedState as DemoDataState),
      }),
    },
  ),
);

export const selectViewer = () => {
  const state = useDemoStore.getState();
  return state.users.find((user) => user.id === state.viewerId);
};

export const selectRandomMentor = () => {
  const mentors = useDemoStore
    .getState()
    .users.filter((user) => user.role === 'mentor');
  return mentors.length ? randomItem(mentors) : undefined;
};
