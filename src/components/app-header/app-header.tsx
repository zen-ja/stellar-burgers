import { selectUser } from '@/services/selectors';
import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: +Получите имя пользователя из хранилища */
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
