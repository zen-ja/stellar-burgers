import { removeIngredient, upIngredient, downIngredient } from '@/services/rootReducer';
import { useDispatch } from '@/services/store';
import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();
  const handleMoveDown = (): void => {
    // TODO: +
    dispatch(downIngredient(ingredient));
  };

  const handleMoveUp = (): void => {
    // TODO: +
    dispatch(upIngredient(ingredient));
  };

  const handleClose = (): void => {
    // TODO: +
    dispatch(removeIngredient(ingredient));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
