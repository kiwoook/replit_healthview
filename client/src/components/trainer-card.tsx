import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle, Users } from "lucide-react";

interface TrainerCardProps {
  trainer: {
    id: number;
    specialization: string;
    rating: string;
    totalStudents: number;
    verified: boolean;
    user: {
      id: string;
      firstName: string;
      lastName?: string;
      profileImageUrl?: string;
    };
  };
}

export default function TrainerCard({ trainer }: TrainerCardProps) {
  const fullName = `${trainer.user.firstName}${trainer.user.lastName ? ` ${trainer.user.lastName}` : ""}`;

  return (
    <Card className="bg-white rounded-xl shadow-sm text-center card-hover">
      <CardContent className="p-6">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={trainer.user.profileImageUrl} alt={fullName} />
          <AvatarFallback className="text-lg bg-primary text-white">
            {trainer.user.firstName?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <h4 className="font-semibold text-gray-900 mb-1">
          {fullName} 트레이너
        </h4>

        <p className="text-sm text-gray-600 mb-2">
          {trainer.specialization || "피트니스 전문"}
        </p>

        <div className="flex items-center justify-center space-x-1 mb-3">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">
            {parseFloat(trainer.rating).toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">
            • {trainer.totalStudents}명 수강
          </span>
        </div>

        {trainer.verified && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-600">인증된 전문가</span>
          </div>
        )}

        <Link href={`/trainers/${trainer.user.id}`}>
          <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            프로필 보기
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
