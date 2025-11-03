import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoStore } from '@/store/use-demo-store';

export default function PodcastPage() {
  const { t } = useTranslation();
  const episodes = useDemoStore((state) => state.podcastEpisodes);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-semibold">
          {t('podcast.title')}
        </h1>
        <p className="text-muted-foreground">{t('podcast.subtitle')}</p>
      </header>

      <Tabs defaultValue="podcast" className="space-y-6">
        <TabsList>
          <TabsTrigger value="podcast">{t('podcast.tabs.podcast')}</TabsTrigger>
          <TabsTrigger value="blog">{t('podcast.tabs.blog')}</TabsTrigger>
        </TabsList>
        <TabsContent value="podcast" className="grid gap-6 md:grid-cols-2">
          {episodes
            .filter((episode) => episode.type === 'podcast')
            .map((episode) => (
              <Card key={episode.id}>
                <CardHeader>
                  <CardTitle>{episode.title}</CardTitle>
                  <CardDescription>
                    {episode.guest} · {episode.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{episode.description}</p>
                  <Badge variant="secondary">{episode.releaseDate}</Badge>
                  <Button className="rounded-full">
                    {t('podcast.actions.listen')}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="blog" className="space-y-4">
          {episodes
            .filter((episode) => episode.type === 'blog')
            .map((episode) => (
              <Card key={episode.id}>
                <CardHeader>
                  <CardTitle>{episode.title}</CardTitle>
                  <CardDescription>{episode.releaseDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{episode.description}</p>
                  <Button variant="outline" className="rounded-full">
                    {t('podcast.actions.read')}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
