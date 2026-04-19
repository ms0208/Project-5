import express from 'express';
import {
    generateFlashcards,
    generatedQuiz,
    generateSummary,
    chat,
    explainConcept,
    getCharHistory
} from '../controllers/aiController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/generate-flashcards',generateFlashcards);
router.post('/generate-quiz',generatedQuiz);
router.post('/generate-summary',generateSummary);
router.post('/chat',chat);
router.post('/explain-concept',explainConcept);
router.get('/chat-history/:documentId',getCharHistory);

export default router;