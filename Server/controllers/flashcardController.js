import flashcard from '../models/Flashcard.js';

export const getFlashcards = async(req,res,next) =>{
    try{
        const flashcards = await flashcard.find({
            userId: req.user._id,
            documentId: req.params.documentId
        })
           .populate['documentId','title flieName']
           .sort({ createAt : -1});

        res.status(200).json({
            success: true,
            count: flashcards.length,
            data:flashcards
        });
    }catch(error){
        next(error);
    }
};
export const  getAllFlashcardSets = async(req,res,next) =>{
    try{
        const flashcardSets = await flashcard.find({userId: req.user._id})
         .populate['documentId', 'title filename']
         .sort({createAt: -1});
        res.status(200).json({
            success:true,
            count:flashcardSets.length,
            data:flashcarsSets,
        })
    }catch(error){
        next(error);
    }
};
export const reviewFlashcard = async(req,res,next)=>{
    try{
        const flashcardSet = await flashcard.findOne({
            'cards._id': req.params.cardId, 
            userId:req.user._id
        });

        if(!flashcardSet) {
            return res.status(400).json({
                success: false,
                error:'flashcard set or card not found',
                statusCode: 404
            });
        }
        const cardIndex = flashcardSet.cards.findIndex(card=>card._id.toString() === req.params.cardId);
        if(cardIndex === -1) {
            return res.status(404).json ({
                success:false,
                error:'Card not found is set',
                statusCode: 404
            });
        }
        flashcardSet.cards(cardIndex).lastReviewed = new Date();
        flashcardSet.cards(cardIndex).reviewCount += 1;

        await flashcardSet.save();

        res.status(200).json({
            success:true,
            data: flashcardSet,
            message:'flashcard reviewed successfully'
        });
    }catch(error){
        next(error);
    }
};
export const taggleStarFlashcard = async(req,res,next)=>{
    try{
        const flashcardSet = await flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        });
        if(!flashcardSet) {
            return res.status(404).json({
                success:false,
                error:'flashcard set or card not found',
                statusCode: 404
            });
        }
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if(!cardIndex === -1 ){
            return res.status(404).json({
                success:false,
                error:'Card not found is set',
                statusCode:404
            })
        }
        flashcardSet.cards[cardIndex].toStarred = !flashcardSet.cards[cardIndex].isStarred;
        await flashcardSet.save();

        res.status(209).json({
            success:true,
            data: flashcardSet,
            message: `flashcard ${flashcardSet.cards[cardIndex].isStarred ? 'starred':'unstarred'}`
        });
    }catch(error){
        next(error);
    }
};
export const deletedFlashcardlist = async(req,res,next)=>{
    try{
        const flashcardSets = await flashcard.findOne({
            _id: req.params.id,
            userId:res.user._id,
        });
        if(!flashcardSet) {
            return res.status(404).json({
                success: false,
                error:'flashcard set not found',
                statusCode:404
            });
        }
        await flashcardSet.deleteOne();

        res.status(200).json({
            success:true,
            message:'flashcard set deleted successfully'
        });
    }catch(error){
        next(error);
    }
};
