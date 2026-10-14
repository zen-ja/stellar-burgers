import { expect, test } from '@playwright/test';

import { prepareDataFromHar } from './test-utils';

const { bunTitle, fillingTitle, sauceTitle, orderNumber } = prepareDataFromHar();

test.describe('Конструктор бургера с HAR', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false,
    });
    await page.routeFromHAR('./tests/hars/user-unauthorized.har', {
      url: '**/auth/user',
      update: false,
    });
    await page.goto('/');
    await expect(page.getByTestId('ingredients-content')).toBeVisible();
  });

  // test('должен записать HAR-файл для списка ингредиентов', async ({ page }) => {
  //   // Начинаем запись HAR
  //   await page.routeFromHAR('./e2e/hars/ingredients.har', {
  //     url: '**/ingredients',
  //     update: true, // Режим записи
  //   });

  //   await page.goto('/');

  //   // Ждём загрузки данных
  //   await expect(page.getByTestId('ingredients-content')).toBeVisible();

  //   // HAR-файл будет сохранён автоматически
  // });

  test('добавляет ингредиент в конструктор', async ({ page }) => {
    const bun = page
      .getByTestId('bun-ingredients')
      .locator('li')
      .filter({ hasText: bunTitle });
    const filling = page
      .getByTestId('mains-ingredients')
      .locator('li')
      .filter({ hasText: fillingTitle });
    const sauce = page
      .getByTestId('sauces-ingredients')
      .locator('li')
      .filter({ hasText: sauceTitle });

    await bun.getByRole('button', { name: 'Добавить' }).click();
    await filling.getByRole('button', { name: 'Добавить' }).click();
    await sauce.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-1')).toContainText(
      `${bunTitle} (верх)`
    );
    await expect(page.getByTestId('constructor-bun-2')).toContainText(
      `${bunTitle} (низ)`
    );
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      fillingTitle
    );
    await expect(page.getByTestId('constructor-ingredients')).toContainText(sauceTitle);
    await expect(page.getByTestId('constructor')).not.toContainText('Выберите булки');
  });

  test('открывает модальное окно ингредиента и закрывает по клику на крестик', async ({
    page,
  }) => {
    const bun = page
      .getByTestId('bun-ingredients')
      .locator('li')
      .filter({ hasText: bunTitle });
    await bun.getByRole('link').click();

    const modal = page.locator('#modals');
    await expect(page.getByTestId('modal-overlay')).toBeVisible();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByRole('heading', { name: bunTitle })).toBeVisible();
    await modal.getByRole('button').click();
    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  });

  test('открывает модальное окно ингредиента и закрывает по клику на оверлей', async ({
    page,
  }) => {
    const bun = page
      .getByTestId('bun-ingredients')
      .locator('li')
      .filter({ hasText: bunTitle });
    await bun.getByRole('link').click();

    const modal = page.locator('#modals');
    await expect(page.getByTestId('modal-overlay')).toBeVisible();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByRole('heading', { name: bunTitle })).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 20, y: 20 } });
    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  });

  test('создаёт заказ, показывает его номер и очищает конструктор', async ({
    context,
    page,
  }) => {
    await page.routeFromHAR('./tests/hars/user-authorized.har', {
      url: '**/auth/user',
      update: false,
    });
    await page.routeFromHAR('./tests/hars/order-created.har', {
      url: '**/orders',
      update: false,
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        url: 'http://localhost:4000',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.reload();
    await expect(page.getByTestId('ingredients-content')).toBeVisible();

    const bun = page
      .getByTestId('bun-ingredients')
      .locator('li')
      .filter({ hasText: bunTitle });
    const filling = page
      .getByTestId('mains-ingredients')
      .locator('li')
      .filter({ hasText: fillingTitle });
    const sauce = page
      .getByTestId('sauces-ingredients')
      .locator('li')
      .filter({ hasText: sauceTitle });

    await bun.getByRole('button', { name: 'Добавить' }).click();
    await filling.getByRole('button', { name: 'Добавить' }).click();
    await sauce.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    await expect(page.getByTestId('modal-overlay')).toBeVisible();
    await expect(modal.getByTestId('order-number')).toHaveText(orderNumber);

    await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );
    await expect(page.getByTestId('constructor')).toContainText('Выберите булки');

    await modal.getByRole('button').click();
    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  });
});
