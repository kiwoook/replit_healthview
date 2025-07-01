import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertRoutineSchema,
  insertExerciseSchema,
  insertWorkoutRecordSchema,
  insertExerciseRecordSchema,
  insertRoutineRatingSchema,
  insertPostSchema,
  insertCommentSchema,
  insertTrainerSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user is a trainer
      const trainer = await storage.getTrainer(userId);
      
      res.json({ ...user, trainer });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Trainer routes
  app.post('/api/trainers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const trainerData = insertTrainerSchema.parse({ ...req.body, userId });
      
      // Update user type to trainer
      await storage.upsertUser({ id: userId, userType: "trainer" });
      
      const trainer = await storage.createTrainer(trainerData);
      res.json(trainer);
    } catch (error) {
      console.error("Error creating trainer:", error);
      res.status(500).json({ message: "Failed to create trainer profile" });
    }
  });

  app.get('/api/trainers', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const trainers = await storage.getTrainers(limit);
      res.json(trainers);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      res.status(500).json({ message: "Failed to fetch trainers" });
    }
  });

  // Routine routes
  app.post('/api/routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routineData = insertRoutineSchema.parse({ ...req.body, creatorId: userId });
      
      const routine = await storage.createRoutine(routineData);
      res.json(routine);
    } catch (error) {
      console.error("Error creating routine:", error);
      res.status(500).json({ message: "Failed to create routine" });
    }
  });

  app.get('/api/routines', async (req, res) => {
    try {
      const filters = {
        bodyParts: req.query.bodyParts ? (req.query.bodyParts as string).split(',') : undefined,
        difficulty: req.query.difficulty as string,
        duration: req.query.minDuration || req.query.maxDuration ? {
          min: req.query.minDuration ? parseInt(req.query.minDuration as string) : undefined,
          max: req.query.maxDuration ? parseInt(req.query.maxDuration as string) : undefined,
        } : undefined,
        equipmentNeeded: req.query.equipmentNeeded === 'true' ? true : req.query.equipmentNeeded === 'false' ? false : undefined,
        search: req.query.search as string,
        creatorId: req.query.creatorId as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const routines = await storage.getRoutines(filters);
      res.json(routines);
    } catch (error) {
      console.error("Error fetching routines:", error);
      res.status(500).json({ message: "Failed to fetch routines" });
    }
  });

  app.get('/api/routines/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const routine = await storage.getRoutine(id);
      
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      res.json(routine);
    } catch (error) {
      console.error("Error fetching routine:", error);
      res.status(500).json({ message: "Failed to fetch routine" });
    }
  });

  // Exercise routes
  app.post('/api/exercises', isAuthenticated, async (req: any, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.json(exercise);
    } catch (error) {
      console.error("Error creating exercise:", error);
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });

  // Workout record routes
  app.post('/api/workout-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recordData = insertWorkoutRecordSchema.parse({ ...req.body, userId });
      
      const record = await storage.createWorkoutRecord(recordData);
      res.json(record);
    } catch (error) {
      console.error("Error creating workout record:", error);
      res.status(500).json({ message: "Failed to create workout record" });
    }
  });

  app.get('/api/workout-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      const records = await storage.getWorkoutRecords(userId, limit);
      res.json(records);
    } catch (error) {
      console.error("Error fetching workout records:", error);
      res.status(500).json({ message: "Failed to fetch workout records" });
    }
  });

  app.get('/api/workout-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getWorkoutStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching workout stats:", error);
      res.status(500).json({ message: "Failed to fetch workout stats" });
    }
  });

  // Exercise record routes
  app.post('/api/exercise-records', isAuthenticated, async (req: any, res) => {
    try {
      const recordData = insertExerciseRecordSchema.parse(req.body);
      const record = await storage.createExerciseRecord(recordData);
      res.json(record);
    } catch (error) {
      console.error("Error creating exercise record:", error);
      res.status(500).json({ message: "Failed to create exercise record" });
    }
  });

  // Rating routes
  app.post('/api/routine-ratings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ratingData = insertRoutineRatingSchema.parse({ ...req.body, userId });
      
      // Check if user already rated this routine
      const existingRating = await storage.getUserRoutineRating(ratingData.routineId, userId);
      if (existingRating) {
        return res.status(400).json({ message: "You have already rated this routine" });
      }
      
      const rating = await storage.createRoutineRating(ratingData);
      res.json(rating);
    } catch (error) {
      console.error("Error creating rating:", error);
      res.status(500).json({ message: "Failed to create rating" });
    }
  });

  app.get('/api/routine-ratings/:routineId', async (req, res) => {
    try {
      const routineId = parseInt(req.params.routineId);
      const ratings = await storage.getRoutineRatings(routineId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  // Saved routines routes
  app.post('/api/saved-routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { routineId } = z.object({ routineId: z.number() }).parse(req.body);
      
      await storage.saveRoutine(userId, routineId);
      res.json({ message: "Routine saved successfully" });
    } catch (error) {
      console.error("Error saving routine:", error);
      res.status(500).json({ message: "Failed to save routine" });
    }
  });

  app.delete('/api/saved-routines/:routineId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routineId = parseInt(req.params.routineId);
      
      await storage.unsaveRoutine(userId, routineId);
      res.json({ message: "Routine unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving routine:", error);
      res.status(500).json({ message: "Failed to unsave routine" });
    }
  });

  app.get('/api/saved-routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedRoutines = await storage.getSavedRoutines(userId);
      res.json(savedRoutines);
    } catch (error) {
      console.error("Error fetching saved routines:", error);
      res.status(500).json({ message: "Failed to fetch saved routines" });
    }
  });

  app.get('/api/saved-routines/:routineId/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routineId = parseInt(req.params.routineId);
      
      const isSaved = await storage.isRoutineSaved(userId, routineId);
      res.json({ isSaved });
    } catch (error) {
      console.error("Error checking saved routine:", error);
      res.status(500).json({ message: "Failed to check saved routine" });
    }
  });

  // Community routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse({ ...req.body, userId });
      
      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/posts', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const posts = await storage.getPosts(limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Comment routes
  app.post('/api/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const commentData = insertCommentSchema.parse({ ...req.body, userId });
      
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.get('/api/comments/:postId', async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getComments(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
