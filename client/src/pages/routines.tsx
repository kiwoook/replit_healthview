import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import RoutineCard from "@/components/routine-card";
import WorkoutFilter from "@/components/workout-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function Routines() {
  const [filters, setFilters] = useState({
    search: "",
    bodyParts: [] as string[],
    difficulty: "",
    minDuration: "",
    maxDuration: "",
    equipmentNeeded: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.bodyParts.length) queryParams.append("bodyParts", filters.bodyParts.join(","));
  if (filters.difficulty) queryParams.append("difficulty", filters.difficulty);
  if (filters.minDuration) queryParams.append("minDuration", filters.minDuration);
  if (filters.maxDuration) queryParams.append("maxDuration", filters.maxDuration);
  if (filters.equipmentNeeded) queryParams.append("equipmentNeeded", filters.equipmentNeeded);

  const { data: routines, isLoading } = useQuery({
    queryKey: [`/api/routines?${queryParams.toString()}`],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Query will automatically refetch due to key change
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">운동 루틴 찾기</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="루틴명, 운동 부위, 트레이너로 검색..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="gradient-bg text-white">
              검색
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              필터
            </Button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="mb-6">
              <WorkoutFilter filters={filters} onFiltersChange={setFilters} />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {routines?.length || 0}개의 루틴을 찾았습니다
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-12 h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : routines?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              다른 검색어나 필터 조건을 시도해보세요
            </p>
            <Button
              onClick={() => setFilters({
                search: "",
                bodyParts: [],
                difficulty: "",
                minDuration: "",
                maxDuration: "",
                equipmentNeeded: "",
              })}
              variant="outline"
            >
              필터 초기화
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines?.map((routine: any) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
