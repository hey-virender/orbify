import cloudinary from 'cloudinary';
import path from "path";
import fs from "fs";
import dotenv from 'dotenv';


dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload to Cloudinary
async function bufferToPath(buffer, folder = "./uploads") {
  try {
    // Ensure the folder exists
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    // Generate a unique file name
    const fileName = `upload-${Date.now()}.jpg`; // Change the extension as needed
    const filePath = path.join(folder, fileName);

    // Write buffer to file
    await fs.promises.writeFile(filePath, buffer);

 
    return filePath;
  } catch (error) {
   
    throw error;
  }
}

export async function uploadToCloudinary(media,folder){
  const bytes = await media.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = await bufferToPath(buffer);

  const result = await cloudinary.v2.uploader.upload(filePath, {
    folder: "posts",
    format: "jpg",
    folder:folder,
    width: 1000,
    height: 1000,
    crop: "fill",
  });
  fs.unlink(filePath, (err) => {
    if (err) {
     
    } else {
      
    }
  });
  return result;
}

export async function deleteFromCloudinary(url) {
  try {
    
    const publicId = url.split("/").pop().split(".")[0];
    
    
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Failed to delete media from Cloudinary");
    }

    
    return result;
  } catch (error) {
    
    throw error;
  }
};

export default cloudinary;
