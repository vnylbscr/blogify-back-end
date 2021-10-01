import { gql, AuthenticationError, UserInputError } from 'apollo-server-express';
import Post from '../../Models/post.js';
import slugify from 'slugify';
import { TOKEN_NOT_FOUND } from '../../lib/constants.js';
import cloudinary from 'cloudinary';
import { v4 as uuidv4, v4 } from 'uuid';
import { uploadFileCloudinary } from '../../utils/cloudinaryUpload.js';
import fs from 'node:fs';
const postResolvers = {
   Query: {
      getAllPosts: async (_, __, context, info) => {
         // if (!context.isAuth) {
         //     throw new AuthenticationError(TOKEN_NOT_FOUND);
         // }
         const posts = await Post.find();
         return posts;
      },
      getPost: async (parent, args, context, info) => {
         if (context.isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const { _id } = args;

         const foundPost = await Post.findOne({
            _id,
         });

         if (!foundPost) {
            throw new Error('Post not found.');
         }

         return foundPost;
      },
   },
   Mutation: {
      addPost: async (parent, args, context, info) => {
         try {
            console.log('argsss', args);
            // if (!context.isAuth) {
            //     throw new AuthenticationError(TOKEN_NOT_FOUND);
            // }
            const { userId, title, subtitle, image: file, content, category } = args.data;
            const {
               file: { createReadStream, mimetype, filename },
            } = await file;
            const body = createReadStream();
            // Stream upload
            var upload_stream = cloudinary.uploader.upload_stream({ tags: 'basic_sample' }, function (err, image) {
               console.log();
               console.log('** Stream Upload');
               if (err) {
                  console.warn(err);
               }
               console.log('* Same image, uploaded via stream');
               console.log('* ' + image.public_id);
               console.log('* ' + image.url);
               waitForAllUploads('pizza3', err, image);
            });
            fs.createReadStream(body).pipe(upload_stream);

            if (!title || !content || !image) {
               throw new UserInputError('please fill required fields.');
            }

            //  const uploadedFile = await uploadFileCloudinary(image, 'images');

            console.log('aaaa', uploadedFile);
            //  const newPost = new Post({
            //     user: userId,
            //     title,
            //     content,
            //     category,
            //     image: 'merto',
            //     slug: slugify(title),
            //  });

            //  const post = await newPost.save();

            return post;
         } catch (error) {
            console.log(error);
            throw new Error('Ulaaa');
         }
      },
   },
};

export default postResolvers;
