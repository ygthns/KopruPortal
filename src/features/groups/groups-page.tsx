import { useMemo, useState } from 'react';
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

export default function GroupsPage() {
  const { t } = useTranslation();
  const groups = useDemoStore((state) => state.groups);
  const events = useDemoStore((state) => state.events);
  const posts = useDemoStore((state) => state.posts);
  const joinGroup = useDemoStore((state) => state.joinGroup);
  const leaveGroup = useDemoStore((state) => state.leaveGroup);
  const createPost = useDemoStore((state) => state.createPost);
  const { toast } = useToast();

  const [activeGroupId, setActiveGroupId] = useState<string | null>(
    groups[0]?.id ?? null,
  );
  const [messageDraft, setMessageDraft] = useState('');

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

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('groups.title')}
        </h1>
        <p className="text-muted-foreground">{t('groups.subtitle')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="space-y-4">
          {groups.map((group) => (
            <Card
              key={group.id}
              className={
                group.id === activeGroupId ? 'border-primary shadow-card' : ''
              }
            >
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription>{group.category}</CardDescription>
                </div>
                <Badge variant="muted">
                  {group.memberCount} {t('groups.labels.members')}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
                <div className="flex gap-2 text-xs text-muted-foreground">
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
                      group.membershipStatus === 'member'
                        ? 'secondary'
                        : 'default'
                    }
                    className="flex-1 rounded-full"
                    onClick={() => {
                      if (group.membershipStatus === 'member') {
                        leaveGroup(group.id);
                        toast({
                          variant: 'warning',
                          title: t('groups.toasts.left'),
                        });
                      } else {
                        joinGroup(group.id);
                        setActiveGroupId(group.id);
                        toast({
                          variant: 'success',
                          title: t('groups.toasts.joined', {
                            group: group.name,
                          }),
                        });
                      }
                    }}
                  >
                    {group.membershipStatus === 'member'
                      ? t('groups.actions.leave')
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
          ))}
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
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {event.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.date} � {event.location}
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
                    if (!messageDraft.trim()) return;
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
  );
}
