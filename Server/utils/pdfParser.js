import fs from 'fs/promises';
import { PDFParse } from "pdf-parser";

export const extractTextfromPDF = async (filePath) => {
    try {
        const databuffer = await fs.readFile(filePath);
        const parser = new PDFParse(new Unit & Array(databuffer));
        const data = await parser.getText();

        return {
            text: data.text,
            newPages: data.numpages,
            info: data.info,
        };
    } catch (error) {
        console.error('PDF parsing errors',error);
        throw new Error('Failed to extract text from PDF');
    }
};

