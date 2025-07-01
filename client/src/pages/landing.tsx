import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Users, TrendingUp, Star, Play, CheckCircle } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">HealthView</h1>
            </div>
            <Button onClick={handleLogin} className="gradient-bg text-white">
              로그인
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            당신만의 완벽한 운동 루틴을 찾아보세요
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            전문 트레이너가 만든 검증된 루틴으로 건강한 변화를 시작하세요.
            진도 추적부터 커뮤니티 활동까지 모든 것이 하나로!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin} 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              무료로 시작하기
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3"
            >
              <Play className="mr-2 h-5 w-5" />
              둘러보기
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              왜 HealthView를 선택해야 할까요?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              전문성과 편의성을 모두 갖춘 종합 피트니스 플랫폼으로 
              당신의 건강한 라이프스타일을 완성하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-4">전문 트레이너 루틴</h4>
                <p className="text-gray-600">
                  검증된 전문 트레이너들이 직접 제작한 체계적인 운동 루틴으로 
                  안전하고 효과적인 운동을 경험하세요.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-4">스마트 진도 추적</h4>
                <p className="text-gray-600">
                  AI 기반 분석으로 운동 성과를 시각화하고 
                  개인 맞춤형 피드백을 통해 목표를 달성하세요.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-4">활발한 커뮤니티</h4>
                <p className="text-gray-600">
                  같은 목표를 가진 사람들과 소통하며 
                  서로 동기부여하고 운동 노하우를 공유하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              숫자로 보는 HealthView
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-gray-600">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-gray-600">전문 루틴</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">300+</div>
              <div className="text-gray-600">인증 트레이너</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.9</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                평균 만족도
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              어떻게 시작하나요?
            </h3>
            <p className="text-lg text-gray-600">
              간단한 3단계로 건강한 운동 습관을 만들어보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-4">가입 & 프로필 설정</h4>
              <p className="text-gray-600">
                간단한 회원가입 후 운동 목표와 경험 수준을 설정하여 
                맞춤형 추천을 받아보세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-4">루틴 선택 & 시작</h4>
              <p className="text-gray-600">
                전문 트레이너가 만든 다양한 루틴 중에서 
                당신에게 맞는 운동을 선택하고 바로 시작하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-4">진도 추적 & 성장</h4>
              <p className="text-gray-600">
                운동 기록을 추적하고 분석하여 
                지속적인 발전과 목표 달성을 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold mb-6">
            오늘부터 건강한 변화를 시작하세요
          </h3>
          <p className="text-xl opacity-90 mb-8">
            수만 명의 사용자가 HealthView와 함께 목표를 달성했습니다. 
            당신도 지금 시작해보세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin} 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              무료로 시작하기
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-4">
            신용카드 불필요 • 언제든지 취소 가능
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">HealthView</h1>
            </div>
            <p className="text-gray-400 mb-4">
              전문적이고 체계적인 피트니스 플랫폼
            </p>
            <p className="text-sm text-gray-500">
              © 2025 HealthView. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
