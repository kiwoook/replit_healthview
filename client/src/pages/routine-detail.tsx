import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  Signal, 
  Bookmark, 
  BookmarkCheck, 
  Play, 
  Star,
  CheckCircle,
  Users,
  Share2,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RoutineDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: routine, isLoading } = useQuery({
    queryKey: [`/api/routines/${id}`],
  });

  const { data: isSaved } = useQuery({
    queryKey: [`/api/saved-routines/${id}/check`],
    enabled: !!user,
  });

  const { data: ratings } = useQuery({
    queryKey: [`/api/routine-ratings/${id}`],
  });

  const saveRoutineMutation = useMutation({
    mutationFn: async () => {
      if (isSaved?.isSaved) {
        await apiRequest("DELETE", `/api/saved-routines/${id}`);
      } else {
        await apiRequest("POST", "/api/saved-routines", { routineId: parseInt(id!) });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-routines/${id}/check`] });
      toast({
        title: isSaved?.isSaved ? "루틴 저장 취소" : "루틴 저장됨",
        description: isSaved?.isSaved ? "저장된 루틴에서 제거되었습니다." : "나중에 쉽게 찾을 수 있습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류가 발생했습니다",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startWorkoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/workout-records", {
        routineId: parseInt(id!),
        date: new Date().toISOString(),
        completed: false,
      });
    },
    onSuccess: () => {
      toast({
        title: "운동 시작!",
        description: "운동 기록이 시작되었습니다. 파이팅!",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">루틴을 찾을 수 없습니다</h1>
            <Link href="/routines">
              <Button>루틴 목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "초급";
      case "intermediate": return "중급";
      case "advanced": return "고급";
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/routines">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            루틴 목록으로
          </Button>
        </Link>

        {/* Routine Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {routine.bodyParts?.map((part: string) => (
                    <Badge key={part} variant="secondary">
                      {part === "upper" ? "상체" : 
                       part === "lower" ? "하체" : 
                       part === "core" ? "코어" :
                       part === "cardio" ? "유산소" :
                       part === "full" ? "전신" : part}
                    </Badge>
                  ))}
                  <Badge className={getDifficultyColor(routine.difficulty)}>
                    {getDifficultyLabel(routine.difficulty)}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {routine.title}
                </h1>

                <p className="text-gray-600 mb-6">
                  {routine.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{routine.duration}분</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Signal className="h-4 w-4" />
                    <span>{getDifficultyLabel(routine.difficulty)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{parseFloat(routine.rating).toFixed(1)}</span>
                    <span>({routine.totalRatings})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bookmark className="h-4 w-4" />
                    <span>{routine.totalSaves}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{routine.creator.firstName}</span>
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm text-gray-500">인증된 트레이너</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    onClick={() => startWorkoutMutation.mutate()}
                    disabled={startWorkoutMutation.isPending}
                    className="flex-1 gradient-bg text-white"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    운동 시작하기
                  </Button>
                  
                  <Button
                    onClick={() => saveRoutineMutation.mutate()}
                    disabled={saveRoutineMutation.isPending}
                    variant="outline"
                    className="px-4"
                  >
                    {isSaved?.isSaved ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button variant="outline" className="px-4">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">운동 목록</h2>
            
            {routine.exercises?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">아직 운동이 추가되지 않았습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {routine.exercises?.map((exercise: any, index: number) => (
                  <div key={exercise.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {exercise.name}
                        </h3>
                        
                        {exercise.description && (
                          <p className="text-gray-600 mb-3">
                            {exercise.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {exercise.sets && (
                            <span>{exercise.sets} 세트</span>
                          )}
                          {exercise.reps && (
                            <span>{exercise.reps} 회</span>
                          )}
                          {exercise.duration && (
                            <span>{Math.floor(exercise.duration / 60)}분 {exercise.duration % 60}초</span>
                          )}
                          {exercise.restTime && (
                            <span>휴식 {exercise.restTime}초</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                리뷰 ({ratings?.length || 0})
              </h2>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                리뷰 작성
              </Button>
            </div>
            
            {ratings?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {ratings?.map((rating: any) => (
                  <div key={rating.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{rating.user.firstName}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < rating.rating 
                                    ? "text-yellow-400 fill-current" 
                                    : "text-gray-300"
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {rating.review && (
                          <p className="text-gray-700">{rating.review}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
