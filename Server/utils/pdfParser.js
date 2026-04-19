import fs from "fs/promises";
import pkg from "pdf-parser";

const { PDFParser } = pkg; // note: may be PDFParser, not PDFParse

export const extractTextfromPDF = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);

        const parser = new PDFParser();
        const data = await parser.parseBuffer(dataBuffer);


        return {
            text:data.text,
            newPages: data.newPages,
            info: data.info,
        };
    } catch (error) {
        console.error("PDF parsing error:", error);
        throw new Error("Failed to extract text from PDF");
    }
};
