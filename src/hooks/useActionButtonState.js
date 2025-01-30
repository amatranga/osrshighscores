import React, { useState } from 'react';

const useActionButtonState = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  return {
    showFavorites,
    setShowFavorites,
    showCharts,
    setShowCharts,
  }
};

export { useActionButtonState };
