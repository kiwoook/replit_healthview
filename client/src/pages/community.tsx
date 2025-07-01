import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/header";
import CommunityPost from "@/components/community-post";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, TrendingUp, MessageSquare, Trophy, Clock, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Community() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("latest");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    type: "general",
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts?limit=20"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      await apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setNewPost({ title: "", content: "", type: "general" });
      setIsCreateDialogOpen(false);
      toast({
        title: "게시물이 작성되었습니다!",
        description: "커뮤니티에서 다른 사용자들과 소통해보세요.",
      });
    },
    onError: (error) => {
      toast({
        title: "게시물 작성 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 인기 태그
  const popularTags = [
    { name: "#초보자", count: 24 },
    { name: "#벤치프레스", count: 18 },
    { name: "#자세교정", count: 15 },
    { name: "#홈트", count: 42 },
    { name: "#다이어트", count: 33 },
    { name: "#후기", count: 28 },
  ];

  // 게시물 필터링 및 정렬
  const getFilteredAndSortedPosts = () => {
    if (!posts || !Array.isArray(posts)) return [];
    
    let filteredPosts = posts.filter((post: any) => {
      const matchesSearch = !searchTerm || 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedCategory === "latest" || selectedCategory === "popular") {
        return matchesSearch;
      }
      
      const matchesCategory = post.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // 정렬
    if (sortBy === "popular") {
      filteredPosts.sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));
    } else {
      filteredPosts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filteredPosts;
  };

  const filteredPosts = getFilteredAndSortedPosts();

  const handleSubmitPost = () => {
    if (!newPost.content.trim()) {
      toast({
        title: "내용을 입력하세요",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate(newPost);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "latest": return <Clock className="h-4 w-4" />;
      case "popular": return <TrendingUp className="h-4 w-4" />;
      case "question": return <MessageSquare className="h-4 w-4" />;
      case "tip": return <Trophy className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
            <p className="text-gray-600">
              운동 경험을 공유하고 서로 도움을 주고받아요
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg text-white mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                글쓰기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 게시물 작성</DialogTitle>
                <DialogDescription>
                  커뮤니티와 운동 경험을 공유해보세요.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Select
                    value={newPost.type}
                    onValueChange={(value) => setNewPost(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="게시물 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">일반</SelectItem>
                      <SelectItem value="question">질문</SelectItem>
                      <SelectItem value="tip">팁</SelectItem>
                      <SelectItem value="achievement">성과 공유</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Input
                    placeholder="제목 (선택사항)"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="내용을 입력하세요..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  취소
                </Button>
                <Button 
                  onClick={handleSubmitPost}
                  disabled={createPostMutation.isPending}
                  className="gradient-bg text-white"
                >
                  {createPostMutation.isPending ? "작성 중..." : "게시하기"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="게시물 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
              <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
                <TabsTrigger 
                  value="latest" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <Clock className="h-4 w-4" />
                  최신순
                </TabsTrigger>
                <TabsTrigger 
                  value="popular"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <TrendingUp className="h-4 w-4" />
                  인기순
                </TabsTrigger>
                <TabsTrigger 
                  value="question"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <MessageSquare className="h-4 w-4" />
                  질문
                </TabsTrigger>
                <TabsTrigger 
                  value="tip"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <Trophy className="h-4 w-4" />
                  팁
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6">
                {/* Posts List */}
                <div className="space-y-6">
                  {isLoading ? (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <div className="animate-pulse">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="space-y-2">
                                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : filteredPosts?.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          아직 게시물이 없습니다
                        </h3>
                        <p className="text-gray-600 mb-4">
                          첫 번째 게시물을 작성해서 커뮤니티를 활성화해보세요!
                        </p>
                        <Button 
                          onClick={() => setIsCreateDialogOpen(true)}
                          className="gradient-bg text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          글쓰기
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredPosts?.map((post: any) => (
                      <CommunityPost key={post.id} post={post} />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Popular Tags */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 태그</h3>
                  <div className="space-y-3">
                    {popularTags.map((tag, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className="text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                          onClick={() => setSearchTerm(tag.name)}
                        >
                          {tag.name}
                        </Badge>
                        <span className="text-sm text-gray-500">{tag.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">커뮤니티 현황</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">총 게시물</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {Array.isArray(posts) ? posts.length : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-600">오늘의 좋아요</span>
                      </div>
                      <span className="font-semibold text-gray-900">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">활성 사용자</span>
                      </div>
                      <span className="font-semibold text-gray-900">18</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 실행</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setNewPost({ title: "", content: "", type: "question" });
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      질문하기
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setNewPost({ title: "", content: "", type: "achievement" });
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      성과 공유
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setNewPost({ title: "", content: "", type: "tip" });
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      팁 공유
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}