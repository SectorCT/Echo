import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

export const uploadImage = async (base64Image: string): Promise<string> => {
  try {
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(imageData, 'base64');
    const fileName = `${uuidv4()}.jpg`;
    const filePath = path.join(__dirname, '../../uploads', fileName);
    
    await fs.mkdir(path.join(__dirname, '../../uploads'), { recursive: true });
    await fs.writeFile(filePath, buffer);
    
    return `/uploads/${fileName}`;
  } catch (error) {
    throw new Error('Failed to upload image');
  }
}; 