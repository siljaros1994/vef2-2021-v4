import redis from 'redis';
import { promisify } from 'util';

// TODO útfæra redis cache
const redisOptions = {
  url: 'redis://127.0.0.1:6379/0',
};

const client = redis.createClient(redisOptions);

const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.mset).bind(client);

export async function getEarthquakes(key) {
  // eslint-disable-next-line prefer-const
  let earthquakes = await asyncGet(key);
  return earthquakes;
}

export async function setEarthquakes(key, earthquakes) {
  await asyncSet(key, earthquakes);
}
