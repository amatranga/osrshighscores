const getHighScoreByMode = async(mode, name) => {
  console.log('getting high scores by mode...');
  const options = {
    method: 'POST',
    body: JSON.stringify({ mode, name }),
    headers: { 'Content-Type': 'application/json' },
  };

  const response = await fetch('/api/scores', options);
  const data = response.json();
  console.log(data);
  return data;
};

export { getHighScoreByMode };
