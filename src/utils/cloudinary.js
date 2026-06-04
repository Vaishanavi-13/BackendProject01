import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filepath) => {
    try{

        if(!localFilepath) return null;

        const result = await cloudinary.uploader.upload(localFilepath, {
            resource_type: "auto",
        })

        console.log("File uploaded to Cloudinary:", response.url)

        return result;
    }catch(error){
        fs.unlinkSync(localFilePath);
        console.error("Error uploading file to Cloudinary:", error);
    }
}

export default cloudinary; 