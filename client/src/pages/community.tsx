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
import { Plus, Search, Filter, TrendingUp, MessageSquare, Trophy } from "lucide-react";
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
  const [postType, setPostType] = useState("");
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

  const filteredPosts = posts?.filter((post: any) => {
    const matchesSearch = !searchTerm || 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !postType || post.type === postType;
    
    return matchesSearch && matchesType;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
            <p className="text-gray-600">
              운동 경험을 공유하고 함께 성장해보세요
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg text-white mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                게시물 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>새 게시물 작성</DialogTitle>
                <DialogDescription>
                  운동 관련 질문, 성과, 팁을 커뮤니티와 공유해보세요.
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
            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="게시물 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={postType} onValueChange={setPostType}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="전체 유형" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      <SelectItem value="question">질문</SelectItem>
                      <SelectItem value="achievement">성과</SelectItem>
                      <SelectItem value="general">일반</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
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
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm || postType ? "검색 결과가 없습니다" : "아직 게시물이 없습니다"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || postType 
                        ? "다른 검색어나 필터를 시도해보세요"
                        : "첫 번째 게시물을 작성해보세요!"
                      }
                    </p>
                    {!(searchTerm || postType) && (
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="gradient-bg text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        게시물 작성하기
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredPosts?.map((post: any) => (
                  <CommunityPost key={post.id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">커뮤니티 활동</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">총 게시물</span>
                    </div>
                    <span className="font-semibold">{posts?.length || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">활성 사용자</span>
                    </div>
                    <span className="font-semibold">128</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">성과 공유</span>
                    </div>
                    <span className="font-semibold">
                      {posts?.filter((p: any) => p.type === "achievement").length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">인기 주제</h3>
                <div className="flex flex-wrap gap-2">
                  {["다이어트", "근력운동", "유산소", "자세교정", "홈트레이닝", "영양"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">커뮤니티 가이드</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>서로를 존중하고 격려해주세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>정확한 정보를 공유해주세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>부적절한 내용은 신고해주세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>질문은 구체적으로 작성해주세요</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
