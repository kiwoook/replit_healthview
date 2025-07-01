import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Exercise {
  name: string;
  description: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  videoUrl?: string;
  orderIndex: number;
}

export default function CreateRoutine() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [routine, setRoutine] = useState({
    title: "",
    description: "",
    bodyParts: [] as string[],
    difficulty: "",
    duration: 0,
    equipmentNeeded: false,
    isPublic: true,
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: "",
    description: "",
    sets: undefined,
    reps: undefined,
    duration: undefined,
    restTime: undefined,
    videoUrl: "",
    orderIndex: 0,
  });

  const bodyPartOptions = [
    { value: "upper", label: "상체" },
    { value: "lower", label: "하체" },
    { value: "core", label: "코어" },
    { value: "cardio", label: "유산소" },
    { value: "full", label: "전신" },
  ];

  const createRoutineMutation = useMutation({
    mutationFn: async () => {
      // Create routine first
      const routineResponse = await apiRequest("POST", "/api/routines", routine);
      const routineData = await routineResponse.json();
      
      // Then create exercises
      for (let i = 0; i < exercises.length; i++) {
        await apiRequest("POST", "/api/exercises", {
          ...exercises[i],
          routineId: routineData.id,
          orderIndex: i,
        });
      }
      
      return routineData;
    },
    onSuccess: (data) => {
      toast({
        title: "루틴이 생성되었습니다!",
        description: "다른 사용자들이 이제 당신의 루틴을 볼 수 있습니다.",
      });
      setLocation(`/routines/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "루틴 생성 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleBodyPart = (bodyPart: string) => {
    setRoutine(prev => ({
      ...prev,
      bodyParts: prev.bodyParts.includes(bodyPart)
        ? prev.bodyParts.filter(part => part !== bodyPart)
        : [...prev.bodyParts, bodyPart]
    }));
  };

  const addExercise = () => {
    if (!currentExercise.name.trim()) {
      toast({
        title: "운동 이름을 입력하세요",
        variant: "destructive",
      });
      return;
    }

    setExercises(prev => [...prev, { ...currentExercise, orderIndex: prev.length }]);
    setCurrentExercise({
      name: "",
      description: "",
      sets: undefined,
      reps: undefined,
      duration: undefined,
      restTime: undefined,
      videoUrl: "",
      orderIndex: 0,
    });
  };

  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!routine.title.trim()) {
      toast({
        title: "루틴 제목을 입력하세요",
        variant: "destructive",
      });
      return;
    }

    if (routine.bodyParts.length === 0) {
      toast({
        title: "운동 부위를 하나 이상 선택하세요",
        variant: "destructive",
      });
      return;
    }

    if (!routine.difficulty) {
      toast({
        title: "난이도를 선택하세요",
        variant: "destructive",
      });
      return;
    }

    if (exercises.length === 0) {
      toast({
        title: "운동을 하나 이상 추가하세요",
        variant: "destructive",
      });
      return;
    }

    createRoutineMutation.mutate();
  };

  // Check if user is a trainer
  if (user?.userType !== "trainer") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🏋️‍♂️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                트레이너 전용 기능
              </h1>
              <p className="text-gray-600 mb-6">
                루틴을 생성하려면 트레이너 계정이 필요합니다.
              </p>
              <div className="space-y-3">
                <Link href="/profile">
                  <Button className="gradient-bg text-white">
                    트레이너로 등록하기
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>기본 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">루틴 제목 *</Label>
                <Input
                  id="title"
                  value={routine.title}
                  onChange={(e) => setRoutine(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="예: 초보자를 위한 상체 근력 루틴"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">루틴 설명</Label>
                <Textarea
                  id="description"
                  value={routine.description}
                  onChange={(e) => setRoutine(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="이 루틴의 목적과 특징을 설명해주세요..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label>운동 부위 *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {bodyPartOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={routine.bodyParts.includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleBodyPart(option.value)}
                      className={
                        routine.bodyParts.includes(option.value)
                          ? "gradient-bg text-white"
                          : ""
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">난이도 *</Label>
                  <Select
                    value={routine.difficulty}
                    onValueChange={(value) => setRoutine(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">초급</SelectItem>
                      <SelectItem value="intermediate">중급</SelectItem>
                      <SelectItem value="advanced">고급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">예상 소요 시간 (분)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={routine.duration || ""}
                    onChange={(e) => setRoutine(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    placeholder="30"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="equipment"
                    checked={routine.equipmentNeeded}
                    onCheckedChange={(checked) => setRoutine(prev => ({ ...prev, equipmentNeeded: checked }))}
                  />
                  <Label htmlFor="equipment">기구 필요</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={routine.isPublic}
                  onCheckedChange={(checked) => setRoutine(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="public">공개 루틴</Label>
              </div>
            </CardContent>
          </Card>

          {/* Exercise List */}
          <Card>
            <CardHeader>
              <CardTitle>운동 목록</CardTitle>
            </CardHeader>
            <CardContent>
              {exercises.length > 0 && (
                <div className="space-y-4 mb-6">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary text-sm">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                        {exercise.description && (
                          <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                          {exercise.sets && <span>{exercise.sets} 세트</span>}
                          {exercise.reps && <span>{exercise.reps} 회</span>}
                          {exercise.duration && <span>{Math.floor(exercise.duration / 60)}분 {exercise.duration % 60}초</span>}
                          {exercise.restTime && <span>휴식 {exercise.restTime}초</span>}
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-6" />

              {/* Add Exercise Form */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">운동 추가</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseName">운동 이름 *</Label>
                    <Input
                      id="exerciseName"
                      value={currentExercise.name}
                      onChange={(e) => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="예: 푸쉬업"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="videoUrl">영상 URL (선택)</Label>
                    <Input
                      id="videoUrl"
                      value={currentExercise.videoUrl}
                      onChange={(e) => setCurrentExercise(prev => ({ ...prev, videoUrl: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="exerciseDescription">운동 설명</Label>
                  <Textarea
                    id="exerciseDescription"
                    value={currentExercise.description}
                    onChange={(e) => setCurrentExercise(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="올바른 자세와 주의사항을 설명해주세요..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="sets">세트 수</Label>
                    <Input
                      id="sets"
                      type="number"
                      value={currentExercise.sets || ""}
                      onChange={(e) => setCurrentExercise(prev => ({ ...prev, sets: parseInt(e.target.value) || undefined }))}
                      placeholder="3"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reps">반복 횟수</Label>
                    <Input
                      id="reps"
                      type="number"
                      value={currentExercise.reps || ""}
                      onChange={(e) => setCurrentExercise(prev => ({ ...prev, reps: parseInt(e.target.value) || undefined }))}
                      placeholder="10"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">지속 시간 (초)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={currentExercise.duration || ""}
                      onChange={(e) => setCurrentExercise(prev => ({ ...prev, duration: parseInt(e.target.value) || undefined }))}
                      placeholder="30"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rest">휴식 시간 (초)</Label>
                    <Input
                      id="rest"
                      type="number"
                      value={currentExercise.restTime || ""}
                      onChange={(e) => setCurrentExercise(prev => ({ ...prev, restTime: parseInt(e.target.value) || undefined }))}
                      placeholder="60"
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addExercise}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  운동 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link href="/">
              <Button type="button" variant="outline">
                취소
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="gradient-bg text-white"
              disabled={createRoutineMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {createRoutineMutation.isPending ? "생성 중..." : "루틴 생성"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
