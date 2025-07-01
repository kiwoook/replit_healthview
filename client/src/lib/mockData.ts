// Mock data service for client-only version

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trainer {
  id: number;
  specialization: string;
  rating: string;
  totalStudents: number;
  verified: boolean;
  user: User;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  videoUrl?: string;
  orderIndex: number;
}

export interface Routine {
  id: number;
  title: string;
  description: string;
  bodyParts: string[];
  difficulty: string;
  duration: number;
  rating: string;
  totalRatings: number;
  creator: User;
  exercises?: Exercise[];
}

export interface Post {
  id: number;
  title?: string;
  content: string;
  type: string;
  imageUrl?: string;
  likes: number;
  createdAt: string;
  commentCount: number;
  user: User;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "kim.trainer@example.com",
    firstName: "김민수",
    lastName: "김",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    email: "lee.trainer@example.com",
    firstName: "이지영",
    lastName: "이",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b667f3c6?w=150&h=150&fit=crop",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z"
  },
  {
    id: "3",
    email: "park.trainer@example.com", 
    firstName: "박성호",
    lastName: "박",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z"
  }
];

// Mock trainers
export const mockTrainers: Trainer[] = [
  {
    id: 1,
    specialization: "근력 운동",
    rating: "4.9",
    totalStudents: 127,
    verified: true,
    user: mockUsers[0]
  },
  {
    id: 2,
    specialization: "요가 & 필라테스",
    rating: "4.8",
    totalStudents: 89,
    verified: true,
    user: mockUsers[1]
  },
  {
    id: 3,
    specialization: "크로스핏",
    rating: "4.7",
    totalStudents: 64,
    verified: false,
    user: mockUsers[2]
  }
];

// Mock exercises
export const mockExercises: Exercise[] = [
  {
    id: 1,
    name: "푸시업",
    description: "가슴과 어깨, 삼두근을 강화하는 기본 운동",
    sets: 3,
    reps: 12,
    restTime: 60,
    orderIndex: 0
  },
  {
    id: 2,
    name: "스쿼트",
    description: "하체 전체 근육을 강화하는 복합 운동",
    sets: 3,
    reps: 15,
    restTime: 90,
    orderIndex: 1
  },
  {
    id: 3,
    name: "플랭크",
    description: "코어 근육을 강화하는 정적 운동",
    duration: 60,
    restTime: 60,
    orderIndex: 2
  }
];

// Mock routines
export const mockRoutines: Routine[] = [
  {
    id: 1,
    title: "초보자를 위한 전신 홈트레이닝",
    description: "집에서 할 수 있는 기본적인 전신 운동 루틴입니다. 장비 없이도 효과적으로 운동할 수 있습니다.",
    bodyParts: ["전신"],
    difficulty: "초급",
    duration: 30,
    rating: "4.8",
    totalRatings: 124,
    creator: mockUsers[0],
    exercises: mockExercises
  },
  {
    id: 2,
    title: "상체 집중 근력 강화",
    description: "상체 근육을 집중적으로 발달시키는 루틴입니다.",
    bodyParts: ["가슴", "어깨", "팔"],
    difficulty: "중급",
    duration: 45,
    rating: "4.7",
    totalRatings: 87,
    creator: mockUsers[1],
    exercises: mockExercises.slice(0, 2)
  },
  {
    id: 3,
    title: "하체 파워 업 루틴",
    description: "하체 근력과 지구력을 향상시키는 고강도 루틴입니다.",
    bodyParts: ["다리", "엉덩이"],
    difficulty: "고급",
    duration: 60,
    rating: "4.9",
    totalRatings: 203,
    creator: mockUsers[2],
    exercises: [mockExercises[1]]
  }
];

// Mock posts
export const mockPosts: Post[] = [
  {
    id: 1,
    title: "3개월 홈트레이닝 후기",
    content: "집에서만 운동했는데도 정말 많은 변화가 있었어요! 체중도 5kg 감량하고 근력도 많이 늘었습니다.",
    type: "success",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    likes: 24,
    createdAt: "2024-12-01T10:00:00Z",
    commentCount: 8,
    user: mockUsers[0]
  },
  {
    id: 2,
    content: "운동 초보자인데 어떤 루틴부터 시작하면 좋을까요? 조언 부탁드립니다!",
    type: "question",
    likes: 12,
    createdAt: "2024-12-02T14:30:00Z",
    commentCount: 15,
    user: mockUsers[1]
  },
  {
    id: 3,
    title: "오늘 첫 크로스핏 도전!",
    content: "드디어 크로스핏에 도전했어요. 힘들었지만 정말 만족스러운 운동이었습니다.",
    type: "general",
    likes: 18,
    createdAt: "2024-12-03T09:15:00Z",
    commentCount: 6,
    user: mockUsers[2]
  }
];

// Mock API functions
export const mockApi = {
  // Users
  getUser: (id: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === id);
        resolve(user || null);
      }, 300);
    });
  },

  // Routines
  getRoutines: (): Promise<Routine[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRoutines);
      }, 500);
    });
  },

  getRoutine: (id: number): Promise<Routine | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const routine = mockRoutines.find(r => r.id === id);
        resolve(routine || null);
      }, 300);
    });
  },

  // Trainers
  getTrainers: (): Promise<Trainer[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTrainers);
      }, 400);
    });
  },

  getTrainer: (id: number): Promise<Trainer | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trainer = mockTrainers.find(t => t.id === id);
        resolve(trainer || null);
      }, 300);
    });
  },

  // Posts
  getPosts: (): Promise<Post[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPosts);
      }, 400);
    });
  },

  // Workout stats (mock)
  getWorkoutStats: (): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          weeklyWorkouts: 4,
          totalHours: 12.5,
          currentStreak: 7
        });
      }, 300);
    });
  }
};