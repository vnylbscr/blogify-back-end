import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { SO_SECRET_KEY } from '../utils/config.js';

export const Auth = (request) => {
   console.log('header', request.header);
   const header = request.req.headers.authorization;
   if (!header) {
      return {
         isAuth: false,
      };
   }
   const token = header.split(' ')[1];
   if (!token) {
      return {
         isAuth: false,
      };
   } else {
      try {
         const user = jwt.verify(token, SO_SECRET_KEY);
         console.log('agaa', user);
         return {
            user,
            isAuth: true,
         };
      } catch (error) {
         return {
            isAuth: false,
         };
      }
   }
};
