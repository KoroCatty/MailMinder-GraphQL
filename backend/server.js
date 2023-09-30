import colors from 'colors';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Schema and Resolvers
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';

import crypto from 'crypto';
// console.log(crypto.randomUUID());// 30eee7b2-7d88-4388-9424-28257803b92d

import jwt from 'jsonwebtoken';

// Define the startServer function
async function startServer() {

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    // introspection: true,
    //! ver 4 からは context がここで定義できない 
  })

  const { url } = await startStandaloneServer(server, {
    // req は この standaloneServer からのもの
    context: async ({ req }) => {

      // destructure from req
      const { authorization } = req.headers;

      // トークンがあれば、トークンを検証し、userId を返す
      if (authorization) {
        try {
          const { userId } = await jwt.verify(authorization, process.env.JWT_SECRET);
          return { userId };
        } catch (error) {
          console.error("トークン Verification Error", error); // JWTの検証中のエラーをログに出力
          return {}; 
        }
      }
    },
    listen: { port: 5001 },
  });
  console.log(`🚀 Server ready at ${url}`);

}
startServer();


