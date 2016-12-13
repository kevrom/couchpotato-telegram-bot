import { Observable } from 'rxjs';
import redis from 'redis';
import bluebird from 'bluebird';
import { createLogger } from '../utils';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const log = createLogger();
const client = redis.createClient();

client.on('error', err => log(`Redis : ${err}`));

export const get = key =>
  Observable.from(client.getAsync(key));

export const set = (key, val) =>
  Observable.from(client.setAsync(key, val));
