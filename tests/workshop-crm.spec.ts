import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('CRM search, contacts, CSV export and sample controls use the same saved enquiries', async ({
  page,
}) => {
  await page.goto('/demo-dashboard')
  await page.getByRole('button', { name: 'Load sample enquiries' }).click()
  await expect(page.locator('.enquiry-row')).toHaveCount(5)
  await page.getByLabel('Search workspace').fill('Leah')
  await expect(page.locator('.enquiry-row')).toHaveCount(1)
  await expect(page.locator('.enquiry-row')).toContainText('Leah Naidoo')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export filtered enquiries' }).click()
  const file = await download
  const csv = await readFile((await file.path())!, 'utf8')
  expect(csv).toContain('Leah Naidoo')
  expect(csv).not.toContain('Alex Jacobs')
  await page.getByRole('button', { name: 'Clear search' }).click()
  await page
    .getByRole('navigation', { name: 'Workshop navigation' })
    .getByRole('button', { name: 'Contacts', exact: true })
    .click()
  await expect(page.locator('.crm-contact')).toHaveCount(5)
  await page.locator('.crm-contact').filter({ hasText: 'Alex Jacobs' }).click()
  await expect(page.locator('.enquiry-row')).toHaveCount(1)
  await expect(page.locator('.enquiry-row')).toContainText('Alex Jacobs')
  await page.getByRole('button', { name: 'Remove sample data' }).click()
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('handmade-by-charl.enquiries.v1')!)),
  ).toHaveLength(0)
})

test('pipeline drag, workshop notes, activity and stage changes survive reloads', async ({
  page,
}) => {
  await page.goto('/demo-dashboard')
  await page.getByRole('button', { name: 'Load sample enquiries' }).click()
  await page
    .getByRole('navigation', { name: 'Workshop navigation' })
    .getByRole('button', { name: 'Pipeline', exact: true })
    .click()
  const alex = page.locator('.crm-kanban-card').filter({ hasText: 'Alex Jacobs' })
  await alex.dragTo(page.locator('.crm-kanban-column').nth(1))
  await expect(page.locator('.crm-kanban-column').nth(1)).toContainText('Alex Jacobs')
  await alex.click()
  await expect(page.getByLabel('Enquiry status')).toHaveValue('Awaiting quotation')
  await expect(
    page.getByRole('button', { name: 'Sample contact · messaging disabled' }),
  ).toBeDisabled()
  await page
    .getByLabel('Internal note', { exact: true })
    .fill('Confirm dimensions with Charl before preparing a quote.')
  await page.getByRole('button', { name: 'Add note', exact: true }).click()
  await expect(page.locator('.crm-note')).toContainText('Confirm dimensions')
  await page.getByRole('tab', { name: /Activity/ }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Moved to awaiting quotation')
  await expect(page.getByRole('tabpanel')).toContainText('Internal note added')
  await page.keyboard.press('Escape')
  await page.reload()
  await page.locator('.enquiry-row').filter({ hasText: 'Alex Jacobs' }).click()
  await expect(page.getByLabel('Enquiry status')).toHaveValue('Awaiting quotation')
  await expect(page.locator('.crm-note')).toContainText('Confirm dimensions')
})

test('manual CRM enquiries, pagination and sample removal preserve the user’s data', async ({
  page,
}) => {
  await page.goto('/demo-dashboard')
  await page.getByRole('button', { name: 'Load sample enquiries' }).click()
  for (const name of ['Manual test one', 'Manual test two']) {
    await page.locator('.crm-page-title').getByRole('button', { name: 'New enquiry' }).click()
    const form = page.getByRole('dialog')
    await form.getByLabel('Customer name').fill(name)
    await form.getByLabel('WhatsApp number').fill('084 123 4567')
    await form.getByLabel('Product', { exact: false }).selectOption('Ornamental wooden clock')
    await form.getByLabel('The idea').fill('A personal gift with a date engraved.')
    await form.getByRole('button', { name: 'Save enquiry', exact: true }).click()
    await expect(
      page.getByRole('dialog').getByRole('heading', { name: 'Ornamental wooden clock' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Message customer' })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/27841234567\?text=/,
    )
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  }
  await expect(page.locator('.enquiry-row')).toHaveCount(6)
  await page.getByRole('button', { name: 'Next page', exact: true }).click()
  await expect(page.locator('.enquiry-row')).toHaveCount(1)
  await page.getByRole('button', { name: 'Remove sample data' }).click()
  await expect(page.locator('.enquiry-row')).toHaveCount(2)
  await page.reload()
  await expect(page.locator('.enquiry-row')).toHaveCount(2)
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('handmade-by-charl.enquiries.v1')!),
  )
  expect(saved.map((enquiry: { name: string }) => enquiry.name).sort()).toEqual([
    'Manual test one',
    'Manual test two',
  ])
})

test('mobile CRM navigation, source-photo comparison and complete hero titles remain usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    for (const name of [
      'Show fairy houses',
      'Show personalised engraving',
      'Show decorative clocks',
    ]) {
      await page.getByRole('button', { name }).click()
      await expect(page.getByRole('button', { name })).toBeEnabled()
      const right = await page
        .locator('.hero-scene:not([aria-hidden=true]) h1 .word-mask')
        .evaluateAll((nodes) =>
          Math.max(...nodes.map((node) => node.getBoundingClientRect().right)),
        )
      expect(right).toBeLessThanOrEqual(width - 10)
    }
  }
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Workshop CRM' })
    .click()
  await expect(page).toHaveURL('/demo-dashboard')
  await page.getByRole('button', { name: 'Load sample enquiries' }).click()
  await page.getByRole('button', { name: 'Open workspace navigation' }).click()
  await page
    .getByRole('navigation', { name: 'Workshop navigation' })
    .getByRole('button', { name: 'Pipeline', exact: true })
    .click()
  await expect(page.locator('.crm-kanban-card')).toHaveCount(5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  await page.locator('.crm-kanban-card').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.goto('/')
  await page.locator('.featured-card').first().click()
  await page.getByRole('button', { name: 'Original photos', exact: true }).click()
  await expect(page.locator('.detail-main-image img')).toHaveAttribute(
    'src',
    '/images/fairy-house-front.jpg',
  )
  await expect(page.locator('.detail-footnote')).toContainText('Actual photograph')
})
