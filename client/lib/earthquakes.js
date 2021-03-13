export async function fetchEarthquakes(type, period) {
  // TODO sækja gögn frá proxy þjónustu
  let result;

  try {
    result = await fetch(`/proxy?type=${type}&period=${period}`);
  } catch (err) {
    console.error('Villa við að sækja', err);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();

  return data;
}
