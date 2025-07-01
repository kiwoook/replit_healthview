import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RoutineCard from "@/components/routine-card";
import TrainerCard from "@/components/trainer-card";
import ProgressChart from "@/components/progress-chart";
import { Search, Calendar, Clock, Bookmark, Flame, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  
  const { data: workoutStats } = useQuery({
    queryKey: ["/api/workout-stats"],
  });

  const { data: routines } = useQuery({
    queryKey: ["/api/routines?limit=6"],
  });

  const { data: trainers } = useQuery({
    queryKey: ["/api/trainers?limit=4"],
  });

  const { data: posts } = useQuery({
    queryKey: ["/api/posts?limit=5"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              안녕하세요, {user?.firstName || '회원'}님!
            </h2>
            <p className="text-lg opacity-90 mb-8">
              오늘도 건강한 하루를 위한 운동을 시작해보세요
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-xl p-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400 ml-4" />
                <Input 
                  placeholder="운동 부위, 트레이너, 루틴명으로 검색하세요..." 
                  className="flex-1 border-0 focus:ring-0 text-gray-700"
                />
                <Button className="gradient-bg text-white">
                  검색
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Dashboard */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">이번 주 운동</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {workoutStats?.weeklyWorkouts || 0}회
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full progress-bar" 
                      style={{ width: `${Math.min((workoutStats?.weeklyWorkouts || 0) / 7 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">목표: 주 7회</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">총 운동 시간</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {workoutStats?.totalHours || 0}시간
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-blue-600">이번 달 활동 중!</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">저장한 루틴</p>
                    <p className="text-2xl font-bold text-gray-900">12개</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Bookmark className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-green-600">+3개 이번 주</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">연속 기록</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {workoutStats?.currentStreak || 0}일
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Flame className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-yellow-600">🔥 연속 운동 기록!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Progress Chart */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">운동 진행 상황</h3>
              <ProgressChart />
            </CardContent>
          </Card>
        </section>

        {/* Featured Routines */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">인기 루틴</h3>
            <Link href="/routines">
              <Button variant="ghost" className="text-primary hover:text-primary-dark">
                전체 보기 →
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines?.map((routine: any) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </div>
        </section>

        {/* Featured Trainers */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">인기 트레이너</h3>
            <Link href="/trainers">
              <Button variant="ghost" className="text-primary hover:text-primary-dark">
                전체 보기 →
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers?.map((trainer: any) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </section>

        {/* Community Activity */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">커뮤니티 활동</h3>
            <Link href="/community">
              <Button variant="ghost" className="text-primary hover:text-primary-dark">
                더 보기 →
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">최근 질문 & 답변</h4>
                <div className="space-y-4">
                  {posts?.slice(0, 3).map((post: any) => (
                    <div key={post.id} className="border-l-4 border-primary pl-4">
                      <h5 className="font-medium text-gray-900 text-sm mb-1">
                        {post.title || post.content.substring(0, 50)}...
                      </h5>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {post.user.firstName} • {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-green-600">
                          댓글 {post.commentCount}개
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary/20">
                  질문하기
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">운동 성과 공유</h4>
                <div className="space-y-4">
                  {posts?.slice(0, 2).map((post: any) => (
                    <div key={post.id} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {post.user.firstName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>👍 {post.likes}</span>
                          <span>💬 {post.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary/20">
                  성과 공유하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <Button 
        className="floating-action gradient-bg text-white w-16 h-16 rounded-full shadow-lg hover:scale-110 transition-all"
        title="새 루틴 생성"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center py-1 px-2 text-primary">
            <div className="text-lg mb-1">🏠</div>
            <span className="text-xs">홈</span>
          </Link>
          <Link href="/routines" className="flex flex-col items-center py-1 px-2 text-gray-600">
            <div className="text-lg mb-1">🔍</div>
            <span className="text-xs">루틴</span>
          </Link>
          <Link href="/create-routine" className="flex flex-col items-center py-1 px-2 text-gray-600">
            <div className="text-lg mb-1">➕</div>
            <span className="text-xs">기록</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center py-1 px-2 text-gray-600">
            <div className="text-lg mb-1">👥</div>
            <span className="text-xs">커뮤니티</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-1 px-2 text-gray-600">
            <div className="text-lg mb-1">👤</div>
            <span className="text-xs">프로필</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
