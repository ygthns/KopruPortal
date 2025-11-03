import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';
import { Avatar } from '@/components/ui/avatar';

export default function ForumsPage() {
  const { t } = useTranslation();
  const topics = useDemoStore((state) => state.topics);
  const threads = useDemoStore((state) => state.threads);
  const users = useDemoStore((state) => state.users);
  const replyToThread = useDemoStore((state) => state.replyToThread);
  const [activeTopic, setActiveTopic] = useState<string | null>(
    topics[0]?.id ?? null,
  );
  const { toast } = useToast();

  const activeThreads = useMemo(
    () => threads.filter((thread) => thread.topicId === activeTopic),
    [threads, activeTopic],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('forums.title')}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          {t('forums.subtitle')}
        </p>
      </header>

      <Tabs
        value={activeTopic ?? undefined}
        onValueChange={setActiveTopic}
        className="space-y-6"
      >
        <TabsList>
          {topics.map((topic) => (
            <TabsTrigger key={topic.id} value={topic.id}>
              {topic.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {topics.map((topic) => (
          <TabsContent key={topic.id} value={topic.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="muted">
                    #{tag}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              {activeThreads.map((thread) => {
                const author = users.find(
                  (user) => user.id === thread.authorId,
                );
                return (
                  <Card key={thread.id} className="border border-border/70">
                    <CardHeader className="flex-row items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={author?.name ?? 'Member'} />
                        <div>
                          <CardTitle className="text-lg">
                            {thread.title}
                          </CardTitle>
                          <CardDescription>{author?.name}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {thread.replies.length} {t('forums.replies')}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">{thread.body}</p>
                      <div className="space-y-3 rounded-2xl bg-muted/40 p-3">
                        {thread.replies.slice(0, 3).map((reply) => {
                          const replyAuthor = users.find(
                            (user) => user.id === reply.authorId,
                          );
                          return (
                            <div
                              key={reply.id}
                              className="rounded-2xl border border-border/60 bg-background/80 p-3 text-sm"
                            >
                              <div className="font-semibold text-foreground">
                                {replyAuthor?.name}
                              </div>
                              <p className="text-muted-foreground">
                                {reply.content}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="space-y-2">
                        <Textarea
                          placeholder={t('forums.placeholders.reply')}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && event.ctrlKey) {
                              const value = (
                                event.target as HTMLTextAreaElement
                              ).value;
                              if (!value.trim()) return;
                              replyToThread(thread.id, {
                                authorId: useDemoStore.getState().viewerId,
                                content: value,
                                reactions: {},
                              });
                              (event.target as HTMLTextAreaElement).value = '';
                              toast({
                                variant: 'success',
                                title: t('forums.toasts.replyPosted'),
                              });
                            }
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          {t('forums.hints.shortcut')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {activeThreads.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
                  {t('forums.empty')}
                </div>
              )}
            </div>

            <Button className="rounded-full px-4">
              {t('forums.actions.newThread')}
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
