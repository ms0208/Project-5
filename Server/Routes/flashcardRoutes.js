import express from 'express';
import {
    getFlashcards,
    getAllFlashcardSets,
    reviewFlashcard,
    taggleStarFlashcard,
    deletedFlashcardlist,
} from '../controllers/flashcardController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/',getAllFlashcardSets);
router.get('/:documentId',getFlashcards);
router.post('/:cardId/review',reviewFlashcard);
router.put('/:cardId/star',taggleStarFlashcard);
router.delete('/:id',deletedFlashcardlist);

export default router;