import { useSelector, type RootState } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';

// import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  /** TODO: взять переменную из стора */
  //const orders: TOrder[] = [];
  const { orders } = useSelector((state: RootState) => state.orders);

  return <ProfileOrdersUI orders={orders} />;
};
