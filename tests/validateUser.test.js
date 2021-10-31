import faker from 'faker';
import { validateLoginInputs } from '../src/utils/validateUser';

describe('validate user login inputs', () => {
   test('should isValid to be truty', () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const { isValid } = validateLoginInputs(email, password);
      expect(isValid).toBeTruthy();
   });

   test('should be return error ', () => {
      const invalidEmail = faker.datatype.string(10);
      const password = faker.internet.password();
      const { isValid } = validateLoginInputs(invalidEmail, password);
      expect(isValid).toBeFalsy();
   });
});
