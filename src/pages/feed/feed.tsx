import { getFeedsApiThunk } from '@/services/feeds';
import { useDispatch, useSelector, type RootState } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

// import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  // TODO: +Взять переменную из стора
  const { orders, isLoading } = useSelector((store: RootState) => store.feeds);
  const dispatch = useDispatch();

  const handleGetFeeds = (): void => {
    // TODO: +Запросить ленту заказов
    void dispatch(getFeedsApiThunk());
  };

  useEffect(() => {
    void dispatch(getFeedsApiThunk());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
