import Auth from '../src/middleware/auth.js';

describe('token verified test', () => {
   test('should be token is not valid', () => {
      const req = {
         headers: {
            authorization: '',
         },
      };
      const { isAuth, user } = Auth(req);
      expect(isAuth).toBeFalsy();
      expect(user).toBeUndefined();
   });

   test('should be token is valid', () => {
      const req = {
         headers: {
            authorization:
               // eslint-disable-next-line
               'Baerer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjBhZDg3ZDIwNTFiMGQ1NWFhOTFkYiIsImVtYWlsIjoibWVydEBtZXJ0by5jb20iLCJ1c2VybmFtZSI6Im1lcnRvIiwiaWF0IjoxNjM1NjM0OTEyLCJleHAiOjE2MzU5ODA1MTJ9.eZOdDY1Yewso9_MSZVsPC795T5sduXD9gr4i7Ijs_EM',
         },
      };
      const { isAuth, user } = Auth(req);
      expect(isAuth).toBeTruthy();
      expect(user.email).toBe('mert@merto.com');
   });
});
