import cloudinary from 'cloudinary';

const uploadFileCloudinary = async (file, folder = 'blogify_media') => {
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
