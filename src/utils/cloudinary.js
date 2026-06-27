import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localFilepath) => {
    try{

        if(!localFilepath) return null;

        const result = await cloudinary.uploader.upload(localFilepath, {
            resource_type: "auto",
        })

        
        fs.unlinkSync(localFilepath); // Delete the local file after successful upload
        return result;
    }catch(error){
        fs.unlinkSync(localFilepath);
        console.error("Error uploading file to Cloudinary:", error);
    }
}

export { uploadToCloudinary };