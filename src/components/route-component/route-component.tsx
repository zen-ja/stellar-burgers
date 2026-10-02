import { IngredientDetails, Modal, OrderInfo, ProtectedRoute } from '@components';
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
import {
  Route,
  Routes,
  type Location,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { ModalWithNumber } from '../modal-with-number';

import styles from './route-component.module.css';

type TLocationState = {
  background?: Location;
};

export const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = (location.state as TLocationState | null)?.background;
  const closeModal = (): void => {
    void navigate(-1);
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth={true}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth={true}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth={true}>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth={true}>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/ingredients/:id"
          element={
            <div className={`${styles.detailHeader} ${styles.message}`}>
              <h1 className="text_type_main-large">Детали ингредиента</h1>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div className={`${styles.detailHeader} ${styles.message}`}>
              <NotFound404 />
            </div>
          }
        />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <ModalWithNumber onClose={closeModal}>
                <OrderInfo />
              </ModalWithNumber>
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
              <ProtectedRoute>
                <ModalWithNumber onClose={closeModal}>
                  <OrderInfo />
                </ModalWithNumber>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
