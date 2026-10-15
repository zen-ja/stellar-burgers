import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@/utils/types';

export type ConstructorState = {
  constructorItems: TConstructorState;
};

export const initialConstructorState: ConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialConstructorState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;

        if (item.type === 'bun') {
          state.constructorItems.bun = item;
        } else {
          state.constructorItems.ingredients = [
            ...state.constructorItems.ingredients,
            item,
          ];
        }
      },
      prepare: (item: TIngredient) => {
        return {
          payload: {
            id: crypto.randomUUID().toString(),
            ...item,
          },
        };
      },
    },
    removeIngredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      if (payload.type === 'bun') {
        state.constructorItems.bun = null;
      } else {
        state.constructorItems.ingredients = state.constructorItems.ingredients.filter(
          (i) => i.id !== payload.id
        );
      }
    },
    upIngredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (i) => i.id === payload.id
      );
      if (index !== 0) {
        state.constructorItems.ingredients = [
          ...state.constructorItems.ingredients.slice(0, index - 1),
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index - 1],
          ...state.constructorItems.ingredients.slice(index + 1),
        ];
      }
    },
    downIngredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (i) => i.id === payload.id
      );
      if (index !== state.constructorItems.ingredients.length - 1) {
        state.constructorItems.ingredients = [
          ...state.constructorItems.ingredients.slice(0, index),
          state.constructorItems.ingredients[index + 1],
          state.constructorItems.ingredients[index],
          ...state.constructorItems.ingredients.slice(index + 2),
        ];
      }
    },
    resetConstructor: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
    },
  },
});
