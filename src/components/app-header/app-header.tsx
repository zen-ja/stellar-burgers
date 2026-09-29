import { useSelector, type RootState } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: +Получите имя пользователя из хранилища */
  const { user } = useSelector((store: RootState) => store.secure);

  return <AppHeaderUI userName={user?.name} />;
};
