export const calculatePostReadTime = (post) => {
   const wordCount = post.split(' ').length;
   const readTime = Math.ceil(wordCount / 200);
   return readTime;
};
