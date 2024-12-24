const getHiScoreByMode = async (mode, name) => {
  try {
    const options = {
      method: 'POST',
      body: JSON.stringify({ mode, name }),
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch('/api/scores', options);
    const data = await response.json();

    if (data.status === 200) {
      // Successful response
      return data;
    } else {
      // Handle error messages from the API
      throw new Error(data.data);
    }
  } catch (error) {
    console.error('Error fetching high scores:', error.message);
    throw error; 
  }
};

export { getHiScoreByMode };
