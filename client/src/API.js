const HIGH_SCORES_URL = '/api/scores';
const EHB_URL = '/api/ehb';

export async function getHighScoreByMode(mode, name) {
  let options = {
    method: 'POST',
    body: JSON.stringify({ mode, name }),
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await fetch(HIGH_SCORES_URL, options);
  const data = response.json();
  return data;
}

export async function getEhb() {
  let options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await fetch(EHB_URL, options);
  const data = response.json();
  return data;
}