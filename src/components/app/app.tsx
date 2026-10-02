import { getIngredientsThunk, getUserApiThunk } from '@/services/rootReducer';
import { useSelector, type RootState, useDispatch } from '@/services/store';
import { AppHeader } from '@components';
import { useEffect } from 'react';

import { AppContent } from '../app-content';

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
    void dispatch(getUserApiThunk());
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
