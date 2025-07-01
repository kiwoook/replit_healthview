import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/header";
import RoutineCard from "@/components/routine-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Settings, 
  Trophy, 
  Calendar,
  Bookmark,
  Edit3,
  CheckCircle,
  Award,
  Clock,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [trainerForm, setTrainerForm] = useState({
    specialization: "",
    bio: "",
    experienceYears: 0,
  });

  const { data: savedRoutines } = useQuery({
    queryKey: ["/api/saved-routines"],
  });

  const { data: myRoutines } = useQuery({
    queryKey: [`/api/routines?creatorId=${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: workoutStats } = useQuery({
    queryKey: ["/api/workout-stats"],
  });

  const { data: workoutRecords } = useQuery({
    queryKey: ["/api/workout-records?limit=10"],
  });

  const becomeTrainerMutation = useMutation({
    mutationFn: async (trainerData: typeof trainerForm) => {
      await apiRequest("POST", "/api/trainers", trainerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
      toast({
        title: "트레이너 등록 완료!",
        description: "이제 루틴을 생성하고 공유할 수 있습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "트레이너 등록 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBecomeTrainer = () => {
    if (!trainerForm.specialization.trim()) {
      toast({
        title: "전문 분야를 입력하세요",
        variant: "destructive",
      });
      return;
    }

    becomeTrainerMutation.mutate(trainerForm);
  };

  const isTrainer = user?.userType === "trainer";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                <AvatarFallback className="text-2xl bg-primary text-white">
                  {user?.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  {isTrainer && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      트레이너
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                {isTrainer ? (
                  <p className="text-gray-700">
                    {user?.trainer?.specialization || "피트니스 전문가"}
                  </p>
                ) : (
                  <p className="text-gray-600">피트니스 애호가</p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline">
                  <Edit3 className="mr-2 h-4 w-4" />
                  프로필 편집
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {workoutStats?.weeklyWorkouts || 0}
              </div>
              <div className="text-sm text-gray-600">이번 주 운동</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {workoutStats?.totalHours || 0}
              </div>
              <div className="text-sm text-gray-600">총 운동 시간</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bookmark className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {savedRoutines?.length || 0}
              </div>
              <div className="text-sm text-gray-600">저장한 루틴</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {workoutStats?.currentStreak || 0}
              </div>
              <div className="text-sm text-gray-600">연속 기록</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">활동 기록</TabsTrigger>
            <TabsTrigger value="saved">저장한 루틴</TabsTrigger>
            {isTrainer && <TabsTrigger value="my-routines">내 루틴</TabsTrigger>}
            <TabsTrigger value="settings">
              {isTrainer ? "트레이너 설정" : "트레이너 등록"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>최근 운동 기록</CardTitle>
              </CardHeader>
              <CardContent>
                {workoutRecords?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🏋️‍♂️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      아직 운동 기록이 없습니다
                    </h3>
                    <p className="text-gray-600">
                      첫 번째 운동을 시작해보세요!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workoutRecords?.map((record: any) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('ko-KR')}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {record.duration}분 운동
                          </p>
                        </div>
                        <Badge variant={record.completed ? "default" : "secondary"}>
                          {record.completed ? "완료" : "진행중"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            {savedRoutines?.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🔖</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    저장한 루틴이 없습니다
                  </h3>
                  <p className="text-gray-600 mb-6">
                    마음에 드는 루틴을 찾아서 저장해보세요
                  </p>
                  <Button className="gradient-bg text-white">
                    루틴 탐색하기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRoutines?.map((routine: any) => (
                  <RoutineCard key={routine.id} routine={routine} />
                ))}
              </div>
            )}
          </TabsContent>

          {isTrainer && (
            <TabsContent value="my-routines" className="space-y-6">
              {myRoutines?.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      아직 생성한 루틴이 없습니다
                    </h3>
                    <p className="text-gray-600 mb-6">
                      첫 번째 루틴을 만들어서 다른 사용자들과 공유해보세요
                    </p>
                    <Button className="gradient-bg text-white">
                      루틴 생성하기
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRoutines?.map((routine: any) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-6">
            {!isTrainer ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>트레이너로 등록하기</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-600">
                    트레이너로 등록하면 운동 루틴을 생성하고 공유할 수 있으며, 
                    다른 사용자들에게 전문적인 조언을 제공할 수 있습니다.
                  </p>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="specialization">전문 분야 *</Label>
                        <Input
                          id="specialization"
                          value={trainerForm.specialization}
                          onChange={(e) => setTrainerForm(prev => ({ ...prev, specialization: e.target.value }))}
                          placeholder="예: 근력 운동, HIIT, 요가, 재활 운동 등"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bio">자기소개</Label>
                        <Textarea
                          id="bio"
                          value={trainerForm.bio}
                          onChange={(e) => setTrainerForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="경력, 전문성, 운동 철학 등을 소개해주세요..."
                          className="mt-1"
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="experience">경력 (년)</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={trainerForm.experienceYears || ""}
                          onChange={(e) => setTrainerForm(prev => ({ ...prev, experienceYears: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleBecomeTrainer}
                          disabled={becomeTrainerMutation.isPending}
                          className="gradient-bg text-white"
                        >
                          {becomeTrainerMutation.isPending ? "등록 중..." : "트레이너 등록"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">트레이너 혜택</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• 운동 루틴 생성 및 공유</li>
                          <li>• 전문가 인증 배지</li>
                          <li>• 수강생 관리 도구</li>
                          <li>• 커뮤니티에서 우선 노출</li>
                        </ul>
                      </div>
                      
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="gradient-bg text-white"
                      >
                        트레이너 등록 시작하기
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>트레이너 설정</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      트레이너로 활동 중
                    </h3>
                    <p className="text-gray-600">
                      전문가 설정 및 프로필 관리 기능이 곧 추가될 예정입니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
