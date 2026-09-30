import { getOrderByNumberApiThunk } from '@/services/rootReducer';
import { useDispatch, useSelector, type RootState } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const location = useLocation();
  const isFeeds = location.pathname.includes('/feed');
  const orders = useSelector((store: RootState) =>
    isFeeds ? store.feeds.orders : store.orders.orders
  );
  const orderModalData = useSelector((store: RootState) => store.orders.orderModalData);
  const { ingredients } = useSelector((store: RootState) => store.ingredients);
  const { number } = useParams();
  const orderData = orders.find((i) => i.number === Number(number)) ?? orderModalData;

  useEffect(() => {
    if (!orderData && number) {
      void dispatch(getOrderByNumberApiThunk(Number(number)));
    }
  }, [dispatch, number, orderData]);

  /**
   * использование useMemo не обязательно
   */
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
