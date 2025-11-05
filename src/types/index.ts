export type LanguageCode = 'en' | 'tr';

export type Role = 'admin' | 'staff' | 'alumni' | 'student' | 'mentor';

export type ThemePreference = 'light' | 'dark' | 'system';

export type MembershipStatus = 'member' | 'pending' | 'invited' | 'owner';

export type ReactionType = 'like' | 'celebrate' | 'insightful' | 'support';

export type ContentMedia = {
  type: 'image' | 'video' | 'document' | 'link';
  url: string;
  thumbnail?: string;
  title?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  role: Role;
  title: string;
  organization?: string;
  avatar?: string;
  bio: string;
  classYear: string;
  location: string;
  industry: string;
  skills: string[];
  interests: string[];
  languages: LanguageCode[];
  badges: string[];
  headline?: string;
  mentorStatus?: 'available' | 'limited' | 'unavailable';
  preferredMentoringTopics?: string[];
};

export type Comment = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  reactions: Partial<Record<ReactionType, number>>;
};

export type FeedPost = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  audience: string[];
  tags: string[];
  media?: ContentMedia[];
  comments: Comment[];
  reactions: Partial<Record<ReactionType, number>>;
  reposts?: number;
  isPinned?: boolean;
  translatedContent?: Record<LanguageCode, string>;
};

export type ForumTopic = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  pinned?: boolean;
  lastActivity: string;
  replies: number;
};

export type ForumThread = {
  id: string;
  topicId: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
  replies: Comment[];
};

export type Message = {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
  attachments?: ContentMedia[];
  status: 'sent' | 'delivered' | 'seen';
};

export type MessageThread = {
  id: string;
  participantIds: string[];
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
  typing?: boolean;
};

export type DirectoryFacet = {
  key: string;
  labelKey: string;
  options: string[];
};

export type Group = {
  id: string;
  name: string;
  description: string;
  category: string;
  coverImage?: string;
  memberCount: number;
  membershipStatus: MembershipStatus;
  tags: string[];
  events: Event[];
};

export type GroupApplication = {
  id: string;
  groupId: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved';
  submittedAt: string;
};

export type MentorshipMatch = {
  id: string;
  mentorId: string;
  menteeId: string;
  goals: string[];
  progress: number;
  status: 'requested' | 'in_progress' | 'completed';
  notes?: string[];
};

export type FlashSession = {
  id: string;
  mentorId: string;
  menteeId?: string;
  startTime: string;
  durationMinutes: number;
  topic: string;
  status: 'available' | 'held' | 'upcoming';
};

export type JobPosting = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
  tags: string[];
  description: string;
  saved?: boolean;
};

export type ResumeAnalysis = {
  id: string;
  score: number;
  highlights: string[];
  suggestions: string[];
  recommendedAlumni: string[];
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  tags: string[];
  registered: boolean;
  capacity: number;
  attendees: number;
  organizerId: string;
  integrations?: string[];
};

export type FundraisingCampaign = {
  id: string;
  name: string;
  description: string;
  goal: number;
  raised: number;
  donors: number;
  progress: number;
  impactHighlights: string[];
};

export type AnalyticsMetric = {
  id: string;
  label: string;
  value: number;
  delta?: number;
  unit?: string;
  trend?: number[];
};

export type AdminTask = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved';
  assigneeId?: string;
  createdAt: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
};

export type IntegrationStub = {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'available' | 'coming_soon';
};

export type LeaderboardEntry = {
  id: string;
  userId: string;
  score: number;
  segment: string;
  badgeIds: string[];
};

export type Challenge = {
  id: string;
  title: string;
  theme: string;
  month: string;
  participants: number;
  submissions: number;
  leaderboard: LeaderboardEntry[];
  prize: string;
};

export type VolunteerOpportunity = {
  id: string;
  title: string;
  organization: string;
  impact: string;
  registered: boolean;
  hours: number;
  needed: number;
  participants: number;
  category: string;
};

export type Perk = {
  id: string;
  partner: string;
  description: string;
  discountCode: string;
  category: string;
  claimed: boolean;
};

export type PodcastEpisode = {
  id: string;
  title: string;
  description: string;
  duration: string;
  guest: string;
  releaseDate: string;
  type: 'podcast' | 'blog';
};

export type DigitalCard = {
  id: string;
  userId: string;
  qrCode: string;
  expiresAt: string;
};
