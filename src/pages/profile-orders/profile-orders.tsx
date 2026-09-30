import { getOrdersApiThunk } from '@/services/rootReducer';
import { useDispatch, useSelector, type RootState } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

// import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  /** TODO: +взять переменную из стора */
  const { orders } = useSelector((state: RootState) => state.orders);
  const dispatch = useDispatch();
  useEffect(() => {
    void dispatch(getOrdersApiThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
