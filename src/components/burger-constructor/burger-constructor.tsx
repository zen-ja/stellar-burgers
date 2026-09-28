import { useSelector, type RootState } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  /** TODO: +Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const { constructorItems, orderRequest, orderModalData } = useSelector(
    (store: RootState) => store.burgerConstructor
  );
  // const constructorItems: TConstructorState = {
  //   bun: null,
  //   ingredients: [],
  // };
  // const orderRequest = false;
  // const orderModalData: TOrder | null = null;

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ
  };

  const closeOrderModal = (): void => {
    // TODO: Закрыть модальное окно и сбросить заказ
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
