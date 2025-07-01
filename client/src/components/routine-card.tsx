import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Signal, Star, Bookmark, Play, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RoutineCardProps {
  routine: {
    id: number;
    title: string;
    description: string;
    bodyParts: string[];
    difficulty: string;
    duration: number;
    rating: string;
    totalRatings: number;
    creator: {
      id: string;
      firstName: string;
      profileImageUrl?: string;
    };
  };
}

export default function RoutineCard({ routine }: RoutineCardProps) {
  const { toast } = useToast();

  const saveRoutineMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/saved-routines", { routineId: routine.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-routines"] });
      toast({
        title: "루틴 저장됨",
        description: "나중에 쉽게 찾을 수 있습니다.",
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

  const getBodyPartLabel = (part: string) => {
    switch (part) {
      case "upper": return "상체";
      case "lower": return "하체";
      case "core": return "코어";
      case "cardio": return "유산소";
      case "full": return "전신";
      default: return part;
    }
  };

  const primaryBodyPart = routine.bodyParts?.[0];
  const getImageForBodyPart = (part: string) => {
    switch (part) {
      case "upper":
        return "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
      case "lower":
        return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
      case "core":
        return "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
      case "cardio":
        return "https://pixabay.com/get/gcdd1bd12545ad9e7ce5a6e2eecf9c45d348a42e34c78e0f09de92f4780ac4061948348596b7a99d4f0fc1597371a065d5bf931213d118a09b0433fad03065bc3_1280.jpg";
      case "full":
        return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
      default:
        return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
      <img 
        src={getImageForBodyPart(primaryBodyPart)} 
        alt={routine.title}
        className="w-full h-48 object-cover" 
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getDifficultyColor(routine.difficulty)}>
            {getDifficultyLabel(routine.difficulty)}
          </Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">
              {parseFloat(routine.rating).toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({routine.totalRatings})
            </span>
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {routine.title}
        </h4>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {routine.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {routine.bodyParts?.slice(0, 3).map((part) => (
            <Badge key={part} variant="secondary" className="text-xs">
              {getBodyPartLabel(part)}
            </Badge>
          ))}
          {routine.bodyParts?.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{routine.bodyParts.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{routine.duration}분</span>
            </span>
            <span className="flex items-center space-x-1">
              <Signal className="h-4 w-4" />
              <span>{getDifficultyLabel(routine.difficulty)}</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Avatar className="w-6 h-6">
              <AvatarImage src={routine.creator.profileImageUrl} />
              <AvatarFallback className="text-xs">
                {routine.creator.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-xs">{routine.creator.firstName}</span>
            <CheckCircle className="h-3 w-3 text-blue-500" />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/routines/${routine.id}`} className="flex-1">
            <Button className="w-full gradient-bg text-white hover:opacity-90">
              <Play className="mr-2 h-4 w-4" />
              시작하기
            </Button>
          </Link>
          <Button 
            onClick={() => saveRoutineMutation.mutate()}
            disabled={saveRoutineMutation.isPending}
            variant="outline" 
            className="px-4"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
