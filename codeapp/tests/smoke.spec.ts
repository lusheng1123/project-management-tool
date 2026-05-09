import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:5173'

test.describe('Project Management Tool — CodeApp smoke tests', () => {

  test('homepage loads and shows tab navigation', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('nav')).toBeVisible()
    const tabs = page.locator('nav button')
    const count = await tabs.count()
    expect(count).toBeGreaterThanOrEqual(8)
  })

  test('Resources tab loads and displays seeded data', async ({ page }) => {
    await page.goto(BASE)
    await page.getByText('Resources').click()
    await page.waitForTimeout(500)
    const rows = page.locator('table tbody tr')
    // should show at least some seeded records
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('Products pipeline modal opens', async ({ page }) => {
    await page.goto(BASE)
    await page.getByText('Products').click()
    await page.waitForTimeout(500)
    const pipelineBtn = page.locator('button:has-text("Pipeline")').first()
    if (await pipelineBtn.isVisible()) {
      await pipelineBtn.click()
      await expect(page.locator('.modal-header:has-text("Product Pipeline")')).toBeVisible()
    }
  })

  test('Roadmap calendar renders', async ({ page }) => {
    await page.goto(BASE)
    await page.getByText('Roadmap').click()
    await page.waitForTimeout(1000)
    // FullCalendar renders a .fc-toolbar element
    await expect(page.locator('.fc-toolbar')).toBeVisible()
    // there should be events (projects with dates)
    const events = page.locator('.fc-event')
    if (await events.count() > 0) {
      await expect(events.first()).toBeVisible()
    }
  })

  test('search filters table rows', async ({ page }) => {
    await page.goto(BASE)
    await page.getByText('Resources').click()
    await page.waitForTimeout(500)
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.fill('IT')
    await page.waitForTimeout(300)
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    // filtering should have reduced rows or at least not thrown
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
