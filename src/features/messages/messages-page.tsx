import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paperclip, Send, Video, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { t } = useTranslation();
  const threads = useDemoStore((state) => state.messageThreads);
  const users = useDemoStore((state) => state.users);
  const viewerId = useDemoStore((state) => state.viewerId);
  const [activeThreadId, setActiveThreadId] = useState<string>(
    threads[0]?.id ?? '',
  );
  const [draft, setDraft] = useState('');
  const { toast } = useToast();

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId),
    [threads, activeThreadId],
  );

  const handleSend = () => {
    if (!draft.trim() || !activeThread) return;
    useDemoStore.setState((state) => ({
      messageThreads: state.messageThreads.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              messages: [
                {
                  id: crypto.randomUUID(),
                  senderId: viewerId,
                  body: draft,
                  sentAt: new Date().toISOString(),
                  status: 'sent',
                },
                ...thread.messages,
              ],
            }
          : thread,
      ),
    }));
    setDraft('');
    toast({
      variant: 'success',
      title: t('messages.toasts.sent'),
    });
    setTimeout(() => {
      toast({
        variant: 'default',
        title: t('messages.toasts.delivered'),
      });
    }, 800);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <Card className="h-[calc(100vh-220px)] overflow-hidden">
        <div className="border-b border-border/60 p-4">
          <h2 className="font-display text-xl font-semibold">
            {t('messages.title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('messages.subtitle')}
          </p>
        </div>
        <div className="h-full overflow-y-auto">
          {threads.map((thread) => {
            const participants = thread.participantIds
              .map((id) => users.find((user) => user.id === id))
              .filter(Boolean);
            const preview = thread.messages[0];
            return (
              <button
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={cn(
                  'flex w-full items-center gap-3 border-b border-border/60 px-4 py-3 text-left transition hover:bg-muted/40',
                  activeThreadId === thread.id && 'bg-primary/10',
                )}
              >
                <Avatar
                  name={participants[0]?.name ?? 'Member'}
                  className="h-10 w-10"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {participants.map((user) => user?.name).join(', ')}
                    </span>
                    {thread.typing && (
                      <span className="text-xs text-primary">
                        {t('messages.typing')}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {preview?.body}
                  </p>
                </div>
                {thread.unreadCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="flex h-[calc(100vh-220px)] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar
              name={
                activeThread?.participantIds
                  .map((id) => users.find((user) => user.id === id)?.name)
                  .join(', ') ?? 'Member'
              }
            />
            <div>
              <p className="font-semibold text-foreground">
                {activeThread?.participantIds
                  .map((id) => users.find((user) => user.id === id)?.name)
                  .join(', ')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('messages.secure')}
              </p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Phone className="mr-2 h-4 w-4" />
              {t('messages.actions.call')}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Video className="mr-2 h-4 w-4" />
              {t('messages.actions.video')}
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {activeThread?.messages.map((message) => {
            const sender = users.find((user) => user.id === message.senderId);
            const isOwn = message.senderId === viewerId;
            return (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-2',
                  isOwn ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <Avatar name={sender?.name ?? 'Member'} className="h-8 w-8" />
                <div
                  className={cn(
                    'max-w-sm rounded-2xl px-4 py-2 text-sm shadow-sm',
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/60 text-foreground',
                  )}
                >
                  <p>{message.body}</p>
                  <div className="mt-1 text-[10px] text-white/60">
                    {message.status === 'seen'
                      ? t('messages.status.seen')
                      : message.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border/60 p-4">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('messages.placeholder')}
              className="border-0 focus-visible:ring-0"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button className="rounded-full" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
