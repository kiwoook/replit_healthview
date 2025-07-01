import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function ProgressChart() {
  const { data: workoutRecords } = useQuery({
    queryKey: ["/api/workout-records?limit=30"],
  });

  // Transform workout records into chart data
  const chartData = workoutRecords?.slice(0, 7).reverse().map((record: any, index: number) => ({
    day: ["월", "화", "수", "목", "금", "토", "일"][index] || `Day ${index + 1}`,
    duration: record.duration || 0,
    date: new Date(record.date).toLocaleDateString(),
  })) || [];

  // Mock strength progression data
  const strengthData = [
    { exercise: "벤치프레스", weight: 65, month: "1월" },
    { exercise: "벤치프레스", weight: 70, month: "2월" },
    { exercise: "벤치프레스", weight: 72, month: "3월" },
    { exercise: "벤치프레스", weight: 75, month: "4월" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">주간 운동 통계</h4>
        
        {/* Weekly Progress */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">이번 주 목표</span>
            <span className="text-sm font-medium text-gray-900">7/7일</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-primary to-blue-500 h-3 rounded-full progress-bar" 
              style={{ width: `${Math.min((chartData.length / 7) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {chartData.length}일 완료 • {7 - chartData.length}일 남음
          </p>
        </div>

        {/* Weekly Chart */}
        {chartData.length > 0 ? (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => `${label}요일`}
                  formatter={(value: number) => [`${value}분`, "운동 시간"]}
                />
                <Bar dataKey="duration" fill="#FF6B35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">운동 기록이 없습니다</p>
          </div>
        )}

        {/* Daily Breakdown */}
        <div className="space-y-3 mt-4">
          {["월요일", "화요일", "수요일", "목요일", "금요일"].map((day, index) => {
            const dayRecord = chartData.find(d => d.day === day.charAt(0));
            const hasWorkout = dayRecord && dayRecord.duration > 0;
            
            return (
              <div key={day} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{day}</span>
                <div className="flex items-center space-x-2">
                  {hasWorkout ? (
                    <>
                      <span className="text-xs text-green-600">
                        운동 {dayRecord.duration}분
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400">휴식</span>
                      <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">근력 발전 상황</h4>
        
        {/* Strength Progress Chart */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-900">벤치프레스 1RM</span>
            <span className="text-lg font-bold text-primary">75kg</span>
          </div>
          
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [`${value}kg`, "중량"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#FF6B35" 
                  strokeWidth={3}
                  dot={{ fill: "#FF6B35", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-xs text-green-600 mt-2">+10kg 증가 (지난 3개월)</p>
        </div>

        {/* Exercise Progress */}
        <div className="space-y-3">
          {[
            { name: "스쿼트", weight: "85kg", increase: "+5kg" },
            { name: "데드리프트", weight: "95kg", increase: "+8kg" },
            { name: "오버헤드프레스", weight: "45kg", increase: "+3kg" },
          ].map((exercise) => (
            <div key={exercise.name} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{exercise.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{exercise.weight}</span>
                <span className="text-xs text-green-600">{exercise.increase}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
