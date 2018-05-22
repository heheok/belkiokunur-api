import Hapi from 'hapi';
import mongoose from 'mongoose';
import { redisGetAsync } from './src/services/redis';
import { JWT_SECRET, MONGODB_URL } from './src/config/config';
import Routes from './src/config/routing';

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

    /* ROUTING */
    const { publicRoutes, privateRoutes } = Routes;

    Object.keys(publicRoutes).map(route => {
      server.route({
        ...publicRoutes[route],
        config: { auth: false }
      });
    });

    Object.keys(privateRoutes).map(route => {
      server.route({
        ...privateRoutes[route],
        config: { auth: 'jwt' }
      });
    });

    await server.start();

    mongoose.connect(MONGODB_URL, {}).then(
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
