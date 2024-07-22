import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  return storyIds.slice(0, 100);
};

const fetchStoryDetails = async (id) => {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  return await response.json();
};

const HackerNewsTopStories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stories, setStories] = useState([]);

  const { data: storyIds, isLoading: isLoadingIds } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  useEffect(() => {
    if (storyIds) {
      const fetchAllStories = async () => {
        const storyPromises = storyIds.map(fetchStoryDetails);
        const fetchedStories = await Promise.all(storyPromises);
        setStories(fetchedStories);
      };
      fetchAllStories();
    }
  }, [storyIds]);

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Hacker News Top 100 Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />
      {isLoadingIds ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStories.map((story) => (
            <Card key={story.id}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Upvotes: {story.score} |{" "}
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Read more
                  </a>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HackerNewsTopStories;