import { orderBurgerThunk } from '@/services/orders';
import { clearOrderModal } from '@/services/rootReducer';
import { useSelector, useDispatch, type RootState } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  /** TODO: +Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const { orderRequest, orderModalData } = useSelector(
    (store: RootState) => store.orders
  );
  const { constructorItems } = useSelector(
    (store: RootState) => store.burgerConstructor
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store: RootState) => store.secure);

  const onOrderClick = (): void => {
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    // TODO: +Оформить заказ
    void dispatch(orderBurgerThunk(constructorItems));
  };

  const closeOrderModal = (): void => {
    // TODO: +Закрыть модальное окно и сбросить заказ
    if (!orderRequest) {
      dispatch(clearOrderModal());
    }
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
