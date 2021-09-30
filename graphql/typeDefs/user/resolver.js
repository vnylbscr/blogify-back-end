import { gql, UserInputError, AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TOKEN_NOT_FOUND } from '../../../lib/constants.js';
import fs from 'node:fs';
import User from '../../../Models/user.js';
import { SO_SECRET_KEY } from '../../../utils/config.js';
import { validateRegisterInputs } from '../../../utils/validateUser.js';
import { validateLoginInputs } from '../../../utils/validateUser.js';

const userResolvers = {
   Query: {
      getMeWithToken: async (parent, args, context, _) => {
         try {
            const { token } = args;
            if (!token) {
               return;
            }
            const user = jwt.verify(token, SO_SECRET_KEY);

            const res = await User.findOne({ email: user.email });
            return {
               id: res._id,
               name: res.username,
               ...res._doc,
            };
         } catch (error) {
            throw new AuthenticationError('Token geçersiz yada süresi dolmuş');
         }
      },
   },
   Mutation: {
      // REGISTER USER
      register: async (parent, args, context, info) => {
         console.log(args);
         const { username, email, password } = args.input;

         console.log(username);
         // Validate the user
         const { errors, isValid } = validateRegisterInputs(username, email, password);

         if (!isValid) {
            throw new UserInputError('Errors', { errors });
         }
         // todo check user is exist
         const user = await User.findOne({ email });
         console.log('user', user);
         if (user) {
            throw new UserInputError('Bu e-mail ile kayıtlı bir kullanıcı zaten var.', {
               errors: {
                  email: 'Bu isimde bir e-mail var',
               },
            });
         } else {
            // hash password and save user to db
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
               username,
               email,
               password: hashPassword,
               createdAt: new Date(),
            });
            const res = await newUser.save();
            const authToken = jwt.sign(
               {
                  id: res._id,
                  email: res.email,
                  username: res.username,
               },
               SO_SECRET_KEY,
               { expiresIn: '4d' }
            );
            return {
               token: authToken,
               ...res._doc,
            };
         }
      },
      // LOGIN USER
      login: async (parent, args, context, info) => {
         const { email, password } = args.input;
         const user = await User.findOne({ email });
         if (!user) {
            throw new UserInputError('User not found. Please check your informations.');
         } else {
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
               throw new UserInputError('E-mail or password is incorrect. Please check your informations.');
            }

            const authToken = jwt.sign(
               {
                  id: user._id,
                  email: user.email,
                  username: user.username,
               },
               SO_SECRET_KEY,
               { expiresIn: '4d' }
            );
            return {
               ...user.toObject(),
               token: authToken,
            };
         }
      },
      editProfile: async (_, args, context, __) => {
         if (!context.isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const doc = await User.findOneAndUpdate({
            ...args,
         });
      },
   },
};

export default userResolvers;
