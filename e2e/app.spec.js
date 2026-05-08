const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('page title contains My Jenkins App', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/My Jenkins App/i);
  });

  test('home page renders hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /My Jenkins App/i }).first()).toBeVisible();
  });

  test('navbar shows all links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /To-Do/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Notes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Counter/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /About/i })).toBeVisible();
  });

  test('navigates to Todo page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /To-Do/i }).click();
    await expect(page.getByRole('heading', { name: /To-Do List/i })).toBeVisible();
  });

  test('navigates to Notes page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Notes/i }).click();
    await expect(page.getByRole('heading', { name: /Notes/i })).toBeVisible();
  });

  test('navigates to Counter page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Counter/i }).click();
    await expect(page.getByRole('heading', { name: /Counter/i })).toBeVisible();
  });

  test('navigates to About page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /About/i }).click();
    await expect(page.getByRole('heading', { name: /About/i })).toBeVisible();
  });
});

test.describe('Todo List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos');
  });

  test('shows default todos', async ({ page }) => {
    await expect(page.getByText(/Set up Jenkins pipeline/i)).toBeVisible();
  });

  test('adds a new todo', async ({ page }) => {
    await page.getByLabel(/New task input/i).fill('My E2E Task');
    await page.getByLabel(/Add task/i).click();
    await expect(page.getByText(/My E2E Task/i)).toBeVisible();
  });

  test('deletes a todo', async ({ page }) => {
    await page.hover('.todo-item:first-child');
    await page.getByLabel(/Delete task/i).first().click();
    await expect(page.getByText(/Set up Jenkins pipeline/i)).not.toBeVisible();
  });

  test('filters active todos', async ({ page }) => {
    await page.getByRole('button', { name: /Active/i }).click();
    await expect(page.getByText(/Deploy to staging/i)).toBeVisible();
  });
});

test.describe('Counter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/counter');
  });

  test('shows 0 initially', async ({ page }) => {
    await expect(page.getByLabel(/Counter value: 0/i)).toBeVisible();
  });

  test('increments counter', async ({ page }) => {
    await page.getByLabel(/Increment by 1/i).click();
    await expect(page.getByLabel(/Counter value: 1/i)).toBeVisible();
  });

  test('decrements counter', async ({ page }) => {
    await page.getByLabel(/Decrement by 1/i).click();
    await expect(page.getByLabel(/Counter value: -1/i)).toBeVisible();
  });

  test('resets counter', async ({ page }) => {
    await page.getByLabel(/Increment by 1/i).click();
    await page.getByLabel(/Reset counter/i).click();
    await expect(page.getByLabel(/Counter value: 0/i)).toBeVisible();
  });
});

test.describe('Notes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notes');
  });

  test('shows default notes', async ({ page }) => {
    await expect(page.getByText(/Jenkins Pipeline Tips/i)).toBeVisible();
  });

  test('creates a new note', async ({ page }) => {
    await page.getByText(/\+ New Note/i).click();
    await page.getByLabel(/Note title/i).fill('E2E Test Note');
    await page.getByLabel(/Note body/i).fill('Created from Playwright');
    await page.getByText(/Save Note/i).click();
    await expect(page.getByText(/E2E Test Note/i)).toBeVisible();
  });

  test('searches notes', async ({ page }) => {
    await page.getByLabel(/Search notes/i).fill('Docker');
    await expect(page.getByText(/Docker Best Practices/i)).toBeVisible();
    await expect(page.getByText(/Jenkins Pipeline Tips/i)).not.toBeVisible();
  });
});

test.describe('About', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('shows build information section', async ({ page }) => {
    await expect(page.getByText(/Build Information/i)).toBeVisible();
  });

  test('shows tech stack', async ({ page }) => {
    await expect(page.getByText(/Tech Stack/i)).toBeVisible();
    await expect(page.getByText(/React/i).first()).toBeVisible();
  });

  test('shows pipeline stages', async ({ page }) => {
    await expect(page.getByText(/CI\/CD Pipeline/i)).toBeVisible();
    await expect(page.getByText(/Install & Build/i)).toBeVisible();
  });
});

test.describe('Version', () => {
  test('displays app version in footer', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('.app-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/v/i);
  });
});
