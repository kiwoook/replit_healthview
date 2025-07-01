import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/header";
import RoutineCard from "@/components/routine-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  CheckCircle, 
  Users, 
  Calendar, 
  Award,
  MessageCircle,
  Heart,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

export default function TrainerProfile() {
  const { id } = useParams<{ id: string }>();
  
  const { data: trainer } = useQuery({
    queryKey: [`/api/trainers/${id}`],
    enabled: false, // This endpoint doesn't exist yet, so disable for now
  });

  const { data: routines } = useQuery({
    queryKey: [`/api/routines?creatorId=${id}`],
  });

  // Mock trainer data since the endpoint doesn't exist
  const mockTrainer = {
    id: 1,
    specialization: "근력 운동 전문",
    bio: "10년 경력의 전문 트레이너입니다. 개인별 맞춤 루틴 설계와 올바른 운동 자세 교정에 특화되어 있습니다. 안전하고 효과적인 운동으로 여러분의 목표 달성을 도와드리겠습니다.",
    certifications: ["NSCA-CSCS", "ACSM-CPT", "재활트레이닝 자격증"],
    experienceYears: 10,
    rating: "4.9",
    totalStudents: 524,
    verified: true,
    user: {
      id: id,
      firstName: "김준혁",
      lastName: "",
      profileImageUrl: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    }
  };

  const fullName = `${mockTrainer.user.firstName}${mockTrainer.user.lastName ? ` ${mockTrainer.user.lastName}` : ""}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/trainers">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            트레이너 목록으로
          </Button>
        </Link>

        {/* Trainer Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col items-center lg:items-start">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={mockTrainer.user.profileImageUrl} alt={fullName} />
                  <AvatarFallback className="text-3xl bg-primary text-white">
                    {mockTrainer.user.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {fullName} 트레이너
                    </h1>
                    {mockTrainer.verified && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-4">
                    {mockTrainer.specialization}
                  </p>
                  
                  <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{mockTrainer.rating}</span>
                      <span>평점</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{mockTrainer.totalStudents}명 수강</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{mockTrainer.experienceYears}년 경력</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="gradient-bg text-white">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      상담 문의
                    </Button>
                    <Button variant="outline">
                      <Heart className="mr-2 h-4 w-4" />
                      팔로우
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">소개</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {mockTrainer.bio}
                </p>

                {/* Certifications */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <Award className="inline mr-2 h-5 w-5" />
                    자격증 및 인증
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockTrainer.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {routines?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">루틴</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {mockTrainer.totalStudents}
                    </div>
                    <div className="text-sm text-gray-600">수강생</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {mockTrainer.rating}
                    </div>
                    <div className="text-sm text-gray-600">평점</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trainer's Routines */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {fullName}의 루틴 ({routines?.length || 0})
            </h2>
          </div>

          {routines?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">💪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  아직 등록된 루틴이 없습니다
                </h3>
                <p className="text-gray-600">
                  {fullName} 트레이너가 곧 새로운 루틴을 업로드할 예정입니다.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routines?.map((routine: any) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                수강생 후기
              </h2>
              
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  후기를 기다리고 있습니다
                </h3>
                <p className="text-gray-600">
                  이 트레이너의 첫 번째 후기를 남겨보세요!
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
