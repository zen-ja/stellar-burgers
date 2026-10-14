import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { TIngredient, TOrder } from '../src/utils/types';

type HarEntry = {
  request: {
    url: string;
  };
  response: {
    status: number;
    content: {
      mimeType: string;
      text?: string;
      _file?: string;
    };
  };
};

type HarFile = {
  log: {
    entries: HarEntry[];
  };
};

type HarResponse<T> = {
  data: T[];
};

const getObjectFromHarFile = <T, TBody = HarResponse<T>>(
  ingredientType: string,
  harFileName: string,
  url: string,
  searcher: (body: TBody, type: string) => T | null
): T | null => {
  const harDir = 'tests/hars/';
  const harPath = path.resolve(path.join(harDir, harFileName));
  const harFile = JSON.parse(readFileSync(harPath, 'utf8')) as HarFile;
  const harEntry = harFile.log.entries.find(
    (i: HarEntry) => i.request.url.includes(url) && i.response.status === 200
  );
  if (harEntry) {
    const fileName = harEntry.response.content._file;
    if (!fileName) return null;
    const bodyPath = path.join(harDir, fileName);
    const body = JSON.parse(readFileSync(bodyPath, 'utf8')) as TBody;
    const item = searcher(body, ingredientType);
    if (item) return item;
  }
  return null;
};

///
// предполагаем, что в списке ингредиентов всегда есть как мининмум 1 булка, 1 соус и 1 начинка
///
export const prepareDataFromHar = (): {
  bunTitle: string;
  fillingTitle: string;
  sauceTitle: string;
  orderNumber: string;
} => {
  const orderSearcher = (
    body: { order: TOrder },
    _type: string
  ): { order: TOrder } | null => {
    return body.order.number > 0 ? body : null;
  };
  const orders = getObjectFromHarFile<{ order: TOrder }, { order: TOrder }>(
    '',
    'order-created.har',
    '/orders',
    orderSearcher
  );
  if (!orders) {
    throw new Error('Заказ не найден в order-created');
  }

  const typeSearcher = (
    body: HarResponse<TIngredient>,
    type: string
  ): TIngredient | null => {
    return (
      body.data.find(
        (ingredient) =>
          ingredient.type === type && orders.order.ingredients.includes(ingredient._id)
      ) ?? null
    );
  };
  const bun = getObjectFromHarFile<TIngredient>(
    'bun',
    'ingredients.har',
    '/ingredients',
    typeSearcher
  );
  if (!bun) {
    throw new Error('Булка не найдена в ingredients');
  }
  const main = getObjectFromHarFile<TIngredient>(
    'main',
    'ingredients.har',
    '/ingredients',
    typeSearcher
  );
  if (!main) {
    throw new Error('Начинка не найдена в ingredients');
  }
  const sauce = getObjectFromHarFile<TIngredient>(
    'sauce',
    'ingredients.har',
    '/ingredients',
    typeSearcher
  );
  if (!sauce) {
    throw new Error('Соус не найден в ingredients');
  }

  return {
    bunTitle: bun.name,
    fillingTitle: main.name,
    sauceTitle: sauce.name,
    orderNumber: orders.order.number.toString(),
  };
};
