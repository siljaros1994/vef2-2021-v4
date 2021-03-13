import express from 'express';
import fetch from 'node-fetch';

import { getEarthquakes, setEarthquakes } from './cache.js';
import { timerStart, timerEnd } from './time.js';

const types = ['all', '1.0', '2.5', '4.5', 'significant'];
const periods = ['hour', 'day', 'week', 'month'];

export const router = express.Router();

// TODO útfæra proxy virkni

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/proxy', async (req, res) => {
  const {
      type,
      period,
  } = req.query;
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
  let result;
  let data;

  const timer = timerStart();
  const cached = await getCachedEarthquakes(cacheKey);


if (cached) {
  try {
    result = JSON.parse(cached);
  } catch (err) {
    console.log('cached data, ${cacheKey}, ${err.message}');
    return null;
  }
};

try {
  result = await getEarthquakes(`${type}_${period}`);
} catch (err) {
  console.error('error from cache', err);
}

if(result) {
    const data = {
        'data': JSON.parse(result),
        'info': {
            'cached': true, 
            'time': 0.500
        }
    }
    res.json(data);
    return;
}

try {
  result = await fetch(URL);
} catch (err) {
  console.log('Villa við að sækja gögn. ', err);
  res.status(500).send('Villa við að sækja gögn.');
  return;
}

if (!result.ok) {
  console.log('Villa frá vefþjónustu', await result.text());
  res.status(500).send('Villa við að sækja gögn.');
  return;
}

await setEarthquakes(`${type}_${period}`, result);

try {
  result = JSON.parse(resultText);
} catch (err) {
  console.log('cached, ${cacheKey}, ${err.message}');
  return null;
}

if(result) {
  const data = {
      'data': JSON.parse(result),
      'info': {
          'cached': false, 
          'time': 0.500
      }
  }
  res.json(data);
  return;
}

router.get('/', catchErrors(proxyRoute));
router.get('/', getEarthquakes);