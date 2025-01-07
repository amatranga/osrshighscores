import { useState, useEffect } from "react";

const useFavorites = (setPlayers) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("osrs_highscores_favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("osrs_highscores_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (player) => {
    if (!favorites.some((fav) => fav.username === player.username)) {
      setFavorites([...favorites, player]);
    }
  };

  const removeFavorite = (username) => {
    setFavorites(favorites.filter((fav) => fav.username !== username));
  };

  const isFavorite = (username) => {
    return favorites.some((fav) => fav.username === username);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};

export { useFavorites };
