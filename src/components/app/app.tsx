import { getIngredientsThunk } from '@/services/rootReducer';
import { useSelector, type RootState, useDispatch } from '@/services/store';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
// import type { TIngredient } from '@utils-types';
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const {
    isInit,
    isLoading: isIngredientsLoading,
    ingredients,
    error: ingredientsError,
  } = useSelector((store: RootState) => store.ingredients);

  useEffect(() => {
    if (!isInit) {
      void dispatch(getIngredientsThunk());
    }
  }, [dispatch, isInit]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const closeModal = (): void => {
    void navigate(-1);
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<ProfileOrders />} />
        <Route path="/feed/:number" element={<Feed />} />
        <Route path="/ingredients/:id" element={<ConstructorPage />} />
        <Route path="/profile/orders/:number" element={<ProfileOrders />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      <Routes>
        <Route
          path="/feed/:number"
          element={
            <Modal title="oo" onClose={closeModal}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <Modal title="Детали ингредиента" onClose={closeModal}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <Modal title="oo" onClose={closeModal}>
              <OrderInfo />
            </Modal>
          }
        />
      </Routes>
    </>
  );
};
