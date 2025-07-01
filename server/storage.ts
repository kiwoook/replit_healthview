import {
  users,
  trainers,
  routines,
  exercises,
  workoutRecords,
  exerciseRecords,
  routineRatings,
  savedRoutines,
  posts,
  comments,
  type User,
  type UpsertUser,
  type Trainer,
  type InsertTrainer,
  type Routine,
  type InsertRoutine,
  type Exercise,
  type InsertExercise,
  type WorkoutRecord,
  type InsertWorkoutRecord,
  type ExerciseRecord,
  type InsertExerciseRecord,
  type RoutineRating,
  type InsertRoutineRating,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, sql, like, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Trainer operations
  createTrainer(trainer: InsertTrainer): Promise<Trainer>;
  getTrainer(userId: string): Promise<Trainer | undefined>;
  getTrainers(limit?: number): Promise<(Trainer & { user: User })[]>;
  updateTrainer(userId: string, updates: Partial<InsertTrainer>): Promise<Trainer>;
  
  // Routine operations
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  getRoutine(id: number): Promise<(Routine & { creator: User; exercises: Exercise[] }) | undefined>;
  getRoutines(filters?: {
    bodyParts?: string[];
    difficulty?: string;
    duration?: { min?: number; max?: number };
    equipmentNeeded?: boolean;
    search?: string;
    creatorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<(Routine & { creator: User })[]>;
  updateRoutine(id: number, updates: Partial<InsertRoutine>): Promise<Routine>;
  deleteRoutine(id: number): Promise<void>;
  
  // Exercise operations
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  getExercisesByRoutine(routineId: number): Promise<Exercise[]>;
  updateExercise(id: number, updates: Partial<InsertExercise>): Promise<Exercise>;
  deleteExercise(id: number): Promise<void>;
  
  // Workout record operations
  createWorkoutRecord(record: InsertWorkoutRecord): Promise<WorkoutRecord>;
  getWorkoutRecords(userId: string, limit?: number): Promise<WorkoutRecord[]>;
  getWorkoutStats(userId: string): Promise<{
    weeklyWorkouts: number;
    totalHours: number;
    currentStreak: number;
  }>;
  
  // Exercise record operations
  createExerciseRecord(record: InsertExerciseRecord): Promise<ExerciseRecord>;
  getExerciseRecords(workoutRecordId: number): Promise<ExerciseRecord[]>;
  
  // Rating operations
  createRoutineRating(rating: InsertRoutineRating): Promise<RoutineRating>;
  getRoutineRatings(routineId: number): Promise<(RoutineRating & { user: User })[]>;
  getUserRoutineRating(routineId: number, userId: string): Promise<RoutineRating | undefined>;
  
  // Saved routines operations
  saveRoutine(userId: string, routineId: number): Promise<void>;
  unsaveRoutine(userId: string, routineId: number): Promise<void>;
  getSavedRoutines(userId: string): Promise<(Routine & { creator: User })[]>;
  isRoutineSaved(userId: string, routineId: number): Promise<boolean>;
  
  // Community operations
  createPost(post: InsertPost): Promise<Post>;
  getPosts(limit?: number, offset?: number): Promise<(Post & { user: User; commentCount: number })[]>;
  getPost(id: number): Promise<(Post & { user: User }) | undefined>;
  updatePost(id: number, updates: Partial<InsertPost>): Promise<Post>;
  deletePost(id: number): Promise<void>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getComments(postId: number): Promise<(Comment & { user: User })[]>;
  deleteComment(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Trainer operations
  async createTrainer(trainer: InsertTrainer): Promise<Trainer> {
    const [newTrainer] = await db.insert(trainers).values(trainer).returning();
    return newTrainer;
  }

  async getTrainer(userId: string): Promise<Trainer | undefined> {
    const [trainer] = await db.select().from(trainers).where(eq(trainers.userId, userId));
    return trainer;
  }

  async getTrainers(limit = 10): Promise<(Trainer & { user: User })[]> {
    const result = await db
      .select()
      .from(trainers)
      .innerJoin(users, eq(trainers.userId, users.id))
      .orderBy(desc(trainers.rating), desc(trainers.totalStudents))
      .limit(limit);
    
    return result.map(({ trainers: trainer, users: user }) => ({ ...trainer, user }));
  }

  async updateTrainer(userId: string, updates: Partial<InsertTrainer>): Promise<Trainer> {
    const [trainer] = await db
      .update(trainers)
      .set(updates)
      .where(eq(trainers.userId, userId))
      .returning();
    return trainer;
  }

  // Routine operations
  async createRoutine(routine: InsertRoutine): Promise<Routine> {
    const [newRoutine] = await db.insert(routines).values(routine).returning();
    return newRoutine;
  }

  async getRoutine(id: number): Promise<(Routine & { creator: User; exercises: Exercise[] }) | undefined> {
    const [result] = await db
      .select()
      .from(routines)
      .innerJoin(users, eq(routines.creatorId, users.id))
      .where(eq(routines.id, id));

    if (!result) return undefined;

    const exerciseList = await db
      .select()
      .from(exercises)
      .where(eq(exercises.routineId, id))
      .orderBy(asc(exercises.orderIndex));

    return {
      ...result.routines,
      creator: result.users,
      exercises: exerciseList,
    };
  }

  async getRoutines(filters?: {
    bodyParts?: string[];
    difficulty?: string;
    duration?: { min?: number; max?: number };
    equipmentNeeded?: boolean;
    search?: string;
    creatorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<(Routine & { creator: User })[]> {
    let query = db
      .select()
      .from(routines)
      .innerJoin(users, eq(routines.creatorId, users.id))
      .where(eq(routines.isPublic, true));

    const conditions = [];

    if (filters?.bodyParts?.length) {
      conditions.push(
        or(...filters.bodyParts.map(part => 
          sql`${routines.bodyParts} @> ${[part]}`
        ))
      );
    }

    if (filters?.difficulty) {
      conditions.push(eq(routines.difficulty, filters.difficulty));
    }

    if (filters?.duration?.min) {
      conditions.push(sql`${routines.duration} >= ${filters.duration.min}`);
    }

    if (filters?.duration?.max) {
      conditions.push(sql`${routines.duration} <= ${filters.duration.max}`);
    }

    if (filters?.equipmentNeeded !== undefined) {
      conditions.push(eq(routines.equipmentNeeded, filters.equipmentNeeded));
    }

    if (filters?.search) {
      conditions.push(
        or(
          like(routines.title, `%${filters.search}%`),
          like(routines.description, `%${filters.search}%`)
        )
      );
    }

    if (filters?.creatorId) {
      conditions.push(eq(routines.creatorId, filters.creatorId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query
      .orderBy(desc(routines.rating), desc(routines.totalSaves))
      .limit(filters?.limit || 20)
      .offset(filters?.offset || 0);

    return result.map(({ routines: routine, users: user }) => ({ ...routine, creator: user }));
  }

  async updateRoutine(id: number, updates: Partial<InsertRoutine>): Promise<Routine> {
    const [routine] = await db
      .update(routines)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(routines.id, id))
      .returning();
    return routine;
  }

  async deleteRoutine(id: number): Promise<void> {
    await db.delete(routines).where(eq(routines.id, id));
  }

  // Exercise operations
  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }

  async getExercisesByRoutine(routineId: number): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.routineId, routineId))
      .orderBy(asc(exercises.orderIndex));
  }

  async updateExercise(id: number, updates: Partial<InsertExercise>): Promise<Exercise> {
    const [exercise] = await db
      .update(exercises)
      .set(updates)
      .where(eq(exercises.id, id))
      .returning();
    return exercise;
  }

  async deleteExercise(id: number): Promise<void> {
    await db.delete(exercises).where(eq(exercises.id, id));
  }

  // Workout record operations
  async createWorkoutRecord(record: InsertWorkoutRecord): Promise<WorkoutRecord> {
    const [newRecord] = await db.insert(workoutRecords).values(record).returning();
    return newRecord;
  }

  async getWorkoutRecords(userId: string, limit = 20): Promise<WorkoutRecord[]> {
    return await db
      .select()
      .from(workoutRecords)
      .where(eq(workoutRecords.userId, userId))
      .orderBy(desc(workoutRecords.date))
      .limit(limit);
  }

  async getWorkoutStats(userId: string): Promise<{
    weeklyWorkouts: number;
    totalHours: number;
    currentStreak: number;
  }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [weeklyResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(workoutRecords)
      .where(
        and(
          eq(workoutRecords.userId, userId),
          sql`${workoutRecords.date} >= ${oneWeekAgo}`
        )
      );

    const [totalResult] = await db
      .select({ total: sql<number>`sum(${workoutRecords.duration})` })
      .from(workoutRecords)
      .where(eq(workoutRecords.userId, userId));

    // Calculate streak (simplified)
    const recentWorkouts = await db
      .select({ date: workoutRecords.date })
      .from(workoutRecords)
      .where(eq(workoutRecords.userId, userId))
      .orderBy(desc(workoutRecords.date))
      .limit(30);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < recentWorkouts.length; i++) {
      const workoutDate = new Date(recentWorkouts[i].date);
      workoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return {
      weeklyWorkouts: weeklyResult?.count || 0,
      totalHours: Math.round((totalResult?.total || 0) / 60),
      currentStreak: streak,
    };
  }

  // Exercise record operations
  async createExerciseRecord(record: InsertExerciseRecord): Promise<ExerciseRecord> {
    const [newRecord] = await db.insert(exerciseRecords).values(record).returning();
    return newRecord;
  }

  async getExerciseRecords(workoutRecordId: number): Promise<ExerciseRecord[]> {
    return await db
      .select()
      .from(exerciseRecords)
      .where(eq(exerciseRecords.workoutRecordId, workoutRecordId));
  }

  // Rating operations
  async createRoutineRating(rating: InsertRoutineRating): Promise<RoutineRating> {
    const [newRating] = await db.insert(routineRatings).values(rating).returning();
    
    // Update routine's average rating
    const [avgResult] = await db
      .select({ 
        avg: sql<number>`avg(${routineRatings.rating})`,
        count: sql<number>`count(*)`
      })
      .from(routineRatings)
      .where(eq(routineRatings.routineId, rating.routineId));

    await db
      .update(routines)
      .set({ 
        rating: avgResult.avg.toFixed(2),
        totalRatings: avgResult.count 
      })
      .where(eq(routines.id, rating.routineId));

    return newRating;
  }

  async getRoutineRatings(routineId: number): Promise<(RoutineRating & { user: User })[]> {
    const result = await db
      .select()
      .from(routineRatings)
      .innerJoin(users, eq(routineRatings.userId, users.id))
      .where(eq(routineRatings.routineId, routineId))
      .orderBy(desc(routineRatings.createdAt));

    return result.map(({ routine_ratings: rating, users: user }) => ({ ...rating, user }));
  }

  async getUserRoutineRating(routineId: number, userId: string): Promise<RoutineRating | undefined> {
    const [rating] = await db
      .select()
      .from(routineRatings)
      .where(
        and(
          eq(routineRatings.routineId, routineId),
          eq(routineRatings.userId, userId)
        )
      );
    return rating;
  }

  // Saved routines operations
  async saveRoutine(userId: string, routineId: number): Promise<void> {
    await db.insert(savedRoutines).values({ userId, routineId }).onConflictDoNothing();
    
    // Update routine's total saves count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(savedRoutines)
      .where(eq(savedRoutines.routineId, routineId));

    await db
      .update(routines)
      .set({ totalSaves: countResult.count })
      .where(eq(routines.id, routineId));
  }

  async unsaveRoutine(userId: string, routineId: number): Promise<void> {
    await db
      .delete(savedRoutines)
      .where(
        and(
          eq(savedRoutines.userId, userId),
          eq(savedRoutines.routineId, routineId)
        )
      );
    
    // Update routine's total saves count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(savedRoutines)
      .where(eq(savedRoutines.routineId, routineId));

    await db
      .update(routines)
      .set({ totalSaves: countResult.count })
      .where(eq(routines.id, routineId));
  }

  async getSavedRoutines(userId: string): Promise<(Routine & { creator: User })[]> {
    const result = await db
      .select()
      .from(savedRoutines)
      .innerJoin(routines, eq(savedRoutines.routineId, routines.id))
      .innerJoin(users, eq(routines.creatorId, users.id))
      .where(eq(savedRoutines.userId, userId))
      .orderBy(desc(savedRoutines.createdAt));

    return result.map(({ routines: routine, users: user }) => ({ ...routine, creator: user }));
  }

  async isRoutineSaved(userId: string, routineId: number): Promise<boolean> {
    const [saved] = await db
      .select()
      .from(savedRoutines)
      .where(
        and(
          eq(savedRoutines.userId, userId),
          eq(savedRoutines.routineId, routineId)
        )
      );
    return !!saved;
  }

  // Community operations
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPosts(limit = 20, offset = 0): Promise<(Post & { user: User; commentCount: number })[]> {
    const result = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        content: posts.content,
        type: posts.type,
        imageUrl: posts.imageUrl,
        likes: posts.likes,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: users,
        commentCount: sql<number>`count(${comments.id})`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .groupBy(posts.id, users.id)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  }

  async getPost(id: number): Promise<(Post & { user: User }) | undefined> {
    const [result] = await db
      .select()
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id));

    if (!result) return undefined;

    return { ...result.posts, user: result.users };
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getComments(postId: number): Promise<(Comment & { user: User })[]> {
    const result = await db
      .select()
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt));

    return result.map(({ comments: comment, users: user }) => ({ ...comment, user }));
  }

  async deleteComment(id: number): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }
}

export const storage = new DatabaseStorage();
