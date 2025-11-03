import express from "express";
import {
  getRecommendations,
  getQuiz,
  submitFeedback,
} from "../controllers/aiController.js";

const router = express.Router();

// @route   GET /api/ai/quiz
// @desc    Get quiz questions
// @access  Public
router.get("/quiz", getQuiz);

// @route   POST /api/ai/recommend
// @desc    Get AI recommendations based on preferences
// @access  Public
router.post("/recommend", getRecommendations);

// @route   POST /api/ai/feedback
// @desc    Submit feedback on recommendations
// @access  Public
router.post("/feedback", submitFeedback);

export default router;
