import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder(/username/i).fill('admin')
    await page.getByPlaceholder(/password/i).fill('admin123')
    const captcha = await page.locator('.captcha-image').textContent()
    await page.getByPlaceholder(/captcha/i).fill(captcha || '12345')
    await page.getByRole('button', { name: /login/i }).click()
    await page.waitForURL('/chat', { timeout: 5000 })

    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('should display admin dashboard', async ({ page }) => {
    await expect(page.locator('.admin-layout')).toBeVisible()
    await expect(page.locator('.admin-sidebar')).toBeVisible()
  })

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.getByText(/dashboard/i)).toBeVisible()
    await expect(page.getByText(/knowledge base/i)).toBeVisible()
    await expect(page.getByText(/intelligent qa/i)).toBeVisible()
    await expect(page.getByText(/user management/i)).toBeVisible()
    await expect(page.getByText(/model configuration/i)).toBeVisible()
  })

  test('should navigate from chat to admin via button', async ({ page }) => {
    await page.goto('/chat')

    const managementButton = page.locator('.header-right .icon-button').first()
    await managementButton.click()

    await expect(page).toHaveURL('/admin/dashboard')
  })

  test('should logout and redirect to login', async ({ page }) => {
    await page.getByTestId('user-dropdown').click()
    await page.getByText(/logout/i).click()

    await expect(page).toHaveURL('/')
    await expect(page.locator('.login-container')).toBeVisible()
  })
})