"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateHTML, JSONContent } from "@tiptap/react";
import { FileText, MessageSquare } from "lucide-react";
import { extensions } from "../Editor/TipTapEditor";
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  postTitle: string;
  createdAt: string;
}

interface UserContentProps {
  posts: Post[];
  comments: Comment[];
}

export function UserContent({ posts, comments }: UserContentProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Contenu de l&apos;utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="posts" className="h-[600px] flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Commentaires ({comments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="flex-1 mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun post
                  </p>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">{post.title}</h3>
                        <div
                          className="text-sm text-muted-foreground mb-2"
                          dangerouslySetInnerHTML={{
                            __html: generateHTML(
                              post.content as unknown as JSONContent,
                              extensions
                            ),
                          }}
                        />

                        <time className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </time>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="flex-1 mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun commentaire
                  </p>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-6">
                        <p className="text-sm mb-2">{comment.content}</p>
                        <p className="text-xs text-muted-foreground mb-1">
                          Sur le post: {comment.postTitle}
                        </p>
                        <time className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </time>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
