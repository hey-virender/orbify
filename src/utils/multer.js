import multer from 'multer';

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file uploads
 

 export default upload;