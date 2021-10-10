import cloudinary from 'cloudinary';

const uploadFileCloudinary = async (file, folder = 'blogify_media') => {
   // if provided string to file
   if (typeof file === 'string') {
      return new Promise((resolve, reject) => {
         cloudinary.v2.uploader.upload(file, (error, result) => {
            if (error) {
               reject(error.message);
            }
            resolve(result.url);
         });
      });
   }
   // else provided file
   const { createReadStream } = file;
   const res = await new Promise((resolve, reject) => {
      createReadStream().pipe(
         cloudinary.v2.uploader.upload_stream({ folder, unique_filename: true }, (error, result) => {
            if (error) {
               reject(error.message);
            }

            resolve(result.url);
         })
      );
   });

   return res;
};

export default uploadFileCloudinary;
