const HIGH_SCORES_URL = '/api/scores';

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