import { test, describe } from '@jest/globals';

import { constructorSlice, initialConstructorState } from './burger-constructor';
import {
  addIngredient,
  downIngredient,
  removeIngredient,
  resetConstructor,
  upIngredient,
} from './rootReducer';

import type { TIngredient } from '@/utils/types';

describe('тесты синхронных экшенов для burgerConstructor', () => {
  // afterEach(() => {
  //   jest.restoreAllMocks();
  // });

  const mockIngredients: TIngredient[] = [
    {
      _id: 'ingredient-1',
      name: 'Булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-1.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-1-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-1-mobile.png',
    },
    {
      _id: 'ingredient-2',
      name: 'Котлета',
      type: 'main',
      proteins: 42,
      fat: 18,
      carbohydrates: 15,
      calories: 420,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    },
    {
      _id: 'ingredient-3',
      name: 'Соус',
      type: 'sauce',
      proteins: 2,
      fat: 20,
      carbohydrates: 30,
      calories: 22,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-1.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-1-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-1-mobile.png',
    },
  ];

  test('неизвестный экшен', () => {
    const absentAction = { type: 'UNKNOWN' };
    const state = constructorSlice.reducer(undefined, absentAction);

    expect(state).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [],
      },
    });
  });

  test('добавить булку в конструктор', () => {
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: null,
        ingredients: [],
      },
    };

    const addAction = addIngredient(mockIngredients[0]);
    const newState = constructorSlice.reducer(initState, addAction);
    const bun = newState.constructorItems.bun;

    expect(newState).toEqual({
      constructorItems: {
        bun: {
          ...mockIngredients[0],
          id: addAction.payload.id,
        },
        ingredients: [],
      },
    });
    expect(typeof bun?.id).toBe('string');
    expect(bun?.id).toBeTruthy();
  });

  test('добавить две одинаковых котлеты в конструктор', () => {
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: null,
        ingredients: [],
      },
    };

    const addFirstAction = addIngredient(mockIngredients[1]);
    const addSecondAction = addIngredient(mockIngredients[1]);
    const newStateFirst = constructorSlice.reducer(initState, addFirstAction);
    const newStateSecond = constructorSlice.reducer(newStateFirst, addSecondAction);
    const [fist, second] = newStateSecond.constructorItems.ingredients;

    expect(fist.id).not.toBe(second.id);
  });

  test('добавить котлету в конструктор', () => {
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: null,
        ingredients: [],
      },
    };

    const addAction = addIngredient(mockIngredients[1]);
    const newState = constructorSlice.reducer(initState, addAction);

    expect(newState).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [
          {
            ...mockIngredients[1],
            id: addAction.payload.id,
          },
        ],
      },
    });
  });

  test('удалить котлету из конструктора', () => {
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: null,
        ingredients: [],
      },
    };

    const addActionFirst = addIngredient(mockIngredients[1]);
    const stateAfterAddFirst = constructorSlice.reducer(initState, addActionFirst);
    const addedFirstElement = addActionFirst.payload;
    expect(stateAfterAddFirst).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [addedFirstElement],
      },
    });
    const addActionSecond = addIngredient(mockIngredients[1]);
    const stateAfterAddSecond = constructorSlice.reducer(
      stateAfterAddFirst,
      addActionSecond
    );
    const addedSecondElement = addActionSecond.payload;
    expect(stateAfterAddSecond).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [addedFirstElement, addedSecondElement],
      },
    });

    const removeAction = removeIngredient(addedFirstElement);
    const stateAfterRemove = constructorSlice.reducer(stateAfterAddSecond, removeAction);

    expect(stateAfterRemove).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [addedSecondElement],
      },
    });
  });

  test('удалить булку из конструктора', () => {
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: null,
        ingredients: [],
      },
    };

    const addAction = addIngredient(mockIngredients[0]);
    const stateAfterAdd = constructorSlice.reducer(initState, addAction);
    const addedElement = addAction.payload;

    expect(stateAfterAdd).toEqual({
      constructorItems: {
        bun: addedElement,
        ingredients: [],
      },
    });

    const removeAction = removeIngredient(addedElement);
    const stateAfterRemove = constructorSlice.reducer(stateAfterAdd, removeAction);

    expect(stateAfterRemove).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [],
      },
    });
  });

  test('переместить второй ингредиент вверх', () => {
    const first = { ...mockIngredients[1], id: '111' };
    const second = { ...mockIngredients[2], id: '222' };
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: null,
        ingredients: [first, second],
      },
    };

    const upAction = upIngredient(second);
    const stateAfterUp = constructorSlice.reducer(initState, upAction);

    expect(stateAfterUp).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [second, first],
      },
    });
  });

  test('переместить первый ингредиент вверх', () => {
    const bun = { ...mockIngredients[0], id: '000' };
    const first = { ...mockIngredients[1], id: '111' };
    const second = { ...mockIngredients[2], id: '222' };
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: bun,
        ingredients: [first, second],
      },
    };

    const upAction = upIngredient(first);
    const stateAfterUp = constructorSlice.reducer(initState, upAction);

    expect(stateAfterUp).toEqual({
      constructorItems: {
        bun: bun,
        ingredients: [first, second],
      },
    });
  });

  test('переместить второй ингредиент вниз', () => {
    const first = { ...mockIngredients[1], id: '111' };
    const second = { ...mockIngredients[2], id: '222' };
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: null,
        ingredients: [first, second],
      },
    };

    const upAction = downIngredient(second);
    const stateAfterUp = constructorSlice.reducer(initState, upAction);

    expect(stateAfterUp).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [first, second],
      },
    });
  });

  test('переместить первый ингредиент вниз', () => {
    const bun = { ...mockIngredients[0], id: '000' };
    const first = { ...mockIngredients[1], id: '111' };
    const second = { ...mockIngredients[2], id: '222' };
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: bun,
        ingredients: [first, second],
      },
    };

    const downAction = downIngredient(first);
    const stateAfterUp = constructorSlice.reducer(initState, downAction);

    expect(stateAfterUp).toEqual({
      constructorItems: {
        bun: bun,
        ingredients: [second, first],
      },
    });
  });

  test('удалить все ингредиенты', () => {
    const bun = { ...mockIngredients[0], id: '000' };
    const first = { ...mockIngredients[1], id: '111' };
    const second = { ...mockIngredients[2], id: '222' };
    const initState = {
      ...initialConstructorState,
      constructorItems: {
        bun: bun,
        ingredients: [first, second],
      },
    };

    const resetAction = resetConstructor();
    const stateAfterReset = constructorSlice.reducer(initState, resetAction);

    expect(stateAfterReset).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [],
      },
    });
  });
});
