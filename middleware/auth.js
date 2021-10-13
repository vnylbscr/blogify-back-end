import jwt from 'jsonwebtoken';
import { SO_SECRET_KEY } from '../utils/config.js';

const Auth = (request) => {
   const header = request.headers.authorization;
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
   }
   try {
      const user = jwt.verify(token, SO_SECRET_KEY);
      return {
         user,
         isAuth: true,
      };
   } catch (error) {
      return {
         isAuth: false,
      };
   }
};

export default Auth;
