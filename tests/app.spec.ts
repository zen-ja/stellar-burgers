import { expect, test } from '@playwright/test';

test('открывает страницу конструктора и добавляет ингредиент в конструктор', async ({
  page,
}) => {
  await page.goto('/');
  const burgerConstructor = page.getByTestId('constructor');
  //конструктор не содержит ингредиентов
  await expect(burgerConstructor).toContainText(/Выберите булки/);
  await expect(burgerConstructor).toContainText(/Выберите начинку/);
  //выбрать булку
  const bunTitle = 'Флюоресцентная булка R2-D3';
  const bun = page
    .getByTestId('bun-ingredients')
    .locator('li')
    .filter({ hasText: bunTitle });
  await bun.getByRole('button', { name: /Добавить/ }).click();
  await expect(page.getByTestId('constructor-bun-1')).toContainText(
    bunTitle + ' (верх)'
  );
  await expect(page.getByTestId('constructor-bun-2')).toContainText(bunTitle + ' (низ)');
  //выбрать начинку
  const souceTitle = 'Соус Spicy-X';
  const souce = page
    .getByTestId('sauces-ingredients')
    .locator('li')
    .filter({ hasText: souceTitle });
  await souce.getByRole('button', { name: /Добавить/ }).click();
  await expect(page.getByTestId('constructor-ingredients')).toContainText(souceTitle);
  const mainTitle = 'Филе Люминесцентной тетры';
  const main = page
    .getByTestId('mains-ingredients')
    .locator('li')
    .filter({ hasText: mainTitle });
  await main.getByRole('button', { name: /Добавить/ }).click();
  await expect(page.getByTestId('constructor-ingredients')).toContainText(mainTitle);
});

