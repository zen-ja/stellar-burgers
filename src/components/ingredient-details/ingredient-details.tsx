import { useSelector, type RootState } from '@/services/store';
import { Preloader, IngredientDetailsUI } from '@ui';
// import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const { ingredients } = useSelector((store: RootState) => store.ingredients);
  const { id } = useParams();
  console.log(id);
  const ingredientData = ingredients.find(i => i._id === id) ?? null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
