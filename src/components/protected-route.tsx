import { useSelector, type RootState } from '@/services/store';
import { Preloader } from '@ui';
// import { isAuthCheckedSelector, userDataSelector } from '../services/store/selectors';
import { useLocation } from 'react-router';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const { isLoading } = useSelector((store: RootState) => store.secure);
  //const isAuthChecked = useSelector(isAuthCheckedSelector); //  isAuthCheckedSelector — селектор получения состояния загрузки пользователя
  const { user } = useSelector((store: RootState) => store.secure); //  userDataSelector — селектор получения пользователя из store
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    //  если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
    return <Navigate replace to="/login" state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
  }

  if (onlyUnAuth && user) {
    //  если маршрут для неавторизованного пользователя, но пользователь авторизован
    // при обратном редиректе  получаем данные о месте назначения редиректа из объекта location.state
    // в случае если объекта location.state?.from нет — а такое может быть , если мы зашли на страницу логина по прямому URL
    // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
    const from = (location.state as { from?: { pathname: string } } | null)?.from ?? {
      pathname: '/',
    };

    return <Navigate replace to={from} />;
  }

  return children;
};
