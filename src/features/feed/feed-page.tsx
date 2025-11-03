import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Send, SmilePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDemoStore } from '@/store/use-demo-store';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function FeedPage() {
  const { t } = useTranslation();
  const posts = useDemoStore((state) => state.posts);
  const users = useDemoStore((state) => state.users);
  const createPost = useDemoStore((state) => state.createPost);
  const addComment = useDemoStore((state) => state.addComment);
  const [filter, setFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const { toast } = useToast();

  const filters = useMemo(() => {
    const uniqueTags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => uniqueTags.add(tag)));
    return ['all', ...Array.from(uniqueTags)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((post) => post.tags.includes(filter));
  }, [filter, posts]);

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        variant: 'warning',
        title: t('common.validation.required'),
      });
      return;
    }
    const tagsList = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const post = createPost({
      content,
      tags: tagsList,
    });
    toast({
      variant: 'success',
      title: t('feed.toasts.postPublished'),
    });
    setContent('');
    setTags('');
    setOpen(false);
    window.setTimeout(() => {
      toast({
        variant: 'default',
        title: t('feed.toasts.synced'),
        description: t('feed.toasts.syncedDescription'),
      });
    }, 1200);
    return post;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">
            {t('feed.title')}
          </h1>
          <p className="text-muted-foreground">{t('feed.subtitle')}</p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="rounded-full px-4">
              <SmilePlus className="mr-2 h-4 w-4" />
              {t('feed.actions.newPost')}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-lg">
            <SheetHeader>
              <SheetTitle>{t('feed.actions.newPost')}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={t('feed.placeholders.content')}
              />
              <Input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder={t('feed.placeholders.tags')}
              />
              <Button onClick={handleSubmit} className="w-full rounded-full">
                <Send className="mr-2 h-4 w-4" />
                {t('common.actions.submit')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button
            key={item}
            variant={filter === item ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => setFilter(item)}
          >
            <Hash className="mr-2 h-4 w-4" />
            {item === 'all' ? t('common.labels.all') : item}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const author = users.find((user) => user.id === post.authorId);
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={author?.name ?? 'Member'} />
                    <div>
                      <CardTitle className="text-lg">
                        {author?.name ?? 'Member'}
                      </CardTitle>
                      <CardDescription>{author?.title}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="muted">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-base text-foreground">{post.content}</p>
                  {post.media && post.media.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {post.media.map((media) => (
                        <div
                          key={media.url}
                          className="h-40 rounded-2xl bg-muted/80"
                          aria-label={media.title}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {Object.entries(post.reactions ?? {}).map(
                      ([key, value]) => (
                        <span key={key} className="flex items-center gap-1">
                          <SmilePlus className="h-4 w-4" />
                          {value}
                        </span>
                      ),
                    )}
                    <span>
                      {post.comments.length} {t('feed.labels.comments')}
                    </span>
                  </div>
                  <div className="w-full space-y-2">
                    <Input
                      placeholder={t('feed.placeholders.comment')}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          const value = (event.target as HTMLInputElement)
                            .value;
                          if (!value.trim()) return;
                          addComment(post.id, {
                            authorId: useDemoStore.getState().viewerId,
                            content: value,
                            reactions: {},
                          });
                          (event.target as HTMLInputElement).value = '';
                          toast({
                            variant: 'success',
                            title: t('feed.toasts.commentAdded'),
                          });
                        }
                      }}
                    />
                    <div className="space-y-2">
                      {post.comments.slice(0, 2).map((comment) => {
                        const commentAuthor = users.find(
                          (user) => user.id === comment.authorId,
                        );
                        return (
                          <div
                            key={comment.id}
                            className={cn(
                              'rounded-2xl border border-border/60 bg-muted/40 p-3',
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={commentAuthor?.name ?? 'Member'}
                                className="h-8 w-8"
                              />
                              <div>
                                <div className="text-sm font-semibold">
                                  {commentAuthor?.name}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
        {filteredPosts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
            {t('feed.empty')}
          </div>
        )}
      </div>
    </div>
  );
}
