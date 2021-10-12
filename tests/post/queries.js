export const GET_ALL_POSTS = `
query GetAllPosts {
      getAllPosts {
         _id
         title
         content
         image
         subtitle
         comments {
            _id
            content
            likedCount
            createdAt
         }
         user {
            ...CoreUserFields
         }
         category
         createdAt
         slug
      }
   }
`;

export const GET_SINGLE_POST = `
query getSinglePostQuery($_id: ID!) {
      getPost(_id: $_id) {
         _id
         title
         subtitle
         content
         image
         comments {
            _id
            content
            likedCount
            createdAt
         }
         category
         createdAt
         user {
            _id
            username
         }
         slug
         likedCount
         commentCount
         likedUsers {
            _id
            username
            email
            aboutMe
            job
            location {
               country
               city
            }
         }
      }
   }
`;
