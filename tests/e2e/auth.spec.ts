import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login page', async ({ page }) => {
    await expect(page.locator('.login-container')).toBeVisible()
    await expect(page.locator('.left-panel')).toBeVisible()
    await expect(page.locator('.right-panel')).toBeVisible()
  })

  test('should display login form with all required fields', async ({ page }) => {
    await expect(page.getByPlaceholder(/username/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByPlaceholder(/captcha/i)).toBeVisible()
  })

  test('should show logo and title', async ({ page }) => {
    await expect(page.locator('.logo-text')).toContainText('AIDP')
    await expect(page.locator('.right-title')).toContainText('[GIN] Hello World!')
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder(/username/i).fill('admin')
    await page.getByPlaceholder(/password/i).fill('admin123')
    const captcha = await page.locator('.captcha-image').textContent()
    await page.getByPlaceholder(/captcha/i).fill(captcha || '12345')

    await page.getByRole('button', { name: /login/i }).click()

    await expect(page).toHaveURL('/chat', { timeout: 5000 })
    await expect(page.locator('.chat-layout')).toBeVisible()
  })

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.getByPlaceholder(/username/i).fill('invalid')
    await page.getByPlaceholder(/password/i).fill('wrong')
    await page.getByPlaceholder(/captcha/i).fill('12345')
    
    await page.getByRole('button', { name: /login/i }).click()
    
    await expect(page.locator('.el-message--error')).toBeVisible({ timeout: 2000 })
  })

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click()
    
    await expect(page.getByText(/username/i)).toBeVisible()
    await expect(page.getByText(/password/i)).toBeVisible()
  })
})