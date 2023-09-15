import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads'); // Replace 'uploads/' with your desired directory
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  export const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check if the file is a JSON file
        if (file.mimetype === 'application/json') {
          cb(null, true); // Accept the file
        } else {
            // @ts-ignore
          cb(new Error('Invalid file type. Please upload a JSON file.'), false); // Reject the file
        }
      },
     
});