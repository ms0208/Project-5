import Document from '../models/Document.js';
import flashCard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import {extractTextFromPDF} from '../utils/pdfParser.js';
import {chunkText} from '../utils/testChunker.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';

// Upload PDF DOCUMENT

// POST /api/documents/upload
// Private 

export const uploadDocument = async(req,res,next) =>{
    try{

    } catch(error){
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        next(error);
    }
};

//  Get all user documents
//  Get /api/documents
// Private

export  const getDocuments = async (req,res,next) =>{

};

// Get single document with chunks
// Get /api/document/:id 
// Private
export const deleteDocument = async (req,res,next) =>{

};

// update document title
// PUT /api/document/:id   
// Private
export const updateDocument = async (req,res,next) =>{

};