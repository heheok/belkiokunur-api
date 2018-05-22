import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
client.on('error', function(err) {
  console.log('Error ' + err);
});
client.on('connect', function() {
  console.log('Redis Connected');
});

export const redisGetAsync = promisify(client.get).bind(client);
export const redisSetAsync = promisify(client.set).bind(client);
