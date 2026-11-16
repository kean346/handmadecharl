import { test, expect } from '@playwright/test'

const key = 'handmade-by-charl.enquiries.v1'

test('three composed hero scenes, controls, restrained parallax and scroll header', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Little details. Beautifully made.',
  )
  await expect(page.getByRole('button', { name: 'Show decorative clocks' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.mouse.move(1120, 530)
  await expect
    .poll(() => page.locator('.clock-perspective').evaluate((el) => getComputedStyle(el).transform))
    .not.toBe('none')
  await page.getByRole('button', { name: 'Show fairy houses' }).click()
  await expect(page.getByRole('button', { name: 'Show fairy houses' })).toBeEnabled()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Small creations. Big imagination.',
  )
  await expect(page.locator('.house-composition img')).toBeVisible()
  await page.getByRole('button', { name: 'Next hero scene' }).click()
  await expect(page.getByRole('button', { name: 'Next hero scene' })).toBeEnabled()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Made personal. Made by hand.')
  await expect(page.getByRole('link', { name: 'Make it personal', exact: true })).toHaveAttribute(
    'href',
    '#personalise',
  )
  await page.getByRole('button', { name: 'Previous hero scene' }).click()
  await expect(page.getByRole('button', { name: 'Previous hero scene' })).toBeEnabled()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Small creations.')
  await page.getByRole('button', { name: 'Show decorative clocks' }).click()
  await expect(page.getByRole('button', { name: 'Show decorative clocks' })).toBeEnabled()
  await page.locator('#collection').scrollIntoViewIfNeeded()
  await expect(page.locator('.site-header')).toHaveClass(/is-scrolled/)
  expect(errors).toEqual([])
})

test('gallery filters, featured detail, alternate photos, keyboard close and enquiry prefilling', async ({
  page,
}) => {
  await page.goto('/')
  const card = page.locator('.featured-card').first()
  await card.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading')).toHaveText('A little fairy house')
  await dialog.getByRole('button', { name: 'Original photos' }).click()
  await dialog.getByRole('button', { name: 'View photograph 2' }).click()
  await expect(dialog.locator('.detail-main-image img')).toHaveAttribute(
    'src',
    '/images/fairy-house-angle.jpg',
  )
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(card).toBeFocused()
  await page
    .locator('.gallery-filters')
    .getByRole('button', { name: 'Clocks', exact: true })
    .click()
  await expect(page.locator('.product-card')).toHaveCount(1)
  await expect(page.locator('.product-card')).toContainText('Ornamental wooden clock')
  await page
    .locator('.gallery-filters')
    .getByRole('button', { name: 'Miniatures', exact: true })
    .click()
  await expect(page.locator('.product-card')).toHaveCount(2)
  await page
    .locator('.gallery-filters')
    .getByRole('button', { name: 'All creations', exact: true })
    .click()
  await expect(page.locator('.product-card')).toHaveCount(8)
  await page.locator('.product-card').filter({ hasText: 'Ornamental wooden clock' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Enquire about this' }).click()
  await expect(page.locator('select[name=product]')).toHaveValue('Ornamental wooden clock')
  await expect(page.locator('.prefilled-category')).toContainText('clocks')
})

test('engraving, upload, validation, quote, WhatsApp message and all dashboard statuses persist', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('A few meaningful words').fill('For Ouma, with love')
  await expect(page.locator('.engraving-text')).toHaveText('For Ouma, with love')
  await page.getByRole('radio', { name: 'Handwritten' }).check()
  await expect(page.locator('.engraving-text')).toHaveClass(/lettering-script/)
  await page.getByRole('radio', { name: 'Keepsake tag' }).check()
  await expect(page.locator('.wood-tag')).toBeVisible()
  const upload = page.locator('#personalise input[type=file]')
  await upload.setInputFiles({
    name: 'a-note.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  })
  await expect(page.locator('#personalise').getByRole('alert')).toContainText('JPG, PNG or WebP')
  await upload.setInputFiles('public/images/engraved-spoon-owl.jpg')
  await expect(page.locator('#personalise .uploaded-reference')).toContainText(
    'engraved-spoon-owl.jpg',
  )
  await expect(page.locator('.engraving-content img')).toBeVisible()
  await page.getByRole('button', { name: 'Let’s make it yours' }).click()
  await expect(page.locator('select[name=product]')).toHaveValue('Personalised keepsake tag')
  await expect(page.locator('textarea[name=details]')).toContainText('Lettering: Handwritten')
  await expect(page.locator('#contact .uploaded-reference')).toContainText('engraved-spoon-owl.jpg')
  await page.getByRole('button', { name: 'Save demo enquiry' }).click()
  await expect(page.locator('.quote-success')).toHaveCount(0)
  await page.getByLabel('Your name').fill('Demo Visitor')
  await page.getByLabel('WhatsApp number').fill('123')
  await page.getByRole('button', { name: 'Save demo enquiry' }).click()
  expect(
    await page.getByLabel('WhatsApp number').evaluate((el: HTMLInputElement) => el.validity.valid),
  ).toBe(false)
  await page.getByLabel('WhatsApp number').fill('084 123 4567')
  await page.getByRole('spinbutton', { name: 'Quantity' }).fill('2')
  await page.getByLabel('Anything else?').fill('A birthday gift, please.')
  await page.getByRole('button', { name: 'Save demo enquiry' }).click()
  await expect(page.locator('.quote-success')).toContainText('not been delivered to Charl')
  const href = await page.getByRole('link', { name: 'Continue on WhatsApp' }).getAttribute('href')
  expect(href).toContain('https://wa.me/27845117007?text=')
  expect(decodeURIComponent(href!)).toContain('2 × Personalised keepsake tag')
  expect(decodeURIComponent(href!)).toContain('reference image to attach separately')
  await page.getByRole('link', { name: 'View the demo enquiry' }).click()
  await expect(page).toHaveURL('/demo-dashboard')
  await expect(page.locator('.enquiry-row')).toHaveCount(1)
  await page.locator('.enquiry-row').click()
  await expect(page.getByRole('dialog')).toContainText('For Ouma, with love')
  await expect(page.getByRole('dialog').locator('.enquiry-reference img')).toBeVisible()
  for (const status of ['Awaiting quotation', 'In progress', 'Completed']) {
    await page.getByLabel('Enquiry status').selectOption(status)
    await page.keyboard.press('Escape')
    await expect(page.locator('.enquiry-row .status-badge')).toHaveText(status)
    await page.reload()
    await expect(page.locator('.enquiry-row .status-badge')).toHaveText(status)
    await page.locator('.enquiry-row').click()
  }
  await page.keyboard.press('Escape')
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key)
  expect(saved).toHaveLength(1)
  expect(saved[0]).toMatchObject({
    quantity: 2,
    name: 'Demo Visitor',
    status: 'Completed',
    reference: { name: 'engraved-spoon-owl.jpg' },
  })
})

test('mobile menu, reduced motion, scene controls and responsive widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Personalise' })
    .click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0)
  await expect(page).toHaveURL('/#personalise')
  await page.goto('/')
  await page.getByRole('button', { name: 'Show fairy houses' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Small creations.')
  await expect(page.getByRole('button', { name: 'Show fairy houses' })).toBeEnabled()
  await page.getByRole('button', { name: 'Next hero scene' }).click()
  await expect(page.getByRole('button', { name: 'Next hero scene' })).toBeEnabled()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Made personal.')
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
    )
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width)
  }
})

test('unavailable browser storage produces an honest failure instead of a false success', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    }
  })
  await page.goto('/#contact')
  await page.getByLabel('Your name').fill('Demo Visitor')
  await page.getByLabel('WhatsApp number').fill('084 123 4567')
  await page.locator('select[name=product]').selectOption('Ornamental wooden clock')
  await page.getByRole('button', { name: 'Save demo enquiry' }).click()
  await expect(page.locator('#contact').getByRole('alert')).toContainText('could not save')
  await expect(page.locator('.quote-success')).toHaveCount(0)
})

test('corrupt saved data is preserved and dashboard reports the problem', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(
    (key) => localStorage.setItem(key, JSON.stringify([{ unexpected: true }])),
    key,
  )
  await page.goto('/demo-dashboard')
  await expect(page.getByRole('alert')).toContainText('existing data has been preserved')
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe('[{"unexpected":true}]')
})
