import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface WorkoutFilterProps {
  filters: {
    bodyParts: string[];
    difficulty: string;
    minDuration: string;
    maxDuration: string;
    equipmentNeeded: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function WorkoutFilter({ filters, onFiltersChange }: WorkoutFilterProps) {
  const bodyPartOptions = [
    { value: "upper", label: "상체" },
    { value: "lower", label: "하체" },
    { value: "core", label: "코어" },
    { value: "cardio", label: "유산소" },
    { value: "full", label: "전신" },
  ];

  const toggleBodyPart = (bodyPart: string) => {
    const newBodyParts = filters.bodyParts.includes(bodyPart)
      ? filters.bodyParts.filter(part => part !== bodyPart)
      : [...filters.bodyParts, bodyPart];
    
    onFiltersChange({ ...filters, bodyParts: newBodyParts });
  };

  const clearFilters = () => {
    onFiltersChange({
      bodyParts: [],
      difficulty: "",
      minDuration: "",
      maxDuration: "",
      equipmentNeeded: "",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">필터</h3>
          <Button variant="ghost" onClick={clearFilters} className="text-sm">
            초기화
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Body Parts */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              운동 부위
            </Label>
            <div className="flex flex-wrap gap-2">
              {bodyPartOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.bodyParts.includes(option.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleBodyPart(option.value)}
                  className={
                    filters.bodyParts.includes(option.value)
                      ? "gradient-bg text-white"
                      : "text-gray-700"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty, Duration, Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                난이도
              </Label>
              <Select
                value={filters.difficulty}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="beginner">초급</SelectItem>
                  <SelectItem value="intermediate">중급</SelectItem>
                  <SelectItem value="advanced">고급</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                최소 시간
              </Label>
              <Select
                value={filters.minDuration}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, minDuration: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="제한 없음" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">제한 없음</SelectItem>
                  <SelectItem value="15">15분</SelectItem>
                  <SelectItem value="30">30분</SelectItem>
                  <SelectItem value="45">45분</SelectItem>
                  <SelectItem value="60">60분</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                최대 시간
              </Label>
              <Select
                value={filters.maxDuration}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, maxDuration: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="제한 없음" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">제한 없음</SelectItem>
                  <SelectItem value="30">30분</SelectItem>
                  <SelectItem value="45">45분</SelectItem>
                  <SelectItem value="60">60분</SelectItem>
                  <SelectItem value="90">90분</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              기구 필요성
            </Label>
            <Select
              value={filters.equipmentNeeded}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, equipmentNeeded: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="false">기구 없음</SelectItem>
                <SelectItem value="true">기구 필요</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
