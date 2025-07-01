import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default("enthusiast"), // "enthusiast" or "trainer"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trainer profiles
export const trainers = pgTable("trainers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  specialization: text("specialization"),
  bio: text("bio"),
  certifications: text("certifications").array(),
  experienceYears: integer("experience_years"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalStudents: integer("total_students").default(0),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workout routines
export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  bodyParts: text("body_parts").array(), // ["upper", "lower", "core", "cardio", "full"]
  difficulty: varchar("difficulty").notNull(), // "beginner", "intermediate", "advanced"
  duration: integer("duration"), // in minutes
  equipmentNeeded: boolean("equipment_needed").default(false),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  isPublic: boolean("is_public").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalRatings: integer("total_ratings").default(0),
  totalSaves: integer("total_saves").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual exercises within routines
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  routineId: integer("routine_id").notNull().references(() => routines.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  sets: integer("sets"),
  reps: integer("reps"),
  duration: integer("duration"), // in seconds for time-based exercises
  restTime: integer("rest_time"), // in seconds
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User workout records
export const workoutRecords = pgTable("workout_records", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  routineId: integer("routine_id").references(() => routines.id),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // actual duration in minutes
  notes: text("notes"),
  completed: boolean("completed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exercise performance records
export const exerciseRecords = pgTable("exercise_records", {
  id: serial("id").primaryKey(),
  workoutRecordId: integer("workout_record_id").notNull().references(() => workoutRecords.id),
  exerciseId: integer("exercise_id").references(() => exercises.id),
  exerciseName: varchar("exercise_name", { length: 255 }).notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Routine ratings and reviews
export const routineRatings = pgTable("routine_ratings", {
  id: serial("id").primaryKey(),
  routineId: integer("routine_id").notNull().references(() => routines.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved routines
export const savedRoutines = pgTable("saved_routines", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  routineId: integer("routine_id").notNull().references(() => routines.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community posts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  type: varchar("type").notNull(), // "question", "achievement", "general"
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Post comments
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  trainer: one(trainers, {
    fields: [users.id],
    references: [trainers.userId],
  }),
  routines: many(routines),
  workoutRecords: many(workoutRecords),
  savedRoutines: many(savedRoutines),
  posts: many(posts),
  comments: many(comments),
  routineRatings: many(routineRatings),
}));

export const trainersRelations = relations(trainers, ({ one }) => ({
  user: one(users, {
    fields: [trainers.userId],
    references: [users.id],
  }),
}));

export const routinesRelations = relations(routines, ({ one, many }) => ({
  creator: one(users, {
    fields: [routines.creatorId],
    references: [users.id],
  }),
  exercises: many(exercises),
  workoutRecords: many(workoutRecords),
  ratings: many(routineRatings),
  savedBy: many(savedRoutines),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  routine: one(routines, {
    fields: [exercises.routineId],
    references: [routines.id],
  }),
  records: many(exerciseRecords),
}));

export const workoutRecordsRelations = relations(workoutRecords, ({ one, many }) => ({
  user: one(users, {
    fields: [workoutRecords.userId],
    references: [users.id],
  }),
  routine: one(routines, {
    fields: [workoutRecords.routineId],
    references: [routines.id],
  }),
  exerciseRecords: many(exerciseRecords),
}));

export const exerciseRecordsRelations = relations(exerciseRecords, ({ one }) => ({
  workoutRecord: one(workoutRecords, {
    fields: [exerciseRecords.workoutRecordId],
    references: [workoutRecords.id],
  }),
  exercise: one(exercises, {
    fields: [exerciseRecords.exerciseId],
    references: [exercises.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertTrainerSchema = createInsertSchema(trainers).omit({ id: true });
export const insertRoutineSchema = createInsertSchema(routines).omit({ id: true, rating: true, totalRatings: true, totalSaves: true, createdAt: true, updatedAt: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true, createdAt: true });
export const insertWorkoutRecordSchema = createInsertSchema(workoutRecords).omit({ id: true, createdAt: true });
export const insertExerciseRecordSchema = createInsertSchema(exerciseRecords).omit({ id: true, createdAt: true });
export const insertRoutineRatingSchema = createInsertSchema(routineRatings).omit({ id: true, createdAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, likes: true, createdAt: true, updatedAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTrainer = z.infer<typeof insertTrainerSchema>;
export type Trainer = typeof trainers.$inferSelect;
export type InsertRoutine = z.infer<typeof insertRoutineSchema>;
export type Routine = typeof routines.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertWorkoutRecord = z.infer<typeof insertWorkoutRecordSchema>;
export type WorkoutRecord = typeof workoutRecords.$inferSelect;
export type InsertExerciseRecord = z.infer<typeof insertExerciseRecordSchema>;
export type ExerciseRecord = typeof exerciseRecords.$inferSelect;
export type InsertRoutineRating = z.infer<typeof insertRoutineRatingSchema>;
export type RoutineRating = typeof routineRatings.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
