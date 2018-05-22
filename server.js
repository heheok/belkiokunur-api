import Hapi from 'hapi';
import mongoose from 'mongoose';
import { redisGetAsync } from './src/services/redis';
import { JWT_SECRET } from './src/config/config';
const MongoDBUrl = 'mongodb://localhost:27017/saltokunur';
const TEMPORARY_SECRET = 'temporarysecret';

const redisOptions = {
  connection: {
    host: 'localhost',
    opts: {
      parser: 'javascript'
    }
  }
};

import {
  listAuthor,
  getAuthor,
  createAuthor,
  updateAuthor,
  removeAuthor
} from './src/controllers/author';
import { login } from './src/controllers/authentication';

const server = new Hapi.Server({
  host: 'localhost',
  port: '8081'
});

const validate = async function(decodedToken, request) {
  const { id, username } = decodedToken;
  const previouslyRecordedJWT = await redisGetAsync(`JWT_${id}`);
  if (previouslyRecordedJWT === request.auth.token) {
    return { isValid: true };
  }
  return { isValid: false };
};

(async () => {
  try {
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
      key: JWT_SECRET,
      validate: validate,
      verifyOptions: { algorithms: ['HS256'] }
    });
    server.auth.default('jwt');
    server.route({
      method: 'POST',
      path: '/login',
      config: { auth: false },
      handler: login
    });

    server.route({
      method: 'GET',
      path: '/authors',
      config: { auth: 'jwt' },
      handler: listAuthor
    });

    server.route({
      method: 'GET',
      path: '/authors/{id}',
      handler: getAuthor
    });
    server.route({
      method: 'POST',
      path: '/authors',
      handler: createAuthor
    });

    server.route({
      method: 'PUT',
      path: '/authors/{id}',
      handler: updateAuthor
    });

    server.route({
      method: 'DELETE',
      path: '/authors/{id}',
      handler: removeAuthor
    });

    await server.start();
    // Once started, connect to Mongo through Mongoose
    mongoose.connect(MongoDBUrl, {}).then(
      () => {
        console.log(`Connected to Mongo server`);
      },
      err => {
        console.log(err);
      }
    );
    console.log(`Server running at: ${server.info.uri}`);
  } catch (err) {
    console.log(err);
  }
})();
