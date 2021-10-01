import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

export const uploadFileCloudinary = async (file, folder) => {
   const { stream, filename, mimetype, encoding } = await file;
   const fileBuffer = Buffer.from(file);
   let uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
         let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
            {
               folder,
            },
            (error, result) => {
               if (result) {
                  resolve(result);
               } else {
                  reject(error);
               }
            }
         );

         streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
      });
   };

   const result = await uploadFromBuffer();
   return result;
};
