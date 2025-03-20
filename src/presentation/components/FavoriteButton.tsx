import React from 'react';
import { Button } from 'react-native';

type Props = {
  isFavorite: boolean;
  onPress: () => void;
};

const FavoriteButton = ({ isFavorite, onPress }: Props) => {
  return <Button title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"} onPress={onPress} />;
};

export default FavoriteButton;
