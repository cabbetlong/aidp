import { test, expect } from '@playwright/test'

test.describe('Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder(/username/i).fill('admin')
    await page.getByPlaceholder(/password/i).fill('admin123')
    const captcha = await page.locator('.captcha-image').textContent()
    await page.getByPlaceholder(/captcha/i).fill(captcha || '12345')
    await page.getByRole('button', { name: /login/i }).click()
    await page.waitForURL('/chat', { timeout: 5000 })
  })

  test('should display chat interface', async ({ page }) => {
    await expect(page.locator('.chat-layout')).toBeVisible()
    await expect(page.locator('.sidebar')).toBeVisible()
    await expect(page.locator('.main-content')).toBeVisible()
  })

  test('should display sidebar with navigation', async ({ page }) => {
    await expect(page.locator('.app-logo')).toBeVisible()
    await expect(page.getByText(/new chat/i)).toBeVisible()
    await expect(page.getByText(/history/i)).toBeVisible()
  })

  test('should display messages container', async ({ page }) => {
    await expect(page.locator('.messages-container')).toBeVisible()
    await expect(page.locator('.empty-state')).toBeVisible()
  })

test('should display input field', async ({ page }) => {
    await expect(page.locator('.input-container')).toBeVisible()
    await expect(page.getByPlaceholder(/message/i)).toBeVisible()
  })

  test('should send message and receive response', async ({ page }) => {
    await page.getByPlaceholder(/message/i).fill('你好')
    await page.getByRole('button', { name: /send/i }).click()

    await expect(page.locator('.message-row.user')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('.message-row.assistant')).toBeVisible({ timeout: 5000 })
  })

  test('should show loading state while sending message', async ({ page }) => {
    await page.getByPlaceholder(/message/i).fill('test message')
    await page.getByRole('button', { name: /send/i }).click()

    await expect(page.locator('.loading-icon')).toBeVisible()
    await expect(page.locator('.loading-icon')).not.toBeVisible({ timeout: 2000 })
  })

  test('should collapse and expand sidebar', async ({ page }) => {
    await expect(page.locator('.sidebar')).toBeVisible()

    const collapseButton = page.locator('.collapse-button')
    await collapseButton.click()

    await expect(page.locator('.sidebar.collapsed')).toBeVisible()

    await collapseButton.click()
    await expect(page.locator('.sidebar:not(.collapsed)')).toBeVisible()
  })

  test('should create new chat session', async ({ page }) => {
    await page.getByRole('button', { name: /new chat/i }).click()
    
    await expect(page.locator('.empty-state')).toBeVisible()
  })

  test('should send message and receive response', async ({ page }) => {
    await page.getByPlaceholder(/message/i).fill('你好')
    await page.getByRole('button', { name: /send/i }).click()
    
    await expect(page.locator('.message-row.user')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('.message-row.assistant')).toBeVisible({ timeout: 5000 })
  })

  test('should show loading state while sending message', async ({ page }) => {
    await page.getByPlaceholder(/message/i).fill('test message')
    await page.getByRole('button', { name: /send/i }).click()
    
    await expect(page.locator('.loading-icon')).toBeVisible()
    await expect(page.locator('.loading-icon')).not.toBeVisible({ timeout: 2000 })
  })
})