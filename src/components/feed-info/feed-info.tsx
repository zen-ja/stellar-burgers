import { useSelector, type RootState } from '@/services/store';
import { FeedInfoUI } from '@ui';

import type { TFeedState, TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const {
    orders: feeds,
    total,
    totalToday,
    isLoading,
    error,
  } = useSelector((store: RootState) => store.feeds);
  const feed: TFeedState = {
    orders: feeds,
    total: total,
    totalToday: totalToday,
    isLoading: isLoading,
    error: error,
  };
  const orders: TOrder[] = feeds;

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
