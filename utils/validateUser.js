import { EMAIL_REGEX, PASSWORD_REGEX } from '../lib/constants.js';

const validateRegisterInputs = (username, email, password) => {
   const errors = {};
   if (username.trim() === '') {
      errors.username = 'Kullanıcı adı boş olamaz';
   }
   if (password.trim() === '') {
      errors.password = 'Şifre boş olamaz';
   }
   if (email.trim() === '') {
      errors.email = 'E-mail boş olamaz';
   } else {
      if (!EMAIL_REGEX.test(email)) {
         errors.email = 'E-mail adresi geçerli bir e-mail adresi olmalıdır';
      }
   }
   // * returns errors
   return {
      errors,
      isValid: Object.keys(errors).length < 1,
   };
};

const validateLoginInputs = (email, password) => {
   const errors = {};
   if (password.trim() === '') {
      errors.password = 'Şifre boş olamaz';
   }
   if (email.trim() === '') {
      errors.email = 'E-mail boş olamaz';
   } else {
      if (!EMAIL_REGEX.test(email)) {
         errors.email = 'E-mail adresi geçerli bir e-mail adresi olmalıdır. Lütfen bilgileri kontrol edin.';
      }
   }
   return {
      errors,
      isValid: Object.keys(errors).length < 1,
   };
};

export { validateLoginInputs, validateRegisterInputs };
