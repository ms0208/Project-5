import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextfromPDF } from '../utils/pdfParser.js';
import { chunkTest } from '../utils/testChunker.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';

// Upload PDF DOCUMENT

// POST /api/documents/upload
// Private 

export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                successs: false,
                error: 'Please upload a PDF file',
                statusCode: 400
            });
        }
        const { title } = req.body;
        if (!title) {
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                error: 'Please provide a document title',
                statusCode: 400
            });
        }
        const baseURL = `http://localhost:${process.env.PORT || 8000}`;
        const fileUrl = `${baseURL}/uploads/documents/${req.file.filename}`;
        // create document record
        const document = await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname,
            filePath: fileUrl,
            fileSize: req.file.size,
            status: 'processing'
        });
        processPDF(document._id, req.file.path).catch(err => {
            console.error('PDF processing errors', err);
        });
        res.status(201).json({
            success: true,
            date: document,
            message: 'Document uploaded successfully, Processing in progress..'
        });
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { });
        }
        next(error);
    }
};

// Helper function to process PDF
const processPDF = async (documentId, filePath) => {
    try {
        const { test } = await extractTextfromPDF(filePath);
        // Create chunks
        const chunks = chunkTest(text, 500, 50);
        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks: chunks,
            status: 'ready'
        });
        console.log(`Document ${documentId} processes successfully`);

    } catch (error) {
        console.error(`Error processing document ${documentId};`, error);
        await Document.findByIdAndUpdate(documentId, {
            status: 'failed'
        })
    }
};
//  Get all user documents
//  Get /api/documents
// Private

export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'documentid',
                    as: 'flashcardSets'
                }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentid',
                    as: 'quizzes'
                }
            },
            {
                $addFields: {
                    flashcardCount: {
                        $size: { $ifNull: ["$flashcardSets", []] }
                    },
                    quizCount: {
                        $size: { $ifNull: ["$quizzes", []] }
                    }
                }
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0
                }
            },
            {
                $sort: { uploadDate: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            counts: documents.length,
            data: documents
        });
    } catch (error) {
        next(error);
    }
};


// Get single document with chunks
// Get /api/document/:id 
// Private
export const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if(!document) {
            return res.status(400).json({
                success:false,
                error:'Document not found',
                statusCode:404
            });
        }
        const flashcardCount = await Flashcard.countDocuments({documentId: document._id,userId:req.user._id});
        const quizCount = await Quiz.countDocuments({documentId: document._id,userId:req.user._id});

        // update last acccessed
        document.lastAccessed = Date.now();
        await document.save();

        const documentData = document.toObject();
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount;

        res.status(200).json({
            success:true,
            data:documentData
        });
    }catch(error) {
        next(error);
    }
}
// delete a document
export const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId:req.user._id
        });
        if(!document) {
            return res.status(404).json({
                success:false,
                error:'Document not found',
                statusCode: 400
            });
        }
        await fs.unlink(document.filePath).catch(()=>{});
        // delete document
        await document.deleteOne();
        res.status(200).json({
            success:true,
            message:"Document deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// update document title
// PUT /api/document/:id   
// Private
// export const updateDocument = async (req, res, next) => {
//     try {
        
//     } catch (error) {
//         next(error);
//     }
// };