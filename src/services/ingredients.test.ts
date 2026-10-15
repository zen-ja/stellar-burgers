import * as burgerApi from '@/utils/burger-api';
import { test, describe, jest } from '@jest/globals';

import store from '@services/store';

import { getIngredientsThunk, ingredientsSlice } from './ingredients';

import type { TIngredient } from '@/utils/types';

describe('тесты асинхронных экшенов для ingredients', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockIngredients: TIngredient[] = [
    {
      _id: 'ingredient-1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 200,
      price: 100,
      image: 'image.png',
      image_large: 'image-large.png',
      image_mobile: 'image-mobile.png',
    },
  ];

  test('получить список ингредиентов', async () => {
    const getIngredientsApiSpy = jest
      .spyOn(burgerApi, 'getIngredientsApi')
      .mockResolvedValue(mockIngredients);

    await store.dispatch(getIngredientsThunk());

    expect(getIngredientsApiSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().ingredients.ingredients).toEqual(mockIngredients);
    expect(store.getState().ingredients.isLoading).toBe(false);
  });

  test('проверка pending', () => {
    const state = ingredientsSlice.reducer(
      undefined,
      getIngredientsThunk.pending('requestOne', undefined)
    );
    expect(state.isLoading).toBe(true);
    expect(state.isInit).toBe(false);
    expect(state.ingredients).toEqual([]);
    expect(state.error).toBeNull();
  });

  test('проверка fulfilled', () => {
    const prevState = ingredientsSlice.reducer(
      undefined,
      getIngredientsThunk.pending('requestOne', undefined)
    );
    expect(prevState.isLoading).toBe(true);
    const state = ingredientsSlice.reducer(
      prevState,
      getIngredientsThunk.fulfilled(mockIngredients, 'requestOne', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.isInit).toBe(true);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('проверка rejected', () => {
    const errorObject = new Error('Ингредиенты не загружены');
    const prevState = ingredientsSlice.reducer(
      undefined,
      getIngredientsThunk.pending('requestOne', undefined)
    );
    expect(prevState.isLoading).toBe(true);
    const state = ingredientsSlice.reducer(
      prevState,
      getIngredientsThunk.rejected(errorObject, 'requestOne')
    );
    expect(state.isLoading).toBe(false);
    expect(state.isInit).toBe(true);
    expect(state.ingredients).toEqual([]);
    expect(state.error?.message).toEqual(errorObject.message);
  });

  test('проверка несуществующего экшена', () => {
    const absentAction = { type: 'UNKNOWN' };
    const state = ingredientsSlice.reducer(undefined, absentAction);

    expect(state).toEqual({
      isInit: false,
      isLoading: false,
      ingredients: [],
      error: null,
    });
  });
});
