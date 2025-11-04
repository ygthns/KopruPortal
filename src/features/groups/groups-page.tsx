import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, MessageSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useDemoStore } from '@/store/use-demo-store';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GroupsPage() {
  const { t } = useTranslation();
  const groups = useDemoStore((state) => state.groups);
  const events = useDemoStore((state) => state.events);
  const posts = useDemoStore((state) => state.posts);
  const leaveGroup = useDemoStore((state) => state.leaveGroup);
  const createPost = useDemoStore((state) => state.createPost);
  const submitGroupApplication = useDemoStore(
    (state) => state.submitGroupApplication,
  );
  const groupApplications = useDemoStore((state) => state.groupApplications);
  const viewer = useDemoStore((state) =>
    state.users.find((user) => user.id === state.viewerId),
  );
  const { toast } = useToast();

  const [activeGroupId, setActiveGroupId] = useState<string | null>(
    groups[0]?.id ?? null,
  );
  const [messageDraft, setMessageDraft] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const approvedApplicationsRef = useRef(new Set<string>());

  const activeGroup = useMemo(
    () => groups.find((group) => group.id === activeGroupId),
    [groups, activeGroupId],
  );

  const groupEvents = useMemo(() => {
    if (!activeGroup) return [];
    return events.filter((event) =>
      event.tags.some(
        (tag) => tag === activeGroup.id || tag === activeGroup.category,
      ),
    );
  }, [events, activeGroup]);

  const groupPosts = useMemo(() => {
    if (!activeGroup) return [];
    return posts
      .filter((post) => post.tags.includes(activeGroup.id))
      .slice(0, 5);
  }, [posts, activeGroup]);

  const activeApplication = useMemo(() => {
    if (!activeGroupId) return undefined;
    return groupApplications.find(
      (application) => application.groupId === activeGroupId,
    );
  }, [groupApplications, activeGroupId]);

  useEffect(() => {
    groupApplications.forEach((application) => {
      if (application.status !== 'approved') return;
      if (approvedApplicationsRef.current.has(application.id)) return;
      approvedApplicationsRef.current.add(application.id);
      const approvedGroup = groups.find(
        (group) => group.id === application.groupId,
      );
      toast({
        variant: 'success',
        title: t('groups.toasts.applicationApproved', {
          group: approvedGroup?.name,
        }),
        description: t('groups.toasts.applicationApprovedDescription'),
      });
    });
  }, [groupApplications, groups, toast, t]);

  const resetApplicationForm = () => {
    setApplicationForm({
      name: viewer?.name ?? '',
      email: '',
      phone: '',
    });
  };

  useEffect(() => {
    if (!isDialogOpen) return;
    resetApplicationForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  const handleApplicationSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!activeGroup) return;

    const trimmed = {
      name: applicationForm.name.trim(),
      email: applicationForm.email.trim(),
      phone: applicationForm.phone.trim(),
    };

    if (!trimmed.name || !trimmed.email || !trimmed.phone) {
      toast({
        variant: 'destructive',
        title: t('groups.toasts.applicationValidationError'),
        description: t('groups.toasts.applicationValidationDescription'),
      });
      return;
    }

    const application = submitGroupApplication({
      groupId: activeGroup.id,
      ...trimmed,
    });

    if (application) {
      toast({
        variant: 'success',
        title: t('groups.toasts.applicationSubmitted', {
          group: activeGroup.name,
        }),
        description: t('groups.toasts.applicationSubmittedDescription'),
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          resetApplicationForm();
        }
      }}
    >
      {activeGroup && isDialogOpen && (
        <DialogContent className="max-w-xl">
          <form className="space-y-6" onSubmit={handleApplicationSubmit}>
            <DialogHeader>
              <DialogTitle>
                {t('groups.application.title', { group: activeGroup.name })}
              </DialogTitle>
              <DialogDescription>
                {t('groups.application.subtitle')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="club-application-name">
                    {t('groups.application.fields.name')}
                  </Label>
                  <Input
                    id="club-application-name"
                    value={applicationForm.name}
                    onChange={(event) =>
                      setApplicationForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder={t('groups.application.placeholders.name')}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="club-application-email">
                    {t('groups.application.fields.email')}
                  </Label>
                  <Input
                    id="club-application-email"
                    type="email"
                    value={applicationForm.email}
                    onChange={(event) =>
                      setApplicationForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder={t('groups.application.placeholders.email')}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="club-application-phone">
                  {t('groups.application.fields.phone')}
                </Label>
                <Input
                  id="club-application-phone"
                  value={applicationForm.phone}
                  onChange={(event) =>
                    setApplicationForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  placeholder={t('groups.application.placeholders.phone')}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('groups.application.notice')}
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {t('common.actions.cancel')}
              </Button>
              <Button type="submit" className="rounded-full px-6">
                {t('groups.application.actions.submit')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}

      <div className="space-y-8">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-semibold">
            {t('groups.title')}
          </h1>
          <p className="text-muted-foreground">{t('groups.subtitle')}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="space-y-4">
            {groups.map((group) => {
              const isActive = group.id === activeGroupId;
              const status = group.membershipStatus;
              const isMember = status === 'member';
              const isPending = status === 'pending';
              const statusLabel = isMember
                ? t('groups.status.member')
                : isPending
                  ? t('groups.status.pending')
                  : t('groups.status.open');
              const statusBadgeVariant = isMember
                ? 'default'
                : isPending
                  ? 'secondary'
                  : 'outline';

              return (
                <Card
                  key={group.id}
                  className={isActive ? 'border-primary shadow-card' : ''}
                >
                  <CardHeader className="flex-row items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>{group.category}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="muted">
                        {group.memberCount} {t('groups.labels.members')}
                      </Badge>
                      <Badge variant={statusBadgeVariant}>{statusLabel}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {group.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {group.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={
                          isMember ? 'secondary' : isPending ? 'outline' : 'default'
                        }
                        className="flex-1 rounded-full"
                        disabled={isPending}
                        onClick={() => {
                          if (isMember) {
                            leaveGroup(group.id);
                            toast({
                              variant: 'warning',
                              title: t('groups.toasts.left'),
                            });
                            return;
                          }

                          if (isPending) return;

                          setActiveGroupId(group.id);
                          resetApplicationForm();
                          setIsDialogOpen(true);
                        }}
                      >
                        {isMember
                          ? t('groups.actions.leave')
                          : isPending
                            ? t('groups.status.pending')
                            : t('groups.actions.join')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => setActiveGroupId(group.id)}
                      >
                        {t('groups.actions.view')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-6 rounded-3xl border border-border/60 bg-muted/20 p-6">
            {activeGroup ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {activeGroup.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t('groups.feedDescription', { group: activeGroup.name })}
                  </p>
                </div>

                {activeGroup.membershipStatus === 'pending' && (
                  <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary">
                    {t('groups.statusMessages.pending')}
                    {activeApplication && (
                      <p className="mt-2 text-xs text-primary/80">
                        {t('groups.statusMessages.pendingDetails', {
                          email: activeApplication.email,
                          phone: activeApplication.phone,
                        })}
                      </p>
                    )}
                  </div>
                )}

                {activeGroup.membershipStatus === 'member' && (
                  <div className="rounded-2xl border border-dashed border-emerald-400/50 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                    {t('groups.statusMessages.member')}
                  </div>
                )}

                <Separator />
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {t('groups.labels.upcomingEvents')}
                  </h3>
                  {groupEvents.length > 0 ? (
                    groupEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-2xl border border-border/60 bg-background/90 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">
                              {event.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {event.date} - {event.time} - {event.location}
                            </p>
                          </div>
                          <Badge
                            variant={
                              event.type === 'virtual' ? 'secondary' : 'muted'
                            }
                          >
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t('groups.emptyEvents')}
                    </p>
                  )}
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {t('groups.labels.wall')}
                  </h3>
                  <form
                    className="space-y-3 rounded-2xl border border-dashed border-border/60 bg-background/80 p-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (!messageDraft.trim() || !activeGroup) return;
                      createPost({
                        content: messageDraft,
                        tags: [activeGroup.id],
                      });
                      setMessageDraft('');
                      toast({
                        variant: 'success',
                        title: t('groups.toasts.messagePosted'),
                      });
                    }}
                  >
                    <Textarea
                      value={messageDraft}
                      onChange={(event) => setMessageDraft(event.target.value)}
                      placeholder={t('groups.placeholders.message')}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" className="rounded-full px-6">
                        {t('groups.actions.post')}
                      </Button>
                    </div>
                  </form>
                  {groupPosts.length > 0 ? (
                    groupPosts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-2xl border border-border/60 bg-background/90 p-4"
                      >
                        <p className="text-sm text-foreground">{post.content}</p>
                        <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="muted">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t('groups.emptyFeed')}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
                {t('groups.empty')}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
