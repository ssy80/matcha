import fs from 'fs/promises';
import dotenv from 'dotenv';
import crypto from "crypto";
import path from 'path';


dotenv.config();

const IMAGE_DIR = process.env.IMAGE_DIR;
const MAX_SIZE = process.env.MAX_IMAGE_SIZE * 1024 * 1024;


export class PictureUtil{

    static async savePicture(picture){

        // Check if it's an object
        if (typeof picture !== 'object' || picture === null) return null;
        
        // Check required properties exist
        if (!picture.hasOwnProperty('base64_image')) return null;
        if (!picture.hasOwnProperty('isProfilePicture')) return null;

        if (typeof picture.base64_image !== 'string') return null;
        if (typeof picture.isProfilePicture !== 'number') return null;

        const base64Data = picture.base64_image;
        const isProfilePicture = picture.isProfilePicture;
        const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return null;
        }
        const imageType = matches[1].toLowerCase();

        const allowedTypes = ['jpeg', 'jpg', 'png'];
        if (!allowedTypes.includes(imageType)) {
            return null;
        }

        const base64Image = matches[2];
        const randomBytes = crypto.randomBytes(16);
        const randomName = randomBytes.toString('hex');

        const uploadPath = path.join(process.cwd(), IMAGE_DIR);
        const filename = `${randomName}.${imageType}`;
        const filePath = path.join(uploadPath, filename);

        const imageBuffer = Buffer.from(base64Image, 'base64');

        if (imageBuffer.length > MAX_SIZE) {
            return null;
        }

        await fs.writeFile(filePath, imageBuffer);

        const fileObj = {
            filename: filename,
            isProfilePicture: isProfilePicture
        }
        return fileObj;
    }

    static async savePictures(pictures){
        
        if (!Array.isArray(pictures)) 
            return null;

        let saved = [];
        let isProfilePictureCount = 0;
        for (const pic of pictures){
            const savedPic = await this.savePicture(pic);
            if (!savedPic)
                return null;
            else{
                if (savedPic.isProfilePicture)
                    isProfilePictureCount++;
                saved.push(savedPic);
            }
        }
        if (isProfilePictureCount > 1)
            return null;
        return saved;
    }
}
