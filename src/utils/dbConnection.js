import mongoose from 'mongoose';

mongoose.set('useCreateIndex', true);

export const closeConn = () => mongoose.disconnect();

export default (dbUrl) =>
   mongoose.connect(dbUrl, {
      useNewUrlParser: true,
   });
