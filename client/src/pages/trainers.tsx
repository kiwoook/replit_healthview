import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import TrainerCard from "@/components/trainer-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Trainers() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: trainers, isLoading } = useQuery({
    queryKey: ["/api/trainers?limit=20"],
  });

  const filteredTrainers = trainers?.filter((trainer: any) =>
    trainer.user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">전문 트레이너</h1>
          
          {/* Search Bar */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="트레이너 이름이나 전문 분야로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredTrainers?.length || 0}명의 트레이너를 찾았습니다
          </p>
        </div>

        {/* Trainers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTrainers?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "검색 결과가 없습니다" : "아직 등록된 트레이너가 없습니다"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "다른 검색어를 시도해보세요" 
                : "전문 트레이너들이 곧 합류할 예정입니다"
              }
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
              >
                전체 트레이너 보기
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTrainers?.map((trainer: any) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        )}

        {/* Call to Action for Trainers */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            트레이너이신가요?
          </h2>
          <p className="text-gray-600 mb-6">
            HealthView에 합류하여 더 많은 사람들과 당신의 전문성을 공유하세요.
            온라인으로 수익을 창출하고 브랜드를 구축할 수 있습니다.
          </p>
          <Button className="gradient-bg text-white">
            트레이너로 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
