import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Hash,
  Link as LinkIcon,
  Plus,
  Repeat2,
  Send,
  Smile,
  ThumbsUp,
} from 'lucide-react';
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
import type { LanguageCode, ReactionType } from '@/types';

function getLocale(language: string): LanguageCode {
  const code = language.slice(0, 2).toLowerCase();
  return (code === 'tr' ? 'tr' : 'en') as LanguageCode;
}

export default function FeedPage() {
  const { t, i18n } = useTranslation();
  const posts = useDemoStore((state) => state.posts);
  const users = useDemoStore((state) => state.users);
  const createPost = useDemoStore((state) => state.createPost);
  const addComment = useDemoStore((state) => state.addComment);
  const [filter, setFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const { toast } = useToast();

  const locale = useMemo(() => getLocale(i18n.language), [i18n.language]);

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

  const renderMedia = (
    media?:
      | {
          type: 'image' | 'video' | 'document' | 'link';
          url: string;
          thumbnail?: string;
          title?: string;
          description?: string;
        }[]
      | null,
  ) => {
    if (!media?.length) return null;
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {media.map((item) => {
          if (item.type === 'image') {
            return (
              <img
                key={item.url}
                src={item.url}
                alt={item.title ?? 'Post media'}
                className="h-56 w-full rounded-2xl border border-border/60 object-cover"
              />
            );
          }
          if (item.type === 'link') {
            return (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4"
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title ?? item.url}
                    className="h-40 w-full rounded-xl object-cover"
                  />
                )}
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <LinkIcon className="h-4 w-4" />
                    {item.title ?? item.url}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </a>
            );
          }
          return null;
        })}
      </div>
    );
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
              <Plus className="mr-2 h-4 w-4" />
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
            {item === 'all' ? t('common.labels.all') : `#${item}`}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const author = users.find((user) => user.id === post.authorId);
          const postContent = post.translatedContent?.[locale] ?? post.content;
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
                    <Avatar
                      name={author?.name ?? 'Member'}
                      src={author?.avatar}
                    />
                    <div>
                      <CardTitle className="text-lg">
                        {author?.name ?? 'Member'}
                      </CardTitle>
                      <CardDescription>{author?.title}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="muted">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-base text-foreground">{postContent}</p>
                  {renderMedia(post.media)}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {(() => {
                      const reactions = post.reactions ?? {};
                      const reactionEntries = Object.entries(
                        reactions as Record<string, number | undefined>,
                      ) as [ReactionType | string, number | undefined][];
                      const positiveReactions = reactionEntries.reduce(
                        (acc, [key, value]) =>
                          key === 'like' ? acc : acc + (value ?? 0),
                        0,
                      );
                      return (
                        <>
                          <span className="flex items-center gap-1">
                            <Smile className="h-4 w-4" />
                            {positiveReactions}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {reactions.like ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat2 className="h-4 w-4" />
                            {post.reposts ?? 0}
                          </span>
                        </>
                      );
                    })()}
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
                          const value = (event.target as HTMLInputElement).value;
                          if (!value.trim()) return;
                          addComment(post.id, {
                            authorId: useDemoStore.getState().viewerId,
                            content: value,
                            translatedContent: {
                              [locale]: value,
                            },
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
                      {post.comments.slice(0, 3).map((comment) => {
                        const commentAuthor = users.find(
                          (user) => user.id === comment.authorId,
                        );
                        const commentContent =
                          comment.translatedContent?.[locale] ??
                          comment.content;
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
                                src={commentAuthor?.avatar}
                                className="h-8 w-8"
                              />
                              <div>
                                <div className="text-sm font-semibold">
                                  {commentAuthor?.name}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {commentContent}
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
