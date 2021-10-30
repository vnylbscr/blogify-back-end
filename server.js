import app from './src/app.js';

const PORT = process.env.PORT || 4000;

async function server() {
   const httpServer = await app();

   httpServer.listen(PORT, () => {
      console.log(`🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`);
   });
}

server();
