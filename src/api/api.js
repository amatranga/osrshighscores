const getHighScoreByMode = async(mode, name) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({ mode, name }),
    headers: { 'Content-Type': 'application/json' },
  };

  const response = await fetch('/api/scores', options);
  const data = response.json();
  return data;
};

export { getHighScoreByMode };
